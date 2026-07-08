import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const refreshToken = localStorage.getItem("refresh_token");
    if (error.response?.status === 401 && refreshToken && !original?._retry && !original?.url?.includes("/auth/refresh")) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh", { refresh_token: refreshToken });
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return api(original);
      } catch {
        localStorage.clear();
      }
    }
    return Promise.reject(error);
  }
);
