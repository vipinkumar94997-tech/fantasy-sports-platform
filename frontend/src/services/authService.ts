import api from "./api";

export const authService = {
  register: (data: Record<string, unknown>) => api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  verifyOTP: (data: { phone: string; otp: string }) =>
    api.post("/auth/verify-otp", data),
  googleLogin: (token?: string) => api.post("/auth/google", { token }),
  getProfile: () => api.get("/auth/profile"),
};
