import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Wallet = sequelize.define(
  "Wallet",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },

    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    bonusBalance: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default Wallet;
