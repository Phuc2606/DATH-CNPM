import React, { useState, useEffect } from "react";
// Bỏ import axios
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCategory,
} from "@tabler/icons-react";
import CategoryService from "../../services/categoryService";

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    CategoryID: "",
    Name: "",
    Icon: "",
  });

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      // Gọi API có phân trang
      const res = await CategoryService.getAllCategories({
        page: page,
        limit: 5,
        search: searchTerm,
      });

      // Backend trả về { data, pagination }
      setCategories(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error("Lỗi:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCategories(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (category = null) => {
    if (category) {
      setIsEditing(true);
      setFormData({
        CategoryID: category.CategoryID,
        Name: category.Name,
        Icon: category.Icon,
      });
    } else {
      setIsEditing(false);
      setFormData({
        CategoryID: "",
        Name: "",
        Icon: "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Gọi Service Update
        await CategoryService.updateCategory(formData.CategoryID, formData);
        alert("Cập nhật thành công!");
      } else {
        // Gọi Service Create
        await CategoryService.createCategory(formData);
        alert("Thêm mới thành công!");
      }
      setShowModal(false);
      fetchCategories(1);
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      alert("Lỗi: " + msg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục [${id}] không?`)) {
      try {
        // Gọi Service Delete
        await CategoryService.deleteCategory(id);
        alert("Đã xóa!");
        fetchCategories(1);
      } catch (err) {
        const msg =
          err.response?.data?.message || err.message || "Không thể xóa";
        alert("Lỗi: " + msg);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark d-flex align-items-center gap-2">
          <IconCategory size={28} /> Quản lý Danh mục
        </h2>
        <div className="d-flex gap-2">
          <form onSubmit={handleSearch} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Tìm tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" type="submit">
              Tìm
            </button>
          </form>
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => openModal()}
          >
            <IconPlus size={20} /> Thêm
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="ps-4">
                    Mã Danh mục (ID)
                  </th>
                  <th scope="col">Tên Danh mục</th>
                  <th scope="col">Icon (Code)</th>
                  <th scope="col" className="text-end pe-4">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.CategoryID}>
                    <td className="ps-4 fw-bold text-primary">
                      {cat.CategoryID}
                    </td>
                    <td className="fw-bold">{cat.Name}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {cat.Icon || "Chưa có icon"}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openModal(cat)}
                        title="Sửa"
                      >
                        <IconEdit size={18} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(cat.CategoryID)}
                        title="Xóa"
                      >
                        <IconTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      Chưa có danh mục nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {pagination.totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3 mb-2">
                <nav>
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                      >
                        Trước
                      </button>
                    </li>
                    <li className="page-item">
                      <span className="page-link text-primary">
                        Trang {currentPage} / {pagination.totalPages}
                      </span>
                    </li>
                    <li
                      className={`page-item ${
                        currentPage === pagination.totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      >
                        Sau
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      )}

      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Cập nhật Danh mục" : "Thêm Danh mục mới"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Mã danh mục (ID)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="CategoryID"
                        value={formData.CategoryID}
                        onChange={handleChange}
                        required
                        disabled={isEditing}
                        placeholder="Ví dụ: cat-1, cat-laptop..."
                      />
                      {!isEditing && (
                        <small className="text-muted">
                          Mã này không thể đổi sau khi tạo.
                        </small>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Tên hiển thị</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        required
                        placeholder="Ví dụ: Laptop Gaming"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Tên Icon (React Icons)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Icon"
                        value={formData.Icon}
                        onChange={handleChange}
                        placeholder="Ví dụ: PiLaptopFill"
                      />
                      <small className="text-muted">
                        Nhập tên icon trong bộ thư viện icon.
                      </small>
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
                      {isEditing ? "Lưu thay đổi" : "Thêm mới"}
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

export default CategoriesManager;
