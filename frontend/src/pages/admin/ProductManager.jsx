import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconX,
  IconPhoto,
} from "@tabler/icons-react";

// Cấu hình URL
const API_URL = "http://localhost:5000/api";
const UPLOAD_URL = "http://localhost:5000";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    ProductID: null,
    Name: "",
    Brand: "",
    Category: "",
    Price: "",
    Stock: "",
    Description: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi lấy sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setFormData({
        ProductID: product.ProductID,
        Name: product.Name,
        Brand: product.Brand,
        Category: product.Category,
        Price: product.Price,
        Stock: product.Stock,
        Description: product.Description,
        image: null,
      });
      setPreviewImage(
        product.ImageURL ? `${UPLOAD_URL}${product.ImageURL}` : ""
      );
    } else {
      setIsEditing(false);
      setFormData({
        ProductID: null,
        Name: "",
        Brand: "",
        Category: categories[0]?.CategoryID || "",
        Price: "",
        Stock: "",
        Description: "",
        image: null,
      });
      setPreviewImage("");
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("Name", formData.Name);
      data.append("Brand", formData.Brand);
      data.append("Category", formData.Category);
      data.append("Price", formData.Price);
      data.append("Stock", formData.Stock);
      data.append("Description", formData.Description);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (isEditing) {
        await axios.put(
          `${API_URL}/admin/products/${formData.ProductID}`,
          data,
          config
        );
        alert("Cập nhật thành công!");
      } else {
        await axios.post(`${API_URL}/admin/products`, data, config);
        alert("Thêm mới thành công!");
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await axios.delete(`${API_URL}/admin/products/${id}`);
        alert("Đã xóa!");
        fetchProducts();
      } catch (err) {
        alert("Lỗi xóa: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c.CategoryID === catId);
    return cat ? cat.Name : catId;
  };

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Quản lý sản phẩm</h2>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => openModal()}
        >
          <IconPlus size={20} /> Thêm sản phẩm
        </button>
      </div>

      {/* TABLE */}
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
                    Hình ảnh
                  </th>
                  <th scope="col">Tên sản phẩm</th>
                  <th scope="col">Danh mục</th>
                  <th scope="col">Giá</th>
                  <th scope="col">Kho</th>
                  <th scope="col" className="text-end pe-4">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.ProductID}>
                    <td className="ps-4">
                      <img
                        src={
                          p.ImageURL
                            ? `${UPLOAD_URL}${p.ImageURL}`
                            : "https://placehold.co/50"
                        }
                        alt={p.Name}
                        className="rounded border"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        onError={(e) =>
                          (e.target.src = "https://placehold.co/50?text=No+Img")
                        }
                      />
                    </td>
                    <td>
                      <div className="fw-bold">{p.Name}</div>
                      <small className="text-muted">{p.Brand}</small>
                    </td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {getCategoryName(p.Category)}
                      </span>
                    </td>
                    <td className="fw-bold text-success">
                      {formatCurrency(p.Price)}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          p.Stock < 10 ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {p.Stock}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openModal(p)}
                        title="Sửa"
                      >
                        <IconEdit size={18} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(p.ProductID)}
                        title="Xóa"
                      >
                        <IconTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL (Bootstrap Style - Custom Overlay) */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit} id="productForm">
                    {/* Tên sản phẩm */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Tên sản phẩm</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        required
                        placeholder="Ví dụ: iPhone 15 Pro Max"
                      />
                    </div>

                    {/* Hàng 1: Thương hiệu & Danh mục */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">
                          Thương hiệu
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="Brand"
                          value={formData.Brand}
                          onChange={handleChange}
                          placeholder="Apple, Samsung..."
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Danh mục</label>
                        <select
                          className="form-select"
                          name="Category"
                          value={formData.Category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Chọn danh mục --</option>
                          {categories.map((c) => (
                            <option key={c.CategoryID} value={c.CategoryID}>
                              {c.Name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Hàng 2: Giá & Tồn kho */}
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Giá (VNĐ)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="Price"
                          value={formData.Price}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Tồn kho</label>
                        <input
                          type="number"
                          className="form-control"
                          name="Stock"
                          value={formData.Stock}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Mô tả */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Mô tả</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        name="Description"
                        value={formData.Description}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    {/* Hình ảnh */}
                    <div className="mb-3">
                      <label className="form-label fw-bold d-flex align-items-center gap-2">
                        <IconPhoto size={18} /> Hình ảnh
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                      {previewImage && (
                        <div className="mt-3 text-center">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ height: "150px", objectFit: "contain" }}
                          />
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    form="productForm"
                    className="btn btn-primary"
                  >
                    {isEditing ? "Lưu thay đổi" : "Thêm mới"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductManager;
