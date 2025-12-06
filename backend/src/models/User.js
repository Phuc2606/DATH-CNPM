import { sql } from "../config/database.js";

class User {
  constructor(user) {
    this.CustomerID = user.CustomerID;
    this.Name = user.Name;
    this.Email = user.Email;
    this.PasswordHash = user.PasswordHash;
    this.PhoneNumber = user.PhoneNumber;
    this.Address = user.Address;
    this.DateOfBirth = user.DateOfBirth || null;
    this.Gender = user.Gender || null;
    this.Role = user.Role;
  }
  toJSON() {
    const userObject = {
      CustomerID: this.CustomerID,
      Name: this.Name,
      Email: this.Email,
      PhoneNumber: this.PhoneNumber,
      Address: this.Address,
      Role: this.Role,
      DateOfBirth: this.DateOfBirth
        ? this.DateOfBirth.toISOString().split("T")[0]
        : null,
      Gender: this.Gender,
    };
    return userObject;
  }
  // 1. Tìm user theo Email (Dùng cho Login/Register)
  static async findByEmail(email) {
    const request = new sql.Request();
    request.input("email", sql.NVarChar, email);

    const result = await request.query(
      "SELECT * FROM Customer WHERE Email = @email"
    );

    const row = result.recordset[0];
    return row ? new User(row) : null;
  }

  // 2. Tìm user theo ID (Dùng cho getProfile sau này)
  static async findById(id) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);

    const result = await request.query(
      "SELECT * FROM Customer WHERE CustomerID = @id"
    );

    const row = result.recordset[0];
    return row ? new User(row) : null;
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
  static async findByIdAndUpdate(id, updateData) {
    const request = new sql.Request();
    request.input("id", sql.Int, id);

    const fieldMap = {
      fullName: { column: "Name", type: sql.NVarChar(100) },
      phone: { column: "PhoneNumber", type: sql.NVarChar(20) },
      address: { column: "Address", type: sql.NVarChar(255) },
      dateOfBirth: { column: "DateOfBirth", type: sql.Date },
      gender: { column: "Gender", type: sql.NVarChar(10) },
    };

    const updates = [];

    for (const [key, value] of Object.entries(updateData)) {
      if (value === undefined || value === null || value === "") continue;

      const field = fieldMap[key];
      if (field) {
        const paramName = `@${key}`;
        if (key === "dateOfBirth") {
          request.input(key, field.type, value ? new Date(value) : null);
        } else {
          request.input(key, field.type, value);
        }
        updates.push(`${field.column} = ${paramName}`);
      }
    }

    if (updates.length === 0) {
      return await User.findById(id);
    }

    const query = `
    UPDATE Customer 
    SET ${updates.join(", ")}
    WHERE CustomerID = @id
  `;
    await request.query(query);
    return await User.findById(id);
  }
}

export default User;
