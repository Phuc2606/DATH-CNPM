import { sql } from "../config/database.js";

export const resolvePath = async (req, res, next) => {
  try {
    const categoryId = req.body.Category;

    if (!categoryId) {
      req.categoryName = "default";
      return next();
    }

    const request = new sql.Request();
    request.input("id", sql.VarChar, categoryId);

    const result = await request.query(
      "SELECT Name FROM Category WHERE CategoryID = @id"
    );

    if (result.recordset.length > 0) {
      req.categoryName = result.recordset[0].Name;
    } else {
      req.categoryName = "default";
    }

    next();
  } catch (err) {
    console.log("Category lookup error:", err);
    req.categoryName = "default";
    next();
  }
};
