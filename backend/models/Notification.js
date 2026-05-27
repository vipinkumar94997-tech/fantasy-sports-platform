import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Notification = sequelize.define(
  "Notification",
  {
    userId: { type: DataTypes.STRING(36), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.ENUM("info", "success", "warning", "error"),
      defaultValue: "info",
    },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { timestamps: true },
);

export default Notification;
