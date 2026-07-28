import express from "express";
import {
  getContestsByMatch,
  getContestById,
  joinContest,
  getMyContests,
  getLeaderboard,
} from "../controllers/contestController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-contests", protect, getMyContests);
router.get("/detail/:id", protect, getContestById);
router.get("/:id/leaderboard", protect, getLeaderboard);
router.get("/:matchId", getContestsByMatch);
router.post("/join", protect, joinContest);

export default router;
