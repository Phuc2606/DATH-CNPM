import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.username === form.username && u.password === form.password
    );
    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      alert("Đăng nhập thành công!");
      navigate("/home");
    } else {
      setError("*Sai tên đăng nhập hoặc mật khẩu!");
    }
  };
  return (
    <div>
      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="w-96 rounded-2xl bg-white p-8 shadow-md">
          <h2 className="text-2xl text-center font-semibold mb-4">Đăng Nhập</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Tên đăng nhập"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className="absolute right-2.5 top-3 cursor-pointer select-none text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </span>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200"
            >
              Đăng nhập
            </button>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </form>
          <p className="text-sm text-center mt-4">
            Chưa có tài khoản?{" "}
            <Link to="/register">
              <span className="text-blue-600 hover:underline">Đăng ký</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
