import { sql } from "../config/database.js";

class Supplier {
  constructor({ SupplierID, Name, Address, PhoneNumber, TaxNumber }) {
    this.SupplierID = SupplierID;
    this.Name = Name;
    this.Address = Address;
    this.PhoneNumber = PhoneNumber;
    this.TaxNumber = TaxNumber;
  }

  async save() {
    const request = new sql.Request();
    request.input("name", sql.NVarChar, this.Name);
    request.input("addr", sql.NVarChar, this.Address);
    request.input("phone", sql.NVarChar, this.PhoneNumber);
    request.input("tax", sql.NVarChar, this.TaxNumber);

    if (this.SupplierID) {
      request.input("id", sql.Int, this.SupplierID);
      await request.query(
        "UPDATE Supplier SET Name=@name, Address=@addr, PhoneNumber=@phone, TaxNumber=@tax WHERE SupplierID=@id"
      );
      return this;
    } else {
      const res = await request.query(
        "INSERT INTO Supplier (Name, Address, PhoneNumber, TaxNumber) VALUES (@name, @addr, @phone, @tax); SELECT SCOPE_IDENTITY() as id;"
      );
      this.SupplierID = res.recordset[0].id;
      return this;
    }
  }

  static async findAll() {
    const request = new sql.Request();
    const res = await request.query("SELECT * FROM Supplier");
    return res.recordset;
  }

  static async findById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);
    const res = await request.query(
      "SELECT * FROM Supplier WHERE SupplierID=@id"
    );
    return res.recordset[0] || null;
  }

  static async linkProduct({ ProductID, SupplierID }) {
    const request = new sql.Request();
    request.input("pid", sql.Int, ProductID);
    request.input("sid", sql.Int, SupplierID);

    await request.query(
      "INSERT INTO ProductSupplier (ProductID, SupplierID) VALUES (@pid, @sid)"
    );
    return { ProductID, SupplierID };
  }

  static async unlinkProduct({ ProductID, SupplierID }) {
    const request = new sql.Request();
    request.input("pid", sql.Int, ProductID);
    request.input("sid", sql.Int, SupplierID);

    await request.query(
      "DELETE FROM ProductSupplier WHERE ProductID = @pid AND SupplierID = @sid"
    );
    return true;
  }

  static async getLinkedProducts(supplierId) {
    const request = new sql.Request();
    request.input("sid", sql.Int, supplierId);
    // Join bảng Product để lấy tên, giá...
    const res = await request.query(`
        SELECT p.ProductID, p.Name, p.Brand, p.Price, p.ImageURL
        FROM Product p
        JOIN ProductSupplier ps ON p.ProductID = ps.ProductID
        WHERE ps.SupplierID = @sid
    `);
    return res.recordset;
  }

  static async deleteById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);

    // 1. Xóa liên kết sản phẩm trước (Bảng trung gian)
    await request.query("DELETE FROM ProductSupplier WHERE SupplierID = @id");

    // 2. Xóa nhà cung cấp
    await request.query("DELETE FROM Supplier WHERE SupplierID = @id");
    return true;
  }
}

export default Supplier;
