import express from "express";
import {
  register,
  login,
  getProfile,
  refreshToken,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
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

export default router;
