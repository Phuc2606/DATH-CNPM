import React, { useState, useEffect } from "react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconBuildingWarehouse,
  IconBoxSeam,
  IconMapPin,
  IconArrowDown,
  IconArrowUp, // Icon cho xuất kho
  IconTransform, // Icon chuyển đổi
} from "@tabler/icons-react";
import BranchService from "../../services/branchService";
import ProductService from "../../services/productService";

// Cấu hình URL (Sửa port nếu cần)
const UPLOAD_URL = "http://localhost:5000";

const InventoryManager = () => {
  // --- STATE ---
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal Chi nhánh
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [branchForm, setBranchForm] = useState({
    BranchID: null,
    Name: "",
    Address: "",
    Expense: "",
    AvailableCapacity: "",
  });

  // Modal Kho (Store)
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  // Form Transaction (Nhập/Xuất)
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [transactionMode, setTransactionMode] = useState("import"); // 'import' | 'return'
  const [transactionData, setTransactionData] = useState({
    productId: "",
    quantity: 1,
  });

  // --- EFFECT ---
  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const data = await BranchService.getAllBranches();
      setBranches(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC CHI NHÁNH (BRANCH) ---
  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await BranchService.updateBranch(branchForm.BranchID, branchForm);
        alert("Cập nhật chi nhánh thành công!");
      } else {
        await BranchService.createBranch(branchForm);
        alert("Thêm chi nhánh thành công!");
      }
      setShowBranchModal(false);
      fetchBranches();
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const openBranchModal = (branch = null) => {
    if (branch) {
      setIsEditing(true);
      setBranchForm(branch);
    } else {
      setIsEditing(false);
      setBranchForm({
        BranchID: null,
        Name: "",
        Address: "",
        Expense: "",
        AvailableCapacity: "",
      });
    }
    setShowBranchModal(true);
  };

  const deleteBranch = async (id) => {
    if (
      window.confirm("Xóa chi nhánh này sẽ xóa luôn kho hàng của nó. Tiếp tục?")
    ) {
      try {
        await BranchService.deleteBranch(id);
        fetchBranches();
      } catch (err) {
        alert("Lỗi xóa: " + err.message);
      }
    }
  };

  // --- LOGIC KHO (INVENTORY) ---
  const openInventory = async (branch) => {
    setSelectedBranch(branch);
    setShowInventoryModal(true);
    setShowTransactionForm(false); // Reset form
    setTransactionMode("import"); // Mặc định là nhập
    setTransactionData({ productId: "", quantity: 1 });

    try {
      const stock = await BranchService.getBranchInventory(branch.BranchID);
      setInventory(stock);
      const prods = await ProductService.getAllProducts();
      setAllProducts(prods);
    } catch (err) {
      console.error("Lỗi load kho:", err);
    }
  };

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!transactionData.productId) return alert("Vui lòng chọn sản phẩm!");

    const payload = {
      branchId: selectedBranch.BranchID,
      productId: transactionData.productId,
      quantity: parseInt(transactionData.quantity),
    };

    try {
      if (transactionMode === "import") {
        await BranchService.importStock(payload);
        alert("Nhập kho thành công!");
      } else {
        await BranchService.returnStock(payload);
        alert("Xuất trả kho tổng thành công!");
      }

      // Reload lại kho
      const stock = await BranchService.getBranchInventory(
        selectedBranch.BranchID
      );
      setInventory(stock);
      fetchBranches();

      // Giữ form mở để nhập tiếp nếu cần, hoặc đóng: setShowTransactionForm(false);
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  // --- RENDER ---
  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark d-flex align-items-center gap-2">
          <IconBuildingWarehouse size={28} /> Quản lý Kho & Chi nhánh
        </h2>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => openBranchModal()}
        >
          <IconPlus size={20} /> Thêm Chi nhánh
        </button>
      </div>

      {/* TABLE BRANCHES */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover table-striped mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Tên Chi nhánh</th>
                <th>Địa chỉ</th>
                <th>Chi phí (Expense)</th>
                <th style={{ width: "15%" }}>Trạng thái Kho (Hiện có / Max)</th>
                <th className="text-end pe-4">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => {
                // Tính phần trăm lấp đầy kho
                const percent = b.AvailableCapacity
                  ? Math.round((b.CurrentStock / b.AvailableCapacity) * 100)
                  : 0;
                // Chọn màu: Xanh (ít), Vàng (sắp đầy), Đỏ (quá tải)
                const progressColor =
                  percent > 90
                    ? "bg-danger"
                    : percent > 70
                    ? "bg-warning"
                    : "bg-success";

                return (
                  <tr key={b.BranchID}>
                    <td className="ps-4 fw-bold text-primary">{b.Name}</td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <IconMapPin size={16} className="text-muted" />{" "}
                        {b.Address}
                      </div>
                    </td>
                    <td>
                      {new Intl.NumberFormat("vi-VN").format(b.Expense)} đ
                    </td>

                    {/* --- CỘT MỚI: HIỆN CÓ / SỨC CHỨA --- */}
                    <td>
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-bold">{b.CurrentStock}</span>
                        <span className="text-muted">
                          / {b.AvailableCapacity || "∞"}
                        </span>
                      </div>
                      {/* Thanh Progress Bar của Bootstrap */}
                      {b.AvailableCapacity && (
                        <div className="progress" style={{ height: "6px" }}>
                          <div
                            className={`progress-bar ${progressColor}`}
                            role="progressbar"
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </td>

                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => openInventory(b)}
                        title="Xem & Nhập Kho"
                      >
                        <IconBoxSeam size={18} /> Kho
                      </button>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => openBranchModal(b)}
                      >
                        <IconEdit size={18} />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteBranch(b.BranchID)}
                      >
                        <IconTrash size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL 1: THÊM/SỬA CHI NHÁNH --- */}
      {showBranchModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Cập nhật Chi nhánh" : "Thêm Chi nhánh mới"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowBranchModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleBranchSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-bold">
                        Tên chi nhánh
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={branchForm.Name}
                        onChange={(e) =>
                          setBranchForm({ ...branchForm, Name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Địa chỉ</label>
                      <input
                        type="text"
                        className="form-control"
                        value={branchForm.Address}
                        onChange={(e) =>
                          setBranchForm({
                            ...branchForm,
                            Address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="row">
                      <div className="col-6 mb-3">
                        <label className="form-label fw-bold">Chi phí</label>
                        <input
                          type="number"
                          className="form-control"
                          value={branchForm.Expense}
                          onChange={(e) =>
                            setBranchForm({
                              ...branchForm,
                              Expense: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <label className="form-label fw-bold">Sức chứa</label>
                        <input
                          type="number"
                          className="form-control"
                          value={branchForm.AvailableCapacity}
                          onChange={(e) =>
                            setBranchForm({
                              ...branchForm,
                              AvailableCapacity: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowBranchModal(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Lưu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- MODAL 2: QUẢN LÝ KHO (INVENTORY) --- */}
      {showInventoryModal && selectedBranch && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-light">
                  <div>
                    <h5 className="modal-title fw-bold">
                      Kho hàng: {selectedBranch.Name}
                    </h5>
                    <small className="text-muted">
                      {selectedBranch.Address}
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowInventoryModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {/* Form Transaction Toggle */}
                  <div
                    className={`card mb-4 border-${
                      transactionMode === "import" ? "primary" : "warning"
                    }`}
                  >
                    <div
                      className={`card-header text-white d-flex justify-content-between cursor-pointer ${
                        transactionMode === "import"
                          ? "bg-primary"
                          : "bg-warning"
                      }`}
                      onClick={() =>
                        setShowTransactionForm(!showTransactionForm)
                      }
                    >
                      <span className="fw-bold d-flex align-items-center gap-2">
                        <IconTransform size={18} />
                        {showTransactionForm
                          ? "Đóng form"
                          : "Thao tác kho (Nhập/Xuất)"}
                      </span>
                      <span>{showTransactionForm ? "▲" : "▼"}</span>
                    </div>

                    {showTransactionForm && (
                      <div className="card-body bg-light">
                        {/* Nút chọn chế độ */}
                        <div className="btn-group w-100 mb-3" role="group">
                          <button
                            type="button"
                            className={`btn ${
                              transactionMode === "import"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => setTransactionMode("import")}
                          >
                            <IconArrowDown size={18} /> Nhập kho (Vào)
                          </button>
                          <button
                            type="button"
                            className={`btn ${
                              transactionMode === "return"
                                ? "btn-warning text-dark"
                                : "btn-outline-warning text-dark"
                            }`}
                            onClick={() => setTransactionMode("return")}
                          >
                            <IconArrowUp size={18} /> Xuất trả (Ra)
                          </button>
                        </div>

                        <form
                          onSubmit={handleTransactionSubmit}
                          className="row g-3 align-items-end"
                        >
                          <div className="col-md-7">
                            <label className="form-label fw-bold">
                              Chọn sản phẩm
                            </label>
                            <select
                              className="form-select"
                              onChange={(e) =>
                                setTransactionData({
                                  ...transactionData,
                                  productId: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">-- Chọn sản phẩm --</option>
                              {(transactionMode === "import"
                                ? allProducts
                                : inventory
                              ).map((p) => (
                                <option key={p.ProductID} value={p.ProductID}>
                                  {p.Name}
                                  {transactionMode === "return"
                                    ? ` (Có sẵn: ${p.Quantity})`
                                    : ` (Giá gốc: ${new Intl.NumberFormat(
                                        "vi-VN"
                                      ).format(p.Price)})`}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-3">
                            <label className="form-label fw-bold">
                              Số lượng
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              min="1"
                              value={transactionData.quantity}
                              onChange={(e) =>
                                setTransactionData({
                                  ...transactionData,
                                  quantity: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="col-md-2">
                            <button
                              type="submit"
                              className={`btn w-100 ${
                                transactionMode === "import"
                                  ? "btn-primary"
                                  : "btn-warning"
                              }`}
                            >
                              Thực hiện
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>

                  {/* Danh sách tồn kho */}
                  <h6 className="fw-bold mb-3">Danh sách hàng đang có sẵn:</h6>
                  <div
                    className="table-responsive"
                    style={{ maxHeight: "400px" }}
                  >
                    <table className="table table-bordered table-hover">
                      <thead className="table-secondary sticky-top">
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Hình ảnh</th>
                          <th className="text-center">Số lượng tồn</th>
                          <th>Đơn giá</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.length > 0 ? (
                          inventory.map((item, index) => (
                            <tr key={index}>
                              <td className="fw-bold">{item.Name}</td>
                              <td>
                                <img
                                  src={`${UPLOAD_URL}${item.ImageURL}`}
                                  alt=""
                                  style={{
                                    width: 40,
                                    height: 40,
                                    objectFit: "cover",
                                  }}
                                  onError={(e) =>
                                    (e.target.src = "https://placehold.co/40")
                                  }
                                />
                              </td>
                              <td className="text-center">
                                <span
                                  className={`badge ${
                                    item.Quantity < 10
                                      ? "bg-danger text-white"
                                      : "bg-success text-light"
                                  } fs-6`}
                                >
                                  {item.Quantity}
                                </span>
                              </td>
                              <td>
                                {new Intl.NumberFormat("vi-VN").format(
                                  item.Price
                                )}{" "}
                                đ
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center text-muted py-4"
                            >
                              Kho này đang trống. Hãy nhập hàng!
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

export default InventoryManager;
