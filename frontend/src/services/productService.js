import apiClient from "./api";

const ENDPOINT = "/products"; // Vì trong app.js đã đặt là /api/products rồi

// --- PUBLIC ---
export const getAllProducts = async () => {
  const response = await apiClient.get(ENDPOINT);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// --- ADMIN ---
// Tạo sản phẩm (Có upload ảnh)
export const createProduct = async (formData) => {
  const response = await apiClient.post(ENDPOINT, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Cập nhật sản phẩm
export const updateProduct = async (id, formData) => {
  const response = await apiClient.put(`${ENDPOINT}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
