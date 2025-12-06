import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- AI CŨNG DÙNG ĐƯỢC ---
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// --- CHỈ ADMIN MỚI ĐƯỢC DÙNG (Các dòng dưới) ---
router.use(verifyToken, isAdmin); // Chốt chặn bảo vệ

router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;
