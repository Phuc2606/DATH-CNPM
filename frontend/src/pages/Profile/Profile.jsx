import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const navigate = useNavigate();

  // Định dạng ngày giờ Việt Nam (UTC+7)
  const formatDateTime = (dateValue) => {
    if (!dateValue) return "Chưa có";

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "Không xác định";

    // Trừ 7 giờ vì backend gửi UTC
    date.setHours(date.getHours() + 0 - 7);

    return new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };


  const formatPrice = (amount) => {
    return Number(amount ?? 0).toLocaleString("vi-VN");
  };

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const { data } = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);
        setFormData({
          fullName: data.Name || "",
          email: data.Email || "",
          phone: data.PhoneNumber || "",
          address: data.Address || "",
          dateOfBirth: data.DateOfBirth?.split("T")[0] || "",
          gender: data.Gender || "",
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Fetch orders khi chuyển tab
  useEffect(() => {
    if (activeTab !== "orders") return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/users/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders || data || []);
      } catch (err) {
        console.error("Lỗi tải đơn hàng:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data.user);
      setEditing(false);
      alert("Cập nhật hồ sơ thành công!");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const getStatus = (status) => {
    const map = {
      Pending: { text: "Chờ xử lý", color: "amber" },
      Confirmed: { text: "Đã xác nhận", color: "emerald" },
      Delivering: { text: "Đang giao", color: "sky" },
      Completed: { text: "Hoàn thành", color: "green" },
      Cancelled: { text: "Đã hủy", color: "red" },
    };
    return map[status] || { text: status || "Không rõ", color: "gray" };
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner"></div></div>;
  }

  return (
    <div className="profile-page">
      {/* Nút quay lại */}
      <button onClick={() => navigate(-1)} className="back-btn" aria-label="Quay lại">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="profile-container">
        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={activeTab === "profile" ? "tab active" : "tab"}
            onClick={() => setActiveTab("profile")}
          >
            Hồ sơ cá nhân
          </button>
          <button
            className={activeTab === "orders" ? "tab active" : "tab"}
            onClick={() => setActiveTab("orders")}
          >
            Lịch sử mua hàng
          </button>
        </div>

        {/* Card chính */}
        <div className="profile-card">
          {/* Header */}
          <div className="profile-header">
            <div className="avatar">
              {user?.Name?.[0]?.toUpperCase() || "U"}
            </div>
            <h1 className="name">{user?.Name}</h1>
            <p className="email">{user?.Email}</p>
            <span className="role">{user?.Role || "Khách hàng"}</span>
          </div>

          {/* Nội dung theo tab */}
          {activeTab === "profile" ? (
            <div className="profile-content">
              {!editing ? (
                <>
                  <div className="info-grid">
                    <InfoItem label="Họ và tên" value={user?.Name} />
                    <InfoItem label="Email" value={user?.Email} />
                    <InfoItem label="Số điện thoại" value={user?.PhoneNumber || "Chưa cập nhật"} />
                    <InfoItem label="Địa chỉ" value={user?.Address || "Chưa cập nhật"} />
                    <InfoItem
                      label="Ngày sinh"
                      value={
                        user?.DateOfBirth
                          ? format(new Date(user.DateOfBirth), "dd/MM/yyyy")
                          : "Chưa cập nhật"
                      }
                    />
                    <InfoItem
                      label="Giới tính"
                      value={
                        user?.Gender === "Male"
                          ? "Nam"
                          : user?.Gender === "Female"
                            ? "Nữ"
                            : "Khác"
                      }
                    />
                  </div>

                  <button onClick={() => setEditing(true)} className="btn-primary">
                    Chỉnh sửa hồ sơ
                  </button>
                </>
              ) : (
                <form onSubmit={handleSubmit} className="edit-form">
                  <Input label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleChange} required />
                  <Input label="Email" name="email" value={formData.email} disabled note="Email không thể thay đổi" />
                  <Input label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} />
                  <Input label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} />

                  <div className="input-group">
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Giới tính</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="">Chọn giới tính</option>
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">Lưu thay đổi</button>
                    <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                      Hủy
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* ==================== LỊCH SỬ ĐƠN HÀNG ==================== */
            <div className="orders-content">
              <h2 className="section-title">Lịch sử đơn hàng</h2>

              {loadingOrders ? (
                <div className="loading-state">
                  <div className="spinner small"></div>
                  <p>Đang tải đơn hàng...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">Receipt</div>
                  <p>Chưa có đơn hàng nào</p>
                  <button onClick={() => navigate("/")} className="btn-primary">
                    Mua sắm ngay
                  </button>
                </div>
              ) : (
                <div className="orders-grid">
                  {orders.map(({ order, items }) => {
                    const recipient = order.recipient || {};
                    const status = getStatus(order.Status);
                    return (
                      <div key={order.OrderID} className="order-card">
                        <div className="order-header">
                          <span className="order-id">#{order.OrderID}</span>
                          <span className="order-date">{formatDateTime(order.OrderDate)}</span>
                        </div>

                        <div className="order-summary">
                          <div className="order-info">
                            <p><strong>Tạm tính:</strong> <span className="price">{formatPrice(order.Subtotal)} đ</span></p>
                            <p><strong>Phí giao hàng:</strong> <span className="price">{formatPrice(order.ShippingFee)} đ</span></p>
                            <p><strong>Giảm giá:</strong> <span className="price">{formatPrice(order.DiscountAmount)} đ</span></p>
                            <p><strong>Tổng tiền:</strong> <span className="price">{formatPrice(order.TotalAmount)} đ</span></p>
                            <p><strong>Người nhận:</strong> {recipient.name || "—"} - {recipient.phone || "—"}</p>
                            {recipient.address && <p><strong>Địa chỉ:</strong> {recipient.address}</p>}
                          </div>
                          <span className={`status ${status.color}`}>{status.text}</span>
                        </div>

                        <div className="order-products">
                          {items.slice(0, 3).map((item, i) => (
                            <div key={item.ProductID || i} className="product-item">
                              <img
                                src={
                                  item.ImageUrl?.startsWith("http")
                                    ? item.ImageUrl
                                    : `http://localhost:5000${item.ImageUrl || "/placeholder.jpg"}`
                                }
                                alt={item.ProductName}
                                onError={(e) => (e.target.src = "/placeholder.jpg")}
                              />
                              <div className="product-info">
                                <p className="name">{item.ProductName}</p>
                                <p className="detail">{item.Quantity} × {formatPrice(item.UnitPrice)} đ</p>
                              </div>
                            </div>
                          ))}
                          {items.length > 3 && (
                            <div className="more-items">+ {items.length - 3} sản phẩm khác</div>
                          )}
                        </div>

                        <button
                          onClick={() => navigate(`/checkout-success/${order.OrderID}`)}
                          className="btn-outline"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component nhỏ tái sử dụng
const InfoItem = ({ label, value }) => (
  <div className="info-row">
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

const Input = ({ label, note, disabled, ...props }) => (
  <div className="input-group">
    <label>{label}</label>
    <input {...props} disabled={disabled} className={disabled ? "disabled" : ""} />
    {note && <small className="note">{note}</small>}
  </div>
);

export default Profile;