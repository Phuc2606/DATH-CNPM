import { sql } from "../config/database.js";

class Product {
  constructor({
    ProductID,
    Name,
    Brand,
    Category,
    Price,
    Stock,
    Description,
    ImageURL,
  }) {
    this.ProductID = ProductID;
    this.Name = Name;
    this.Brand = Brand;
    this.Category = Category;
    this.Price = Price;
    this.Stock = Stock;
    this.Description = Description;
    this.ImageURL = ImageURL;
  }

  async save() {
    const request = new sql.Request();
    request.input("name", sql.NVarChar, this.Name);
    request.input("brand", sql.NVarChar, this.Brand);
    request.input("category", sql.VarChar, this.Category);
    request.input("price", sql.Decimal(18, 2), this.Price);
    request.input("stock", sql.Int, this.Stock);
    request.input("desc", sql.NVarChar, this.Description);
    request.input("img", sql.NVarChar, this.ImageURL);

    if (this.ProductID) {
      // UPDATE
      request.input("id", sql.Int, this.ProductID);
      await request.query(`
        UPDATE Product 
        SET Name=@name, Brand=@brand, Category=@category, Price=@price, Stock=@stock, Description=@desc, ImageURL=@img 
        WHERE ProductID=@id
      `);
      return this;
    } else {
      // INSERT
      const res = await request.query(`
        INSERT INTO Product (Name, Brand, Category, Price, Stock, Description, ImageURL) 
        VALUES (@name, @brand, @category, @price, @stock, @desc, @img); 
        SELECT SCOPE_IDENTITY() as id;
      `);
      this.ProductID = res.recordset[0].id;
      return this;
    }
  }

  static async findAll() {
    const request = new sql.Request();
    const res = await request.query("SELECT * FROM Product");
    return res.recordset;
  }

  static async findById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);
    const res = await request.query(
      "SELECT * FROM Product WHERE ProductID = @id"
    );
    return res.recordset[0] || null;
  }

  static async deleteById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);
    await request.query("DELETE FROM Product WHERE ProductID = @id");
  }
}

export default Product;
