import { api } from "../lib/apiClient";

export const fetchBlogs = () => api.get("/api/blogs");

export const adminLogout = () => api.post("/api/admin/logout");

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => api.post("/api/auth/change-password", data);

export const forgetPassword = (data: { email: string }) =>
  api.post("/api/auth/send-otp", { ...data, purpose: "reset" });

export const verifyOTP = (data: { email: string; otp: string }) =>
  api.post("/api/auth/verify-otp", data);

export const resetPassword = (data: {
  email: string;
  otp: string;
  newPassword: string;
}) => api.post("/api/auth/reset-password", data);
