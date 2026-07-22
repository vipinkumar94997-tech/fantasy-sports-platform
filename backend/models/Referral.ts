import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Referral = sequelize.define("Referral", {
  referrerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  referredUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  bonus: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

export default Referral;
