import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FilteredProducts from "../../components/FilteredProducts/FilteredProducts";
import "./Products.css";

const Products = () => {
  const location = useLocation();

  // --- lấy keyword tìm kiếm ---
  const urlSearch = new URLSearchParams(location.search).get("search") || "";
  const params = new URLSearchParams(location.search);
  const searchText = params.get("search") || "";

  // --- state ---
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("default");

  // --- fetch toàn sản phẩm ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Fetch products error:", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="products-container">

      {/* =================== SIDEBAR FILTER =================== */}
      <aside className="products-sidebar">
        <h3>Bộ lọc</h3>

        <div className="filter-block">
          <label>Giá tối thiểu</label>
          <input
            type="number"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="filter-block">
          <label>Giá tối đa</label>
          <input
            type="number"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            placeholder="100000000"
          />
        </div>

        <div className="filter-block">
          <label>Sắp xếp</label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="default">Mặc định</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="name-asc">Tên A → Z</option>
            <option value="name-desc">Tên Z → A</option>
          </select>
        </div>
      </aside>

      {/* =================== MAIN CONTENT =================== */}
      <main className="products-main">

        {/* CATEGORY MENU */}
        <div className="category-menu">
          <button onClick={() => setSelectedCategory("all")}>Tất cả</button>
          <button onClick={() => setSelectedCategory("cat-1")}>Laptop</button>
          <button onClick={() => setSelectedCategory("cat-2")}>Smart Watch</button>
          <button onClick={() => setSelectedCategory("cat-3")}>Tai Nghe</button>
          <button onClick={() => setSelectedCategory("cat-4")}>Loa</button>
          <button onClick={() => setSelectedCategory("cat-5")}>Điện thoại</button>
          <button onClick={() => setSelectedCategory("cat-6")}>Tablet</button>
          <button onClick={() => setSelectedCategory("cat-7")}>Máy ảnh</button>
          <button onClick={() => setSelectedCategory("cat-8")}>Gaming Console</button>
        </div>

        {/* PRODUCT GRID */}
        <FilteredProducts
          products={products}
          selectedCategory={selectedCategory}
          query={urlSearch}   
          minPrice={minPrice}
          maxPrice={maxPrice}
          sort={sort}
        />

      </main>
    </div>
  );
};

export default Products;
