import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { createServer } from "http";
import { Server } from "socket.io";
import { validateCoreEnvironment } from "./config/env.js";
import { setSocketServer } from "./services/socketService.js";
import { generalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import { requireEnv } from "./config/env.js";

import sequelize, { connectDB } from "./config/db.js";

import "./models/index.js";

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

validateCoreEnvironment();

await connectDB();

const configuredOrigins = process.env.FRONTEND_URLS
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins?.length
  ? configuredOrigins
  : [
  "https://fantasy-sports-platform-neon.vercel.app",
  "https://fantasy-sports-platform-eight.vercel.app",
  "http://localhost:5173",
    ];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api", generalLimiter);

export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});
setSocketServer(io);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));
    const decoded = jwt.verify(token, requireEnv("JWT_SECRET"), {
      algorithms: ["HS256"],
    }) as jwt.JwtPayload & { id: number };
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "banned"],
    });
    if (!user || user.banned) return next(new Error("Authentication failed"));
    socket.data.userId = user.id;
    next();
  } catch {
    next(new Error("Authentication failed"));
  }
});

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

app.get("/", (req, res) => {
  res.json({ message: "Fantasy API Running" });
});

app.get("/api/health", async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(503).json({ status: "error", database: "unavailable" });
  }
});

io.on("connection", (socket) => {
  socket.on("join-match", (matchId) => {
    const roomId = Number(matchId);
    if (Number.isInteger(roomId) && roomId > 0) {
      void socket.join(String(roomId));
    }
  });

  socket.on("leave-match", (matchId) => {
    const roomId = Number(matchId);
    if (Number.isInteger(roomId) && roomId > 0) {
      void socket.leave(String(roomId));
    }
  });

  socket.on("disconnect", () => undefined);
});

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler);

// ================= START SERVER =================
const PORT = process.env.PORT || 5001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
