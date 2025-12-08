import React, { useState, useEffect } from "react";
import {
  IconEye,
  IconSearch,
  IconFileInvoice,
  IconTruckDelivery,
  IconCheck,
  IconX,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import OrderService from "../../services/orderService";
import { toast } from "react-toastify";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Phân trang
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null); // Chi tiết đơn hàng (info + items)
  const [statusForm, setStatusForm] = useState({
    status: "",
    paymentStatus: "",
  });

  // 1. Load danh sách đơn
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      // Gọi service với tham số phân trang
      const res = await OrderService.getAllOrders({
        page: page,
        limit: 10, // 10 đơn mỗi trang
        search: searchTerm,
      });

      // Backend trả về: { data, pagination }
      setOrders(res.data);
      setPagination(res.pagination);
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset về trang 1 khi tìm mới
    fetchOrders(1);
  };

  // 2. Xem chi tiết đơn
  const handleViewOrder = async (orderId) => {
    try {
      const data = await OrderService.getOrderDetails(orderId);
      // data trả về: { order, items, vouchers }
      setSelectedOrder(data);
      setStatusForm({
        status: data.order.Status,
        paymentStatus: data.order.PaymentStatus,
      });
      setShowModal(true);
    } catch (err) {
      toast.error("Lỗi tải chi tiết đơn hàng");
    }
  };

  // 3. Cập nhật trạng thái
  const handleUpdateStatus = async () => {
    try {
      await OrderService.updateOrderStatus(
        selectedOrder.order.OrderID,
        statusForm
      );
      toast.success("Cập nhật thành công!");
      setShowModal(false);
      fetchOrders(); // Reload lại bảng bên ngoài
    } catch (err) {
      toast.error("Lỗi cập nhật");
    }
  };

  // Helper: Màu sắc trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning text-dark";
      case "Processing":
        return "bg-info text-white";
      case "Shipped":
        return "bg-primary text-light";
      case "Delivered":
        return "bg-success text-success-emphasis";
      case "Cancelled":
        return "bg-danger text-danger-emphasis";
      default:
        return "bg-secondary";
    }
  };

  // Helper: Format tiền
  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount);
  // Helper: Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark d-flex align-items-center gap-2">
          <IconFileInvoice size={28} /> Quản lý Đơn hàng
        </h2>

        {/* Form tìm kiếm */}
        <form onSubmit={handleSearch} className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm mã đơn, tên khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-primary" type="submit">
            <IconSearch size={18} />
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover table-striped mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Mã Đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái đơn</th>
                <th className="text-end pe-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.OrderID}>
                  <td className="ps-4 fw-bold">#{order.OrderID}</td>
                  <td>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">
                        {order.CustomerName || "Khách vãng lai"}
                      </span>
                      <small className="text-muted">{order.Email}</small>
                    </div>
                  </td>
                  <td>{formatDate(order.OrderDate)}</td>
                  <td className="fw-bold text-primary">
                    {formatMoney(order.TotalAmount)} đ
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        order.PaymentStatus === "Paid"
                          ? "text-success"
                          : order.PaymentStatus === "Pending"
                          ? "text-secondary"
                          : "text-danger"
                      }`}
                    >
                      {order.PaymentStatus}
                    </span>
                    <div className="small text-muted">
                      {order.PaymentMethod}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.Status)}`}>
                      {order.Status}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleViewOrder(order.OrderID)}
                      title="Xem chi tiết"
                    >
                      <IconEye size={18} /> Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="text-muted small">
            Hiển thị trang {pagination.page} trên tổng {pagination.totalPages}{" "}
            trang ({pagination.total} đơn)
          </div>
          <nav>
            <ul className="pagination mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <IconChevronLeft size={16} />
                </button>
              </li>

              {/* Render số trang */}
              {[...Array(pagination.totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                // Logic ẩn bớt trang nếu quá nhiều (đơn giản hóa: hiện tất cả nếu < 10)
                return (
                  <li
                    key={pageNum}
                    className={`page-item ${
                      currentPage === pageNum ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}

              <li
                className={`page-item ${
                  currentPage === pagination.totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <IconChevronRight size={16} />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* MODAL CHI TIẾT */}
      {showModal && selectedOrder && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-xl">
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <h5 className="modal-title fw-bold">
                    Chi tiết đơn hàng #{selectedOrder.order.OrderID}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row">
                    {/* Cột Trái: Thông tin khách & SP */}
                    <div className="col-md-8 border-end">
                      <h6 className="fw-bold text-primary mb-3">
                        Sản phẩm đã mua
                      </h6>
                      <div
                        className="table-responsive"
                        style={{ maxHeight: "300px" }}
                      >
                        <table className="table table-bordered table-sm">
                          <thead>
                            <tr>
                              <th>Sản phẩm</th>
                              <th>Đơn giá</th>
                              <th>SL</th>
                              <th>Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item, idx) => (
                              <tr key={idx}>
                                <td>
                                  <div className="d-flex align-items-center gap-2">
                                    <img
                                      src={`http://localhost:5000${item.ImageUrl}`}
                                      alt=""
                                      style={{
                                        width: 40,
                                        height: 40,
                                        objectFit: "cover",
                                      }}
                                      onError={(e) =>
                                        (e.target.src =
                                          "https://placehold.co/40")
                                      }
                                    />
                                    <span>{item.ProductName}</span>
                                  </div>
                                </td>
                                <td>{formatMoney(item.UnitPrice)}</td>
                                <td className="text-center">{item.Quantity}</td>
                                <td className="fw-bold">
                                  {formatMoney(item.FinalPrice)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4 p-3 bg-light rounded">
                        <h6 className="fw-bold">Thông tin giao hàng:</h6>
                        <p className="mb-1">
                          <IconTruckDelivery size={18} />{" "}
                          <strong>Địa chỉ:</strong>{" "}
                          {selectedOrder.order.RecipientInfo}
                        </p>
                        <p className="mb-0 text-muted">
                          <em>
                            Ghi chú: {selectedOrder.order.Note || "Không có"}
                          </em>
                        </p>
                      </div>
                    </div>

                    {/* Cột Phải: Xử lý trạng thái */}
                    <div className="col-md-4">
                      <h6 className="fw-bold text-primary mb-3">
                        Cập nhật đơn hàng
                      </h6>

                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Trạng thái đơn hàng
                        </label>
                        <select
                          className="form-select"
                          value={statusForm.status}
                          onChange={(e) =>
                            setStatusForm({
                              ...statusForm,
                              status: e.target.value,
                            })
                          }
                        >
                          <option value="Pending">Pending (Chờ xử lý)</option>
                          <option value="Processing">
                            Processing (Đang chuẩn bị)
                          </option>
                          <option value="Shipped">Shipped (Đang giao)</option>
                          <option value="Delivered">Delivered (Đã giao)</option>
                          <option value="Cancelled">Cancelled (Đã hủy)</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold">
                          Trạng thái thanh toán
                        </label>
                        <select
                          className="form-select"
                          value={statusForm.paymentStatus}
                          onChange={(e) =>
                            setStatusForm({
                              ...statusForm,
                              paymentStatus: e.target.value,
                            })
                          }
                        >
                          <option value="Pending">
                            Pending (Chưa thu tiền)
                          </option>
                          <option value="Paid">Paid (Đã thanh toán)</option>
                          <option value="Failed">Failed (Thất bại)</option>
                        </select>
                      </div>

                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={handleUpdateStatus}
                        >
                          <IconCheck size={18} /> Lưu thay đổi
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => setShowModal(false)}
                        >
                          <IconX size={18} /> Đóng
                        </button>
                      </div>

                      <hr />
                      <div className="text-end">
                        <p className="mb-1">
                          Tạm tính: {formatMoney(selectedOrder.order.Subtotal)}{" "}
                          đ
                        </p>
                        <p className="mb-1 text-danger">
                          Giảm giá: -
                          {formatMoney(selectedOrder.order.DiscountAmount)} đ
                        </p>
                        <p className="mb-1">
                          Phí ship:{" "}
                          {formatMoney(selectedOrder.order.ShippingFee)} đ
                        </p>
                        <h4 className="fw-bold text-primary mt-2">
                          Tổng: {formatMoney(selectedOrder.order.TotalAmount)} đ
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderManager;
