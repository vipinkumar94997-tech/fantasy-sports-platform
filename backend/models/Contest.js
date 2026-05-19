import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Contest = sequelize.define(
  "Contest",
  {
    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("H2H", "SMALL", "MEGA"),
      defaultValue: "SMALL",
    },

    entryFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    prizePool: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    totalSpots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    filledSpots: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    firstPrize: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    totalWinners: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    isGuaranteed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isPrivate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    inviteCode: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM("open", "full", "live", "completed", "cancelled"),
      defaultValue: "open",
    },

    // JSON Prize Breakup
    prizeBreakup: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
  },
  {
    timestamps: true,
  },
);

export default Contest;
