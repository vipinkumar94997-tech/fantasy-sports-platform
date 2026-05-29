import express from "express";
import {
  createTeam,
  getMyTeams,
  getAllMyTeams,
} from "../controllers/teamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTeam);
router.get("/all", protect, getAllMyTeams);
router.get("/my-teams/:matchId", protect, getMyTeams);

export default router;
