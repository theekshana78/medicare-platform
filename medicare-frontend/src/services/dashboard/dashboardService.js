import api from "../api/axiosInstance";

export const getDashboardStatsApi = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};
