import CategoryModel from "../models/CategoryModel.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await CategoryModel.findById(id);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const c = new CategoryModel(req.body);
    const saved = await c.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await CategoryModel.findById(id);
    if (!existing)
      return res.status(404).json({ message: "Category not found" });
    const c = new CategoryModel({ ...existing, ...req.body, CategoryID: id });
    const updated = await c.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await CategoryModel.findById(id);
    if (!cat) return res.status(404).json({ message: "Category not found" });
    const pool = await (await import("../config/database.js")).sql.connect();
    await pool
      .request()
      .input("id", (await import("../config/database.js")).sql.VarChar, id)
      .query("DELETE FROM Category WHERE CategoryID=@id");
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
