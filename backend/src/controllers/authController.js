// src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Đăng ký
export const register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  try {
    // 1. Kiểm tra email qua Model
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // 2. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Tạo user qua Model
    await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Tìm user qua Model
    const user = await User.findByEmail(email);

    // Kiểm tra user có tồn tại không
    if (!user) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    // 2. So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai email hoặc mật khẩu" });
    }

    // 3. Tạo Token
    const token = jwt.sign(
      { id: user.CustomerID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.CustomerID,
        name: user.Name,
        email: user.Email,
        role: user.Role,
        avatar: user.Avatar,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const logout = (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công" });
};
