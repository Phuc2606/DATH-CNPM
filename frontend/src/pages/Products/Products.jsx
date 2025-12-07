import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FilteredProducts from "../../components/FilteredProducts/FilteredProducts";
import "./Products.css";
import categoryService from "../../services/categoryService";

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
  const [categories, setCategories] = useState([]);
  // --- fetch toàn sản phẩm ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
        const dataCat = await categoryService.getAllCategories();
        setCategories(dataCat);
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
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="filter-block">
          <label>Giá tối đa</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="100000000"
          />
        </div>

        <div className="filter-block">
          <label>Sắp xếp</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
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
          <button
            className={selectedCategory === "all" ? "active" : ""}
            onClick={() => setSelectedCategory("all")}
          >
            Tất cả
          </button>

          {/* Render danh sách từ API */}
          {categories.map((cat) => (
            <button
              key={cat.CategoryID}
              className={selectedCategory === cat.CategoryID ? "active" : ""}
              onClick={() => setSelectedCategory(cat.CategoryID)}
            >
              {cat.Name}
            </button>
          ))}
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
