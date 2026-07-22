import express from "express";
import {
  getNotifications,
  markAsRead,
  markOneAsRead,
  sendToAll,
  sendToUser,
  clearAll,
  deleteSelected,
} from "../controllers/notificationController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/read-all", protect, markAsRead);
router.put("/:id/read", protect, markOneAsRead);
router.delete("/clear-all", protect, clearAll);
router.delete("/delete-selected", protect, deleteSelected);
router.post("/send-all", protect, adminOnly, sendToAll);
router.post("/send-user", protect, adminOnly, sendToUser);

export default router;
