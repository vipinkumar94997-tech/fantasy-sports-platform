import express from "express";
import {
  register,
  login,
  getProfile,
  refreshToken,
  googleLogin,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Match from "../models/Match.js";
import Contest from "../models/Contest.js";
import ContestEntry from "../models/ContestEntry.js";
import { Op } from "sequelize";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateLogin, validateRegister } from "../middleware/validate.js";

const router = express.Router();

router.post("/register", authLimiter, validateRegister, register);
router.post("/login", authLimiter, validateLogin, login);
router.post("/refresh-token", authLimiter, refreshToken);
router.post("/google", authLimiter, googleLogin);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    await User.update({ name, email, phone }, { where: { id: req.user.id } });
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/public-stats", async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalMatches = await Match.count();
    const totalContests = await Contest.count();
    const totalWinners = await ContestEntry.count({
      where: { winning: { [Op.gt]: 0 } },
    });
    res.json({
      totalUsers,
      totalMatches,
      totalContests,
      totalWinners,
      dailyPrizePool: "₹10 Crore",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
