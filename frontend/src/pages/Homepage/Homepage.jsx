import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import './Homepage.css'

const sampleProducts = [
  { id: 1, name: 'Tai nghe không dây X1', price: '899.000₫', img: '/assets/images/laptop_lenovo_legion.jpg', category: 'cat-1' },
  { id: 2, name: 'Loa Bluetooth L5', price: '1.299.000₫', img: '/assets/images/laptop_lenovo_legion.jpg', category: 'cat-1' },
  { id: 3, name: 'Smartwatch S3', price: '2.199.000₫', img: '/assets/images/laptop_lenovo_legion.jpg', category: 'cat-2' },
  { id: 4, name: 'Sạc nhanh 65W', price: '399.000₫', img: '/assets/images/laptop_lenovo_legion.jpg', category: 'cat-3' },
  { id: 5, name: 'Cáp sạc C1', price: '199.000₫', img: '/assets/images/laptop_lenovo_legion.jpg', category: 'cat-3' },
]

const categories = [
  { id: 'cat-1', name: 'Âm thanh', icon: '🔊' },
  { id: 'cat-2', name: 'Thiết bị đeo', icon: '⌚' },
  { id: 'cat-3', name: 'Phụ kiện', icon: '🔌' },
  { id: 'cat-4', name: 'Mới về', icon: '🆕' },
]

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

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
              <p className="hp-subtitle">Khuyến mãi đến 30% cho tai nghe và phụ kiện. Giao hàng toàn quốc.</p>
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
              <select className="category-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">Tất cả</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="cats-grid">
              {categories.map(cat => (
                <button key={cat.id} className="cat-card" onClick={() => setSelectedCategory(cat.id)}>
                  <div className="cat-card__icon">{cat.icon}</div>
                  <div className="cat-card__name">{cat.name}</div>
                </button>
              ))}
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
