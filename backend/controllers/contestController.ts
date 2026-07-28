import Contest from "../models/Contest.js";
import ContestEntry from "../models/ContestEntry.js";
import Match from "../models/Match.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Team from "../models/Team.js";
import sequelize from "../config/db.js";

export const getContestsByMatch = async (req, res) => {
  try {
    const matchId = Number(req.params.matchId);
    if (!Number.isInteger(matchId) || matchId <= 0) {
      return res.status(400).json({ message: "Valid matchId required" });
    }

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
    const contestId = Number(req.body.contestId);
    const teamId = Number(req.body.teamId);
    const userId = req.user.id;
    if (
      !Number.isInteger(contestId) ||
      contestId <= 0 ||
      !Number.isInteger(teamId) ||
      teamId <= 0
    ) {
      return res
        .status(400)
        .json({ message: "Valid contestId and teamId required" });
    }

    const result = await sequelize.transaction(async (transaction) => {
      const contest = await Contest.findByPk(contestId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!contest) return { status: 404, message: "Contest not found" };
      if (contest.status !== "open") {
        return { status: 400, message: "Contest is not open" };
      }

      const team = await Team.findOne({
        where: { id: teamId, userId },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!team) return { status: 404, message: "Team not found" };
      if (Number(team.matchId) !== Number(contest.matchId)) {
        return { status: 400, message: "Team does not belong to this match" };
      }

      const existing = await ContestEntry.findOne({
        where: { contestId, userId, teamId },
        transaction,
      });
      if (existing) return { status: 409, message: "Already joined" };

      if (Number(contest.filledSpots) >= Number(contest.totalSpots)) {
        return { status: 409, message: "Contest is full" };
      }

      const entryFee = Number(contest.entryFee);
      if (entryFee > 0) {
        const wallet = await Wallet.findOne({
          where: { userId },
          transaction,
          lock: transaction.LOCK.UPDATE,
        });
        if (!wallet || Number(wallet.balance) < entryFee) {
          return { status: 400, message: "Insufficient balance" };
        }

        await wallet.update(
          { balance: Number(wallet.balance) - entryFee },
          { transaction },
        );
        await Transaction.create(
          {
            userId,
            type: "contest_join",
            amount: entryFee,
            status: "success",
            note: `Joined contest: ${contest.name}`,
          },
          { transaction },
        );
      }

      await ContestEntry.create(
        {
          userId,
          contestId,
          teamId,
          matchId: contest.matchId,
          points: 0,
          winning: 0,
        },
        { transaction },
      );

      const filledSpots = Number(contest.filledSpots) + 1;
      await contest.update(
        {
          filledSpots,
          status:
            filledSpots >= Number(contest.totalSpots) ? "full" : "open",
        },
        { transaction },
      );

      return { status: 200, message: "Contest joined successfully!" };
    });

    return res.status(result.status).json({ message: result.message });
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
