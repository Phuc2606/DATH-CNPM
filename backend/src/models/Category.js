import { sql } from "../config/database.js";

class Category {
  constructor({ CategoryID, Name, Icon }) {
    this.CategoryID = CategoryID || null;
    this.Name = Name || null;
    this.Icon = Icon || null;
  }

  async save() {
    const request = new sql.Request();
    request.input("id", sql.VarChar, this.CategoryID);
    request.input("name", sql.NVarChar, this.Name);
    request.input("icon", sql.NVarChar, this.Icon);

    // Kiểm tra xem CategoryID này đã có chưa để quyết định Update hay Insert
    const check = await request.query(
      "SELECT CategoryID FROM Category WHERE CategoryID = @id"
    );

    if (check.recordset.length > 0) {
      // UPDATE
      await request.query(
        "UPDATE Category SET Name=@name, Icon=@icon WHERE CategoryID=@id"
      );
    } else {
      // INSERT (Vì ID là string do người dùng nhập nên phải insert cả ID)
      await request.query(
        "INSERT INTO Category (CategoryID, Name, Icon) VALUES (@id, @name, @icon)"
      );
    }
    return this;
  }

  static async findAll() {
    const request = new sql.Request();
    const res = await request.query("SELECT * FROM Category");
    return res.recordset;
  }

  static async findById(id) {
    const request = new sql.Request();
    request.input("id", sql.VarChar, id);
    const res = await request.query(
      "SELECT * FROM Category WHERE CategoryID = @id"
    );
    return res.recordset[0] || null;
  }
}

export default Category;
