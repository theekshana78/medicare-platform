import api from "../api/axiosInstance";

/**
 * Retrieve compiled telemetry metrics for the Administrator Console
 */
export const getTelemetryApi = async () => {
  const response = await api.get("/admin/telemetry");
  return response.data;
};

/**
 * Trigger browser download of raw log file (app.log or error.log)
 * Authenticated via Authorization Bearer token
 * @param {"app"|"error"} type 
 */
export const downloadLogFileApi = async (type = "app") => {
  const token = localStorage.getItem("medicore_token");
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";
  const url = `${baseUrl}/admin/logs/download?type=${type}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to download ${type}.log: HTTP ${response.status}`);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = `${type}.log`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
  a.remove();
};
