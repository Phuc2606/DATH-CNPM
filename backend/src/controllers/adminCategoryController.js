import Category from "../models/Category.js"; //
import { sql } from "../config/database.js";

export const getAllCategories = async (req, res) => {
  try {
    const list = await Category.findAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    // req.body gồm: CategoryID (user nhập mã cat-x), Name, Icon
    const cat = new Category(req.body);
    await cat.save();
    res.status(201).json({ message: "Tạo danh mục thành công", data: cat });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo danh mục", error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check tồn tại
    const existing = await Category.findById(id);
    if (!existing)
      return res.status(404).json({ message: "Category not found" });

    // Update
    const cat = new Category({
      ...existing,
      ...req.body,
      CategoryID: id,
    });

    await cat.save();
    res.json({ message: "Cập nhật thành công", data: cat });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const cat = await Category.findById(id);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    // --- CHECK RÀNG BUỘC ---
    const request = new sql.Request();
    request.input("id", sql.VarChar, id);

    // Kiểm tra xem có sản phẩm nào thuộc danh mục này không?
    const checkProd = await request.query(
      "SELECT TOP 1 ProductID FROM Product WHERE Category = @id"
    );

    if (checkProd.recordset.length > 0) {
      return res.status(400).json({
        message:
          "Không thể xóa: Danh mục này đang chứa sản phẩm. Hãy xóa hoặc chuyển sản phẩm sang danh mục khác trước!",
      });
    }

    // --- XÓA ---
    await Category.deleteById(id);
    res.json({ message: "Đã xóa danh mục" });
  } catch (err) {
    // Check lỗi khóa ngoại SQL (phòng hờ)
    if (err.number === 547) {
      return res.status(400).json({ message: "Lỗi ràng buộc dữ liệu" });
    }
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
