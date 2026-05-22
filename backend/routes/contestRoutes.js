import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Contest from "../models/Contest.js";
import Match from "../models/Match.js";

const router = express.Router();

router.get("/my-contests", protect, async (req, res) => {
  try {
    const contests = await Contest.findAll({
      include: [{ model: Match, as: "match" }],
      order: [["createdAt", "DESC"]],
    });
    res.json({ contests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:matchId", async (req, res) => {
  try {
    const contests = await Contest.findAll({
      where: { matchId: req.params.matchId },
    });
    res.json({ contests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
