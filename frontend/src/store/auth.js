import { create } from "zustand";
import { api } from "../api/client";

export const useAuthStore = create((set) => ({
  role: localStorage.getItem("role") || "company_admin",
  token: localStorage.getItem("access_token"),
  user: null,
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    const user = await api.get("/auth/me").then((res) => res.data);
    localStorage.setItem("role", user.role);
    set({ token: data.access_token, role: user.role, user });
    return user;
  },
  async signup(payload) {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    const user = await api.get("/auth/me").then((res) => res.data);
    localStorage.setItem("role", user.role);
    set({ token: data.access_token, role: user.role, user });
    return user;
  },
  async hydrateUser() {
    const token = localStorage.getItem("access_token");
    if (!token) return null;
    const user = await api.get("/auth/me").then((res) => res.data);
    localStorage.setItem("role", user.role);
    set({ token, role: user.role, user });
    return user;
  },
  setRole(role) {
    localStorage.setItem("role", role);
    set({ role });
  },
  logout() {
    localStorage.clear();
    set({ token: null });
  }
}));
