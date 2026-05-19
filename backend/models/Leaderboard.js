import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Leaderboard = sequelize.define(
  "Leaderboard",
  {
    contestId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    rank: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    points: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    winnings: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default Leaderboard;
