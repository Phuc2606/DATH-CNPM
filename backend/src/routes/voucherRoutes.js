import express from 'express';
import { getVoucherByCode } from '../controllers/voucherController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:code', verifyToken, getVoucherByCode);

export default router;