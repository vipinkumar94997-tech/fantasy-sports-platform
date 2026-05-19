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
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", protect, adminOnly, getDashboardStats);
router.get("/dashboard", protect, adminOnly, getDashboardStats);
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id", protect, adminOnly, toggleBanUser);
router.put("/users/:id/ban", protect, adminOnly, toggleBanUser);
router.get("/matches", protect, adminOnly, getMatches);
router.post("/matches/add", protect, adminOnly, addMatch);
router.put("/matches/:id", protect, adminOnly, updateMatch);
router.delete("/matches/:id", protect, adminOnly, deleteMatch);
router.get("/transactions", protect, adminOnly, getAllTransactions);
router.get("/contests", protect, adminOnly, getAllContests);

export default router;
