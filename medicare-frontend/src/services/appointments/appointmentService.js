import api from "../api/axiosInstance";

export const createAppointmentApi = async (appointmentData) => {
  const response = await api.post("/appointments", appointmentData);
  return response.data;
};

export const getMyAppointmentsApi = async () => {
  const response = await api.get("/appointments");
  return response.data;
};

export const updateAppointmentStatusApi = async (id, status, notes = "") => {
  const response = await api.put(`/appointments/${id}/status`, { status, notes });
  return response.data;
};

export const cancelAppointmentApi = async (id) => {
  const response = await api.put(`/appointments/${id}/cancel`);
  return response.data;
};
