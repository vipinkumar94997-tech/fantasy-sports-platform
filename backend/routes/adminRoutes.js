import express from "express";

import {
  getDashboardStats,
  getAllUsers,
  toggleBanUser,
  getMatches,
  addMatch,
  updateMatch,
  deleteMatch,
  getAllTransactions,
  getAllContests,
  getWithdrawals,
  processWithdrawal,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);

router.get("/users", protect, adminOnly, getAllUsers);

router.put("/users/:id/ban", protect, adminOnly, toggleBanUser);

router.post("/matches/add", protect, adminOnly, addMatch);

router.get("/matches", protect, adminOnly, getMatches);

router.put("/matches/:id", protect, adminOnly, updateMatch);

router.delete("/matches/:id", protect, adminOnly, deleteMatch);

router.get("/contests", protect, adminOnly, getAllContests);

router.get("/transactions", protect, adminOnly, getAllTransactions);

router.get("/withdrawals", protect, adminOnly, getWithdrawals);

router.put("/withdrawals/:id/process", protect, adminOnly, processWithdrawal);

export default router;
