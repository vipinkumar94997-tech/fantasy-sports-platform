import Contest from "../models/Contest.js";
import ContestEntry from "../models/ContestEntry.js";
import Match from "../models/Match.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

export const getContestsByMatch = async (req, res) => {
  try {
    const matchId = Number(req.params.matchId);

    const contests = await Contest.findAll({
      where: { matchId },
      order: [["createdAt", "DESC"]],
    });

    res.json({ contests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getContestById = async (req, res) => {
  try {
    const contest = await Contest.findByPk(req.params.id);
    if (!contest) return res.status(404).json({ message: "Contest not found" });
    res.json({ contest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinContest = async (req, res) => {
  try {
    const { contestId, teamId } = req.body;
    const userId = req.user.id;

    const contest = await Contest.findByPk(contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    // Already joined check
    const existing = await ContestEntry.findOne({
      where: { contestId, userId, teamId },
    });
    if (existing) return res.status(400).json({ message: "Already joined" });

    // Spots check
    if (contest.filledSpots >= contest.totalSpots)
      return res.status(400).json({ message: "Contest is full" });

    // Entry fee deduct
    if (contest.entryFee > 0) {
      const wallet = await Wallet.findOne({ where: { userId } });
      if (!wallet || wallet.balance < contest.entryFee)
        return res.status(400).json({ message: "Insufficient balance" });

      wallet.balance -= contest.entryFee;
      await wallet.save();

      await Transaction.create({
        userId,
        type: "contest_join",
        amount: contest.entryFee,
        status: "success",
        note: `Joined contest: ${contest.name}`,
      });
    }

    // Create entry
    await ContestEntry.create({
      userId,
      contestId,
      teamId,
      matchId: contest.matchId,
      points: 0,
      winning: 0,
    });

    // Update filled spots
    await contest.update({ filledSpots: contest.filledSpots + 1 });

    res.json({ message: "Contest joined successfully!" });
  } catch (err) {
    console.error("Join contest error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyContests = async (req, res) => {
  try {
    const entries = await ContestEntry.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Contest, as: "contest" },
        { model: Match, as: "match" },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json({ contests: entries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { id } = req.params;
    const entries = await ContestEntry.findAll({
      where: { contestId: id },
      order: [["points", "DESC"]],
    });
    res.json({ leaderboard: entries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
