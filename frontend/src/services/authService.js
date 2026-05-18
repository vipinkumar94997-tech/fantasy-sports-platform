import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  verifyOTP: (data) => api.post("/auth/verify-otp", data),
  googleLogin: (token) => api.post("/auth/google", { token }),
  refreshToken: (token) => api.post("/auth/refresh-token", { token }),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  uploadKYC: (data) => api.post("/auth/kyc", data),
};
