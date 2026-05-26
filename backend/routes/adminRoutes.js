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

// ================= DASHBOARD =================

router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);

// ================= USERS =================

router.get("/users", protect, adminOnly, getAllUsers);

router.put("/users/:id/ban", protect, adminOnly, toggleBanUser);

// ================= MATCHES =================

// Add Match
router.post("/matches/add", protect, adminOnly, addMatch);

// Get All Matches
router.get("/matches", protect, adminOnly, getMatches);

// Update Match
router.put("/matches/:id", protect, adminOnly, updateMatch);

// Delete Match
router.delete("/matches/:id", protect, adminOnly, deleteMatch);

// ================= CONTESTS =================

router.get("/contests", protect, adminOnly, getAllContests);

// ================= TRANSACTIONS =================

router.get("/transactions", protect, adminOnly, getAllTransactions);

// ================= WITHDRAWALS =================

router.get("/withdrawals", protect, adminOnly, getWithdrawals);

router.put("/withdrawals/:id/process", protect, adminOnly, processWithdrawal);

export default router;
