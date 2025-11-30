import { sql } from "../config/database.js";

class Review {
  constructor({ ReviewID, ProductID, CustomerID, Rating, Comment }) {
    this.ReviewID = ReviewID;
    this.ProductID = ProductID;
    this.CustomerID = CustomerID;
    this.Rating = Rating;
    this.Comment = Comment;
  }

  async save() {
    const request = new sql.Request();
    request.input("rating", sql.Int, this.Rating);
    request.input("comment", sql.NVarChar, this.Comment);

    if (this.ReviewID) {
      request.input("id", sql.Int, this.ReviewID);
      await request.query(
        "UPDATE Review SET Rating=@rating, Comment=@comment WHERE ReviewID=@id"
      );
      return this;
    } else {
      request.input("pid", sql.Int, this.ProductID);
      request.input("cid", sql.Int, this.CustomerID);
      const res = await request.query(
        "INSERT INTO Review (ProductID, CustomerID, Rating, Comment) VALUES (@pid, @cid, @rating, @comment); SELECT SCOPE_IDENTITY() as id;"
      );
      this.ReviewID = res.recordset[0].id;
      return this;
    }
  }

  static async findAllByProduct(productId) {
    const request = new sql.Request();
    request.input("pid", sql.Int, productId);
    const res = await request.query(`
        SELECT r.*, c.Name as CustomerName 
        FROM Review r
        LEFT JOIN Customer c ON r.CustomerID = c.CustomerID
        WHERE r.ProductID = @pid
    `);
    return res.recordset;
  }
}

export default Review;
