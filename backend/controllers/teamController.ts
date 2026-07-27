import Team from "../models/Team.js";
import Player from "../models/Player.js";
import Match from "../models/Match.js";

export const createTeam = async (req, res) => {
  try {
    const { matchId, players, captainId, viceCaptainId } = req.body;

    const userId = req.user.id;

    if (!matchId || !players || !captainId || !viceCaptainId)
      return res.status(400).json({ message: "All fields required" });

    if (players.length !== 11)
      return res.status(400).json({ message: "Select exactly 11 players" });

    // Count existing teams
    const teamCount = await Team.count({ where: { userId, matchId } });
    if (teamCount >= 6)
      return res.status(400).json({ message: "Max 6 teams allowed per match" });

    const team = await Team.create({
      userId: req.user.id,
      matchId,
      players,
      captainId,
      viceCaptainId,
    });

    res.status(201).json({ message: "Team created!", team });
  } catch (err) {
    console.error("Create team error:", err);
    res.status(500).json({ message: err.message });
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
