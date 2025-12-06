import Supplier from "../models/Supplier.js"; //

export const getAllSuppliers = async (req, res) => {
  try {
    const list = await Supplier.findAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy NCC", error: err.message });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const s = new Supplier(req.body);
    const saved = await s.save();
    res.status(201).json({ message: "Thêm NCC thành công", data: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    supplier.SupplierID = req.params.id; // Gán ID từ URL
    await supplier.save();
    res.json({ message: "Cập nhật NCC thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật NCC", error: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    await Supplier.deleteById(req.params.id);
    res.json({ message: "Xóa NCC thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa NCC", error: error.message });
  }
};

export const linkProduct = async (req, res) => {
  try {
    const { ProductID, SupplierID } = req.body;
    // Sửa SupplierModel -> Supplier cho đúng tên import
    const linked = await Supplier.linkProduct({
      ProductID,
      SupplierID,
    });
    res.status(201).json({ message: "Đã liên kết sản phẩm", data: linked });
  } catch (err) {
    if (err.number === 2627) {
      return res
        .status(400)
        .json({ message: "Sản phẩm này đã được liên kết với NCC rồi" });
    }
    res.status(500).json({ error: err.message });
  }
};

export const unlinkProduct = async (req, res) => {
  try {
    // Lấy ID từ body hoặc query đều được, ở đây mình dùng body cho thống nhất
    const { ProductID, SupplierID } = req.body;
    await Supplier.unlinkProduct({ ProductID, SupplierID });
    res.json({ message: "Đã hủy liên kết sản phẩm" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSupplierProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Supplier.getLinkedProducts(id);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Nhớ export deleteSupplier
export default {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  linkProduct,
  unlinkProduct,
  getSupplierProducts,
};
