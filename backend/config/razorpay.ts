import Razorpay from "razorpay";
import dotenv from "dotenv";
import { requireEnv } from "./env.js";
dotenv.config();

const razorpay = new Razorpay({
  key_id: requireEnv("RAZORPAY_KEY_ID"),
  key_secret: requireEnv("RAZORPAY_KEY_SECRET"),
});

export default razorpay;
