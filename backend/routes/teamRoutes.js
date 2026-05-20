import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/all", protect, async (req, res) => {
  res.json({ teams: [] });
});

router.get("/my-teams/:matchId", protect, async (req, res) => {
  res.json({ teams: [] });
});

router.post("/create", protect, async (req, res) => {
  res.json({ message: "Team created" });
});

router.put("/:id/edit", protect, async (req, res) => {
  res.json({ message: "Team updated" });
});

export default router;
