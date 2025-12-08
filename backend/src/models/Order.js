import { sql } from "../config/database.js";

class Order {
  constructor({ OrderID, CustomerID, TotalAmount, Status }) {
    this.OrderID = OrderID;
    this.CustomerID = CustomerID;
    this.TotalAmount = TotalAmount;
    this.Status = Status || "Pending";
  }

  async save() {
    const request = new sql.Request();
    request.input("total", sql.Decimal(18, 2), this.TotalAmount);
    request.input("status", sql.NVarChar, this.Status);

    if (this.OrderID) {
      request.input("id", sql.Int, this.OrderID);
      await request.query(`
        UPDATE [Order] 
        SET Status=@status, TotalAmount=@total 
        WHERE OrderID=@id
      `);
      return this;
    } else {
      request.input("cid", sql.Int, this.CustomerID);
      const res = await request.query(`
        INSERT INTO [Order] (CustomerID, TotalAmount, Status)
        VALUES (@cid, @total, @status);
        SELECT SCOPE_IDENTITY() as id;
      `);
      this.OrderID = res.recordset[0].id;
      return this;
    }
  }

  // CREATE ORDER (VoucherList)
  static async create(orderData, { transaction } = {}) {
    const request = transaction ? transaction.request() : new sql.Request();

    const result = await request
      .input("customerId", sql.Int, orderData.CustomerID)
      .input("subtotal", sql.Decimal(18, 2), orderData.Subtotal)
      .input("discount", sql.Decimal(18, 2), orderData.DiscountAmount || 0)
      .input("shippingFee", sql.Decimal(18, 2), orderData.ShippingFee || 0)
      .input("total", sql.Decimal(18, 2), orderData.TotalAmount)
      .input("paymentMethod", sql.NVarChar, orderData.PaymentMethod)
      .input(
        "paymentStatus",
        sql.NVarChar,
        orderData.PaymentStatus || "Pending"
      )
      .input("status", sql.NVarChar, orderData.Status || "Pending")
      .input("address", sql.NVarChar, orderData.RecipientInfo)
      .input("note", sql.NVarChar, orderData.Note || null)
      .input(
        "voucherList",
        sql.NVarChar,
        (() => {
          let list = orderData.VoucherList;
          if (typeof list === "string") {
            try {
              list = JSON.parse(list);
            } catch (e) {}
          }
          if (Array.isArray(list)) {
            return list.map((v) => v.code).join(",");
          }

          return list || null;
        })()
      ).query(`
        INSERT INTO [Order] 
          (CustomerID, Subtotal, DiscountAmount, ShippingFee, TotalAmount,
           PaymentMethod, PaymentStatus, Status, RecipientInfo, Note, VoucherList)
        OUTPUT INSERTED.OrderID, INSERTED.OrderDate
        VALUES 
          (@customerId, @subtotal, @discount, @shippingFee, @total,
           @paymentMethod, @paymentStatus, @status, @address, @note, @voucherList)
      `);

    const row = result.recordset[0];
    return {
      OrderID: row.OrderID,
      OrderDate: row.OrderDate,
    };
  }

  static async addOrderItem(orderId, itemData, { transaction } = {}) {
    const request = transaction ? transaction.request() : new sql.Request();

    await request
      .input("orderId", sql.Int, orderId)
      .input("productId", sql.Int, itemData.ProductID)
      .input("quantity", sql.Int, itemData.Quantity)
      .input("unitPrice", sql.Decimal(18, 2), itemData.UnitPrice)
      .input(
        "finalPrice",
        sql.Decimal(18, 2),
        itemData.FinalPrice || itemData.UnitPrice
      ).query(`
        INSERT INTO OrderItem (OrderID, ProductID, Quantity, UnitPrice, FinalPrice)
        VALUES (@orderId, @productId, @quantity, @unitPrice, @finalPrice)
      `);
  }

  static async findById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);
    const res = await request.query(`
      SELECT * FROM [Order] 
      WHERE OrderID=@id
    `);

    return res.recordset[0] || null;
  }

  static async findAll() {
    const request = new sql.Request();
    // Join với bảng Customer để lấy tên người đặt
    const res = await request.query(`
      SELECT 
        o.OrderID, o.OrderDate, o.TotalAmount, o.Status, o.PaymentStatus, o.PaymentMethod,
        c.Name as CustomerName, c.Email
      FROM [Order] o
      LEFT JOIN Customer c ON o.CustomerID = c.CustomerID
      ORDER BY o.OrderDate DESC
    `);
    return res.recordset;
  }

  static async updateStatus(orderId, status, paymentStatus) {
    const request = new sql.Request();
    request.input("id", sql.Int, orderId);
    request.input("status", sql.NVarChar, status);
    request.input("payStatus", sql.NVarChar, paymentStatus);

    await request.query(`
      UPDATE [Order] 
      SET Status = @status, PaymentStatus = @payStatus
      WHERE OrderID = @id
    `);
  }
}

export default Order;
