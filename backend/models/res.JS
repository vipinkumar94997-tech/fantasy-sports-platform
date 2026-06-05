import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OTP = sequelize.define(
  "OTP",
  {
    phone: { type: DataTypes.STRING, allowNull: false },
    otp: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    used: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: true },
);

export default OTP;
