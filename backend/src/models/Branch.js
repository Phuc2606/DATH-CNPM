import { sql } from "../config/database.js";

class Branch {
  constructor({
    BranchID = null,
    Name,
    Address = null,
    Expense = null,
    AvailableCapacity = null,
  }) {
    this.BranchID = BranchID;
    this.Name = Name || null;
    this.Address = Address || null;
    this.Expense = Expense != null ? Number(Expense) : null;
    this.AvailableCapacity =
      AvailableCapacity != null ? Number(AvailableCapacity) : null;
  }

  // Hàm Save: Tự động check nếu có ID thì Update, chưa có thì Insert
  async save() {
    const request = new sql.Request();

    if (this.BranchID) {
      // --- UPDATE ---
      request.input("id", sql.Int, this.BranchID);
      request.input("name", sql.NVarChar, this.Name);
      request.input("address", sql.NVarChar, this.Address);
      request.input("expense", sql.Decimal(18, 2), this.Expense);
      request.input("capacity", sql.Int, this.AvailableCapacity);

      await request.query(`
          UPDATE Branch 
          SET Name=@name, Address=@address, Expense=@expense, AvailableCapacity=@capacity 
          WHERE BranchID=@id
      `);
      return this;
    } else {
      // --- INSERT ---
      request.input("name", sql.NVarChar, this.Name);
      request.input("address", sql.NVarChar, this.Address);
      request.input("expense", sql.Decimal(18, 2), this.Expense);
      request.input("capacity", sql.Int, this.AvailableCapacity);

      const res = await request.query(`
          INSERT INTO Branch (Name, Address, Expense, AvailableCapacity) 
          VALUES (@name, @address, @expense, @capacity); 
          SELECT SCOPE_IDENTITY() as id;
      `);

      this.BranchID = res.recordset[0].id;
      return this;
    }
  }

  static async findAll() {
    const request = new sql.Request();
    const res = await request.query("SELECT * FROM Branch");
    return res.recordset;
  }

  static async findById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);
    const res = await request.query("SELECT * FROM Branch WHERE BranchID=@id");
    return res.recordset[0] || null;
  }

  // Lấy danh sách hàng tồn kho của chi nhánh này
  static async getStock(branchId) {
    const request = new sql.Request();
    request.input("branchId", sql.Int, branchId);

    // Join thêm bảng Product để biết tên sản phẩm là gì luôn
    const res = await request.query(`
        SELECT s.BranchID, s.ProductID, s.Quantity, p.Name, p.ImageURL, p.Price
        FROM Store s
        JOIN Product p ON s.ProductID = p.ProductID
        WHERE s.BranchID = @branchId
    `);
    return res.recordset;
  }
}

export default Branch;
