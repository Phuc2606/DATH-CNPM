import { sql } from "../config/database.js";

class Review {
  constructor({ ReviewID, ProductID, CustomerID, StarRating, Note }) {
    this.ReviewID = ReviewID;
    this.ProductID = ProductID;
    this.CustomerID = CustomerID;
    this.StarRating = StarRating;
    this.Note = Note;
  }

  async save() {
    const result = await sql.query`
    INSERT INTO Review (ProductID, CustomerID, StarRating, Note)
    OUTPUT INSERTED.ReviewID, INSERTED.ProductID, INSERTED.CustomerID,
           INSERTED.StarRating, INSERTED.Note, INSERTED.ReviewTime
    VALUES (${this.ProductID}, ${this.CustomerID}, ${this.StarRating}, ${this.Note || null})
  `;

    const inserted = result.recordset[0];

    this.ReviewID = inserted.ReviewID;
    this.ReviewTime = inserted.ReviewTime;

    return inserted; 
  }

  static async findAllByProduct(productId) {
    const result = await sql.query`
      SELECT 
        ReviewID,
        CustomerID,
        ProductID,
        StarRating,
        Note,
        ReviewTime
      FROM Review
      WHERE ProductID = ${productId}
      ORDER BY ReviewTime DESC
    `;
    return result.recordset;
  }
  static async getAllForAdmin({ page = 1, limit = 10, search = "" }) {
    try {
      const offset = (page - 1) * limit;
      const trimmedSearch = search.trim();
      const hasSearch = trimmedSearch !== "";

      const request = new sql.Request();

      request.input("offset", sql.Int, offset);
      request.input("limit", sql.Int, limit);

      let query = `
      SELECT ReviewID, CustomerID, ProductID, StarRating, Note, ReviewTime
      FROM Review
    `;

      let countQuery = `SELECT COUNT(*) AS total FROM Review`;

      if (hasSearch) {
        const searchValue = `%${trimmedSearch}%`;
        request.input("search", sql.NVarChar, searchValue);
        query += ` WHERE Note LIKE @search`;
        countQuery += ` WHERE Note LIKE @search`;
      }

      query += `
      ORDER BY ReviewTime DESC
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;

      const countResult = await request.query(countQuery);
      const dataResult = await request.query(query);

      const total = countResult.recordset[0].total || 0;

      return {
        data: dataResult.recordset,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Lỗi getAllForAdmin:", error);
      throw error;
    }
  }


  static async deleteById(id) {
    await sql.query`DELETE FROM Review WHERE ReviewID = ${id}`;
  }
}

export default Review;