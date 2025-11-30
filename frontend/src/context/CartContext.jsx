import React, { createContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'dath_cart_v1';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {
      // ignore storage errors (quota/private mode)
    }
  }, [cart]);

  function addItem(product, qty = 1) {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + qty } : p);
      }
      return [...prev, { ...product, qty }];
    });
    // best-effort UI hint for recently added item
    setLastAdded({ id: product.id, name: product.name });
    setTimeout(() => setLastAdded(null), 1600);
  }

  function removeItem(id) {
    setCart(prev => prev.filter(p => p.id !== id));
  }

  function updateQty(id, qty) {
    setCart(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(0, qty) } : p).filter(p=>p.qty>0));
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((s, p) => {
    const n = Number((p.price || '').toString().replace(/\D+/g, '')) || 0;
    return s + n * (p.qty || 1);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart, total, lastAdded }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
