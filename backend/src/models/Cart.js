import { sql } from "../config/database.js";

class Cart {
  constructor({ CartID, CustomerID }) {
    this.CartID = CartID;
    this.CustomerID = CustomerID;
  }

  async save() {
    const request = new sql.Request();
    request.input("cid", sql.Int, this.CustomerID);

    if (this.CartID) {
      request.input("id", sql.Int, this.CartID);
      await request.query("UPDATE Cart SET CustomerID=@cid WHERE CartID=@id");
      return this;
    } else {
      const res = await request.query(
        "INSERT INTO Cart (CustomerID) VALUES (@cid); SELECT SCOPE_IDENTITY() as id;"
      );
      this.CartID = res.recordset[0].id;
      return this;
    }
  }
  static async getOrCreateCart(customerId) {
    let cart = await this.findByCustomerId(customerId);

    if (!cart) {
      const request = new sql.Request();
      const result = await request
        .input("cid", sql.Int, customerId)
        .query(`
          INSERT INTO Cart (CustomerID) 
          OUTPUT INSERTED.CartID 
          VALUES (@cid)
        `);
      cart = { CartID: result.recordset[0].CartID, CustomerID: customerId };
    }

    return cart; // { CartID, CustomerID }
  }

  static async getFullCart(customerId) {
    const cart = await this.getOrCreateCart(customerId);
    const items = await this.getItems(cart.CartID);

    const subtotal = items.reduce((sum, item) => sum + item.Price * item.Quantity, 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000; // Miễn phí vận chuyển cho đơn > 500k(VND)
    const total = subtotal + shippingFee;

    return {
      cartId: cart.CartID,
      items: items.map(item => ({
        productId: item.ProductID,
        name: item.Name,
        price: item.Price,
        quantity: item.Quantity,
        image: item.ImageURL || null,
        total: item.Price * item.Quantity
      })),
      summary: {
        subtotal,
        shippingFee,
        total,
        totalItems: items.length,
        totalQuantity: items.reduce((sum, i) => sum + i.Quantity, 0)
      }
    };
  }

  static async addItem(cartId, { ProductID, Quantity = 1 }) {
    const request = new sql.Request();
    request.input("cartId", sql.Int, cartId);
    request.input("pid", sql.Int, ProductID);
    request.input("qty", sql.Int, Quantity);

    // Check xem item này đã có trong giỏ chưa
    const check = await request.query(
      "SELECT * FROM CartItem WHERE CartID=@cartId AND ProductID=@pid"
    );

    if (check.recordset.length > 0) {
      // Có thì cộng dồn số lượng
      await request.query(
        "UPDATE CartItem SET Quantity = Quantity + @qty WHERE CartID=@cartId AND ProductID=@pid"
      );
    } else {
      // Chưa có thì insert mới
      await request.query(
        "INSERT INTO CartItem (CartID, ProductID, Quantity) VALUES (@cartId, @pid, @qty)"
      );
    }
  }
  static async updateItemQuantity(cartId, productId, quantity) {
    if (quantity < 0) throw new Error("Số lượng không hợp lệ");

    const request = new sql.Request();
    request.input("cartId", sql.Int, cartId);
    request.input("pid", sql.Int, productId);
    request.input("qty", sql.Int, quantity);

    if (quantity === 0) {
      await request.query("DELETE FROM CartItem WHERE CartID=@cartId AND ProductID=@pid");
    } else {
      await request.query(`
        MERGE INTO CartItem AS target
        USING (VALUES (@cartId, @pid)) AS source (CartID, ProductID)
        ON target.CartID = source.CartID AND target.ProductID = source.ProductID
        WHEN MATCHED THEN UPDATE SET Quantity = @qty
        WHEN NOT MATCHED THEN INSERT (CartID, ProductID, Quantity) VALUES (@cartId, @pid, @qty);
      `);
    }
  }
  static async removeItem(cartId, productId) {
    const request = new sql.Request();
    await request
      .input("cartId", sql.Int, cartId)
      .input("pid", sql.Int, productId)
      .query("DELETE FROM CartItem WHERE CartID=@cartId AND ProductID=@pid");
  }

  static async clearCart(cartId) {
    const request = new sql.Request();
    await request
      .input("cartId", sql.Int, cartId)
      .query("DELETE FROM CartItem WHERE CartID=@cartId");
  }

  static async getItems(cartId) {
    const request = new sql.Request();
    request.input("cartId", sql.Int, cartId);
    const res = await request.query(`
        SELECT ci.*, p.Name, p.Price, p.ImageURL 
        FROM CartItem ci
        JOIN Product p ON ci.ProductID = p.ProductID
        WHERE ci.CartID = @cartId
    `);
    return res.recordset;
  }

  static async findByCustomerId(customerId) {
    const request = new sql.Request();
    request.input("cid", sql.Int, customerId);
    const res = await request.query(
      "SELECT * FROM Cart WHERE CustomerID = @cid"
    );
    return res.recordset[0] || null;
  }

  static async clearByCustomerId(customerId, { transaction } = {}) {
    const request = transaction ? transaction.request() : new sql.Request();
    await request
      .input('customerId', sql.Int, customerId)
      .query(`
      DELETE FROM CartItem 
      WHERE CartID IN (SELECT CartID FROM Cart WHERE CustomerID = @customerId)
    `);
  }
}

export default Cart;
