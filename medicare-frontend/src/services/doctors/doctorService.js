import api from "../api/axiosInstance";

export const getDoctorsApi = async (params = {}) => {
  const response = await api.get("/doctors", { params });
  return response.data;
};

export const getDoctorByIdApi = async (id) => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

export const getDoctorSlotsApi = async (id, date) => {
  const response = await api.get(`/doctors/${id}/slots`, { params: { date } });
  return response.data;
};

export const verifyDoctorApi = async (id) => {
  const response = await api.put(`/doctors/${id}/verify`);
  return response.data;
};
