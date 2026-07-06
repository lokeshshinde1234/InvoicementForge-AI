import { create } from "zustand";
import { api } from "../api/client";

export const useAuthStore = create((set) => ({
  role: localStorage.getItem("role") || "company_admin",
  token: localStorage.getItem("access_token"),
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    set({ token: data.access_token });
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

