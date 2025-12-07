import React, { useState, useRef } from "react";
import "./Navbar.css";
import { AiOutlineSearch, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (text.trim() === "") {
        navigate("/products");
      } else {
        navigate(`/products?search=${encodeURIComponent(text)}`);
      }
      setOpen(false); // Đóng menu khi search xong (trên mobile)
    }
  };

  const closeMenu = () => setOpen(false);

  return (
    <>
      <div className="navbar">
        {/* Nút Hamburger cho Mobile */}
        <button
          className="hamburger-btn"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>

        <div
          className={`nav-overlay ${open ? "open" : ""}`}
          onClick={closeMenu}
        ></div>

        <div className={`nav-content ${open ? "open" : ""}`}>
          <div className="nav-links">
            <Link to="/" className="nav-item" onClick={closeMenu}>
              Trang chủ
            </Link>
            <Link to="/products" className="nav-item" onClick={closeMenu}>
              Sản phẩm
            </Link>
            <Link to="/stores" className="nav-item" onClick={closeMenu}>
              Cửa hàng
            </Link>
            <Link to="/profile" className="nav-item" onClick={closeMenu}>
              Tài khoản
            </Link>
          </div>

          <div className="nav-search-wrapper">
            <div className="nav-search">
              <AiOutlineSearch
                className="nav-search__icon"
                onClick={() => searchRef.current?.focus()}
              />
              <input
                ref={searchRef}
                placeholder="Tìm kiếm..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
