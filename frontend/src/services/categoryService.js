import apiClient from "./api"; // Import axios instance đã cấu hình

// Route dùng chung (vì backend gộp chung controller rồi)
const ENDPOINT = "/categories";

// 1. Lấy danh sách (Dùng cho cả User Navbar & Admin Table)
export const getAllCategories = async (params) => {
  const response = await apiClient.get(ENDPOINT, { params });
  return response.data;
};

// 2. Lấy chi tiết
export const getCategoryById = async (id) => {
  const response = await apiClient.get(`${ENDPOINT}/${id}`);
  return response.data;
};

// 3. Tạo mới (Admin)
export const createCategory = async (data) => {
  const response = await apiClient.post(ENDPOINT, data);
  return response.data;
};

// 4. Cập nhật (Admin)
export const updateCategory = async (id, data) => {
  const response = await apiClient.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

// 5. Xóa (Admin)
export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
