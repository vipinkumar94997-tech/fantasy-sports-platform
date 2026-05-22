import User from "../models/User.js";
import ContestEntry from "../models/ContestEntry.js";
import sequelize from "../config/db.js";
import { Op } from "sequelize";

export const getLeaderboard = async (req, res) => {
  try {
    const { period = "weekly" } = req.query;

    let dateFilter = {};
    const now = new Date();

    if (period === "daily") {
      dateFilter = {
        createdAt: {
          [Op.gte]: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        },
      };
    } else if (period === "weekly") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { [Op.gte]: weekAgo } };
    } else if (period === "monthly") {
      const monthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate(),
      );
      dateFilter = { createdAt: { [Op.gte]: monthAgo } };
    }

    const entries = await ContestEntry.findAll({
      where: dateFilter,
      attributes: [
        "userId",
        [sequelize.fn("SUM", sequelize.col("winning")), "totalWinnings"],
        [sequelize.fn("SUM", sequelize.col("points")), "totalPoints"],
        [
          sequelize.fn("COUNT", sequelize.col("ContestEntry.id")),
          "contestsPlayed",
        ],
        [
          sequelize.fn(
            "SUM",
            sequelize.literal("CASE WHEN winning > 0 THEN 1 ELSE 0 END"),
          ),
          "contestsWon",
        ],
      ],
      group: ["userId"],
      order: [[sequelize.fn("SUM", sequelize.col("winning")), "DESC"]],
      limit: 50,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "phone"],
        },
      ],
    });

    const leaderboard = entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      userName: entry.user?.name || "Unknown",
      totalWinnings: parseFloat(entry.dataValues.totalWinnings) || 0,
      totalPoints: parseFloat(entry.dataValues.totalPoints) || 0,
      contestsPlayed: parseInt(entry.dataValues.contestsPlayed) || 0,
      contestsWon: parseInt(entry.dataValues.contestsWon) || 0,
    }));

    res.json({ leaderboard });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: err.message });
  }
};
