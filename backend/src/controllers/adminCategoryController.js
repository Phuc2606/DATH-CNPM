import CategoryModel from "../models/CategoryModel.js";

export const adminListCategories = async (req, res) => {
  try {
    const cats = await CategoryModel.findAll();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminCreateCategory = async (req, res) => {
  try {
    const c = new CategoryModel(req.body);
    const saved = await c.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const adminUpdateCategory = async (req, res) => {
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

export const adminDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
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
  adminListCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
};
