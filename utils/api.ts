import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.FRONTEND_URL || "https://outreachr-mails.vercel.app/api/auth",
  withCredentials: true,
});

// OPTIONAL: Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
