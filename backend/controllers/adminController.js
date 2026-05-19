import User from "../models/User.js";
import Match from "../models/Match.js";
import Contest from "../models/Contest.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import { Op } from "sequelize";

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalMatches = await Match.count();
    const totalContests = await Contest.count();
    const totalRevenue = await Transaction.sum("amount", {
      where: { type: "deposit" },
    });

    const recentUsers = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "email", "phone", "kycStatus", "createdAt"],
    });

    res.json({
      totalUsers,
      totalMatches,
      activeContests: totalContests,
      totalRevenue: totalRevenue || 0,
      todayRevenue: 0,
      pendingWithdrawals: 0,
      recentUsers,
      revenueChart: [],
      userGrowthChart: [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Users
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

// Ban/Unban User
export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.banned = !user.banned;
    await user.save();
    res.json({ message: `User ${user.banned ? "banned" : "unbanned"}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Matches
export const getMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ matches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Match
export const addMatch = async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json({ match });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Match
export const updateMatch = async (req, res) => {
  try {
    await Match.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Match updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Match
export const deleteMatch = async (req, res) => {
  try {
    await Match.destroy({ where: { id: req.params.id } });
    res.json({ message: "Match deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Transactions
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Contests
export const getAllContests = async (req, res) => {
  try {
    const contests = await Contest.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json({ contests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
