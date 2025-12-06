import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";

const CheckoutSuccess = () => {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const buildImageUrl = (path) => {
    if (!path) return "/placeholder.jpg";
    if (path.startsWith("http")) return path;
    return `http://localhost:5000${path}`;
  };

  useEffect(() => {
    if (!orderId) {
      setError("Không tìm thấy mã đơn hàng!");
      return;
    }

    axios
      .get(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setData(res.data))
      .catch((err) => setError("Không thể tải dữ liệu đơn hàng."));
  }, [orderId]);

  if (error)
    return (
      <div className="success-wrapper">
        <div className="success-card">
          <h2 style={{ color: "red" }}>{error}</h2>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="success-wrapper">
        <div className="success-card">
          <p>Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );

  const { order, items } = data;

  let name = "";
  let phone = "";
  let address = "";
  const formatUTC = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", { timeZone: "UTC" });
  };
  if (order?.RecipientInfo) {
    const parts = order.RecipientInfo.split("|").map(p => p.trim());
    name = parts[0] || "";
    phone = parts[1] || "";
    address = parts[2] || "";
  }
  
  return (
    <div className="success-wrapper">
      <div className="success-card">
        <h1 className="success-title">🎉 Thanh toán thành công!</h1>

        <div className="info-box">
          <h2>Thông tin đơn hàng</h2>

          <p><strong>Mã đơn:</strong> {order.OrderID}</p>
          <p><strong>Ngày đặt:</strong> {formatUTC(order.OrderDate)}</p>
          <p><strong>Tổng tiền:</strong> {order.TotalAmount.toLocaleString()} đ</p>

          <p><strong>Người nhận:</strong> {name}</p>
          <p><strong>SĐT:</strong> {phone}</p>
          <p><strong>Địa chỉ:</strong> {address}</p>
          <p><strong>Ghi chú:</strong> {order.Note}</p>
        </div>

        <h2 className="items-title">Sản phẩm đã mua</h2>
        <div className="items-list">
          {items.map((item, idx) => (
            <div key={idx} className="item-box">
              <img
                src={buildImageUrl(item.ImageUrl)}
                alt={item.ProductName}
                onError={(e) => (e.target.src = "/placeholder.jpg")}
              />
              <div>
                <p className="item-name">{item.ProductName}</p>
                <p className="item-sub">
                  {item.Quantity} x {item.UnitPrice.toLocaleString()} đ
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="back-home" onClick={() => (window.location.href = "/")}>
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
