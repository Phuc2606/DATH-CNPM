import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './Homepage.css';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import * as PiIcons from 'react-icons/pi';
import { PiGridFourBold } from "react-icons/pi";
import FilteredProducts from '../../components/FilteredProducts/FilteredProducts';

const Homepage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('default');
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="homepage-root">
      <Header />

      <main className="hp-main">
        {/* === Hero Section === */}
        <section className="hp-hero">
          <div className="container">
            <div className="hp-hero__inner">
              <div className="hp-hero__content">
                <h1 className="hp-title">Công nghệ cho cuộc sống tốt hơn</h1>
                <p className="hp-subtitle">
                  Khuyến mãi đến 30% cho Laptop và phụ kiện. Giao hàng toàn quốc.
                </p>
                <div className="hp-hero__actions">
                  <button className="btn btn--primary">Mua ngay</button>
                  <button className="btn btn--ghost">Xem thêm</button>
                </div>
              </div>

              <div className="hp-hero__visual" aria-hidden>
                <img
                  className="hp-hero-img"
                  src="/assets/images/asus.jpg"
                  alt="Hero visual"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="hp-phone-mock" />
                <div className="hp-badge">-30% OFF</div>
              </div>
            </div>
          </div>
        </section>

        {/* === Categories === */}
        <section className="hp-categories">
          <div className="container">
            <h2 className="section-title">Danh mục</h2>
            <div className="cats-grid">
              {(() => {
                const maxVisible = 5;
                const visible = categories.slice(0, maxVisible);
                const extra = categories.slice(maxVisible);
                return (
                  <>
                    <button key="all" className="cat-card" onClick={() => { setSelectedCategory('all'); setMoreOpen(false); }}>
                      <div className="cat-card__icon"><PiGridFourBold /></div>
                      <div className="cat-card__name">Tất cả</div>
                    </button>

                    {visible.map(cat => {
                      const Icon = PiIcons[cat.icon];
                      return (
                        <button key={cat.id} className="cat-card" onClick={() => setSelectedCategory(cat.id)}>
                          <div className="cat-card__icon">{Icon && <Icon />}</div>
                          <div className="cat-card__name">{cat.name}</div>
                        </button>
                      )
                    })}

                    {extra.length > 0 && (
                      <div className="more-dropdown">
                        <button className="cat-card more-btn" onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen}>
                          <div className="cat-card__icon">⋯</div>
                          <div className="cat-card__name">Thêm</div>
                        </button>
                        {moreOpen && (
                          <div className="more-menu" role="menu">
                            {extra.map(cat => {
                              const Icon = PiIcons[cat.icon];
                              return (
                                <button
                                  key={cat.id}
                                  className="cat-card"
                                  onClick={() => { setSelectedCategory(cat.id); setMoreOpen(false); }}
                                  role="menuitem"
                                >
                                  <div className="cat-card__icon">{Icon && <Icon />}</div>
                                  <div className="cat-card__name">{cat.name}</div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </section>

        {/* === Products === */}
        <section className="hp-products">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Sản phẩm nổi bật</h2>
              <a className="link-muted" href="#">Xem tất cả</a>
            </div>

            {/* <FilteredProducts /> */}
            <FilteredProducts
              products={products}
              selectedCategory={selectedCategory}
              query={query}
              setQuery={setQuery}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sort={sort}
              setSort={setSort}
              maxItems={12}
            />
          </div>
        </section>

        {/* === Newsletter === */}
        <section className="hp-newsletter">
          <div className="container newsletter-inner">
            <div>
              <h3>Nhận thông tin khuyến mãi</h3>
              <p>Đăng ký email để nhận mã giảm giá và tin mới nhất.</p>
            </div>
            <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn!'); }}>
              <input aria-label="email" type="email" placeholder="Email của bạn" required />
              <button className="btn btn--primary">Đăng ký</button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;
