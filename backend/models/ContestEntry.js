import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ContestEntry = sequelize.define(
  "ContestEntry",
  {
    contestId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    teamId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    matchId: {
      type: DataTypes.STRING,
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
