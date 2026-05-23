import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Transaction = sequelize.define(
  "Transaction",
  {
    userId: { type: DataTypes.INTEGER(36), allowNull: false },
    type: {
      type: DataTypes.ENUM(
        "deposit",
        "withdrawal",
        "contest_join",
        "winning",
        "bonus",
        "refund",
      ),
      allowNull: false,
    },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      defaultValue: "success",
    },
    orderId: { type: DataTypes.STRING },
    note: { type: DataTypes.STRING },
  },
  { timestamps: true },
);

export default Transaction;
