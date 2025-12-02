import Branch from "../models/Branch.js";

export const getAllBranches = async (req, res) => {
  try {
    const list = await Branch.findAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const b = await Branch.findById(id);
    if (!b) return res.status(404).json({ message: "Branch not found" });
    res.json(b);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStock = async (req, res) => {
  try {
    const { branchId } = req.params;
    const stock = await Branch.getStock(branchId);
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { getAllBranches, getBranch, getStock };
