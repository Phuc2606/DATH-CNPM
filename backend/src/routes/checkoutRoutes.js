import express from "express";
import { checkout } from "../controllers/checkoutController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/checkout", verifyToken, checkout);

export default router;