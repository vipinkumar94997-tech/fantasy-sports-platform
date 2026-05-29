// import Team from "../models/Team.js";
// import Player from "../models/Player.js";
// import TeamPlayer from "../models/TeamPlayer.js";

// // ================= CREATE TEAM =================

// export const createTeam = async (req, res) => {
//   try {
//     const { matchId, players, captainId, viceCaptainId, teamNumber } = req.body;

//     // ================= VALIDATIONS =================

//     // Total Players
//     if (players.length !== 11) {
//       return res.status(400).json({
//         message: "Team must contain 11 players",
//       });
//     }

//     // Unique Players
//     const uniquePlayers = [...new Set(players)];

//     if (uniquePlayers.length !== 11) {
//       return res.status(400).json({
//         message: "Duplicate players not allowed",
//       });
//     }

//     // Fetch Players
//     const playerData = await Player.findAll({
//       where: {
//         id: players,
//       },
//     });

//     // ================= CREDIT LIMIT =================

//     const totalCredits = playerData.reduce(
//       (sum, player) => sum + player.credits,
//       0,
//     );

//     if (totalCredits > 100) {
//       return res.status(400).json({
//         message: "Credits limit exceeded",
//       });
//     }

//     // ================= ROLE VALIDATION =================

//     const wk = playerData.filter((p) => p.role === "WK").length;

//     const bat = playerData.filter((p) => p.role === "BAT").length;

//     const ar = playerData.filter((p) => p.role === "AR").length;

//     const bowl = playerData.filter((p) => p.role === "BOWL").length;

//     if (wk < 1) {
//       return res.status(400).json({
//         message: "Minimum 1 wicketkeeper required",
//       });
//     }

//     if (bat < 3) {
//       return res.status(400).json({
//         message: "Minimum 3 batsmen required",
//       });
//     }

//     if (ar < 1) {
//       return res.status(400).json({
//         message: "Minimum 1 all-rounder required",
//       });
//     }

//     if (bowl < 3) {
//       return res.status(400).json({
//         message: "Minimum 3 bowlers required",
//       });
//     }

//     // ================= MAX PLAYERS PER TEAM =================

//     const teamCounts = {};

//     playerData.forEach((player) => {
//       teamCounts[player.team] = (teamCounts[player.team] || 0) + 1;
//     });

//     const maxPlayers = Math.max(...Object.values(teamCounts));

//     if (maxPlayers > 7) {
//       return res.status(400).json({
//         message: "Maximum 7 players allowed from one team",
//       });
//     }

//     // ================= CREATE TEAM =================

//     const team = await Team.create({
//       userId: req.user.id,
//       matchId,
//       captainId,
//       viceCaptainId,
//       teamNumber,
//       players: JSON.stringify(players),
//     });

//     // ================= TEAM PLAYERS =================

//     const teamPlayers = players.map((playerId) => ({
//       teamId: team.id,
//       playerId,
//     }));

//     await TeamPlayer.bulkCreate(teamPlayers);

//     res.status(201).json({
//       message: "Team created successfully",
//       team,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // ================= GET MY TEAMS =================

// export const getMyTeams = async (req, res) => {
//   try {
//     const teams = await Team.findAll({
//       where: {
//         userId: req.user.id,
//         matchId: req.params.matchId,
//       },
//     });

//     res.json(teams);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // ================= GET TEAM BY ID =================

// export const getTeamById = async (req, res) => {
//   try {
//     const team = await Team.findByPk(req.params.id);

//     if (!team) {
//       return res.status(404).json({
//         message: "Team not found",
//       });
//     }

//     const players = await TeamPlayer.findAll({
//       where: {
//         teamId: team.id,
//       },
//     });

//     res.json({
//       team,
//       players,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

import Team from "../models/Team.js";
import Player from "../models/Player.js";
import Match from "../models/Match.js";

export const createTeam = async (req, res) => {
  try {
    console.log("Team data received:", req.body);
    const { matchId, players, captainId, viceCaptainId } = req.body;
    console.log(
      "matchId:",
      matchId,
      "players:",
      players?.length,
      "captain:",
      captainId,
      "vc:",
      viceCaptainId,
    );

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
