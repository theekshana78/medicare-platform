import api from "../api/axiosInstance";

export const getNotificationsApi = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const createNotificationApi = async (data) => {
  const response = await api.post("/notifications", data);
  return response.data;
};

export const markNotificationReadApi = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsReadApi = async () => {
  const response = await api.post("/notifications/read-all");
  return response.data;
};
