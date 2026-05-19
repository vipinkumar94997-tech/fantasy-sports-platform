import express from "express";

import {
  getMatches,
  getMatchById,
  getMatchPlayers,
  createMatch,
  updateMatch,
  deleteMatch,
} from "../controllers/matchController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getMatches);

router.get("/:id", getMatchById);

router.get("/:id/players", getMatchPlayers);

// Admin Routes
router.post("/", protect, adminOnly, createMatch);

router.put("/:id", protect, adminOnly, updateMatch);

router.delete("/:id", protect, adminOnly, deleteMatch);

export default router;
