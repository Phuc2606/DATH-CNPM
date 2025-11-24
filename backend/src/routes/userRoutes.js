import express from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", verifyToken, userController.getProfile);
router.put("/profile", verifyToken, userController.updateProfile);
router.get("/", verifyToken, userController.getAllUsers);
router.delete("/:id", verifyToken, userController.deleteUser);

export default router;
