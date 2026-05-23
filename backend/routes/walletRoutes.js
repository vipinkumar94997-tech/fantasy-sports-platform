import express from "express";
import {
  getWallet,
  addMoney,
  withdrawMoney,
  getTransactions,
  verifyPayment,
} from "../controllers/walletController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/balance", protect, getWallet);
router.get("/", protect, getWallet);
router.post("/add", protect, addMoney);
router.post("/withdraw", protect, withdrawMoney);
router.get("/transactions", protect, getTransactions);
router.post("/verify-payment", protect, verifyPayment);

export default router;
