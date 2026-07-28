import User from "../models/User.js";
import jwt from "jsonwebtoken";

interface AuthTokenPayload extends jwt.JwtPayload {
  id: number;
}
import Wallet from "../models/Wallet.js";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";
import { requireEnv } from "../config/env.js";
import sequelize from "../config/db.js";
import { OAuth2Client } from "google-auth-library";

const RESTRICTED_STATES = [
  "Assam",
  "Odisha",
  "Telangana",
  "Andhra Pradesh",
  "Nagaland",
  "Sikkim",
];

const publicUser = (user, wallet) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  kycStatus: user.kycStatus,
  referralCode: user.referralCode,
  balance: wallet?.balance || 0,
});

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, state, age, referralCode } = req.body;

    if (RESTRICTED_STATES.includes(state))
      return res
        .status(400)
        .json({ message: `Gaming not allowed in ${state}` });

    if (age < 18)
      return res.status(400).json({ message: "Must be 18 or older" });

    const normalizedEmail = String(email).trim().toLowerCase();
    const exists = await User.findOne({ where: { email: normalizedEmail } });
    if (exists) return res.status(400).json({ message: "User already exists" });

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ where: { referralCode } });
      if (referrer) referredBy = referrer.id;
    }

    const user = await sequelize.transaction(async (transaction) => {
      const createdUser = await User.create(
        {
          name: String(name).trim(),
          email: normalizedEmail,
          phone: String(phone).trim(),
          password,
          state,
          age: Number(age),
          referredBy,
        },
        { transaction },
      );
      await Wallet.create({ userId: createdUser.id }, { transaction });
      return createdUser;
    });

    res
      .status(201)
      .json({ message: "Registered successfully", userId: user.id });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.banned) return res.status(403).json({ message: "Account banned" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const wallet = await Wallet.findOne({ where: { userId: user.id } });
    res.json({
      token: generateToken(user.id),
      refreshToken: generateRefreshToken(user.id),
      user: publicUser(user, wallet),
    });
  } catch (err) {
    console.error("LOGIN ERROR DETAILS:", err);
    res.status(500).json({ message: err.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const credential = String(req.body.token ?? "");
    if (!credential) {
      return res.status(400).json({ message: "Google credential required" });
    }

    const clientId = requireEnv("GOOGLE_CLIENT_ID");
    const ticket = await new OAuth2Client(clientId).verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ message: "Google email is not verified" });
    }

    const user = await User.findOne({
      where: { email: payload.email.toLowerCase() },
    });
    if (!user) {
      return res.status(404).json({
        message: "Register with this email before using Google login",
      });
    }
    if (user.banned) return res.status(403).json({ message: "Account banned" });

    const [wallet] = await Wallet.findOrCreate({
      where: { userId: user.id },
      defaults: { userId: user.id },
    });

    return res.json({
      token: generateToken(user.id),
      refreshToken: generateRefreshToken(user.id),
      user: publicUser(user, wallet),
    });
  } catch {
    return res.status(401).json({ message: "Invalid Google credential" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const wallet = await Wallet.findOne({ where: { userId: user.id } });
    res.json({ user: { ...user.toJSON(), balance: wallet?.balance || 0 } });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "No token" });
    const decoded = jwt.verify(
      token,
      requireEnv("JWT_REFRESH_SECRET"),
      { algorithms: ["HS256"] },
    ) as AuthTokenPayload;
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "banned"],
    });
    if (!user || user.banned) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    res.json({ token: generateToken(decoded.id) });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
