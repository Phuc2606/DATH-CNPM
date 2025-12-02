import Product from "../models/Product.js"; //
import { sql } from "../config/database.js"; // Import để check ràng buộc

// 1. Lấy danh sách (Admin có thể cần xem cả SP ẩn - tùy logic sau này)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Tạo sản phẩm (Có xử lý ảnh)
export const createProduct = async (req, res) => {
  try {
    // Xử lý ảnh: Nếu có file upload thì lấy đường dẫn, không thì lấy link text
    let imageUrl = req.body.ImageURL || "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Tạo object data từ form
    const productData = {
      ...req.body,
      ImageURL: imageUrl,
    };

    const newProduct = new Product(productData);
    const saved = await newProduct.save();

    res.status(201).json({
      message: "Tạo sản phẩm thành công",
      data: saved,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo sản phẩm", error: err.message });
  }
};

// 3. Cập nhật sản phẩm (Có xử lý ảnh)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check tồn tại
    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Giữ ảnh cũ nếu không upload ảnh mới
    let imageUrl = existing.ImageURL;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const p = new Product({
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

// 4. Xóa sản phẩm (An toàn)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check tồn tại
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const request = new sql.Request();
    request.input("id", sql.Int, id);

    // --- CHECK AN TOÀN ---
    // 1. Có trong đơn hàng không?
    const checkOrder = await request.query(
      "SELECT TOP 1 ProductID FROM OrderItem WHERE ProductID = @id"
    );
    if (checkOrder.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Không thể xóa: Sản phẩm này đã có người mua!" });
    }

    // 2. Có trong giỏ hàng không?
    const checkCart = await request.query(
      "SELECT TOP 1 ProductID FROM CartItem WHERE ProductID = @id"
    );
    if (checkCart.recordset.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa: Sản phẩm đang trong giỏ hàng của khách!",
      });
    }

    // --- XÓA ---
    // Xóa tồn kho trước (Khóa ngoại)
    await request.query("DELETE FROM Store WHERE ProductID = @id");

    // Gọi Model để xóa Product
    await Product.deleteById(id);

    res.json({ message: "Đã xóa sản phẩm vĩnh viễn" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa", error: err.message });
  }
};

export default {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
