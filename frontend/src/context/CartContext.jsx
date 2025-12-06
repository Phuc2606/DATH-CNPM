// src/context/CartContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [rawCart, setRawCart] = useState(null);
  const [appliedVouchers, setAppliedVouchers] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    shippingFee: 30000,
    discount: 0,
    total: 30000,
    totalItems: 0,
    totalQuantity: 0,
  });

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const cartRef = useRef(rawCart);
  useEffect(() => { cartRef.current = rawCart; }, [rawCart]);

  const BACKEND_URL = useMemo(() => {
    return import.meta.env.VITE_API_URL?.replace("/api/users", "") || "http://localhost:5000";
  }, []);

  const API_URL = useMemo(() => `${BACKEND_URL}/api/users`, [BACKEND_URL]);

  const getImageUrls = useCallback((items) => {
    return items.map((item) => ({
      ...item,
      image: item.image
        ? item.image.startsWith("http")
          ? item.image
          : `${BACKEND_URL}${item.image.startsWith("/") ? "" : "/"}${item.image}`
        : "/placeholder.jpg",
    }));
  }, [BACKEND_URL]);

  // === TÍNH TOÁN SUMMARY - CHỈ CHẠY KHI CẦN ===
  const recalculateSummary = useCallback((items = [], vouchers = []) => {
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const baseShipping = subtotal >= 500000 ? 0 : 30000;

    let discount = 0;
    let finalShipping = baseShipping;

    vouchers.forEach((v) => {
      if (v.type === "PERCENT") {
        discount += Math.round(subtotal * (v.value / 100));
      } else if (v.type === "FIXED") {
        discount += v.value;
      } else if (v.type === "FREESHIP" && baseShipping > 0) {
        finalShipping = 0;
      }
    });

    const total = subtotal - discount + finalShipping;

    return {
      subtotal,
      shippingFee: finalShipping,
      discount,
      total,
      totalItems: items.length,
      totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
    };
  }, []);

  // === TỰ ĐỘNG TÍNH LẠI KHI CART HOẶC VOUCHER THAY ĐỔI ===
  useEffect(() => {
    if (!rawCart) {
      setSummary({
        subtotal: 0,
        shippingFee: 30000,
        discount: 0,
        total: 30000,
        totalItems: 0,
        totalQuantity: 0,
      });
      return;
    }
    const newSummary = recalculateSummary(rawCart.items, appliedVouchers);
    setSummary(newSummary);
  }, [rawCart?.items, appliedVouchers, recalculateSummary]);

  // === FETCH CART ===
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setRawCart(null);
        return;
      }

      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data;
      if (!data || !data.items) {
        setRawCart(null);
        return;
      }

      const itemsWithImage = getImageUrls(data.items);
      setRawCart({
        cartId: data.cartId,
        items: itemsWithImage.map((i) => ({ ...i, total: i.price * i.quantity })),
      });
    } catch (err) {
      toast.error("Không tải được giỏ hàng");
      setRawCart(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL, getImageUrls]);

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchCart();
    }
  }, [fetchCart]);
  // THÊM SẢN PHẨM VÀO GIỎ
  const addItem = useCallback(async (productId, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn cần đăng nhập");
      return;
    }

    try {
      setActionLoading(true);

      await axios.post(
        `${API_URL}/cart/items`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Đã thêm vào giỏ hàng");
      await fetchCart();

    } catch (err) {
      toast.error("Không thể thêm sản phẩm");
    } finally {
      setActionLoading(false);
    }
  }, [API_URL, fetchCart]);
  // === CÁC HÀM UPDATE ===
  const updateQuantity = useCallback(async (productId, newQuantity) => {
    if (newQuantity < 0 || !cartRef.current) return;

    setActionLoading(true);

    const currentItem = cartRef.current.items.find((i) => i.productId === productId);
    if (currentItem && currentItem.quantity === newQuantity) {
      setActionLoading(false);
      return;
    }
    setRawCart(prev => {
      if (!prev) return prev;
      const newItems = newQuantity === 0
        ? prev.items.filter(i => i.productId !== productId)
        : prev.items.map(i => i.productId === productId ? { ...i, quantity: newQuantity, total: i.price * newQuantity } : i);
      return { ...prev, items: newItems };
    });
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_URL}/cart/items/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (newQuantity === 0) toast.success("Đã xóa khỏi giỏ hàng");
    } catch (err) {
      toast.error("Cập nhật thất bại, đang hoàn tác...");
      await fetchCart(); // rollback
    } finally {
      setActionLoading(false);
    }
  }, [API_URL, fetchCart]);

  const removeItem = useCallback(async (productId) => {
    if (!cartRef.current || !cartRef.current.items.some((i) => i.productId === productId)) {
      return;
    }

    setActionLoading(true);

    setRawCart((prev) => {
      if (!prev) return prev;
      const newItems = prev.items.filter((item) => item.productId !== productId);
      return {
        ...prev,
        items: newItems,
        summary: recalculateSummary(newItems),
      };
    });

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/cart/items/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa sản phẩm");
    } catch (err) {
      toast.error("Xóa thất bại");
      await fetchCart();
    } finally {
      setActionLoading(false);
    }
  }, [API_URL, fetchCart]);

  const clearCart = useCallback(async () => {
    setRawCart(null);
    setAppliedVouchers([]);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      toast.error("Không thể xóa giỏ hàng");
    }
  }, [API_URL]);

  // === VALUE ỔN ĐỊNH HOÀN TOÀN ===
  const value = useMemo(() => ({
    cart: rawCart,
    summary,              // ← TẤT CẢ ĐÃ TÍNH SẴN Ở ĐÂY
    appliedVouchers,
    setAppliedVouchers,   // ← Checkout chỉ cần gọi cái này
    loading,
    actionLoading,
    fetchCart,
    updateQuantity,
    removeItem,
    clearCart,
    addItem,
  }), [
    rawCart,
    summary,
    appliedVouchers,
    loading,
    actionLoading,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;