import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Enables HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Bearer Token if available in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("medicore_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized Error Normalization
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected clinical system error occurred.",
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || null,
    };

    // If session expired or unauthorized on protected route
    if (error.response?.status === 401) {
      localStorage.removeItem("medicore_token");
      localStorage.removeItem("medicore_user");
    }

    return Promise.reject(customError);
  }
);

export default api;
