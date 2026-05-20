import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-contests", protect, async (req, res) => {
  res.json({ contests: [] });
});

router.get("/:matchId", (req, res) => res.json({ contests: [] }));
router.post("/join", protect, (req, res) => res.json({ message: "joined" }));

export default router;
