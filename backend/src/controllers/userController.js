import User from "../models/User.js";
import { sql } from "../config/database.js";
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.toJSON());
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, dateOfBirth, address, gender } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phone, dateOfBirth, address, gender },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users",
      error: error.message,
    });
  }
};
export const getUserOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const pool = await sql.connect();
    const request = pool.request();
    
    request.input("userId", sql.Int, userId);

    const result = await request.query(`
      SELECT 
        o.OrderID,
        o.OrderDate,
        o.TotalAmount,
        o.Status,
        o.RecipientInfo,
        o.PaymentMethod,
        o.DiscountAmount,
        o.Subtotal,
        -- Chi tiết sản phẩm
        oi.ProductID,
        oi.Quantity,
        oi.UnitPrice,
        oi.FinalPrice,

        p.Name AS ProductName,
        p.ImageURL AS ImageUrl

      FROM [Order] o
      LEFT JOIN OrderItem oi ON o.OrderID = oi.OrderID
      LEFT JOIN Product p ON oi.ProductID = p.ProductID

      WHERE o.CustomerID = @userId
      ORDER BY o.OrderDate DESC
    `);

    const ordersMap = {};

    result.recordset.forEach(row => {
      const orderId = row.OrderID;

      if (!ordersMap[orderId]) {
        let name = "", phone = "", address = "";
        if (row.RecipientInfo) {
          const parts = row.RecipientInfo.split("|").map(p => p.trim());
          name = parts[0] || "";
          phone = parts[1] || "";
          address = parts[2] || "";
        }

        ordersMap[orderId] = {
          order: {
            OrderID: row.OrderID,
            OrderDate: row.OrderDate,
            TotalAmount: row.TotalAmount,
            DiscountAmount: row.DiscountAmount,
            Status: row.Status,
            Subtotal: row.Subtotal,
            PaymentMethod: row.PaymentMethod,
            RecipientInfo: row.RecipientInfo,
            recipient: { name, phone, address }
          },
          items: []
        };
      }
      if (row.ProductID) {
        ordersMap[orderId].items.push({
          ProductName: row.ProductName || "Sản phẩm đã xóa",
          ImageUrl: row.ImageUrl || "/placeholder.jpg",
          Quantity: row.Quantity,
          UnitPrice: row.FinalPrice || row.UnitPrice
        });
      }
    });

    const orders = Object.values(ordersMap);

    res.status(200).json(orders);
  } catch (err) {
    console.error("Lỗi lấy lịch sử đơn hàng:", err);
    res.status(500).json({ message: "Không thể tải lịch sử đơn hàng" });
  }
};