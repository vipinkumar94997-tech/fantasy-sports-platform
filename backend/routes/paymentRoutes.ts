import express from "express";
import { createOrder } from "../controllers/paymentController.js";
import { paymentLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/create-order", paymentLimiter, createOrder);

export default router;
