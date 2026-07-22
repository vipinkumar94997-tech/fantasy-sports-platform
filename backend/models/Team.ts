import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Team = sequelize.define(
  "Team",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    captainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    viceCaptainId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    players: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    teamNumber: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    totalPoints: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    rank: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

export default Team;
