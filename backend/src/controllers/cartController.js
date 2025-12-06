import Cart from "../models/Cart.js";

//LẤY GIỎ HÀNG
export const getCart = async (req, res) => {
  try {
    const data = await Cart.getFullCart(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// THÊM SẢN PHẨM VÀO GIỎ HÀNG
export const addItemToCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ success: false, message: "Invalid product or quantity" });
    }

    const cart = await Cart.getOrCreateCart(customerId);
    await Cart.addItem(cart.CartID, { ProductID: productId, Quantity: quantity });

    res.status(201).json({ success: true, message: "Đã thêm vào giỏ hàng" });
  } catch (err) {
    console.error("addItem error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// XÓA SẢN PHẨM KHỎI GIỎ HÀNG
export const removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.getOrCreateCart(req.user.id);
    await Cart.removeItem(cart.CartID, productId);

    res.json({ success: true, message: "Đã xóa sản phẩm" });
  } catch (err) {
    console.error("removeItem error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// CẬP NHẬT SỐ LƯỢNG SẢN PHẨM TRONG GIỎ HÀNG
export const updateItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ success: false, message: "Số lượng không hợp lệ" });
    }

    const cart = await Cart.getOrCreateCart(req.user.id);
    await Cart.updateItemQuantity(cart.CartID, productId, quantity); 

    res.json({ success: true, message: "Cập nhật thành công" });
  } catch (err) {
    console.error("updateQuantity error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// XÓA TOÀN BỘ GIỎ HÀNG
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.getOrCreateCart(req.user.id);
    await Cart.clearCart(cart.CartID);

    res.json({ success: true, message: "Đã làm trống giỏ hàng" });
  } catch (err) {
    console.error("clearCart error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default { getCart, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart };
