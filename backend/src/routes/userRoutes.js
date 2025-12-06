import express from "express";
import { getProfile, updateProfile, getAllUsers, getUserOrderHistory } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getCart, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart } from "../controllers/cartController.js";
const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.get("/orders", verifyToken, getUserOrderHistory);
router.get("/users", verifyToken, getAllUsers);

//Cart Routes
//------------------------------- Lấy, tạo giỏ hàng(Tính tổng giá trị giỏ hàng) -------------------------------
router.get("/cart", verifyToken, getCart);
//------------------------------- Thêm sản phẩm vào giỏ hàng -------------------------------
router.post("/cart/items", verifyToken, addItemToCart);
//------------------------------- Xóa sản phẩm khỏi giỏ hàng -------------------------------
router.delete("/cart/items/:productId", verifyToken, removeItemFromCart);
//------------------------------- Cập nhật số lượng sản phẩm trong giỏ -------------------------------
router.patch("/cart/items/:productId", verifyToken, updateItemQuantity);
//------------------------------- Xóa toàn bộ giỏ hàng -------------------------------
router.delete("/cart", verifyToken, clearCart);

export default router;
