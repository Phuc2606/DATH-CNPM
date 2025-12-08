import Order from "../models/Order.js";
import { sql } from "../config/database.js";

export const getAllOrders = async (req, res) => {
  try {
    const { page, limit, search } = req.query;

    // Gọi hàm phân trang trong Model
    const result = await Order.findWithPagination({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      search: search || "",
    });

    // Trả về { data: [...], pagination: {...} }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    await Order.updateStatus(orderId, status, paymentStatus);
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi cập nhật đơn hàng" });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Lấy thông tin Order từ SQL Server
    const requestOrder = new sql.Request();
    const orderResult = await requestOrder.input("oid", sql.Int, orderId)
      .query(`
        SELECT *
        FROM [Order]
        WHERE OrderID = @oid
      `);

    const order = orderResult.recordset[0];

    if (!order) return res.status(404).json({ message: "Order not found" });

    const voucherList = order.VoucherList
      ? order.VoucherList.split(",").map((code) => ({ code }))
      : [];

    // Lấy danh sách sản phẩm
    const request = new sql.Request();
    const items = await request.input("oid", sql.Int, orderId).query(`
        SELECT 
          OI.OrderID, OI.ProductID, OI.Quantity,
          OI.UnitPrice, OI.FinalPrice,
          P.Name AS ProductName, P.ImageURL AS ImageUrl
        FROM OrderItem OI
        JOIN Product P ON P.ProductID = OI.ProductID
        WHERE OI.OrderID = @oid
      `);

    return res.json({
      order,
      items: items.recordset,
      vouchers: voucherList,
    });
  } catch (err) {
    console.error("Error getOrderDetails:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
