import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ContestEntry = sequelize.define(
  "ContestEntry",
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

    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    rank: {
      type: DataTypes.INTEGER,
    },

    points: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    winning: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default ContestEntry;
