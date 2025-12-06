import Branch from "../models/Branch.js";

// --- QUẢN LÝ CHI NHÁNH ---

// 1. Lấy danh sách
export const getAllBranches = async (req, res) => {
  try {
    const list = await Branch.findAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Lấy chi tiết
export const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const b = await Branch.findById(id);
    if (!b) return res.status(404).json({ message: "Branch not found" });
    res.json(b);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Tạo chi nhánh mới
export const createBranch = async (req, res) => {
  try {
    const branch = new Branch(req.body);
    await branch.save();
    res
      .status(201)
      .json({ message: "Thêm chi nhánh thành công", data: branch });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo chi nhánh", error: err.message });
  }
};

// 4. Cập nhật chi nhánh
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Branch.findById(id);

    if (!existing) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const branch = new Branch({ ...existing, ...req.body, BranchID: id });
    await branch.save();

    res.json({ message: "Cập nhật thành công", data: branch });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

// 5. Xóa chi nhánh
export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Branch.findById(id);
    if (!existing) return res.status(404).json({ message: "Branch not found" });

    // Model đã xử lý xóa Store (hàng tồn) trước rồi nên yên tâm gọi
    await Branch.deleteById(id);

    res.json({ message: "Xóa chi nhánh thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa chi nhánh", error: err.message });
  }
};

// --- QUẢN LÝ KHO (STORE) ---

// 6. Xem tồn kho của 1 chi nhánh
export const getBranchInventory = async (req, res) => {
  try {
    const { id } = req.params; // BranchID
    const stock = await Branch.getStock(id);
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy tồn kho", error: err.message });
  }
};

// 7. Nhập kho (Import Stock)
export const importStock = async (req, res) => {
  try {
    const { branchId, productId, quantity } = req.body;

    // Gọi hàm trong Model xử lý
    await Branch.importStock({
      BranchID: branchId,
      ProductID: productId,
      Quantity: quantity,
    });

    res.json({ message: "Nhập kho thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi nhập kho", error: err.message });
  }
};

export const returnStock = async (req, res) => {
  try {
    const { branchId, productId, quantity } = req.body;

    await Branch.returnStock({
      BranchID: branchId,
      ProductID: productId,
      Quantity: quantity,
    });

    res.json({ message: "Xuất trả hàng về kho tổng thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xuất trả", error: err.message });
  }
};

export default {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchInventory,
  importStock,
  returnStock,
};
