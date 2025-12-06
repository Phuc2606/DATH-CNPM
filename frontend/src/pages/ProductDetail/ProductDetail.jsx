import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import { useCart } from "../../context/useCart";

const ProductDetail = () => {
    const { id } = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const formatDate = (dateString) => {
        if (!dateString) return "—";

        const fixed = dateString.includes("T")
            ? dateString
            : dateString.replace(" ", "T");
        let d = new Date(fixed);
        if (isNaN(d)) return "—";
        d = new Date(d.getTime() - 7 * 60 * 60 * 1000);

        return d.toLocaleString("vi-VN");
    };

    // ================== FETCH PRODUCT ==================
    useEffect(() => {
        const fetchDetail = async () => {
            const res = await fetch(`http://localhost:5000/api/products/${id}`);
            const data = await res.json();

            setProduct({
                id: data.ProductID,
                name: data.Name,
                price: data.Price,
                img: `http://localhost:5000${data.ImageURL}`, 
                description: data.Description,
                stock: data.Stock,
            });
        };
        fetchDetail();
    }, [id]);

    // ================== FETCH REVIEWS ==================
    useEffect(() => {
        const fetchReviews = async () => {
            const res = await fetch(
                `http://localhost:5000/api/products/${id}/reviews`
            );
            const data = await res.json();
            setReviews(data);
        };
        fetchReviews();
    }, [id]);

    // ================== SUBMIT REVIEW ==================
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn cần đăng nhập để đánh giá!");
            return;
        }

        const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                starRating: rating,
                note: comment,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setReviews((prev) => [data.review, ...prev]);
            setRating(5);
            setComment("");
            alert("Đánh giá thành công!");
        } else {
            alert(data.message || "Gửi đánh giá thất bại!");
        }
    };

    if (!product) return <p>Đang tải...</p>;

    return (
        <div className="product-detail">
            {/* ======== MAIN TOP SECTION ======== */}
            <div className="top-layout">
                <div className="left-image">
                    <img src={product.img} alt={product.name} />
                </div>
                <div className="right-content">
                    <div className="product-info">
                        <h1>{product.name}</h1>
                        <p className="price">{product.price.toLocaleString()} đ</p>

                        <p className={`stock ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
                            {product.stock > 0
                                ? `Còn ${product.stock} sản phẩm`
                                : "Hết hàng"}
                        </p>

                        <p>{product.description}</p>
                        <button
                            className="add-to-cart-btn"
                            disabled={product.stock === 0}
                            onClick={() => addItem(product.id, 1)}
                        >
                            {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                        </button>

                    </div>

                    {/* REVIEW LIST */}
                    <div className="reviews-list">
                        <h2>Đánh giá sản phẩm</h2>

                        {reviews.length === 0 ? (
                            <p>Chưa có đánh giá nào.</p>
                        ) : (
                            reviews.map((r) => (
                                <div key={r.ReviewID} className="review-item">
                                    <span className="stars">{"⭐".repeat(r.StarRating)}</span>
                                    <p>{r.Note}</p>
                                    <small>{formatDate(r.ReviewTime)}</small>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* ======== REVIEW FORM  ======== */}
            <div className="review-form">
                <h3>Viết đánh giá</h3>

                <form onSubmit={handleSubmitReview}>
                    <label>Số sao:</label>
                    <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        <option value={5}>5 sao</option>
                        <option value={4}>4 sao</option>
                        <option value={3}>3 sao</option>
                        <option value={2}>2 sao</option>
                        <option value={1}>1 sao</option>
                    </select>

                    <label>Nội dung:</label>
                    <textarea
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Viết cảm nhận..."
                    />

                    <button type="submit">Gửi đánh giá</button>
                </form>
            </div>
        </div>
    );
};

export default ProductDetail;
