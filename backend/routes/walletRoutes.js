import express from "express";

import {
  getWallet,
  addMoney,
  withdrawMoney,
  getTransactions,
} from "../controllers/walletController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Wallet
router.get("/balance", protect, getWallet);
router.get("/", protect, getWallet);

// Add Money
router.post("/add", protect, addMoney);

// Withdraw
router.post("/withdraw", protect, withdrawMoney);

// Transactions
router.get("/transactions", protect, getTransactions);

export default router;
