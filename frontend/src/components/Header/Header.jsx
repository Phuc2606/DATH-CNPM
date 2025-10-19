import React from 'react'
import './Header.css'
import Navbar from '../Navbar/Navbar'
import { AiOutlineShoppingCart } from 'react-icons/ai'

const Header = () => {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="/">TechShop</a>
        <Navbar />
        <div className="header-actions">
          <button className="cart-btn" aria-label="Giỏ hàng"><AiOutlineShoppingCart /></button>
          <button className="btn">Đăng nhập</button>
        </div>
      </div>
    </header>
  )
}

export default Header
