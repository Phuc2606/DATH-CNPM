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

  static async findWithPagination({ page, limit, search }) {
    const request = new sql.Request();
    const offset = (page - 1) * limit;

    let whereClause = "";
    if (search) {
      whereClause = "WHERE Name LIKE @search";
      request.input("search", sql.NVarChar, `%${search}%`);
    }

    const queryData = `
        SELECT * FROM Product 
        ${whereClause}
        ORDER BY ProductID DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `;
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);

    const queryCount = `SELECT COUNT(*) as total FROM Product ${whereClause}`;

    const dataRes = await request.query(queryData);
    const countRes = await request.query(queryCount);

    return {
      data: dataRes.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countRes.recordset[0].total,
        totalPages: Math.ceil(countRes.recordset[0].total / limit),
      },
    };
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
  static async updateStockSafe(productId, deductQty, { transaction } = {}) {
    const request = transaction ? transaction.request() : new sql.Request();

    const result = await request
      .input("pid", sql.Int, productId)
      .input("qty", sql.Int, deductQty)
      .query(`
      UPDATE Product 
      SET Stock = Stock - @qty 
      WHERE ProductID = @pid AND Stock >= @qty;
      SELECT @@ROWCOUNT as affected;
    `);
    const affected = result.recordset?.[0]?.affected ?? result.rowsAffected[0];
    return affected > 0;
  }
  static async deductStockSafe(productId, quantity, { transaction } = {}) {
    const request = transaction ? transaction.request() : new sql.Request();

    const result = await request
      .input("pid", sql.Int, productId)
      .input("qty", sql.Int, quantity)
      .query(`
        UPDATE Product 
        SET Stock = Stock - @qty 
        WHERE ProductID = @pid AND Stock >= @qty;
        SELECT @@ROWCOUNT as affected;
      `);

    const affected = result.recordset?.[0]?.affected ?? result.rowsAffected[0];
    return affected > 0; // true = giảm thành công, false = hết hàng
  }
  static async Filter({ search, brand, priceRange, page = 1, limit = 12 }) {
    const request = new sql.Request();
    const offset = (page - 1) * limit;

    let where = ["Stock > 0"];

    if (search) {
      const keyword = `%${search.trim()}%`;
      where.push(`(
    Name COLLATE SQL_Latin1_General_CP1_CI_AI LIKE @search 
    OR Description COLLATE SQL_Latin1_General_CP1_CI_AI LIKE @search
  )`);
      request.input("search", sql.NVarChar, `%${search}%`);
    }
    if (brand) {
      where.push(`Brand = @brand`);
      request.input("brand", sql.NVarChar, brand);
    }
    if (priceRange) {
      const parts = priceRange.split("-");

      if (parts.length === 1) {
        const exact = parseFloat(parts[0]);
        if (!isNaN(exact) && exact > 0) {
          where.push(`Price = @priceExact`);
          request.input("priceExact", sql.Decimal(18, 2), exact);
        }
      } else {
        const minStr = parts[0].trim();
        const maxStr = parts[1]?.trim();

        if (minStr && maxStr) {
          // có cả min và max
          where.push(`Price BETWEEN @priceMin AND @priceMax`);
          request.input("priceMin", sql.Decimal(18, 2), parseFloat(minStr));
          request.input("priceMax", sql.Decimal(18, 2), parseFloat(maxStr));
        } else if (minStr && !maxStr) {
          // chỉ có min → từ X trở lên
          where.push(`Price >= @priceMin`);
          request.input("priceMin", sql.Decimal(18, 2), parseFloat(minStr));
        } else if (!minStr && maxStr) {
          // chỉ có max → dưới X
          where.push(`Price <= @priceMax`);
          request.input("priceMax", sql.Decimal(18, 2), parseFloat(maxStr));
        }
      }
    }

    const whereClause = where.length > 1 ? "WHERE " + where.join(" AND ") : "";

    // Đếm tổng
    const countQuery = `SELECT COUNT(*) AS total FROM Product ${whereClause}`;
    const countRes = await request.query(countQuery);

    // Lấy data
    const dataQuery = `
      SELECT ProductID, Name, Brand, Price, ImageURL
      FROM Product ${whereClause}
      ORDER BY Price ASC, ProductID DESC
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `;
    request.input("offset", sql.Int, offset);
    request.input("limit", sql.Int, limit);
    const dataRes = await request.query(dataQuery);

    return {
      data: dataRes.recordset,
      total: countRes.recordset[0].total
    };
  }
}

export default Product;
