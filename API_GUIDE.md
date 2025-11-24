# Hướng Dẫn Call API Từ Frontend Tới Backend

## 1. Cấu Trúc API Services

Các file services được tổ chức như sau:

```
src/services/
├── api.js              # Cấu hình axios instance
├── authService.js      # API liên quan đến authentication
└── userService.js      # API liên quan đến user
```

## 2. Thiết Lập Môi Trường

### Bước 1: Cài đặt dependencies
```bash
cd frontend
npm install
```

### Bước 2: Tạo file .env
```bash
cp .env.example .env
```

Thêm vào `.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 3. Cách Hoạt Động

### api.js - Axios Configuration
File này cấu hình axios instance với:
- **Base URL**: Lấy từ environment variable `VITE_API_BASE_URL`
- **Interceptors**: Tự động thêm token vào header Authorization
- **Error handling**: Tự động xóa token nếu hết hạn (401 error)

```javascript
import apiClient from './api';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api'
});
```

### authService.js - Authentication API

Các hàm có sẵn:

#### 1. Đăng ký (`register`)
```javascript
import { register } from '../services/authService';

const handleRegister = async () => {
  try {
    const result = await register({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '0123456789'
    });
    console.log('Registered:', result);
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

#### 2. Đăng nhập (`login`)
```javascript
import { login } from '../services/authService';

const handleLogin = async () => {
  try {
    const result = await login('john@example.com', 'password123');
    console.log('Logged in:', result);
    // Token được lưu tự động trong localStorage
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

#### 3. Đăng xuất (`logout`)
```javascript
import { logout } from '../services/authService';

const handleLogout = async () => {
  try {
    await logout();
    // Token được xóa tự động từ localStorage
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

#### 4. Lấy thông tin user hiện tại (`getCurrentUser`)
```javascript
import { getCurrentUser } from '../services/authService';

const user = getCurrentUser();
console.log('Current user:', user);
```

#### 5. Kiểm tra đăng nhập (`isAuthenticated`)
```javascript
import { isAuthenticated } from '../services/authService';

if (isAuthenticated()) {
  console.log('User is logged in');
}
```

### userService.js - User API

#### 1. Lấy profile (`getProfile`)
```javascript
import { getProfile } from '../services/userService';

const handleGetProfile = async () => {
  try {
    const profile = await getProfile();
    console.log('Profile:', profile);
  } catch (error) {
    console.error('Failed to get profile:', error);
  }
};
```

#### 2. Cập nhật profile (`updateProfile`)
```javascript
import { updateProfile } from '../services/userService';

const handleUpdateProfile = async () => {
  try {
    const result = await updateProfile({
      fullName: 'Jane Doe',
      phone: '0987654321',
      avatar: 'https://example.com/avatar.jpg'
    });
    console.log('Updated:', result);
  } catch (error) {
    console.error('Failed to update profile:', error);
  }
};
```

#### 3. Lấy tất cả users (`getAllUsers`)
```javascript
import { getAllUsers } from '../services/userService';

const handleGetAllUsers = async () => {
  try {
    const users = await getAllUsers();
    console.log('All users:', users);
  } catch (error) {
    console.error('Failed to get users:', error);
  }
};
```

#### 4. Xóa user (`deleteUser`)
```javascript
import { deleteUser } from '../services/userService';

const handleDeleteUser = async (userId) => {
  try {
    const result = await deleteUser(userId);
    console.log('User deleted:', result);
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};
```

## 4. Ví Dụ Thực Tế

### Ví dụ 1: Login Component
```jsx
import { useState } from "react";
import { login } from "../../services/authService";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await login(form.email, form.password);
      // Token và user đã được lưu trong localStorage
      console.log("Login successful:", response);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={(e) => setForm({...form, email: e.target.value})}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={(e) => setForm({...form, password: e.target.value})}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
};

export default Login;
```

### Ví dụ 2: User Profile Component
```jsx
import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../../services/userService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateProfile({
        fullName: profile.fullName,
        phone: profile.phone
      });
      setProfile(updated.user);
      alert("Profile updated!");
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>User Profile</h2>
      <input
        value={profile.fullName}
        onChange={(e) => setProfile({...profile, fullName: e.target.value})}
      />
      <input
        value={profile.phone}
        onChange={(e) => setProfile({...profile, phone: e.target.value})}
      />
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
};

export default Profile;
```

## 5. Xử Lý Lỗi

Các API services sẽ throw error nếu request thất bại:

```javascript
try {
  await login(email, password);
} catch (error) {
  // error.message hoặc error.response?.data
  console.error(error);
}
```

## 6. Token Management

- Token được lưu tự động trong `localStorage` sau khi login thành công
- Token được tự động thêm vào header `Authorization: Bearer <token>` cho mỗi request
- Nếu token hết hạn (401 error), hệ thống sẽ tự động xóa token và redirect tới login

## 7. Chạy Ứng Dụng

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Backend sẽ chạy tại `http://localhost:5000`
Frontend sẽ chạy tại `http://localhost:5173`

## 8. Ghi Chú Quan Trọng

- Đảm bảo backend đang chạy trước khi test API từ frontend
- Đảm bảo CORS được bật trong backend (đã được cấu hình)
- MongoDB phải đang chạy để backend hoạt động
- Luôn kiểm tra console browser để xem các lỗi
