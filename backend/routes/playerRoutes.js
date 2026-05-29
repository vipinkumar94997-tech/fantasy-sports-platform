import express from "express";
import { getPlayersByMatch } from "../controllers/playerController.js";

const router = express.Router();

// GET PLAYERS BY MATCH
router.get("/match/:matchId", getPlayersByMatch);

export default router;
