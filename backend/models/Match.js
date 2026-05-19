import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Match = sequelize.define(
  "Match",
  {
    sport: {
      type: DataTypes.ENUM("Cricket", "Football"),
      allowNull: false,
    },

    venue: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    matchTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("upcoming", "live", "completed"),
      defaultValue: "upcoming",
    },

    // Team 1
    team1Name: {
      type: DataTypes.STRING,
    },

    team1ShortName: {
      type: DataTypes.STRING,
    },

    team1Logo: {
      type: DataTypes.STRING,
    },

    team1Score: {
      type: DataTypes.STRING,
    },

    team1Overs: {
      type: DataTypes.STRING,
    },

    // Team 2
    team2Name: {
      type: DataTypes.STRING,
    },

    team2ShortName: {
      type: DataTypes.STRING,
    },

    team2Logo: {
      type: DataTypes.STRING,
    },

    team2Score: {
      type: DataTypes.STRING,
    },

    team2Overs: {
      type: DataTypes.STRING,
    },

    totalContests: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    totalPrize: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default Match;
