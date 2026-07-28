import api from "./api";

export const walletService = {
  getBalance: () => api.get("/wallet/balance"),
  addMoney: (data: { amount: number }) => api.post("/wallet/add", data),
  withdraw: (data: { amount: number; upiId: string }) =>
    api.post("/wallet/withdraw", data),
  getTransactions: (params: Record<string, unknown> = {}) =>
    api.get("/wallet/transactions", { params }),
  verifyPayment: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => api.post("/wallet/verify-payment", data),
};
