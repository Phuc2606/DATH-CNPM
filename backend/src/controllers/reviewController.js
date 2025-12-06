import Review from "../models/Review.js";
// User thêm review
export const addReview = async (req, res) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) return res.status(401).json({ message: "Chưa đăng nhập" });

    const productId = req.params.productId; 
    const { starRating, note } = req.body;

    if (!productId || isNaN(productId)) {
      return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
    }

    if (!productId || !starRating || starRating < 1 || starRating > 5) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    const review = new Review({
      ProductID: productId,
      CustomerID: customerId,
      StarRating: starRating,
      Note: note?.trim()
    });

    const saved = await review.save();
    res.status(201).json({ message: "Đánh giá thành công!", review: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Lấy review của sản phẩm
export const getReviewsByProduct = async (req, res) => {
  console.log(">>> ĐÃ VÀO GET REVIEWS, params:", req.params);
  try {
    const { productId } = req.params;
    if (isNaN(productId)) return res.status(400).json({ message: "ID không hợp lệ" });

    const reviews = await Review.findAllByProduct(parseInt(productId));
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin xem tất cả review( có phân trang + tìm kiếm)
export const getAllReviewsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const result = await Review.getAllForAdmin({ page, limit, search });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Admin xóa review vi phạm
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(id)) return res.status(400).json({ message: "ID không hợp lệ" });

    await Review.deleteById(parseInt(id));
    res.json({ message: "Xóa đánh giá thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export default { addReview, getReviewsByProduct, getAllReviewsAdmin, deleteReview };