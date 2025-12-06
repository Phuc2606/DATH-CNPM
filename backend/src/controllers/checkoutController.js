import { sql } from "../config/database.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Voucher from "../models/Voucher.js";

export const checkout = async (req, res) => {
  const {
    shippingAddress,
    recipientName,
    phone,
    note = "",
    paymentMethod = "COD", // COD, MOMO, VNPAY...
    voucherCode = "",
  } = req.body;
  console.log("voucherCode received:", voucherCode);
  const customerId = req.user.id; 

  if (!shippingAddress || !recipientName || !phone) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin giao hàng" });
  }

  const transaction = new sql.Transaction();
  try {
    await transaction.begin();

    // 1. Lấy giỏ hàng đầy đủ 
    const cartData = await Cart.getFullCart(customerId);
    if (!cartData || cartData.items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: "Giỏ hàng trống" });
    }

    const items = cartData.items;
    const subtotal = cartData.summary.subtotal;

    // 2. Tính phí ship
    const shippingFee = subtotal >= 500000 ? 0 : 30000; // Miễn phí ship từ 500k

    // 3. Xử lý voucher
    let discountAmount = 0;
    const appliedVouchers = [];

    if (voucherCode) {
      const codes = voucherCode.split(',').map(c => c.trim().toUpperCase()).filter(Boolean);

      for (const code of codes) {
        const voucher = await Voucher.findByCode(code, { transaction });
        if (!voucher) throw new Error(`Mã "${code}" không hợp lệ hoặc hết hạn`);

        const hasStock = await Voucher.hasStock(voucher.VoucherID, { transaction });
        if (!hasStock) throw new Error(`Mã "${code}" đã hết lượt sử dụng`);

        // Tính giảm giá cho từng mã
        let thisDiscount = 0;
        if (voucher.ApplicableCondition === "PERCENT") {
          thisDiscount = Math.round(subtotal * (voucher.Discount / 100));
        } else if (voucher.ApplicableCondition === "FIXED") {
          thisDiscount = voucher.Discount;
        } else if (voucher.ApplicableCondition === "FREESHIP") {
          thisDiscount = shippingFee;
          shippingFee = 0; // miễn phí ship luôn
        }

        discountAmount += thisDiscount;
        appliedVouchers.push({
          voucherId: voucher.VoucherID,
          code,
          discount: thisDiscount
        });

      }
    }

    // 4. Tính tổng cuối cùng (làm tròn về đồng)
    const totalAmount = Math.round(subtotal - discountAmount + shippingFee);

    // 5. Tạo đơn hàng
    const orderResult = await Order.create({
      CustomerID: customerId,
      Subtotal: subtotal,
      DiscountAmount: discountAmount,
      ShippingFee: shippingFee,
      TotalAmount: totalAmount,
      PaymentMethod: paymentMethod.toUpperCase(),
      PaymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      Status: "Pending",
      RecipientInfo: `${recipientName} | ${phone} | ${shippingAddress}`,
      Note: note,
      VoucherList: JSON.stringify(appliedVouchers),
    }, { transaction });

    const orderId = orderResult.OrderID;

    // 6. Thêm OrderItem + giảm stock
    for (const item of items) {
      // Kiểm tra + giảm stock (chỉ giảm nếu còn đủ)
      const updated = await Product.updateStockSafe(item.productId, item.quantity, { transaction });
      if (!updated) {
        throw new Error(`Sản phẩm "${item.name}" đã hết hàng hoặc không đủ số lượng`);
      }

      // Thêm vào chi tiết đơn
      await Order.addOrderItem(orderId, {
        ProductID: item.productId,
        Quantity: item.quantity,
        UnitPrice: item.price,
        FinalPrice: item.price,
      }, { transaction });
    }

    // 7. Ghi nhận voucher đã dùng
    for (const v of appliedVouchers) {
      const vid = v.voucherId;

      await Voucher.markAsUsed(vid, customerId, orderId, { transaction });

      const request = transaction.request();
      const result = await request
        .input("vid", sql.Int, vid)
        .query(`
      UPDATE Voucher
      SET TotalQuantity = TotalQuantity - 1
      WHERE VoucherID = @vid AND TotalQuantity > 0;

      SELECT @@ROWCOUNT AS affected;
    `);

      if (result.recordset[0].affected === 0) {
        throw new Error(`Voucher ID ${vid} đã hết lượt sử dụng`);
      }
    }

    // 8. Xóa giỏ hàng
    await Cart.clearByCustomerId(customerId, { transaction });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      data: {
        orderId,
        totalAmount,
        paymentMethod,
        expectedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 ngày
        items: items.map(i => ({
          productId: i.productId,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
        })),
      },
    });

  } catch (err) {
    await transaction.rollback();
    console.error("Checkout failed:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Đặt hàng thất bại, vui lòng thử lại",
    });
  }
};