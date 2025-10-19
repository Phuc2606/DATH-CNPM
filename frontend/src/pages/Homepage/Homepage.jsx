import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import './Homepage.css'
import {
  PiLaptopFill,
  PiHeadphonesFill,
  PiWatchFill,
  PiSpeakerHighFill,
  PiDeviceMobileFill,
  PiDeviceTabletFill,
  PiCameraFill,
  PiGameControllerFill,
  PiGridFourBold
} from "react-icons/pi"


const sampleProducts = [
  { id: 1, name: 'Tai nghe không dây X1', price: '899.000₫', img: '/assets/images/laptop_lenovo_legion.jpg', category: 'cat-1' },
  { id: 2, name: 'Loa Bluetooth L5', price: '1.299.000₫', img: '/assets/images/laptop_lenovo_legion.jpg', category: 'cat-1' },
  { id: 3, name: 'Smartwatch S3', price: '2.199.000₫', img: '/assets/images/laptop_lenovo_legion.jpg', category: 'cat-2' },
  { id: 4, name: 'Sạc nhanh 65W', price: '399.000₫', img: '/assets/images/laptop_lenovo_legion.jpg', category: 'cat-3' },
  { id: 5, name: 'Cáp sạc C1', price: '199.000₫', img: '/assets/images/laptop_lenovo_legion.jpg', category: 'cat-3' },
]

const categories = [
  { id: 'cat-1', name: 'Laptop', icon: <PiLaptopFill /> },
  { id: 'cat-2', name: 'Thiết bị đeo', icon: <PiWatchFill /> },
  { id: 'cat-3', name: 'Âm thanh', icon: <PiHeadphonesFill /> },
  { id: 'cat-4', name: 'Loa', icon: <PiSpeakerHighFill /> },
  { id: 'cat-5', name: 'Điện thoại', icon: <PiDeviceMobileFill /> },
  { id: 'cat-6', name: 'Tablet', icon: <PiDeviceTabletFill /> },
  { id: 'cat-7', name: 'Camera', icon: <PiCameraFill /> },
  { id: 'cat-8', name: 'Gaming', icon: <PiGameControllerFill /> },
]

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [moreOpen, setMoreOpen] = useState(false)

  const filteredProducts = sampleProducts.filter(p => selectedCategory === 'all' || p.category === selectedCategory)

  return (
    <div className="homepage-root">
      <Header />

      <main className="hp-main">
        <section className="hp-hero">
          <div className="container">
            <div className="hp-hero__inner">
              <div className="hp-hero__content">
              <h1 className="hp-title">Công nghệ cho cuộc sống tốt hơn</h1>
              <p className="hp-subtitle">Khuyến mãi đến 30% cho Laptop và phụ kiện. Giao hàng toàn quốc.</p>
              <div className="hp-hero__actions">
                <button className="btn btn--primary">Mua ngay</button>
                <button className="btn btn--ghost">Xem thêm</button>
              </div>
              </div>
                <div className="hp-hero__visual" aria-hidden>
                  {/* Hero image (place image at public/assets/hero.png). If missing, fallback to CSS mock */}
                  <img
                    className="hp-hero-img"
                    src="/assets/hero.png"
                    alt="Hero visual"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                  <div className="hp-phone-mock" />
                  <div className="hp-badge">-30% OFF</div>
                </div>
            </div>
          </div>
        </section>

        <section className="hp-categories">
          <div className="container">
            <div className="category-controls">
              <h2 className="section-title">Danh mục</h2>
            </div>

            <div className="cats-grid">
              {(() => {
                const maxVisible = 5
                const visible = categories.slice(0, maxVisible)
                const extra = categories.slice(maxVisible)
                return (
                  <>
                   <button key="all" className="cat-card" onClick={() => { setSelectedCategory('all'); setMoreOpen(false) }}>
                        <div className="cat-card__icon"><PiGridFourBold /></div>
                        <div className="cat-card__name">Tất cả</div>
                  </button>
                    {visible.map(cat => (
                      <button key={cat.id} className="cat-card" onClick={() => { setSelectedCategory(cat.id); setMoreOpen(false) }}>
                        <div className="cat-card__icon">{cat.icon}</div>
                        <div className="cat-card__name">{cat.name}</div>
                      </button>
                    ))}

                    {extra.length > 0 && (
                      <div className="more-dropdown">
                        <button className="cat-card more-btn" onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen}>
                          <div className="cat-card__icon">⋯</div>
                          <div className="cat-card__name">Thêm</div>
                        </button>
                        {moreOpen && (
                          <div className="more-menu" role="menu">
                            {extra.map(cat => (
                              <button key={cat.id} className="cat-card" onClick={() => { setSelectedCategory(cat.id); setMoreOpen(false) }} role="menuitem">
                                <div className="cat-card__icon">{cat.icon}</div>
                                <div className="cat-card__name">{cat.name}</div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        </section>

        <section className="hp-products">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Sản phẩm nổi bật</h2>
              <a className="link-muted" href="#">Xem tất cả</a>
            </div>

            <div className="products-grid">
              {filteredProducts.map(p => (
                <article key={p.id} className="product-card">
                  <div className="product-card__media">
                    <img src={p.img} alt={p.name} onError={(e)=>{e.target.src='/assets/placeholder.png'}}/>
                  </div>
                  <div className="product-card__body">
                    <h3 className="product-name">{p.name}</h3>
                    <div className="product-footer">
                      <div className="product-price">{p.price}</div>
                      <button className="btn btn--small">Thêm vào giỏ</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="hp-newsletter">
          <div className="container newsletter-inner">
            <div>
              <h3>Nhận thông tin khuyến mãi</h3>
              <p>Đăng ký email để nhận mã giảm giá và tin mới nhất.</p>
            </div>
            <form className="newsletter-form" onSubmit={(e)=>{e.preventDefault(); alert('Cảm ơn!')}}>
              <input aria-label="email" type="email" placeholder="Email của bạn" required />
              <button className="btn btn--primary">Đăng ký</button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Homepage
