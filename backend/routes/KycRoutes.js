import express from "express";
import {
  submitKYC,
  getKYCStatus,
  getAllKYC,
  approveKYC,
  rejectKYC,
} from "../controllers/kycController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/submit", protect, submitKYC);
router.get("/status", protect, getKYCStatus);
router.get("/all", protect, adminOnly, getAllKYC);
router.put("/:id/approve", protect, adminOnly, approveKYC);
router.put("/:id/reject", protect, adminOnly, rejectKYC);

export default router;
