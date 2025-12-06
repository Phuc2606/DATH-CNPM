import express from "express";
import {getAllUsers, getProfile, getUserOrderHistory, updateProfile } from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { addItemToCart, getCart, clearCart, removeItemFromCart, updateItemQuantity} from "../controllers/cartController.js"
import { getAllReviewsAdmin, deleteReview } from "../controllers/reviewController.js";
const router = express.Router();

// --- USER CÁ NHÂN ---
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
// --- ADMIN QUẢN LÝ ---
router.get("/", verifyToken, isAdmin, getAllUsers);
router.get("/orders", verifyToken, getUserOrderHistory);
// --- QUẢN LÝ ĐÁNH GIÁ (ADMIN) ---
router.get("/reviews", verifyToken, isAdmin, getAllReviewsAdmin);
router.delete("/reviews/:id", verifyToken, isAdmin, deleteReview);

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
