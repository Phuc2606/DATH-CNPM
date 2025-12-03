import ProductModel from "../models/Product.js"; //
import { sql } from "../config/database.js";

// --- PUBLIC (Ai cũng dùng được) ---

// 1. Lấy danh sách sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: err.message });
  }
};

// 2. Lấy chi tiết 1 sản phẩm
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// --- ADMIN ONLY (Chỉ Admin mới gọi được - Chặn ở Router) ---

// 3. Tạo sản phẩm (Có xử lý ảnh)
export const createProduct = async (req, res) => {
  try {
    // Xử lý ảnh: Nếu có file upload thì lấy đường dẫn
    let imageUrl = req.body.ImageURL || "";
    if (req.file) {
      imageUrl = `/uploads/${req.uploadFolder}/${req.uploadFileName}`;
    }
    const productData = {
      ...req.body,
      ImageURL: imageUrl,
    };

    const newProduct = new ProductModel(productData);
    const saved = await newProduct.save();

    res.status(201).json({ message: "Thêm sản phẩm thành công", data: saved });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo sản phẩm", error: err.message });
  }
};

// 4. Cập nhật sản phẩm
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await ProductModel.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    let imageUrl = existing.ImageURL;
    if (req.file) {
      imageUrl = `/uploads/${req.uploadFolder}/${req.uploadFileName}`;
    }

    const p = new ProductModel({
      ...existing,
      ...req.body,
      ImageURL: imageUrl,
      ProductID: id,
    });

    const updated = await p.save();
    res.json({ message: "Cập nhật thành công", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật", error: err.message });
  }
};

// 5. Xóa sản phẩm (An toàn)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const request = new sql.Request();
    request.input("id", sql.Int, id);

    // Check Order
    const checkOrder = await request.query(
      "SELECT TOP 1 ProductID FROM OrderItem WHERE ProductID = @id"
    );
    if (checkOrder.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Không thể xóa: Sản phẩm này đã có người mua!" });
    }

    // Check Cart
    const checkCart = await request.query(
      "SELECT TOP 1 ProductID FROM CartItem WHERE ProductID = @id"
    );
    if (checkCart.recordset.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa: Sản phẩm đang trong giỏ hàng của khách!",
      });
    }

    const checkStore = await request.query(
      "SELECT TOP 1 ProductID FROM Store WHERE ProductID = @id"
    );
    if (checkStore.recordset.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa: Sản phẩm vẫn còn tồn kho ở chi nhánh!",
      });
    }

    await ProductModel.deleteById(id);
    res.json({ message: "Đã xóa sản phẩm vĩnh viễn" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa", error: err.message });
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
