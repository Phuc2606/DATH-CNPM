import React, { useState, useEffect } from 'react';
import './Checkout.css';
import useCart from '../../context/useCart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTruck, FaCreditCard, FaWallet, FaCheckCircle, FaTimes, FaTag } from 'react-icons/fa';

const Checkout = () => {
  const {
    cart,
    summary,
    appliedVouchers,
    setAppliedVouchers,
    clearCart
  } = useCart();

  const navigate = useNavigate();
  const items = cart?.items || [];

  const { subtotal, shippingFee, discount, total } = summary;

  const [form, setForm] = useState({
    recipientName: '',
    phone: '',
    shippingAddress: '',
    note: ''
  });
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMessage, setVoucherMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fmt = (v) => (Number(v) || 0).toLocaleString('vi-VN') + '₫';
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoadingProfile(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("PROFILE TỪ SERVER:", res.data);
        const user = res.data;
        setProfile(user);

        setForm(prev => ({
          recipientName: prev.recipientName || user.Name || '',
          phone: prev.phone || user.PhoneNumber || '',
          shippingAddress: prev.shippingAddress || user.Address || '',
          note: prev.note || ''
        }));

      } catch (err) {
        console.log("Không lấy được profile (có thể chưa đăng nhập)");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const applyVoucher = async () => {
    const code = voucherInput.trim().toUpperCase();
    if (!code) return;

    if (appliedVouchers.some(v => v.code === code)) {
      setVoucherMessage('Mã này đã được áp dụng!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/vouchers/${code}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const v = res.data.data;
        setAppliedVouchers(prev => [...prev, { code, ...v }]);
        setVoucherInput('');
        setVoucherMessage('');
      }
    } catch (err) {
      setVoucherMessage(err.response?.data?.message || 'Mã không hợp lệ');
    }
  };

  const removeVoucher = (code) => {
    setAppliedVouchers(prev => prev.filter(v => v.code !== code));
    setVoucherMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.recipientName || !form.phone || !form.shippingAddress) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/checkout',
        {
          recipientName: form.recipientName.trim(),
          phone: form.phone.trim(),
          shippingAddress: form.shippingAddress.trim(),
          note: form.note?.trim(),
          paymentMethod,
          voucherCode: appliedVouchers.map(v => v.code).join(',') || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const orderId = res?.data?.data?.orderId;

      if (!orderId) {
        console.error("ORDER ID IS UNDEFINED!!! RES:", res);
        return;
      }

      clearCart();

      navigate(`/checkout-success/${orderId}`, { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }

  };
  useEffect(() => {
    return () => {
      setAppliedVouchers([]);
    };
  }, []);
  // Loading profile
  if (loadingProfile) {
    return <div className="checkout-root"><div className="container">Đang tải thông tin...</div></div>;
  }
  return (
    <div className="checkout-root">
      <div className="container">
        <h1 className="checkout-title">Thanh toán</h1>
        <div className="checkout-grid">

          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Thông tin nhận hàng</h2>
            {error && <div className="error-message">{error}</div>}

            <input required placeholder="Họ và tên" value={form.recipientName}
              onChange={e => setForm({ ...form, recipientName: e.target.value })} />

            <input required type="tel" placeholder="Số điện thoại" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} />

            <input required placeholder="Địa chỉ giao hàng (số nhà, đường, phường...)" value={form.shippingAddress}
              onChange={e => setForm({ ...form, shippingAddress: e.target.value })} />

            <textarea rows={3} placeholder="Ghi chú (giao buổi chiều, để trước cửa...)" value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })} />

            <h2><FaTag /> Mã giảm giá</h2>
            <div className="voucher-section">
              <div className="voucher-input">
                <input placeholder="Nhập mã giảm giá" value={voucherInput} onChange={e => setVoucherInput(e.target.value)} />
                <button type="button" onClick={applyVoucher} className="btn-apply">Áp dụng</button>
              </div>

              {appliedVouchers.map(v => (
                <div key={v.code} className="voucher-applied">
                  <FaCheckCircle /> <strong>{v.code}</strong> – Giảm {fmt(v.type === 'PERCENT' ? Math.round(subtotal * v.value / 100) : v.value)}
                  <button type="button" onClick={() => removeVoucher(v.code)}><FaTimes /></button>
                </div>
              ))}

              {voucherMessage && <div className="voucher-error">{voucherMessage}</div>}
            </div>

            <h2>Phương thức thanh toán</h2>
            <div className="payment-options">
              <label className={paymentMethod === 'COD' ? 'active' : ''}>
                <input type="radio" name="pay" value="COD" checked={paymentMethod === 'COD'} onChange={e => setPaymentMethod(e.target.value)} />
                <FaTruck /> Thanh toán khi nhận hàng (COD)
              </label>
              <label className={paymentMethod === 'MOMO' ? 'active' : ''}>
                <input type="radio" name="pay" value="MOMO" checked={paymentMethod === 'MOMO'} onChange={e => setPaymentMethod(e.target.value)} />
                <FaWallet /> Ví MOMO
              </label>
              <label className={paymentMethod === 'CreditCard' ? 'active' : ''}>
                <input type="radio" name="pay" value="CREDIT" checked={paymentMethod === 'CREDIT'} onChange={e => setPaymentMethod(e.target.value)} />
                <FaWallet /> Thẻ tín dụng
              </label>
            </div>

            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : `Thanh toán ${fmt(total)}`}
            </button>
          </form>

          <aside className="checkout-summary">
            <h2>Đơn hàng ({items.length} sản phẩm)</h2>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.productId} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">x{item.quantity}</div>
                  </div>
                  <div className="item-total">{fmt(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="summary-row"><span>Tạm tính</span><strong>{fmt(subtotal)}</strong></div>
            {discount > 0 && <div className="summary-row discount"><span>Giảm giá</span><strong>-{fmt(discount)}</strong></div>}
            <div className="summary-row"><span>Phí vận chuyển</span><strong>{shippingFee === 0 ? 'Miễn phí' : fmt(shippingFee)}</strong></div>
            <div className="summary-total">
              <span>Tổng cộng</span>
              <strong style={{ fontSize: '1.8rem', color: '#0ea5e9' }}>{fmt(total)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;