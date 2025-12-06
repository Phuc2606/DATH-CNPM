import express from "express";
import upload from "../middleware/upload.js"; // Middleware upload ảnh
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js"; // Middleware bảo vệ
import { resolvePath } from "../middleware/resolvePath.js";
import * as productController from "../controllers/productController.js";

const router = express.Router();

// --- PUBLIC (User xem được) ---
router.get("/", productController.getAllProducts);

router.get(
  "/admin/list",
  verifyToken,
  isAdmin,
  productController.getAdminProducts
);

router.get("/:id", productController.getProductById);

// --- ADMIN ONLY (Cần login & quyền Admin) ---
// Dùng upload.single('image') để nhận file ảnh
router.post(
  "/",
  verifyToken,
  isAdmin,
  resolvePath,
  upload.single("image"),
  productController.createProduct
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  resolvePath,
  upload.single("image"),
  productController.updateProduct
);

router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct);

export default router;
