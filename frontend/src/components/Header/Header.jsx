import React, { useEffect, useState } from "react";
import "./Header.css";
import Navbar from "../Navbar/Navbar";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import useCart from "../../context/useCart";
import { getCurrentUser, logout } from "../../services/authService";

const Header = () => {
  const navigate = useNavigate();
  const { cart, lastAdded } = useCart();
  const itemCount = cart.reduce((s, p) => s + (p.qty || 0), 0);
  const [showToast, setShowToast] = useState(false);
  const [user, setUser] = useState(null);

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

  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/">
          TechShop
        </a>
        <Navbar />
        <div className="header-actions">
          <div style={{ position: "relative" }}>
            <button
              className="cart-btn"
              aria-label="Giỏ hàng"
              onClick={() => navigate("/checkout")}
            >
              <AiOutlineShoppingCart />
              {itemCount > 0 && (
                <span className={`cart-badge ${lastAdded ? "pulse" : ""}`}>
                  {itemCount}
                </span>
              )}
            </button>
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
                className="text-white text-sm max-w-[80px] truncate inline-block align-middle"
                title={user.fullName} /* Hover vào sẽ hiện tên đầy đủ */
              >
                Hi {user.fullName}
              </span>
              <a
                className="!text-(--color-primary) cursor-pointer hover:underline"
                onClick={async () => {
                  try {
                    await logout();
                  } catch (err) {
                    console.error("Logout failed", err);
                  } finally {
                    setUser(null);
                    navigate("/");
                  }
                }}
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
