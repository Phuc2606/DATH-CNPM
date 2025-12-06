import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Homepage.css";
import * as PiIcons from "react-icons/pi";
import { PiGridFourBold, PiTagBold } from "react-icons/pi";
import FilteredProducts from "../../components/FilteredProducts/FilteredProducts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Homepage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default");
  const [moreOpen, setMoreOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");

        const mapped = res.data.map((c) => ({
          id: c.CategoryID,
          name: c.Name,
          icon: c.Icon,
        }));

        setCategories(mapped);
      } catch (err) {
        console.error("Lỗi tải categories:", err);
      }
    };

    fetchCategories();
  }, []);

  //   LOAD PRODUCTS API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await axios.get("http://localhost:5000/api/products");

        let list = res.data.map((p) => ({
          ...p,
          image: p.Image
            ? `http://localhost:5000/uploads/${p.Image}`
            : "/placeholder.jpg",
        }));

        const featuredList = Object.values(
          list.reduce((acc, product) => {
            if (!acc[product.Category]) {
              acc[product.Category] = product;
            }
            return acc;
          }, {})
        );

        setFeatured(featuredList);
      } catch (err) {
        console.error("Lỗi tải products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);




  return (
    <div className="homepage-root">
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
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
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
                    <button
                      key="all"
                      className="cat-card"
                      onClick={() => {
                        setSelectedCategory("all");
                        setMoreOpen(false);
                      }}
                    >
                      <div className="cat-card__icon">
                        <PiGridFourBold />
                      </div>
                      <div className="cat-card__name">Tất cả</div>
                    </button>

                    {visible.map((cat) => {
                      const Icon = cat.icon ? PiIcons[cat.icon] : PiTagBold;
                      return (
                        <button
                          key={cat.id}
                          className="cat-card"
                          onClick={() => setSelectedCategory(cat.id)}
                        >
                          <div className="cat-card__icon">
                            {Icon && <Icon />}
                          </div>
                          <div className="cat-card__name">{cat.name}</div>
                        </button>
                      );
                    })}

                    {extra.length > 0 && (
                      <div className="more-dropdown">
                        <button
                          className="cat-card more-btn"
                          onClick={() => setMoreOpen(!moreOpen)}
                          aria-expanded={moreOpen}
                        >
                          <div className="cat-card__icon">⋯</div>
                          <div className="cat-card__name">Thêm</div>
                        </button>

                        {moreOpen && (
                          <div className="more-menu" role="menu">
                            {extra.map((cat) => {
                              const Icon = cat.icon ? PiIcons[cat.icon] : PiTagBold;
                              return (
                                <button
                                  key={cat.id}
                                  className="cat-card"
                                  onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setMoreOpen(false);
                                  }}
                                  role="menuitem"
                                >
                                  <div className="cat-card__icon">
                                    {Icon && <Icon />}
                                  </div>
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
            </div>

            {loadingProducts ? (
              <p>Đang tải sản phẩm...</p>
            ) : (
              <FilteredProducts
                products={featured}
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


            )}
          </div>
        </section>

        {/* === Newsletter === */}
        <section className="hp-newsletter">
          <div className="newsletter-inner">
            <h2 className="newsletter-title">Nhận thông tin khuyến mãi</h2>
            <p className="newsletter-subtitle">
              Đăng ký email để nhận mã giảm giá và tin mới nhất.
            </p>

            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Email của bạn"
                className="newsletter-input"
              />
              <button className="newsletter-btn">ĐĂNG KÝ</button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Homepage;
