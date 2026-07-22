import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { requireEnv } from "../config/env.js";

export const generateToken = (id) =>
  jwt.sign({ id }, requireEnv("JWT_SECRET"), {
    expiresIn: process.env.JWT_EXPIRE as SignOptions["expiresIn"],
  });

export const generateRefreshToken = (id) =>
  jwt.sign({ id }, requireEnv("JWT_REFRESH_SECRET"), { expiresIn: "30d" });
