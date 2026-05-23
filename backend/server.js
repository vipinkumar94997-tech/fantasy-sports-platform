import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { createServer } from "http";
import { Server } from "socket.io";

import sequelize from "./config/db.js";

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
import kycRoutes from "./routes/kycRoutes.js";

const app = express();
const httpServer = createServer(app);

// ================= SOCKET =================
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// ================= DB CONNECT =================
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected Successfully");

    await sequelize.sync({ force: true }); // ⚠️ safer for development
    console.log("Tables Synced Successfully");
  } catch (error) {
    console.log("Database Error:", error);
  }
};

connectDB();

// ================= MIDDLEWARE =================
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(morgan("dev"));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/kyc", kycRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.json({ message: "Fantasy11 API Running" });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err); // 🔥 important for debugging

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
const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
