import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    repassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);

  function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(String(email).toLowerCase());
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    const newErrors = { ...errors };

    // Cập nhật form
    setForm(newForm);

    // Nếu đang nhập lại mật khẩu thì check liền
    if (name === "repassword") {
      if (value !== newForm.password) {
        newErrors.repassword = "*Mật khẩu nhập lại không khớp";
      } else {
        newErrors.repassword = "";
      }
    }

    // Nếu người dùng đổi mật khẩu chính, thì cũng cần check lại repassword
    if (name === "password" && newForm.repassword) {
      if (newForm.repassword !== value) {
        newErrors.repassword = "*Mật khẩu nhập lại không khớp";
      } else {
        newErrors.repassword = "";
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = { ...errors };
    let hasError = false;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Check username
    if (form.username.length < 6 || form.username.length > 15) {
      newErrors.username = "*Tên tài khoản phải có 6-15 ký tự";
      hasError = true;
    } else {
      const exists = users.some((u) => u.username === form.username);
      if (exists) {
        newErrors.username = "*Tên đăng nhập đã được sử dụng!";
        hasError = true;
      }
    }

    // Check password
    if (form.password.length < 8 || form.password.length > 16) {
      newErrors.password = "*Mật khẩu phải dài 8-16 ký tự";
      hasError = true;
    }

    // Check email
    if (!isValidEmail(form.email)) {
      newErrors.email = "*Email không đúng định dạng!";
      hasError = true;
    } else {
      const exists = users.some((u) => u.email === form.email);
      if (exists) {
        newErrors.email = "*Email đã được sử dụng!";
        hasError = true;
      }
    }

    // Check repassword
    if (form.repassword !== form.password) {
      newErrors.repassword = "*Mật khẩu nhập lại không khớp!";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      users.push({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Đăng ký thành công!");
      navigate("/login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng ký</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={form.username || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.username && (
            <p className="text-red-500 text-xs">{errors.username}</p>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={form.password || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <span
              className="absolute right-2.5 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiEyeOff /> : <HiEye />}
            </span>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}

          {/* Repassword */}
          <div className="relative">
            <input
              type={showRepassword ? "text" : "password"}
              name="repassword"
              placeholder="Nhập lại mật khẩu"
              value={form.repassword || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <span
              className="absolute right-2.5 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowRepassword(!showRepassword)}
            >
              {showRepassword ? <HiEyeOff /> : <HiEye />}
            </span>
          </div>
          {errors.repassword && (
            <p className="text-red-500 text-xs">{errors.repassword}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition duration-200 cursor-pointer"
          >
            Đăng ký
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Đã có tài khoản?{" "}
          <Link to="/login">
            <span className="text-green-600 hover:underline">Đăng nhập</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
