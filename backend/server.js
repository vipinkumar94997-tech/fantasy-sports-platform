import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { createServer } from "http";
import { Server } from "socket.io";

import { connectDB } from "./config/db.js";

// Models
import "./models/index.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import kycRoutes from "./routes/KycRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
const httpServer = createServer(app);

// ================= DB =================
connectDB();

// ================= CORS (ONLY ONCE - FIXED) =================
const allowedOrigins = ["https://fantasy-sports-platform-eight.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // mobile apps / postman

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// ================= MIDDLEWARE =================
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ================= SOCKET =================
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/payment", paymentRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.json({ message: "Fantasy API Running" });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join-match", (matchId) => {
    socket.join(matchId);
  });

  socket.on("leave-match", (matchId) => {
    socket.leave(matchId);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
