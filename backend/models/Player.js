import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Player = sequelize.define(
  "Player",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("WK", "BAT", "AR", "BOWL"),
      allowNull: false,
    },

    sport: {
      type: String,
      enum: ["cricket", "football"],
      required: true,
    },

    team: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    matchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    credits: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    selectionPercent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    image: {
      type: DataTypes.STRING,
    },

    points: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default Player;
