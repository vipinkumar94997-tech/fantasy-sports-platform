import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PromoCode = sequelize.define(
  "PromoCode",
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.STRING,
    },

    discountType: {
      type: DataTypes.ENUM("fixed", "percentage"),
      defaultValue: "fixed",
    },

    discountValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    minDeposit: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    maxDiscount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    usageLimit: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },

    usedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
  },
);

export default PromoCode;
