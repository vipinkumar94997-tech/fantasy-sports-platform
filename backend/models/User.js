import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: "user",
    },

    kycStatus: {
      type: DataTypes.ENUM("none", "pending", "verified", "rejected"),
      defaultValue: "none",
    },

    referralCode: {
      type: DataTypes.STRING,
      unique: true,
    },

    referredBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    totalContests: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    totalWinnings: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,

    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);

        if (!user.referralCode) {
          user.referralCode = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();
        }
      },
    },
  },
);

// Password Match Method
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default User;
