import apiClient from "./api"; //

const ENDPOINT = "/inventory/suppliers";

export const getAllSuppliers = async () => {
  const response = await apiClient.get(ENDPOINT);
  return response.data;
};

export const createSupplier = async (data) => {
  const response = await apiClient.post(ENDPOINT, data);
  return response.data;
};

export const updateSupplier = async (id, data) => {
  const response = await apiClient.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

export const deleteSupplier = async (id) => {
  const response = await apiClient.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

export const linkProduct = async (data) => {
  // data = { ProductID, SupplierID }
  const response = await apiClient.post(`${ENDPOINT}/link-product`, data);
  return response.data;
};

export const getLinkedProducts = async (id) => {
  const response = await apiClient.get(`${ENDPOINT}/${id}/products`);
  return response.data;
};

export const unlinkProduct = async (data) => {
  const response = await apiClient.post(`${ENDPOINT}/unlink-product`, data);
  return response.data;
};

export default {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  linkProduct,
  unlinkProduct,
  getLinkedProducts,
};
