import bcrypt from "bcryptjs";
import crypto from "crypto"; // Dùng để tạo fake ID

// Fake "database"
const users = [];

class User {
  constructor({ fullName, email, password, phone, avatar, role }) {
    this._id = crypto.randomUUID(); // Tạo ID giả lập MongoDB _id
    this.fullName = fullName;
    this.email = email.toLowerCase();
    this.password = password;
    this.phone = phone || null;
    this.avatar = avatar || null;
    this.role = role || "user";
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // --- INSTANCE METHODS (gọi trên đối tượng user) ---

  // Hash password và lưu vào mảng users
  async save() {
    // Chỉ hash nếu password chưa được hash (đơn giản hóa check độ dài)
    if (this.password && this.password.length < 60) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // Kiểm tra xem user đã tồn tại trong mảng chưa để update hoặc push mới
    const existingIndex = users.findIndex((u) => u._id === this._id);
    if (existingIndex !== -1) {
      users[existingIndex] = this;
    } else {
      users.push(this);
    }
    return this;
  }

  async comparePassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  toJSON() {
    // Clone object để tránh sửa trực tiếp data gốc khi delete key
    const userObject = { ...this };
    delete userObject.password;
    return userObject;
  }

  // --- STATIC METHODS (gọi trực tiếp từ Class User) ---

  // 1. Tìm theo Email (cho Auth)
  static async findOne(query) {
    // Giả lập tìm kiếm
    const user = users.find((u) => {
      if (query.email) return u.email === query.email.toLowerCase();
      return false;
    });
    return user || null;
  }

  // 2. Tìm theo ID (cho User Profile)
  static async findById(id) {
    const user = users.find((u) => u._id === id);
    return user || null;
  }

  // 3. Tìm và Update (cho Update Profile)
  static async findByIdAndUpdate(id, updateData, options) {
    const index = users.findIndex((u) => u._id === id);
    if (index === -1) return null;

    // Merge data cũ với data mới
    const updatedUser = {
      ...users[index],
      ...updateData,
      updatedAt: new Date(),
    };

    // Lưu ngược lại vào mảng giả
    users[index] = updatedUser;

    // Vì logic là Fake DB nên ta cần trả về object có method toJSON
    // để controller gọi .toJSON() không bị lỗi.
    // Tuy nhiên trong userController bạn đang gọi user.toJSON() ngay.
    // Để đơn giản, ta ép kiểu về instance của User hoặc trả về object thô đã xử lý.

    // Cách tốt nhất: Trả về object đã merge, gán lại prototype để nó có method toJSON
    Object.setPrototypeOf(updatedUser, User.prototype);

    return updatedUser;
  }

  // 4. Tìm và Xóa
  static async findByIdAndDelete(id) {
    const index = users.findIndex((u) => u._id === id);
    if (index === -1) return null;

    const deletedUser = users[index];
    users.splice(index, 1); // Xóa khỏi mảng
    return deletedUser;
  }

  // 5. Lấy danh sách users (Giả lập Mongoose Query Chain .select())
  static find() {
    // Trả về một object có chứa hàm select và then (để await được)
    return {
      select: function (fields) {
        let result = [...users];

        // Nếu select là "-password" (loại bỏ password)
        if (fields === "-password") {
          result = result.map((u) => {
            const { password, ...rest } = u;
            return rest;
          });
        }

        // Trả về Promise để controller có thể await
        return Promise.resolve(result);
      },
      // Trường hợp gọi await User.find() mà không select
      then: function (resolve) {
        resolve(users);
      },
    };
  }
}

export default User;
