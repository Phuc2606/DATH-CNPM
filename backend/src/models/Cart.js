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
      // Có rồi thì cộng dồn số lượng
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

  static async getItems(cartId) {
    const request = new sql.Request();
    request.input("cartId", sql.Int, cartId);
    // Join để lấy thông tin sản phẩm (Tên, Giá, Ảnh) hiển thị ra giỏ hàng
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
}

export default Cart;
