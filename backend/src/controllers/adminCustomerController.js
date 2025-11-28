import UserModel from "../models/UserModel.js";

export const listCustomers = async (req, res) => {
  try {
    const pool = await (await import("../config/database.js")).sql.connect();
    const result = await pool
      .request()
      .query("SELECT * FROM Customer ORDER BY CustomerID DESC");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const c = await UserModel.findById(id);
    if (!c) return res.status(404).json({ message: "Customer not found" });
    res.json(c);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await UserModel.findById(id);
    if (!existing)
      return res.status(404).json({ message: "Customer not found" });
    const u = new UserModel({ ...existing, ...req.body, CustomerID: id });
    const updated = await u.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await (await import("../config/database.js")).sql.connect();
    await pool
      .request()
      .input("id", (await import("../config/database.js")).sql.Int, id)
      .query("DELETE FROM Customer WHERE CustomerID=@id");
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { listCustomers, getCustomer, updateCustomer, deleteCustomer };
