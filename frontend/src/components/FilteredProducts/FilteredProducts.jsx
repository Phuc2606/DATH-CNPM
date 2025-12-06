import React, { useMemo, useState } from 'react';
import './FilteredProducts.css';
import useCart from '../../context/useCart';
import ProductCard from "../ProductCard/ProductCard";
function parsePrice(price) {
  if (price == null) return 0;
  const val = Number(price);
  return isNaN(val) ? 0 : val;
}

const FilteredProducts = ({
  products = [],
  selectedCategory = 'all',
  query = '',
  setQuery = () => { },
  minPrice = '',
  setMinPrice = () => { },
  maxPrice = '',
  setMaxPrice = () => { },
  sort = 'default',
  setSort = () => { },
  maxItems
}) => {
  const [brand, setBrand] = useState('all');

  function inferBrandFromName(name) {
    if (!name) return 'Khác';
    const known = ['Lenovo', 'Sony', 'Samsung', 'Iphone', 'Apple', 'Asus', 'Dell', 'HP'];
    const upper = name.toLowerCase();
    for (const b of known) {
      if (upper.includes(b.toLowerCase())) return b;
    }
    return 'Khác';
  }

  // ensure we have a sensible API base (fallback to localhost:5000)
  const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL.replace(/\/+$/, '') // remove trailing slash if any
    : 'http://localhost:5000';

  const processedProducts = useMemo(() => {
    return (products || []).map(p => {
      const imageUrlRaw = p?.ImageURL ?? p?.image ?? p?.Image ?? '';
      let img = '/assets/placeholder.png';

      if (imageUrlRaw) {
        const trimmed = String(imageUrlRaw).trim();
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
          img = trimmed;
        } else if (trimmed.startsWith('/')) {
          // ImageURL already begins with /uploads/..., so just prefix domain
          img = `${API_BASE}${trimmed}`;
        } else {
          // some APIs might give just filename; assume it lives under /uploads/
          img = `${API_BASE}/uploads/${trimmed}`;
        }
      }

      return {
        id: p?.ProductID ?? p?.id,
        name: p?.Name ?? p?.name ?? '',
        category: p?.Category ?? p?.category ?? 'uncategorized',
        price: p?.Price ?? p?.price ?? 0,
        _priceNum: parsePrice(p?.Price ?? p?.price ?? 0),
        brand: p?.Brand ?? p?.brand ?? '',
        img,
        _brand: inferBrandFromName(p?.Name ?? p?.name ?? '')
      };
    });
  }, [products, API_BASE]);

  const brands = useMemo(() => {
    const list = Array.from(new Set(processedProducts.map(p => p._brand)));
    return list.sort((a, b) => {
      if (a === 'Khác') return 1;
      if (b === 'Khác') return -1;
      return a.localeCompare(b, 'vi');
    });
  }, [processedProducts]);

  const filtered = useMemo(() => {
    const q = String(query || '').toLowerCase();
    return processedProducts
      .filter(p => selectedCategory === 'all' || String(p.category) === String(selectedCategory))
      .filter(p => brand === 'all' || p._brand === brand)
      .filter(p => (p.name || '').toLowerCase().includes(q))
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

  const { addItem } = useCart();

  return (
    <div className="fp-root">

      <div className="products-grid">
        {filtered
          .slice(0, maxItems ?? filtered.length)
          .map(p => (
            <ProductCard key={p.id} product={p} />
          ))}

      </div>
    </div>
  );
};

export default FilteredProducts;