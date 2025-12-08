import express from "express";
import {
  getOrderDetails,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/:orderId", getOrderDetails);
router.use(verifyToken, isAdmin);

router.get("/", getAllOrders);
router.put("/:orderId/status", updateOrderStatus);

export default router;
