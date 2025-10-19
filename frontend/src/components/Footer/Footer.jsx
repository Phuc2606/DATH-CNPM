import React from 'react'
import './Footer.css'

const Footer = () => {
	return (
		<footer className="site-footer">
			<div className="container footer-inner">
				<div>© {new Date().getFullYear()} TechShop. All rights reserved.</div>
				<div className="footer-links">Liên hệ: hello@techshop.test</div>
			</div>
		</footer>
	)
}

export default Footer
