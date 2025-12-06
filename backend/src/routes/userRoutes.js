import express from "express";
import * as userController from "../controllers/userController.js";
// Import thêm isAdmin
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- USER CÁ NHÂN ---
router.get("/profile", verifyToken, userController.getProfile);
router.put("/profile", verifyToken, userController.updateProfile);

// --- ADMIN QUẢN LÝ ---
router.get("/", verifyToken, isAdmin, userController.getAllUsers);

export default router;
