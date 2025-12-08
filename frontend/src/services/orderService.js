import apiClient from "./api";

const ENDPOINT = "/orders"; // Nhớ map đúng trong app.js (vd: app.use('/api/orders', orderRoutes))

export const getAllOrders = async (params) => {
  const response = await apiClient.get(ENDPOINT, { params });
  return response.data;
};

export const getOrderDetails = async (id) => {
  const response = await apiClient.get(`${ENDPOINT}/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, statusData) => {
  // statusData = { status, paymentStatus }
  const response = await apiClient.put(`${ENDPOINT}/${id}/status`, statusData);
  return response.data;
};

export default {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
};
