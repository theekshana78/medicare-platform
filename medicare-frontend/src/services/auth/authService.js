import api from "../api/axiosInstance";

export const loginApi = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const getMeApi = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const updateProfileApi = async (profileData) => {
  const response = await api.put("/auth/profile", profileData);
  return response.data;
};
