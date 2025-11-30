import ReviewModel from "../models/ReviewModel.js";

export const addReview = async (req, res) => {
  try {
    const rv = new ReviewModel(req.body);
    const saved = await rv.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewModel.findAllByProduct(productId);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await ReviewModel.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await (await import("../config/database.js")).sql.connect();
    await pool
      .request()
      .input("id", (await import("../config/database.js")).sql.Int, id)
      .query("DELETE FROM Review WHERE ReviewID=@id");
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default { addReview, getReviewsByProduct, getReviewById, deleteReview };
