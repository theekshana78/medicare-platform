import api from "../api/axiosInstance";

export const getPublicPlatformSummaryApi = async () => {
  const response = await api.get("/public/summary");
  return response.data;
};
