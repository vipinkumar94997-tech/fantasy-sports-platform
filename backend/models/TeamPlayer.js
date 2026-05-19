import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TeamPlayer = sequelize.define(
  "TeamPlayer",
  {
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  },
);

export default TeamPlayer;
