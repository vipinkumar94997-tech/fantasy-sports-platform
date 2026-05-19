import Contest from "../models/Contest.js";
import ContestEntry from "../models/ContestEntry.js";
import Team from "../models/Team.js";
import Wallet from "../models/Wallet.js";

// ================= GET CONTESTS BY MATCH =================

export const getContests = async (req, res) => {
  try {
    const contests = await Contest.findAll({
      where: {
        matchId: req.params.matchId,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(contests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CREATE PRIVATE CONTEST =================

export const createContest = async (req, res) => {
  try {
    const contest = await Contest.create(req.body);
    res.status(201).json(contest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= JOIN CONTEST =================

export const joinContest = async (req, res) => {
  try {
    const { contestId, teamId } = req.body;

    const contest = await Contest.findByPk(contestId);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Check already joined
    const already = await ContestEntry.findOne({
      where: {
        contestId,
        teamId,
      },
    });

    if (already) {
      return res.status(400).json({
        message: "Already joined contest",
      });
    }

    // Wallet check
    const wallet = await Wallet.findOne({
      where: { userId: req.user.id },
    });

    if (wallet.balance < contest.entryFee) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    // Deduct entry fee
    wallet.balance -= contest.entryFee;
    await wallet.save();

    // Create entry
    const entry = await ContestEntry.create({
      contestId,
      userId: req.user.id,
      teamId,
      matchId: contest.matchId,
    });

    // Update filled spots
    contest.filledSpots += 1;

    if (contest.filledSpots >= contest.totalSpots) {
      contest.status = "full";
    }

    await contest.save();

    res.status(201).json({
      message: "Contest joined successfully",
      entry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET CONTEST LEADERBOARD =================

export const getLeaderboard = async (req, res) => {
  try {
    const entries = await ContestEntry.findAll({
      where: {
        contestId: req.params.id,
      },
      order: [["points", "DESC"]],
    });

    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
