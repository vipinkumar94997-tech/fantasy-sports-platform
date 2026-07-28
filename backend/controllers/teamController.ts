import Team from "../models/Team.js";
import Player from "../models/Player.js";
import Match from "../models/Match.js";
import sequelize from "../config/db.js";
import { Op } from "sequelize";
import { validateTeam } from "../utils/validateTeam.js";

export const createTeam = async (req, res) => {
  try {
    const matchId = Number(req.body.matchId);
    const captainId = Number(req.body.captainId);
    const viceCaptainId = Number(req.body.viceCaptainId);
    const players = Array.isArray(req.body.players)
      ? req.body.players.map(Number)
      : [];

    const userId = req.user.id;

    if (
      !Number.isInteger(matchId) ||
      !Number.isInteger(captainId) ||
      !Number.isInteger(viceCaptainId)
    )
      return res.status(400).json({ message: "All fields required" });

    const uniquePlayerIds = [...new Set(players)];
    if (uniquePlayerIds.length !== 11)
      return res.status(400).json({ message: "Select exactly 11 players" });
    if (
      captainId === viceCaptainId ||
      !uniquePlayerIds.includes(captainId) ||
      !uniquePlayerIds.includes(viceCaptainId)
    ) {
      return res.status(400).json({
        message: "Captain and vice captain must be different selected players",
      });
    }

    const team = await sequelize.transaction(async (transaction) => {
      const match = await Match.findByPk(matchId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!match) throw Object.assign(new Error("Match not found"), { status: 404 });
      if (match.status !== "upcoming") {
        throw Object.assign(new Error("Teams can only be created for upcoming matches"), {
          status: 400,
        });
      }

      const selectedPlayers = await Player.findAll({
        where: { id: { [Op.in]: uniquePlayerIds }, matchId },
        transaction,
      });
      if (selectedPlayers.length !== 11) {
        throw Object.assign(
          new Error("Every selected player must belong to this match"),
          { status: 400 },
        );
      }

      const validationError = validateTeam(
        selectedPlayers.map((player) => ({
          credits: Number(player.credits),
          role: player.role,
          team: player.team,
        })),
      );
      if (validationError) {
        throw Object.assign(new Error(validationError), { status: 400 });
      }

      const teamCount = await Team.count({
        where: { userId, matchId },
        transaction,
      });
      if (teamCount >= 6) {
        throw Object.assign(new Error("Max 6 teams allowed per match"), {
          status: 409,
        });
      }

      return Team.create(
        {
          userId,
          matchId,
          players: uniquePlayerIds,
          captainId,
          viceCaptainId,
          teamNumber: teamCount + 1,
        },
        { transaction },
      );
    });

    res.status(201).json({ message: "Team created!", team });
  } catch (err) {
    console.error("Create team error:", err);
    res
      .status(err.status || 500)
      .json({ message: err.message || "Unable to create team" });
  }
};

export const getMyTeams = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    const teams = await Team.findAll({
      where: { userId, matchId },
      order: [["createdAt", "DESC"]],
    });

    res.json({ teams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllMyTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { userId: req.user.id },
      include: [{ model: Match, as: "match" }],
      order: [["createdAt", "DESC"]],
    });
    res.json({ teams });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
