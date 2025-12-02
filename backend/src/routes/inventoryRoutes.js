import express from "express";
import upload from "../middleware/upload.js";

import * as categoryController from "../controllers/adminCategoryController.js";
import * as supplierController from "../controllers/supplierController.js";
//import * as branchController from "../controllers/branchController.js";
import * as productController from "../controllers/adminProductController.js";

const router = express.Router();

// --- 1. CATEGORIES ---
router.get("/categories", categoryController.getAllCategories);
router.post("/categories", categoryController.createCategory);
router.put("/categories/:id", categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

// --- 2. SUPPLIERS ---
router.get("/suppliers", supplierController.getAllSuppliers);
router.post("/suppliers", supplierController.createSupplier);
router.put("/suppliers/:id", supplierController.updateSupplier);
router.delete("/suppliers/:id", supplierController.deleteSupplier);

// --- 3. BRANCHES (CHI NHÁNH) ---
// router.get("/branches", branchController.getAllBranches);
// router.post("/branches", branchController.createBranch);
// router.put("/branches/:id", branchController.updateBranch);
// // Route lấy tồn kho của 1 chi nhánh
// router.get("/branches/:id/inventory", branchController.getBranchInventory);

// --- 4. STORE (NHẬP KHO) ---
//router.put("/store/import", branchController.importStock);

// --- 5. PRODUCTS (CRUD) ---
router.get("/products", productController.getAllProducts);
router.post(
  "/products",
  upload.single("image"),
  productController.createProduct
);
router.put(
  "/products/:id",
  upload.single("image"),
  productController.updateProduct
);
router.delete("/products/:id", productController.deleteProduct);

export default router;
