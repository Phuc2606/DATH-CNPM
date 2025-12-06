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
// Lấy prod, có phân trang
export const getAdminProducts = async (params) => {
  // params: { page: 1, limit: 5, search: '...' }
  const response = await apiClient.get(`${ENDPOINT}/admin/list`, { params });
  return response.data;
};

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
  getAdminProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
