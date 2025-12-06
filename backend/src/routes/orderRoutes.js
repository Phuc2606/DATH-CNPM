import express from "express";
import { getOrderDetails } from "../controllers/orderController.js";
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();
// GET
router.get("/:orderId", verifyToken, getOrderDetails);

export default router;
