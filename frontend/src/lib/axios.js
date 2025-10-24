import axios from "axios";

const PROD_API = import.meta.env.VITE_API_URL;
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api"
      : PROD_API || "/api",
  withCredentials: true,
});

// Add token from localStorage to Authorization header
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
