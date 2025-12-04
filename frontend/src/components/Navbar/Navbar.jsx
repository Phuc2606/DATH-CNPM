import React, { useState, useRef } from "react";
import "./Navbar.css";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);

  return (
    <div className="navbar">
      <div className={`nav-links ${open ? "open" : ""}`}>
        <Link to="/" className="nav-item">
          Trang chủ
        </Link>

        <Link to="/products" className="nav-item">
          Sản phẩm
        </Link>

        <Link to="/stores" className="nav-item">
          Cửa hàng
        </Link>

        <Link to="/profile" className="nav-item">
          Tài khoản
        </Link>
      </div>

      <div className="nav-actions">
        <div className="nav-search">
          <AiOutlineSearch
            className="nav-search__icon"
            onClick={() => searchRef.current?.focus()}
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
