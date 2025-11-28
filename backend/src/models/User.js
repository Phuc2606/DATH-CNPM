// src/models/User.js
import { sql } from "../config/database.js";

class User {
  constructor(user) {
    this.CustomerID = user.CustomerID;
    this.Name = user.Name;
    this.Email = user.Email;
    this.PasswordHash = user.PasswordHash;
    this.PhoneNumber = user.PhoneNumber;
    this.Address = user.Address;
    this.Role = user.Role;
    this.Avatar = user.Avatar;
  }

  // 1. Tìm user theo Email (Dùng cho Login/Register)
  static async findByEmail(email) {
    const request = new sql.Request();
    request.input("email", sql.NVarChar, email);

    const result = await request.query(
      "SELECT * FROM Customer WHERE Email = @email"
    );

    return result.recordset[0]; // Trả về user đầu tiên hoặc undefined
  }

  // 2. Tìm user theo ID (Dùng cho getProfile sau này)
  static async findById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);

    const result = await request.query(
      "SELECT * FROM Customer WHERE CustomerID = @id"
    );

    return result.recordset[0];
  }

  // 3. Tạo user mới (Dùng cho Register)
  static async create({
    name,
    email,
    password,
    phone,
    address,
    role = "Customer",
  }) {
    const request = new sql.Request();
    request.input("name", sql.NVarChar, name);
    request.input("email", sql.NVarChar, email);
    request.input("pass", sql.NVarChar, password); // Password đã hash
    request.input("phone", sql.NVarChar, phone);
    request.input("address", sql.NVarChar, address);
    request.input("role", sql.NVarChar, role);

    // Insert và trả về ID vừa tạo
    const result = await request.query(`
      INSERT INTO Customer (Name, Email, PasswordHash, PhoneNumber, Address, Role)
      VALUES (@name, @email, @pass, @phone, @address, @role);
    `);

    return result;
  }
}

export default User;
