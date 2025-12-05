import express from "express";
// 1. Import Middleware bảo vệ
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

import * as supplierController from "../controllers/supplierController.js";
import * as branchController from "../controllers/branchController.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/branches", branchController.getAllBranches);
router.get("/branches/:id", branchController.getBranchById);

// ==================================================================
// --- ADMIN ONLY ROUTES ---
// ==================================================================
router.use(verifyToken, isAdmin);

// --- 1. BRANCHES (Thao tác ghi) ---
router.post("/branches", branchController.createBranch);
router.put("/branches/:id", branchController.updateBranch);
router.delete("/branches/:id", branchController.deleteBranch);
// Xem tồn kho chi tiết là việc của Admin
router.get("/branches/:id/inventory", branchController.getBranchInventory);

// --- 2. SUPPLIERS ---
router.get("/suppliers", supplierController.getAllSuppliers);
router.post("/suppliers", supplierController.createSupplier);
router.put("/suppliers/:id", supplierController.updateSupplier);
router.delete("/suppliers/:id", supplierController.deleteSupplier);
router.get("/suppliers/:id/products", supplierController.getSupplierProducts);
router.post("/suppliers/link-product", supplierController.linkProduct);
router.post("/suppliers/unlink-product", supplierController.unlinkProduct);

// --- 3. STORE ---
router.put("/store/import", branchController.importStock);
router.put("/store/return", branchController.returnStock);

export default router;
