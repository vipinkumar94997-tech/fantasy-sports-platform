import api from "./api";

export const walletService = {
  getBalance: () => api.get("/wallet/balance"),
  addMoney: (data) => api.post("/wallet/add-money", data),
  withdraw: (data) => api.post("/wallet/withdraw", data),
  getTransactions: (params) => api.get("/wallet/transactions", { params }),
  verifyPayment: (data) => api.post("/wallet/verify-payment", data),
};
