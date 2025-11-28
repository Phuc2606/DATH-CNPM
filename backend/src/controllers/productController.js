import ProductModel from "../models/ProductModel.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const p = new ProductModel(req.body);
    const saved = await p.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await ProductModel.findById(id);
    if (!existing)
      return res.status(404).json({ message: "Product not found" });
    const p = new ProductModel({ ...existing, ...req.body, ProductID: id });
    const updated = await p.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Simple delete using SQL
    const deleted = await ProductModel.findById(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    const pool = await (await import("../config/database.js")).sql.connect();
    await pool
      .request()
      .input("id", (await import("../config/database.js")).sql.Int, id)
      .query("DELETE FROM Product WHERE ProductID=@id");
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
