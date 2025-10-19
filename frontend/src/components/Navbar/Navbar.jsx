import React, { useState } from 'react'
import './Navbar.css'

const Navbar = () => {
	const [open, setOpen] = useState(false)
	return (
		<div className="navbar">
			<div className={`nav-links ${open ? 'open' : ''}`}>
				<a href="#" className="nav-item">Trang chủ</a>
				<a href="#" className="nav-item">Sản phẩm</a>
				<a href="#" className="nav-item">Tin tức</a>
				<a href="#" className="nav-item">Khuyến mãi</a>
				<a href="#" className="nav-item">Hỗ trợ</a>
			</div>

			<div className="nav-actions">
				<div className="nav-search">
					<input placeholder="Tìm kiếm sản phẩm..." />
				</div>
				<button className="hamburger" onClick={()=>setOpen(!open)} aria-label="menu">☰</button>
			</div>
		</div>
	)
}

export default Navbar
