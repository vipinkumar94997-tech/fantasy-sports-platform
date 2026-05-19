import express from "express";

import {
  getContests,
  createContest,
  joinContest,
  getLeaderboard,
} from "../controllers/contestController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/:matchId", getContests);
router.get("/leaderboard/:id", getLeaderboard);

// User
router.post("/join", protect, joinContest);

// Admin
router.post("/create", protect, adminOnly, createContest);

export default router;
