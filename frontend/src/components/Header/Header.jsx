import React, { useEffect, useState } from "react";
import "./Header.css";
import Navbar from "../Navbar/Navbar";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import useCart from "../../context/useCart";
import { getCurrentUser, logout } from "../../services/authService";
import { Link } from "react-router-dom";
import { DiAptana } from "react-icons/di";

const Header = () => {
  const navigate = useNavigate();
  const { cart, lastAdded } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [user, setUser] = useState(null);
  const itemCount = cart?.items?.length || 0;

  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    if (lastAdded) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 1500);
      return () => clearTimeout(t);
    }
  }, [lastAdded]);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    const updateUser = () => setUser(getCurrentUser());

    window.addEventListener("auth-change", updateUser);

    return () => window.removeEventListener("auth-change", updateUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 80) {
        setHidden(true); // scroll xuống
      } else {
        setHidden(false); // scroll lên
      }

      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const handleLogout = async () => {
    try {
      await logout(); // Xóa token
      clearCart(); // 2. Xóa sạch giỏ hàng hiện tại
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      navigate("/");
      // Có thể reload trang để đảm bảo sạch sẽ hoàn toàn nếu muốn
      // window.location.reload();
    }
  };

  return (
    <header
      className={`site-header fixed top-0 left-0 w-full z-30 
        shadow-lg transition-transform duration-500 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
    >
      <div className="container header-inner">
        <Link className="brand" to="/">
          TechShop
        </Link>
        <Navbar />
        <div className="header-actions">
          <div style={{ position: "relative" }}>
            {user?.role === "Admin" ? (
              <button
                className="cart-btn" // Tái sử dụng class của giỏ hàng cho đẹp
                onClick={() => navigate("/admin")}
                title="Vào trang quản trị" // Hover vào sẽ hiện chữ này
              >
                <DiAptana size={24} />
              </button>
            ) : (
              // Nếu là Customer (hoặc chưa login): Hiện Giỏ hàng
              <button
                className="cart-btn"
                aria-label="Giỏ hàng"
                onClick={() => navigate("/cart")}
              >
                <AiOutlineShoppingCart />
                {itemCount > 0 && (
                  <span className={`cart-badge ${lastAdded ? "pulse" : ""}`}>
                    {itemCount}
                  </span>
                )}
              </button>
            )}
            {showToast && lastAdded && (
              <div
                className={`add-toast ${showToast ? "show" : ""}`}
                role="status"
                aria-live="polite"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="add-toast__text">
                  <strong>Đã thêm</strong>
                  <span className="add-toast__name">{lastAdded.name}</span>
                </div>
              </div>
            )}
          </div>
          {user ? (
            <div className="flex gap-4 items-center ">
              <span
                className="text-white text-sm max-w-20 truncate inline-block align-middle"
                title={user.name} /* Hover vào sẽ hiện tên đầy đủ */
              >
                Hi {user.name}
              </span>
              <a
                className="text-(--color-primary)! cursor-pointer hover:underline"
                onClick={handleLogout}
              >
                Đăng xuất
              </a>
            </div>
          ) : (
            <button className="btn" onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
