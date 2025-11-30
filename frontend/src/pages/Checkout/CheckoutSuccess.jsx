import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const CheckoutSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const orderId = state?.orderId || '—';
  const total = state?.total || 0;

  function fmt(v) {
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  }

  return (
    <div className="checkout-root">
      <div className="container">
        <div className="checkout-success">
          <h1>Đơn hàng đã được đặt!</h1>
          <p>Mã đơn hàng: <strong>{orderId}</strong></p>
          <p>Tổng thanh toán: <strong>{fmt(total)}</strong></p>
          <div style={{marginTop:20}}>
            <button className="btn btn--primary" onClick={() => navigate('/')}>Tiếp tục mua sắm</button>
            <button className="btn" style={{marginLeft:8}} onClick={() => navigate('/')}>Xem đơn hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;