import apiClient from "./api";

const ENDPOINT = "/inventory";

// --- CHI NHÁNH ---
export const getAllBranches = async () => {
  const response = await apiClient.get(`${ENDPOINT}/branches`);
  return response.data;
};

export const createBranch = async (data) => {
  const response = await apiClient.post(`${ENDPOINT}/branches`, data);
  return response.data;
};

export const updateBranch = async (id, data) => {
  const response = await apiClient.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

export const deleteBranch = async (id) => {
  const response = await apiClient.delete(`${ENDPOINT}/branches/${id}`);
  return response.data;
};

// --- KHO (STORE) ---

// Lấy danh sách hàng tồn trong 1 chi nhánh
export const getBranchInventory = async (branchId) => {
  const response = await apiClient.get(
    `${ENDPOINT}/branches/${branchId}/inventory`
  );
  return response.data;
};

// Nhập hàng vào kho
export const importStock = async (data) => {
  // data = { branchId, productId, quantity }
  const response = await apiClient.put(`${ENDPOINT}/store/import`, data);
  return response.data;
};

export const returnStock = async (data) => {
  // data = { branchId, productId, quantity }
  const response = await apiClient.put(`${ENDPOINT}/store/return`, data);
  return response.data;
};

export default {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchInventory,
  importStock,
  returnStock,
};
