import React from 'react'
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-col footer-about">
          <h3 className="footer-logo">TechShop</h3>
          <p>Cửa hàng công nghệ hàng đầu, mang đến thiết bị chính hãng với giá tốt nhất. Giao hàng toàn quốc.</p>
        </div>

        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="#">Liên hệ</a></li>
            <li><a href="#">Chính sách bảo hành</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Hướng dẫn mua hàng</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Về TechShop</h4>
          <ul>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Tuyển dụng</a></li>
            <li><a href="#">Tin tức</a></li>
          </ul>
        </div>

        <div className="footer-col footer-contact">
          <h4>Liên hệ</h4>
          <p>Email: <a href="mailto:hello@techshop.test">hello@techshop.test</a></p>
          <p>Hotline: <a href="tel:0123456789">0123 456 789</a></p>
          <div className="footer-socials">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} TechShop. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
