import SupplierModel from "../models/SupplierModel.js";

export const listSuppliers = async (req, res) => {
  try {
    const list = await SupplierModel.findAll();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const s = new SupplierModel(req.body);
    const saved = await s.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const linkProduct = async (req, res) => {
  try {
    const { ProductID, SupplierID, SupplyPrice } = req.body;
    const linked = await SupplierModel.linkProduct({
      ProductID,
      SupplierID,
      SupplyPrice,
    });
    res.status(201).json(linked);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { listSuppliers, createSupplier, linkProduct };
