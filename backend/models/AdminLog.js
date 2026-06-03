import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AdminLog = sequelize.define(
  "AdminLog",
  {
    adminId: { type: DataTypes.STRING(36), allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    targetType: { type: DataTypes.STRING },
    targetId: { type: DataTypes.STRING },
    details: { type: DataTypes.TEXT },
    ip: { type: DataTypes.STRING },
  },
  { timestamps: true },
);

export const logAdminAction = async (
  adminId,
  action,
  targetType,
  targetId,
  details,
) => {
  try {
    await AdminLog.create({ adminId, action, targetType, targetId, details });
  } catch (err) {
    console.error("Admin log error:", err.message);
  }
};

export default AdminLog;
