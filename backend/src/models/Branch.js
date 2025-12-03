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

  // 1. Save (Tự động Insert hoặc Update)
  async save() {
    const request = new sql.Request();

    // Input parameters
    request.input("name", sql.NVarChar, this.Name);
    request.input("address", sql.NVarChar, this.Address);
    request.input("expense", sql.Decimal(18, 2), this.Expense);
    request.input("capacity", sql.Int, this.AvailableCapacity);

    if (this.BranchID) {
      // --- UPDATE ---
      request.input("id", sql.Int, this.BranchID);
      await request.query(`
          UPDATE Branch 
          SET Name=@name, Address=@address, Expense=@expense, AvailableCapacity=@capacity 
          WHERE BranchID=@id
      `);
      return this;
    } else {
      // --- INSERT ---
      const res = await request.query(`
          INSERT INTO Branch (Name, Address, Expense, AvailableCapacity) 
          VALUES (@name, @address, @expense, @capacity); 
          SELECT SCOPE_IDENTITY() as id;
      `);
      this.BranchID = res.recordset[0].id;
      return this;
    }
  }

  // 2. Lấy tất cả
  static async findAll() {
    const request = new sql.Request();
    const res = await request.query(`
      SELECT 
        b.*,
        (SELECT ISNULL(SUM(Quantity), 0) FROM Store s WHERE s.BranchID = b.BranchID) as CurrentStock
      FROM Branch b
    `);
    return res.recordset;
  }

  // 3. Tìm theo ID
  static async findById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);
    const res = await request.query("SELECT * FROM Branch WHERE BranchID=@id");
    return res.recordset[0] || null;
  }

  // 4. Xóa Chi nhánh
  static async deleteById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);

    // Xóa hàng tồn kho trong Store trước (Ràng buộc khóa ngoại)
    await request.query("DELETE FROM Store WHERE BranchID = @id");

    // Xóa Branch
    await request.query("DELETE FROM Branch WHERE BranchID = @id");
  }

  // 5. Lấy danh sách tồn kho của chi nhánh
  static async getStock(branchId) {
    const request = new sql.Request();
    request.input("branchId", sql.Int, branchId);

    const res = await request.query(`
        SELECT s.BranchID, s.ProductID, s.Quantity, p.Name, p.ImageURL, p.Price
        FROM Store s
        JOIN Product p ON s.ProductID = p.ProductID
        WHERE s.BranchID = @branchId
    `);
    return res.recordset;
  }

  // 6. Nhập kho (Có kiểm tra Sức chứa Branch + Tồn kho Product)
  static async importStock({ BranchID, ProductID, Quantity }) {
    if (Quantity <= 0) throw new Error("Số lượng nhập phải > 0");

    const pool = await sql.connect();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();
      const request = new sql.Request(transaction);

      request.input("bid", sql.Int, BranchID);
      request.input("pid", sql.Int, ProductID);
      request.input("qty", sql.Int, Quantity);

      // --- BƯỚC 1: KIỂM TRA TỒN KHO TỔNG (PRODUCT) ---
      // Lấy số lượng hàng đang có ở kho tổng
      const productCheck = await request.query(`
        SELECT Name, Stock FROM Product WITH (UPDLOCK) WHERE ProductID = @pid
      `);

      if (productCheck.recordset.length === 0) {
        throw new Error("Sản phẩm không tồn tại!");
      }

      const { Name, Stock } = productCheck.recordset[0];

      // Nếu nhập nhiều hơn số đang có -> Báo lỗi
      if (Quantity > Stock) {
        throw new Error(
          `Không đủ hàng trong kho tổng! Sản phẩm: ${Name}, Hiện có: ${Stock}, Cần nhập: ${Quantity}`
        );
      }

      // --- BƯỚC 2: KIỂM TRA SỨC CHỨA CHI NHÁNH (BRANCH CAPACITY) ---
      const capacityCheck = await request.query(`
        SELECT 
            b.AvailableCapacity,
            (SELECT ISNULL(SUM(Quantity), 0) FROM Store WHERE BranchID = @bid) as CurrentTotalStock
        FROM Branch b
        WHERE b.BranchID = @bid
      `);

      if (capacityCheck.recordset.length === 0)
        throw new Error("Chi nhánh không tồn tại!");

      const { AvailableCapacity, CurrentTotalStock } =
        capacityCheck.recordset[0];

      if (AvailableCapacity !== null) {
        const newTotal = CurrentTotalStock + Quantity;
        if (newTotal > AvailableCapacity) {
          throw new Error(
            `Chi nhánh quá tải! Sức chứa: ${AvailableCapacity}, Đang có: ${CurrentTotalStock}, Nhập thêm: ${Quantity} => Vượt quá giới hạn.`
          );
        }
      }

      // --- BƯỚC 3: TRỪ KHO TỔNG (Quan trọng để tránh nhân bản hàng hóa) ---
      // Chuyển hàng từ Product -> Store
      await request.query(`
        UPDATE Product SET Stock = Stock - @qty WHERE ProductID = @pid
      `);

      // --- BƯỚC 4: CỘNG VÀO KHO CHI NHÁNH (STORE) ---
      const checkStore = await request.query(`
        SELECT Quantity FROM Store WITH (UPDLOCK, HOLDLOCK) 
        WHERE BranchID = @bid AND ProductID = @pid
      `);

      if (checkStore.recordset.length > 0) {
        await request.query(`
          UPDATE Store SET Quantity = Quantity + @qty 
          WHERE BranchID = @bid AND ProductID = @pid
        `);
      } else {
        await request.query(`
          INSERT INTO Store (BranchID, ProductID, Quantity) VALUES (@bid, @pid, @qty)
        `);
      }

      await transaction.commit();
      return {
        message: "Nhập kho thành công",
        remainingStock: Stock - Quantity,
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // 7. Xuất trả hàng về kho tổng (Branch -> Product)
  static async returnStock({ BranchID, ProductID, Quantity }) {
    if (Quantity <= 0) throw new Error("Số lượng xuất trả phải > 0");

    const pool = await sql.connect();
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();
      const request = new sql.Request(transaction);

      request.input("bid", sql.Int, BranchID);
      request.input("pid", sql.Int, ProductID);
      request.input("qty", sql.Int, Quantity);

      // --- BƯỚC 1: KIỂM TRA HÀNG TẠI CHI NHÁNH (STORE) ---
      // Khóa dòng này lại để người khác không sửa được lúc đang check
      const checkStore = await request.query(`
        SELECT Quantity FROM Store WITH (UPDLOCK, HOLDLOCK) 
        WHERE BranchID = @bid AND ProductID = @pid
      `);

      if (checkStore.recordset.length === 0) {
        throw new Error("Sản phẩm này không tồn tại trong chi nhánh!");
      }

      const currentQty = checkStore.recordset[0].Quantity;

      if (currentQty < Quantity) {
        throw new Error(
          `Không đủ hàng để trả! Chi nhánh có: ${currentQty}, Muốn trả: ${Quantity}`
        );
      }

      // --- BƯỚC 2: TRỪ KHO CHI NHÁNH ---
      await request.query(`
        UPDATE Store SET Quantity = Quantity - @qty 
        WHERE BranchID = @bid AND ProductID = @pid
      `);

      // --- BƯỚC 3: CỘNG VỀ KHO TỔNG (PRODUCT) ---
      await request.query(`
        UPDATE Product SET Stock = Stock + @qty 
        WHERE ProductID = @pid
      `);

      await transaction.commit();
      return {
        message: "Xuất trả thành công",
        remainingInBranch: currentQty - Quantity,
      };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

export default Branch;
