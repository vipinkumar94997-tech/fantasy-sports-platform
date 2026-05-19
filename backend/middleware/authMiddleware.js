import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Get Token
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find User
    const user = await User.findByPk(decoded.id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Banned Check
    if (user.banned) {
      return res.status(403).json({
        message: "Account banned",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Token invalid",
    });
  }
};

// Admin Middleware
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      message: "Admin only",
    });
  }

  next();
};
