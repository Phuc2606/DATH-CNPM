import React, { useEffect, useState } from "react";
import {
  IconTrash,
  IconSearch,
  IconStar,
  IconMessageCircle,
} from "@tabler/icons-react";
import { toast } from "react-toastify";

const ReviewManager = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/users/reviews?page=${page}&limit=10&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();
      console.log("API RESULT:", result);

      setReviews(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Fetch review error:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa đánh giá này?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/users/reviews/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    toast.success(data.message);

    fetchReviews();
  };

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark d-flex align-items-center gap-2">
          <IconMessageCircle size={28} /> Quản lý đánh giá sản phẩm
        </h2>
      </div>

      {/* SEARCH BAR */}
      <div className="card shadow-sm mb-3">
        <div className="card-body d-flex align-items-center gap-2">
          <IconSearch size={18} className="text-secondary" />
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm nội dung, ID sản phẩm hoặc khách hàng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <table className="table table-hover table-striped mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th className="ps-3">ID</th>
                <th>Sản phẩm</th>
                <th>Khách hàng</th>
                <th>Đánh giá</th>
                <th>Ghi chú</th>
                <th>Thời gian</th>
                <th className="text-end pe-3">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.ReviewID}>
                    <td className="ps-3 fw-bold">{r.ReviewID}</td>
                    <td>{r.ProductID}</td>
                    <td>{r.CustomerID}</td>

                    <td>
                      <span className="text-warning d-flex align-items-center gap-1">
                        <IconStar size={16} />
                        {r.StarRating}
                      </span>
                    </td>

                    <td style={{ maxWidth: 250 }} className="text-truncate">
                      {r.Note}
                    </td>

                    <td>{new Date(r.ReviewTime).toLocaleString()}</td>

                    <td className="text-end pe-3">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(r.ReviewID)}
                      >
                        <IconTrash size={16} /> Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
        <button
          className="btn btn-outline-secondary"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Trước
        </button>

        <span>
          <strong>{page}</strong> / {totalPages}
        </span>

        <button
          className="btn btn-outline-secondary"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default ReviewManager;
