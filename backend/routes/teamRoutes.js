import express from "express";

import {
  createTeam,
  getMyTeams,
  getTeamById,
} from "../controllers/teamController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Team
router.post("/create", protect, createTeam);

// My Teams
router.get("/my-teams/:matchId", protect, getMyTeams);

// Team Preview
router.get("/:id", protect, getTeamById);

export default router;
