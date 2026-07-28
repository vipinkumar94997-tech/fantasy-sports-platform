import express from "express";
import {
  getWallet,
  addMoney,
  withdrawMoney,
  getTransactions,
  verifyPayment,
} from "../controllers/walletController.js";
import { protect } from "../middleware/authMiddleware.js";
import { paymentLimiter } from "../middleware/rateLimiter.js";
import { validateWithdraw } from "../middleware/validate.js";

const router = express.Router();

router.get("/balance", protect, getWallet);
router.get("/", protect, getWallet);
router.post("/add", paymentLimiter, protect, addMoney);
router.post("/withdraw", protect, validateWithdraw, withdrawMoney);
router.get("/transactions", protect, getTransactions);
router.post("/verify-payment", paymentLimiter, protect, verifyPayment);

export default router;
