import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import "./Cart.css";
import { FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiShoppingCart } from "react-icons/fi";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, summary, loading, updateQuantity, removeItem, clearCart } = useCart();

  const cartItems = cart?.items || [];

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <FiShoppingCart size={80} color="#ccc" />
          <h2>Giỏ hàng trống</h2>
          <p>Chưa có sản phẩm nào trong giỏ hàng của bạn</p>
          <button className="continue-shopping-btn" onClick={() => navigate("/")}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>
          <FiShoppingCart size={28} />
          Giỏ hàng ({summary.totalItems} sản phẩm)
        </h1>
        <button onClick={clearCart} className="clear-cart-btn">
          <FiTrash2 size={18} />
          Làm trống
        </button>
      </div>

      <div className="cart-content">
        {/* Danh sách sản phẩm */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="item-image"
                onError={(e) => { e.target.src = "/placeholder.jpg"; }}
              />

              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">{formatPrice(item.price)}</p>

                <div className="quantity-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              <div className="item-actions">
                <button className="remove-btn" onClick={() => removeItem(item.productId)}>
                  <FiTrash2 size={20} />
                </button>
                <div className="item-total">{formatPrice(item.price * item.quantity)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-header">
            <span>Tạm tính ({summary.totalItems} sản phẩm): </span>
            <span>{formatPrice(summary.subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Phí vận chuyển</span>
            <span className={summary.shippingFee === 0 ? "free-shipping" : ""}>
              {summary.shippingFee === 0 ? "Miễn phí" : formatPrice(summary.shippingFee)}
            </span>
          </div>

          <div className="summary-total">
            <strong>Tổng cộng: </strong>
            <strong className="total-price">{formatPrice(summary.total)}</strong>
          </div>

          <button className="checkout-btn" onClick={() => navigate("/checkout")}>
            Tiến hành thanh toán
          </button>
          <button className="continue-shopping-btn" onClick={() => navigate("/")}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;