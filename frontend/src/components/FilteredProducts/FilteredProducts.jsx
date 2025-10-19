import React, { useMemo, useState } from 'react';
import './FilteredProducts.css';

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  const digits = priceStr.replace(/\D+/g, '');
  return Number(digits) || 0;
}

const FilteredProducts = ({
  products,
  selectedCategory,
  query,
  setQuery,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sort,
  setSort
  , maxItems
}) => {
  const [brand, setBrand] = useState('all');

  function inferBrandFromName(name) {
    if (!name) return 'Khác';
    const known = ['Lenovo','Sony','Samsung','Iphone','Apple','Asus','Dell','HP'];
    const upper = name.toLowerCase();
    for (const b of known) {
      if (upper.includes(b.toLowerCase())) return b;
    }
    return 'Khác';
  }
  const processedProducts = useMemo(() => {
    return products.map(p => ({ ...p, _priceNum: parsePrice(p.price), _brand: inferBrandFromName(p.name) }));
  }, [products]);

  const brands = useMemo(() => {
    const list = Array.from(new Set(processedProducts.map(p => p._brand)));
    return list.sort((a, b) => {
      if (a === 'Khác') return 1;
      if (b === 'Khác') return -1;
      return a.localeCompare(b, 'vi');
    });
  }, [processedProducts]);

  const filtered = useMemo(() => {
    return processedProducts
      .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
      .filter(p => brand === 'all' || p._brand === brand)
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .filter(p => {
        if (minPrice && Number(minPrice) > p._priceNum) return false;
        if (maxPrice && Number(maxPrice) < p._priceNum) return false;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'price-asc') return a._priceNum - b._priceNum;
        if (sort === 'price-desc') return b._priceNum - a._priceNum;
        if (sort === 'name-asc') return a.name.localeCompare(b.name);
        if (sort === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [processedProducts, selectedCategory, query, minPrice, maxPrice, sort, brand]);

  return (
    <div className="fp-root">
      {/* Controls */}
      <div className="fp-controls">
        <select className="fp-brand" value={brand} onChange={e => setBrand(e.target.value)}>
          <option value="all">Tất cả</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <input
          type="text"
          className="fp-search"
          placeholder="Tìm theo tên sản phẩm..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <div className="fp-price-range">
          <input
            type="number"
            placeholder="Giá từ"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Đến"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </div>
        <select
          className="fp-sort"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          <option value="default">Mặc định</option>
          <option value="price-asc">Giá thấp → cao</option>
          <option value="price-desc">Giá cao → thấp</option>
          <option value="name-asc">Tên A → Z</option>
          <option value="name-desc">Tên Z → A</option>
        </select>
      </div>

      <div className="products-grid">
        {filtered.slice(0, typeof maxItems === 'number' ? maxItems : filtered.length).map(p => (
          <article key={p.id} className="product-card">
            <div className="product-card__media">
              <img
                src={p.img}
                alt={p.name}
                onError={e => (e.target.src = '/assets/placeholder.png')}
              />
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
  );
};

export default FilteredProducts;