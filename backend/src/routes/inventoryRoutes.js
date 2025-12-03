import express from "express";

import * as supplierController from "../controllers/supplierController.js";
import * as branchController from "../controllers/branchController.js"; // <--- Đã mở comment import

const router = express.Router();

// --- 1. SUPPLIERS (NHÀ CUNG CẤP) ---
router.get("/suppliers", supplierController.getAllSuppliers);
router.post("/suppliers", supplierController.createSupplier);
router.put("/suppliers/:id", supplierController.updateSupplier);
router.delete("/suppliers/:id", supplierController.deleteSupplier);
router.get("/suppliers/:id/products", supplierController.getSupplierProducts);
router.post("/suppliers/link-product", supplierController.linkProduct);
router.post("/suppliers/unlink-product", supplierController.unlinkProduct);

// --- 2. BRANCHES (CHI NHÁNH) ---
router.get("/branches", branchController.getAllBranches);
router.get("/branches/:id", branchController.getBranchById); // Thêm: Lấy chi tiết 1 chi nhánh
router.post("/branches", branchController.createBranch);
router.put("/branches/:id", branchController.updateBranch);
router.delete("/branches/:id", branchController.deleteBranch); // Thêm: Xóa chi nhánh

// Route lấy tồn kho của 1 chi nhánh (Xem chi nhánh đó đang có những SP gì)
router.get("/branches/:id/inventory", branchController.getBranchInventory);

// --- 3. STORE (NHẬP KHO) ---
// Route nhập hàng vào kho (Cập nhật số lượng)
router.put("/store/import", branchController.importStock);
router.put("/store/return", branchController.returnStock);

export default router;
