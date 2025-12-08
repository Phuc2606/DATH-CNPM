import React, { useState, useEffect } from "react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconTruckDelivery,
  IconPhone,
  IconMapPin,
  IconFileInvoice,
  IconLink,
  IconUnlink,
} from "@tabler/icons-react";
import SupplierService from "../../services/supplierService";
import ProductService from "../../services/productService";
import { toast } from "react-toastify";

const SupplierManager = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [allProducts, setAllProducts] = useState([]); // List sản phẩm để chọn
  const [linkData, setLinkData] = useState({ SupplierID: null, ProductID: "" });
  const [selectedSupplierName, setSelectedSupplierName] = useState("");
  const [linkedProducts, setLinkedProducts] = useState([]);
  // Form Data
  const [formData, setFormData] = useState({
    SupplierID: null,
    Name: "",
    Address: "",
    PhoneNumber: "",
    TaxNumber: "",
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await SupplierService.getAllSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Lỗi lấy NCC:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (supplier = null) => {
    if (supplier) {
      setIsEditing(true);
      setFormData({
        SupplierID: supplier.SupplierID,
        Name: supplier.Name,
        Address: supplier.Address,
        PhoneNumber: supplier.PhoneNumber,
        TaxNumber: supplier.TaxNumber,
      });
    } else {
      setIsEditing(false);
      setFormData({
        SupplierID: null,
        Name: "",
        Address: "",
        PhoneNumber: "",
        TaxNumber: "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await SupplierService.updateSupplier(formData.SupplierID, formData);
        toast.success("Cập nhật thành công!");
      } else {
        await SupplierService.createSupplier(formData);
        toast.success("Thêm mới thành công!");
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      toast.error("Lỗi: " + msg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhà cung cấp này không?")) {
      try {
        await SupplierService.deleteSupplier(id);
        toast.success("Đã xóa!");
        fetchSuppliers();
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        toast.error("Lỗi: " + msg);
      }
    }
  };

  const openLinkModal = async (supplier) => {
    try {
      // 1. Lưu ID nhà cung cấp đang chọn
      setLinkData({ SupplierID: supplier.SupplierID, ProductID: "" });
      setSelectedSupplierName(supplier.Name);

      // 2. Lấy danh sách tất cả sản phẩm để hiển thị vào Select
      const products = await ProductService.getAllProducts();
      setAllProducts(products);
      fetchLinkedProducts(supplier.SupplierID);
      // 3. Mở Modal
      setShowLinkModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi tải danh sách sản phẩm");
    }
  };

  const fetchLinkedProducts = async (supplierId) => {
    const linked = await SupplierService.getLinkedProducts(supplierId);
    setLinkedProducts(linked);
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!linkData.ProductID) return alert("Vui lòng chọn sản phẩm!");

    try {
      await SupplierService.linkProduct({
        SupplierID: linkData.SupplierID,
        ProductID: parseInt(linkData.ProductID),
      });
      fetchLinkedProducts(linkData.SupplierID);
      toast.success("Liên kết thành công!");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error("Lỗi: " + msg);
    }
  };

  const handleUnlink = async (productId) => {
    if (!window.confirm("Bạn có chắc muốn hủy liên kết sản phẩm này không?"))
      return;

    try {
      await SupplierService.unlinkProduct({
        SupplierID: linkData.SupplierID,
        ProductID: productId,
      });
      // Không cần alert cho đỡ phiền, chỉ cần load lại list
      fetchLinkedProducts(linkData.SupplierID);
      toast.success("Hủy liên kết thành công!");
    } catch (err) {
      toast.error("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };
  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark d-flex align-items-center gap-2">
          <IconTruckDelivery size={28} /> Quản lý Nhà cung cấp
        </h2>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => openModal()}
        >
          <IconPlus size={20} /> Thêm NCC
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
                    Tên Nhà cung cấp
                  </th>
                  <th scope="col">Địa chỉ</th>
                  <th scope="col">Liên hệ</th>
                  <th scope="col">Mã số thuế</th>
                  <th scope="col" className="text-end pe-4">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.SupplierID}>
                    <td className="ps-4 fw-bold text-primary">{s.Name}</td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <IconMapPin size={16} className="text-muted" />
                        <span
                          className="text-truncate"
                          style={{ maxWidth: "200px" }}
                          title={s.Address}
                        >
                          {s.Address}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <IconPhone size={16} className="text-muted" />
                        {s.PhoneNumber}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <IconFileInvoice size={16} className="text-muted" />
                        {s.TaxNumber}
                      </div>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-info text-white me-2"
                        onClick={() => openLinkModal(s)}
                        title="Cung cấp sản phẩm nào?"
                      >
                        <IconLink size={18} /> Link SP
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openModal(s)}
                        title="Sửa"
                      >
                        <IconEdit size={18} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(s.SupplierID)}
                        title="Xóa"
                      >
                        <IconTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {suppliers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      Chưa có nhà cung cấp nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Cập nhật NCC" : "Thêm Nhà cung cấp mới"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {/* Tên */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Tên Doanh Nghiệp
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        required
                        placeholder="Ví dụ: Công ty TNHH ABC..."
                      />
                    </div>

                    {/* Địa chỉ */}
                    <div className="mb-3">
                      <label className="form-label fw-bold">Địa chỉ</label>
                      <input
                        type="text"
                        className="form-control"
                        name="Address"
                        value={formData.Address}
                        onChange={handleChange}
                        placeholder="Ví dụ: 123 Nguyễn Văn Cừ, Q1, HCM"
                      />
                    </div>

                    <div className="row">
                      {/* SĐT */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="PhoneNumber"
                          value={formData.PhoneNumber}
                          onChange={handleChange}
                          placeholder="0909..."
                        />
                      </div>

                      {/* Mã số thuế */}
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-bold">Mã số thuế</label>
                        <input
                          type="text"
                          className="form-control"
                          name="TaxNumber"
                          value={formData.TaxNumber}
                          onChange={handleChange}
                          placeholder="MST..."
                        />
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
                      {isEditing ? "Lưu thay đổi" : "Thêm mới"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
      {showLinkModal && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1060 }}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 1070 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              {" "}
              {/* modal-lg cho rộng */}
              <div className="modal-content">
                <div className="modal-header bg-info text-white">
                  <h5 className="modal-title">
                    Quản lý nguồn hàng <br />
                    <small style={{ fontSize: "0.8em", opacity: 0.9 }}>
                      NCC: {selectedSupplierName}
                    </small>
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowLinkModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {/* FORM THÊM LIÊN KẾT */}
                  <form
                    onSubmit={handleLinkSubmit}
                    className="row g-2 align-items-end mb-4 border-bottom pb-4"
                  >
                    <div className="col-md-9">
                      <label className="form-label fw-bold">
                        Thêm sản phẩm cung cấp mới
                      </label>
                      <select
                        className="form-select"
                        value={linkData.ProductID}
                        onChange={(e) =>
                          setLinkData({
                            ...linkData,
                            ProductID: e.target.value,
                          })
                        }
                      >
                        <option value="">-- Chọn sản phẩm --</option>
                        {allProducts.map((p) => (
                          <option key={p.ProductID} value={p.ProductID}>
                            {p.Name} - {p.Brand}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <button
                        type="submit"
                        className="btn btn-info text-white w-100"
                      >
                        <IconLink size={18} /> Thêm
                      </button>
                    </div>
                  </form>

                  {/* DANH SÁCH ĐÃ LIÊN KẾT */}
                  <h6 className="fw-bold text-dark">
                    Sản phẩm đang được cung cấp bởi đơn vị này:
                  </h6>
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "300px" }}
                  >
                    <table className="table table-sm table-bordered">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th>ID</th>
                          <th>Tên Sản phẩm</th>
                          <th>Thương hiệu</th>
                          <th>Giá nhập (Tham khảo)</th>
                          <th className="text-center">Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {linkedProducts.length > 0 ? (
                          linkedProducts.map((p) => (
                            <tr key={p.ProductID}>
                              <td>{p.ProductID}</td>
                              <td className="fw-bold text-primary">{p.Name}</td>
                              <td>{p.Brand}</td>
                              <td>
                                {new Intl.NumberFormat("vi-VN").format(p.Price)}{" "}
                                đ
                              </td>
                              <td className="text-center">
                                <button
                                  className="btn btn-sm btn-outline-danger border-0 p-1"
                                  onClick={() => handleUnlink(p.ProductID)}
                                  title="Ngừng cung cấp sản phẩm này"
                                >
                                  <IconUnlink size={18} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-muted">
                              Chưa liên kết sản phẩm nào.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

export default SupplierManager;
