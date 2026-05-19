import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const KYC = sequelize.define(
  "KYC",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    aadhaarNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    panNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    aadhaarImage: {
      type: DataTypes.STRING,
    },

    panImage: {
      type: DataTypes.STRING,
    },

    selfieImage: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM("pending", "verified", "rejected"),
      defaultValue: "pending",
    },

    rejectionReason: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
  },
);

export default KYC;
