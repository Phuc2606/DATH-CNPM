// src/controllers/voucherController.js
import Voucher from '../models/Voucher.js';

export const getVoucherByCode = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const voucher = await Voucher.findByCode(code);

    if (!voucher) {
      return res.status(404).json({
        success: false,
        message: 'Mã giảm giá không tồn tại hoặc đã hết hạn'
      });
    }

    res.json({
      success: true,
      data: {
        code: voucher.Type,
        value: voucher.Discount,
        type: voucher.ApplicableCondition || 'FIXED', // PERCENT, FIXED, FREESHIP
        message: 'Mã hợp lệ!'
      }
    });
  } catch (err) {
    console.error('Voucher error:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống, vui lòng thử lại'
    });
  }
};