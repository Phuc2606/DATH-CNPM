import apiClient from "./api";

const ENDPOINT = "/inventory/branches";

export const getStores = async () => {
  const response = await apiClient.get(ENDPOINT);
  return response.data;
};

export default {
  getStores,
};
