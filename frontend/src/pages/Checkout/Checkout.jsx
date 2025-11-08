import React, { useState } from 'react';
import './Checkout.css';
// products import not needed in this version
import useCart from '../../context/useCart';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', postal: '', country: ''
  });

  const { cart, updateQty, removeItem, clearCart, total: cartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = cartTotal || 0;

  function fmt(v) {
    return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫';
  }

  // payment/shipping/promo state
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingRegion, setShippingRegion] = useState('hn');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [promo, setPromo] = useState('');
  const [discountPct, setDiscountPct] = useState(0);
  const [processing, setProcessing] = useState(false);

  function shippingCostFor(region, method) {
    // simple matrix
    const base = region === 'hn' ? 15000 : region === 'hcm' ? 18000 : 35000;
    return method === 'express' ? base + 30000 : base;
  }

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    if (code === 'SALE10') { setDiscountPct(10); return true; }
    if (code === 'FREESHIP') { setDiscountPct(0); return true; }
    setDiscountPct(0); return false;
  }

  // Luhn algorithm for card number validation
  function isValidCardNumber(num) {
    const digits = num.replace(/\D+/g,'');
    let sum = 0; let alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return digits.length >= 12 && sum % 10 === 0;
  }

  // card input local state (not stored/persisted)
  const [card, setCard] = useState({number:'', expiry:'', cvc:'', name:''});

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      alert('Vui lòng điền đầy đủ thông tin nhận hàng');
      return;
    }

    if (!applyPromo() && promo.trim() !== '') {
      alert('Mã giảm giá không hợp lệ');
      return;
    }

    if (paymentMethod === 'card') {
      if (!isValidCardNumber(card.number)) { alert('Số thẻ không hợp lệ'); return; }
      if (!card.expiry || !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(card.expiry)) { alert('Hạn thẻ không hợp lệ (MM/YY)'); return; }
      if (!/^[0-9]{3,4}$/.test(card.cvc)) { alert('CVC không hợp lệ'); return; }
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const orderId = 'ORD' + Date.now();
      clearCart();
      navigate('/checkout/success', { state: { orderId, total: subtotal } });
    }, 800 + Math.random() * 1000);
  }

  return (
    <div className="checkout-root">
      <div className="container">
        <h1 className="checkout-title">Thanh toán</h1>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Thông tin nhận hàng</h2>

            <div className="form-row">
              <div className="field">
                <label className="field-label">Họ tên</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required/>
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required/>
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label className="field-label">Số điện thoại</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required/>
              </div>
              <div className="field">
                <label className="field-label">Quốc gia</label>
                <input value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
              </div>
            </div>


            <div className="form-row">
              <div className="field">
                <label className="field-label">Thành phố</label>
                <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} required/>
              </div>
              <div className="field">
                <label className="field-label">Mã bưu điện</label>
                <input value={form.postal} onChange={e => setForm({...form, postal: e.target.value})} />
              </div>
            </div>

            <div className="form-row">
                <div className="field field--grow">
                  <label className="field-label">Địa chỉ</label>
                  <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} required/>
                </div>
            </div>
           

            <h2>Phương thức giao hàng</h2>
            <div className="shipping-options">
              <div className="field">
                <label className="field-label">Vùng</label>
                <select value={shippingRegion} onChange={e=>setShippingRegion(e.target.value)}>
                  <option value="hn">Hà Nội</option>
                  <option value="hcm">Hồ Chí Minh</option>
                  <option value="other">Toàn quốc</option>
                </select>
              </div>
              <div className="field field-inline">
                <label className="field-label">Phương thức giao hàng</label>
                <div className="field-controls">
                  <label><input type="radio" name="ship" value="standard" checked={shippingMethod==='standard'} onChange={() => setShippingMethod('standard')} /> Giao tiêu chuẩn</label>
                  <label><input type="radio" name="ship" value="express" checked={shippingMethod==='express'} onChange={() => setShippingMethod('express')} /> Giao hỏa tốc</label>
                </div>
              </div>
            </div>

            <h2>Phương thức thanh toán</h2>
            <div className="payment-options">
              <div className="field field-inline">
                <label className="field-label">Phương thức</label>
                <div className="field-controls">
                  <label><input type="radio" name="pay" value="cod" checked={paymentMethod==='cod'} onChange={() => setPaymentMethod('cod')} /> Thanh toán khi nhận hàng (COD)</label>
                  <label><input type="radio" name="pay" value="card" checked={paymentMethod==='card'} onChange={() => setPaymentMethod('card')} /> Thanh toán bằng thẻ</label>
                  <label><input type="radio" name="pay" value="ewallet" checked={paymentMethod==='ewallet'} onChange={() => setPaymentMethod('ewallet')} /> Ví điện tử</label>
                </div>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-form">
                <div className="field">
                  <label className="field-label">Số thẻ</label>
                  <input placeholder="4242 4242 4242 4242" value={card.number} onChange={e=>setCard({...card, number:e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="field">
                    <label className="field-label">Tháng/Năm</label>
                    <input placeholder="MM/YY" value={card.expiry} onChange={e=>setCard({...card, expiry:e.target.value})} />
                  </div>
                  <div className="field">
                    <label className="field-label">CVC</label>
                    <input placeholder="CVC" value={card.cvc} onChange={e=>setCard({...card, cvc:e.target.value})} />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Tên chủ thẻ</label>
                  <input placeholder="Nguyen Van A" value={card.name} onChange={e=>setCard({...card, name:e.target.value})} />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="field">
                <label className="field-label">Mã giảm giá</label>
                <div style={{display:'flex',gap:8}}>
                  <input placeholder="Nhập mã giảm giá" value={promo} onChange={e => setPromo(e.target.value)} />
                  <button type="button" className="btn" onClick={applyPromo}>Áp dụng</button>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn btn--primary" type="submit" disabled={processing}>{processing ? 'Đang xử lý...' : 'Xác nhận & Thanh toán'}</button>
            </div>
          </form>

          <aside className="checkout-summary">
            <h2>Đơn hàng</h2>
            <ul className="summary-list">
              {cart.length === 0 && <li>Giỏ hàng trống</li>}
              {cart.map(item => (
                <li key={item.id} className="summary-item">
                  <img src={item.img} alt="" onError={e => e.target.src = '/assets/placeholder.png'} />
                  <div style={{flex:1}}>
                    <div className="s-name">{item.name}</div>
                    <div className="s-meta">{item.brand} • {item.price}</div>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <input type="number" min={1} value={item.qty} onChange={e=>updateQty(item.id, Number(e.target.value)||1)} style={{width:64}} />
                    <button className="btn" onClick={()=>removeItem(item.id)}>Xóa</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="summary-row"><span>Tạm tính</span><strong>{fmt(subtotal)}</strong></div>
            <div className="summary-row"><span>Giảm ({discountPct}%)</span><strong>-{fmt(Math.round((subtotal*discountPct)/100))}</strong></div>
            <div className="summary-row"><span>Phí vận chuyển</span><strong>{fmt(shippingCostFor(shippingRegion, shippingMethod))}</strong></div>
            <div className="summary-total"><span>Tổng</span><strong>{fmt(subtotal - Math.round((subtotal*discountPct)/100) + shippingCostFor(shippingRegion, shippingMethod))}</strong></div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
