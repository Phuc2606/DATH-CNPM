import jwt from "jsonwebtoken";

// 1. Xác thực Token (Authentication)
export const verifyToken = (req, res, next) => {
  // Lấy token từ header Authorization: "Bearer <token>"
  const tokenHeader = req.header("Authorization");

  if (!tokenHeader) {
    return res
      .status(401)
      .json({ message: "Truy cập bị từ chối! Vui lòng đăng nhập." });
  }

  try {
    // Cắt bỏ chữ "Bearer " để lấy chuỗi token sạch
    const token = tokenHeader.replace("Bearer ", "");

    // Giải mã
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu thông tin user vào req để các controller sau dùng
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};

// 2. Phân quyền Admin (Authorization)
export const isAdmin = (req, res, next) => {
  // Hàm này chạy SAU verifyToken nên đã có req.user
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Bạn không có quyền Admin!" });
  }
};
