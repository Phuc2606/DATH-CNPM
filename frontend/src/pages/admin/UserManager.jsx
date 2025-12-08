import React, { useState, useEffect } from "react";
import {
  IconUser,
  IconTrash,
  IconEdit,
  IconMail,
  IconPhone,
  IconMapPin,
  IconShieldLock,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../../services/userService";
import { toast } from "react-toastify";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- STATE PHÂN TRANG ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // Số user mỗi trang

  // --- STATE MODAL EDIT ---
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    role: "Customer",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Lỗi lấy user:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (user) => {
    // 1. Chặn xóa Admin
    if (user.Role === "Admin") {
      toast.error("Không thể xóa tài khoản Admin!");
      return;
    }

    if (window.confirm(`Bạn có chắc muốn xóa user: ${user.Name}?`)) {
      try {
        await deleteUser(user.CustomerID);
        toast.success("Đã xóa user!");
        fetchUsers();
      } catch (err) {
        toast.error(err.message || "Lỗi xóa user");
      }
    }
  };

  // --- EDIT LOGIC ---
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.Name,
      phone: user.PhoneNumber || "",
      address: user.Address || "",
      role: user.Role,
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.CustomerID, formData);
      toast.success("Cập nhật thành công!");
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Lỗi cập nhật");
    }
  };

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const renderRoleBadge = (role) => {
    if (role === "Admin")
      return <span className="badge bg-danger text-white">Admin</span>;
    return <span className="badge bg-info text-dark">Customer</span>;
  };

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark d-flex align-items-center gap-2">
          <IconUser size={28} /> Quản lý Người dùng
        </h2>
        <div className="text-muted">
          Total: <strong>{users.length}</strong>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary"></div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-striped mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="ps-4">ID</th>
                    <th>Thông tin cá nhân</th>
                    <th>Liên hệ</th>
                    <th>Vai trò</th>
                    <th className="text-end pe-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.CustomerID}>
                      <td className="ps-4 fw-bold text-muted">
                        #{user.CustomerID}
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="fw-bold text-primary">
                            {user.Name}
                          </span>
                          <small className="text-muted">
                            <IconMail size={14} /> {user.Email}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          <div>
                            <IconPhone size={14} className="text-muted" />{" "}
                            {user.PhoneNumber || "---"}
                          </div>
                          <div
                            className="text-truncate"
                            style={{ maxWidth: "150px" }}
                            title={user.Address}
                          >
                            <IconMapPin size={14} className="text-muted" />{" "}
                            {user.Address || "---"}
                          </div>
                        </div>
                      </td>
                      <td>{renderRoleBadge(user.Role)}</td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openEditModal(user)}
                          title="Sửa thông tin"
                        >
                          <IconEdit size={18} />
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(user)}
                          disabled={user.Role === "Admin"} // Disable nếu là Admin
                          title={
                            user.Role === "Admin"
                              ? "Không thể xóa Admin"
                              : "Xóa user"
                          }
                          style={{ opacity: user.Role === "Admin" ? 0.5 : 1 }}
                        >
                          <IconTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION CONTROL */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center py-3 border-top">
                <nav>
                  <ul className="pagination mb-0">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        <IconChevronLeft size={16} />
                      </button>
                    </li>
                    <li className="page-item disabled">
                      <span className="page-link text-dark">
                        Trang {currentPage} / {totalPages}
                      </span>
                    </li>
                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
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
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">
                    Cập nhật User #{editingUser?.CustomerID}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleUpdate}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Họ tên</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Địa chỉ</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold d-flex align-items-center gap-2">
                        <IconShieldLock size={18} /> Vai trò (Role)
                      </label>
                      <select
                        className="form-select"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                      >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <div className="form-text text-danger">
                        Lưu ý: Cấp quyền Admin cho phép truy cập trang quản trị.
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManager;
