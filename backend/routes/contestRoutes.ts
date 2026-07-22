// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import ContestEntry from "../models/ContestEntry.js";
// import Contest from "../models/Contest.js";
// import Match from "../models/Match.js";

// const router = express.Router();

// // My Contests — PEHLE RAKHO
// router.get("/my-contests", protect, async (req, res) => {
//   try {
//     const entries = await ContestEntry.findAll({
//       where: { userId: req.user.id },
//       include: [
//         { model: Contest, as: "contest" },
//         { model: Match, as: "match" },
//       ],
//       order: [["createdAt", "DESC"]],
//     });
//     res.json({ contests: entries });
//   } catch (err) {
//     console.error("My contests error:", err);
//     res.json({ contests: [] });
//   }
// });

// router.get("/:matchId", async (req, res) => {
//   try {
//     const contests = await Contest.findAll({
//       where: { matchId: req.params.matchId },
//     });
//     res.json({ contests });
//   } catch (err) {
//     res.json({ contests: [] });
//   }
// });

// router.post("/join", protect, async (req, res) => {
//   res.json({ message: "joined" });
// });

// export default router;

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
