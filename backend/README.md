# DATH CNPM Backend

Backend API cho dự án DATH CNPM được xây dựng với Express.js theo mô hình MVC.

## Cấu trúc dự án

```
src/
├── controllers/      # Xử lý logic ứng dụng
├── models/          # Định nghĩa schema MongoDB
├── routes/          # Định nghĩa API routes
├── middleware/      # Middleware (auth, validation, etc)
├── config/          # Cấu hình (database, env, etc)
├── utils/           # Utility functions
└── app.js           # Entry point
```

## Cài đặt

### 1. Clone hoặc tạo backend folder

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Tạo file .env

```bash
cp .env.example .env
```

Chỉnh sửa các biến môi trường trong `.env`:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dath-cnpm
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### 4. Chạy MongoDB

Đảm bảo MongoDB đang chạy trên máy của bạn.

### 5. Chạy server

**Development:**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Users

- `GET /api/users/profile` - Lấy thông tin profile (cần token)
- `PUT /api/users/profile` - Cập nhật profile (cần token)
- `GET /api/users` - Lấy danh sách tất cả users (cần token)
- `DELETE /api/users/:id` - Xóa user (cần token)

## Sử dụng

### Đăng ký

```json
POST /api/auth/register
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0123456789"
}
```

### Đăng nhập

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response sẽ bao gồm JWT token để sử dụng cho các request tiếp theo.

### Sử dụng Token

Thêm header `Authorization` với giá trị `Bearer <token>`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Công nghệ sử dụng

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Token authentication
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Nodemon** - Development server

## Tác giả

Your Name
