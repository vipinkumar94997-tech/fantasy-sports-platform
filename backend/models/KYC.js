import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const KYC = sequelize.define(
  "KYC",
  {
    userId: { type: DataTypes.STRING, allowNull: false },
    aadhaarNumber: { type: DataTypes.STRING },
    aadhaarImage: { type: DataTypes.TEXT("midium") },
    panNumber: { type: DataTypes.STRING },
    panImage: { type: DataTypes.TEXT("midium") },
    status: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      defaultValue: "pending",
    },
    rejectionReason: { type: DataTypes.STRING },
  },
  { timestamps: true },
);

export default KYC;
