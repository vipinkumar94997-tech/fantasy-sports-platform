import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Withdrawal = sequelize.define(
  "Withdrawal",
  {
    userId: { type: DataTypes.INTEGER(36), allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    upiId: { type: DataTypes.STRING, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
    },
    tdsAmount: { type: DataTypes.FLOAT, defaultValue: 0 },
    reason: { type: DataTypes.STRING },
  },
  { timestamps: true },
);

export default Withdrawal;
