import express from "express";
import {
  getNotifications,
  markAsRead,
  markOneAsRead,
  sendToAll,
  sendToUser,
} from "../controllers/notificationController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/read-all", protect, markAsRead);
router.put("/:id/read", protect, markOneAsRead);
router.post("/send-all", protect, adminOnly, sendToAll);
router.post("/send-user", protect, adminOnly, sendToUser);

export default router;
