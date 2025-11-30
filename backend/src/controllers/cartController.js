import CartModel from "../models/CartModel.js";

export const getCart = async (req, res) => {
  try {
    const { id } = req.params; // cart id
    const cart = await CartModel.findById(id);
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const items = await CartModel.getItems(id);
    res.json({ ...cart, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCart = async (req, res) => {
  try {
    const c = new CartModel(req.body);
    const saved = await c.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addItem = async (req, res) => {
  try {
    const { cartId } = req.params;
    const item = req.body; // { ProductID, Quantity }
    const inserted = await CartModel.addItem(cartId, item);
    res.status(201).json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const pool = await (await import("../config/database.js")).sql.connect();
    await pool
      .request()
      .input("id", (await import("../config/database.js")).sql.Int, itemId)
      .query("DELETE FROM CartItem WHERE CartItemID=@id");
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { getCart, createCart, addItem, removeItem };
