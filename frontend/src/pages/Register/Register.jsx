import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { register } from "../../services/authService";
import AuthLogo from "../../components/Auth/AuthLogo";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    repassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    repassword: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRepassword, setShowRepassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = { ...errors };
    let hasError = false;

    // Check fullName
    if (!form.fullName || form.fullName.trim().length === 0) {
      newErrors.fullName = "*Tên đầy đủ không được để trống";
      hasError = true;
    }

    // Check email
    if (!isValidEmail(form.email)) {
      newErrors.email = "*Email không đúng định dạng!";
      hasError = true;
    }

    // Check password
    if (form.password.length < 6) {
      newErrors.password = "*Mật khẩu phải có ít nhất 6 ký tự";
      hasError = true;
    }

    // Check repassword
    if (form.repassword !== form.password) {
      newErrors.repassword = "*Mật khẩu nhập lại không khớp!";
      hasError = true;
    }

    // Check phone
    if (form.phone && !/^\d{10,11}$/.test(form.phone.replace(/\D/g, ""))) {
      newErrors.phone = "*Số điện thoại không hợp lệ!";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      setLoading(true);
      try {
        // Gọi API register
        const response = await register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          phone: form.phone,
        });

        alert("Đăng ký thành công!");
        navigate("/login");
      } catch (error) {
        const errorMessage = error.message || "Đăng ký thất bại!";
        if (errorMessage.includes("Email already registered")) {
          newErrors.email = "*Email đã được sử dụng!";
        } else {
          setErrors({ ...newErrors, general: errorMessage });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <AuthLogo />
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng ký</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Tên đầy đủ"
            value={form.fullName || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs">{errors.fullName}</p>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại (tùy chọn)"
            value={form.phone || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone}</p>
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
              required
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
              required
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

          {errors.general && (
            <p className="text-red-500 text-xs">{errors.general}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-2 rounded-lg transition duration-200 cursor-pointer"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
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
