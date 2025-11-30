import React, { useState, useRef } from "react";
import "./Navbar.css";
import { AiOutlineSearch } from "react-icons/ai";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  return (
    <div className="navbar">
      <div className={`nav-links ${open ? "open" : ""}`}>
        <a href="/" className="nav-item">
          Trang chủ
        </a>

        <a href="/products" className="nav-item">
          Sản phẩm
        </a>

        <a href="/branch" className="nav-item">
          Cửa hàng
        </a>

        <a href="/profile" className="nav-item">
          Tài khoản
        </a>
      </div>

      <div className="nav-actions">
        <div className="nav-search">
          <AiOutlineSearch
            className="nav-search__icon"
            onClick={() => searchRef.current && searchRef.current.focus()}
            aria-hidden
          />
          <input
            ref={searchRef}
            placeholder="Tìm kiếm sản phẩm..."
            aria-label="Tìm kiếm sản phẩm"
          />
        </div>
        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          ☰
        </button>
      </div>
    </div>
  );
};
export default Navbar;
