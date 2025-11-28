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
      await request.query(
        "UPDATE [Order] SET Status=@status, TotalAmount=@total WHERE OrderID=@id"
      );
      return this;
    } else {
      request.input("cid", sql.Int, this.CustomerID);
      const res = await request.query(
        "INSERT INTO [Order] (CustomerID, TotalAmount, Status) VALUES (@cid, @total, @status); SELECT SCOPE_IDENTITY() as id;"
      );
      this.OrderID = res.recordset[0].id;
      return this;
    }
  }

  static async addItem(orderId, { ProductID, Quantity, Price }) {
    const request = new sql.Request();
    request.input("oid", sql.Int, orderId);
    request.input("pid", sql.Int, ProductID);
    request.input("qty", sql.Int, Quantity);
    request.input("price", sql.Decimal(18, 2), Price); // Giá tại thời điểm mua

    await request.query(
      "INSERT INTO OrderItem (OrderID, ProductID, Quantity, UnitPrice) VALUES (@oid, @pid, @qty, @price)"
    );
  }

  static async findById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);
    const res = await request.query("SELECT * FROM [Order] WHERE OrderID=@id");
    return res.recordset[0] || null;
  }
}

export default Order;
