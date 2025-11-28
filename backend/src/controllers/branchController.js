import BranchModel from "../models/BranchModel.js";

export const listBranches = async (req, res) => {
  try {
    const list = await BranchModel.findAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const b = await BranchModel.findById(id);
    if (!b) return res.status(404).json({ message: "Branch not found" });
    res.json(b);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStock = async (req, res) => {
  try {
    const { branchId } = req.params;
    const stock = await BranchModel.getStock(branchId);
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { listBranches, getBranch, getStock };
