import User from "../models/User.js";
import Match from "../models/Match.js";
import Contest from "../models/Contest.js";
import Transaction from "../models/Transaction.js";
import Withdrawal from "../models/Withdrawal.js";
import Wallet from "../models/Wallet.js";
import KYC from "../models/KYC.js";
import { Op } from "sequelize";
import Team from "../models/Team.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalMatches = await Match.count();
    const totalContests = await Contest.count();
    const totalTeams = await Team.count();
    const totalRevenue =
      (await Transaction.sum("amount", { where: { type: "deposit" } })) || 0;
    const totalPrizeDistributed =
      (await Transaction.sum("amount", {
        where: { type: "winning" },
      })) || 0;
    const kycPending = await KYC.count({ where: { status: "pending" } });

    const recentUsers = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "email", "phone", "kycStatus", "createdAt"],
    });

    const recentTransactions = await Transaction.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "user", attributes: ["id", "name"] }],
    });

    const userGrowthChart = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      const count = await User.count({
        where: { createdAt: { [Op.between]: [start, end] } },
      });
      userGrowthChart.push({
        date: start.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        users: count,
      });
    }

    const revenueChart = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      const revenue =
        (await Transaction.sum("amount", {
          where: { type: "deposit", createdAt: { [Op.between]: [start, end] } },
        })) || 0;
      revenueChart.push({
        date: start.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        revenue,
      });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const newUsersToday = await User.count({
      where: { createdAt: { [Op.gte]: todayStart } },
    });
    const todayRevenue =
      (await Transaction.sum("amount", {
        where: { type: "deposit", createdAt: { [Op.gte]: todayStart } },
      })) || 0;
    const pendingWithdrawals = await Withdrawal.count({
      where: { status: "pending" },
    });
    const pendingAmount =
      (await Withdrawal.sum("amount", { where: { status: "pending" } })) || 0;

    res.json({
      totalUsers,
      totalMatches,
      activeContests: totalContests,
      totalRevenue,
      todayRevenue,
      newUsersToday,
      pendingWithdrawals,
      pendingAmount,
      kycPending,
      totalTeams,
      totalPrizeDistributed,
      recentUsers,
      recentTransactions,
      revenueChart,
      userGrowthChart,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};
    const { count, rows } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });
    res.json({ users: rows, total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const toggleBanUser = async (req, res) => {
//   console.log(req.user.id);
//   return;
//   try {
//     const user = await User.findbyIdAndUpdate(req.params.id, { new: true });
//     if (!user) return res.status(404).json({ message: "User not found" });
//     user.banned = !user.banned;
//     await user.save();
//     res.json({ message: `User ${user.banned ? "banned" : "unbanned"}` });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Admin ko ban nahi karna
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin cannot be banned",
      });
    }

    // Toggle banned status
    user.banned = !user.banned;

    await user.save();

    res.json({
      message: user.banned
        ? "User banned successfully"
        : "User unbanned successfully",
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ matches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMatch = async (req, res) => {
  try {
    const {
      sport,
      venue,
      matchTime,
      team1Name,
      team1ShortName,
      team1Logo,
      team2Name,
      team2ShortName,
      team2Logo,
    } = req.body;

    if (!sport || !venue || !matchTime || !team1Name || !team2Name)
      return res.status(400).json({ message: "All fields are required" });

    const match = await Match.create({
      sport,
      venue,
      matchTime,
      status: "upcoming",
      team1Name,
      team1ShortName: team1ShortName || team1Name,
      team1Logo: team1Logo || "",
      team2Name,
      team2ShortName: team2ShortName || team2Name,
      team2Logo: team2Logo || "",
      totalContests: 0,
      totalPrize: 0,
    });

    res.status(201).json({ success: true, match });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateMatch = async (req, res) => {
  try {
    await Match.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Match updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    await Match.destroy({ where: { id: req.params.id } });
    res.json({ message: "Match deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
      limit: 50,
      include: [
        { model: User, as: "user", attributes: ["id", "name", "phone"] },
      ],
    });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ contests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWithdrawals = async (req, res) => {
  try {
    const { status = "pending" } = req.query;
    const withdrawals = await Withdrawal.findAll({
      where: { status },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "phone", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    const totalPendingAmount =
      status === "pending"
        ? withdrawals.reduce((sum, w) => sum + w.amount, 0)
        : 0;
    res.json({ withdrawals, totalPendingAmount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const processWithdrawal = async (req, res) => {
  try {
    const { action, reason } = req.body;
    const withdrawal = await Withdrawal.findByPk(req.params.id);
    if (!withdrawal)
      return res.status(404).json({ message: "Withdrawal not found" });

    if (action === "approve") {
      await withdrawal.update({ status: "approved" });
      await Transaction.update(
        { status: "success" },
        {
          where: {
            userId: withdrawal.userId,
            type: "withdrawal",
            status: "pending",
          },
        },
      );
    } else {
      const wallet = await Wallet.findOne({
        where: { userId: withdrawal.userId },
      });
      if (wallet) {
        wallet.balance += withdrawal.amount;
        await wallet.save();
      }
      await withdrawal.update({ status: "rejected", reason });
      await Transaction.update(
        { status: "failed" },
        {
          where: {
            userId: withdrawal.userId,
            type: "withdrawal",
            status: "pending",
          },
        },
      );
    }
    res.json({ message: `Withdrawal ${action}ed successfully` });
  } catch (err) {
    console.error("Process withdrawal error:", err);
    res.status(500).json({ message: err.message });
  }
};
