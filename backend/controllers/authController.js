// import User from "../models/User.js";
// import jwt from "jsonwebtoken";
// import Wallet from "../models/Wallet.js";

// import { generateToken, generateRefreshToken } from "../utils/generateToken.js";

// const RESTRICTED_STATES = [
//   "Assam",
//   "Odisha",
//   "Telangana",
//   "Andhra Pradesh",
//   "Nagaland",
//   "Sikkim",
// ];

// // Register
// export const register = async (req, res) => {
//   try {
//     const { name, email, phone, password, state, age, referralCode } = req.body;

//     // Restricted States
//     if (RESTRICTED_STATES.includes(state)) {
//       return res.status(400).json({
//         message: `Gaming not allowed in ${state}`,
//       });
//     }

//     // Age Check
//     if (age < 18) {
//       return res.status(400).json({
//         message: "Must be 18 or older",
//       });
//     }

//     // Check Existing User
//     const exists = await User.findOne({
//       where: {
//         email,
//       },
//     });

//     if (exists) {
//       return res.status(400).json({
//         message: "User already exists",
//       });
//     }

//     // Referral
//     let referredBy = null;

//     if (referralCode) {
//       const referrer = await User.findOne({
//         where: {
//           referralCode,
//         },
//       });

//       if (referrer) {
//         referredBy = referrer.id;
//       }
//     }

//     // Create User
//     const user = await User.create({
//       name,
//       email,
//       phone,
//       password,
//       state,
//       age,
//       referredBy,
//     });

//     // Create Wallet
//     await Wallet.create({
//       userId: user.id,
//     });

//     res.status(201).json({
//       message: "Registered successfully",
//       userId: user.id,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// // Login
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find User
//     const user = await User.findOne({
//       where: {
//         email,
//       },
//     });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid credentials",
//       });
//     }

//     // Banned Check
//     if (user.banned) {
//       return res.status(403).json({
//         message: "Account banned",
//       });
//     }

//     // Password Match
//     const isMatch = await user.matchPassword(password);

//     if (!isMatch) {
//       return res.status(400).json({
//         message: "Invalid credentials",
//       });
//     }

//     res.json({
//       token: generateToken(user.id),

//       refreshToken: generateRefreshToken(user.id),

//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         phone: user.phone,
//         role: user.role,
//         kycStatus: user.kycStatus,
//         referralCode: user.referralCode,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// // Get Profile
// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id, {
//       attributes: {
//         exclude: ["password"],
//       },
//     });

//     res.json({ user });
//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     res.status(500).json({
//       message: err.message,
//     });
//   }
// };

// // Refresh Token
// export const refreshToken = async (req, res) => {
//   try {
//     const { token } = req.body;

//     if (!token) {
//       return res.status(401).json({
//         message: "No token",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

//     res.json({
//       token: generateToken(decoded.id),
//     });
//   } catch {
//     res.status(401).json({
//       message: "Invalid refresh token",
//     });
//   }
// };

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Wallet from "../models/Wallet.js";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";

const RESTRICTED_STATES = [
  "Assam",
  "Odisha",
  "Telangana",
  "Andhra Pradesh",
  "Nagaland",
  "Sikkim",
];

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, state, age, referralCode } = req.body;

    if (RESTRICTED_STATES.includes(state))
      return res
        .status(400)
        .json({ message: `Gaming not allowed in ${state}` });

    if (age < 18)
      return res.status(400).json({ message: "Must be 18 or older" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "User already exists" });

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ where: { referralCode } });
      if (referrer) referredBy = referrer.id;
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      state,
      age,
      referredBy,
    });
    await Wallet.create({ userId: user.id });

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
    console.log("Login attempt:", email);

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    console.log("User found:", user ? "yes" : "no");

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (user.banned) return res.status(403).json({ message: "Account banned" });

    const isMatch = await user.matchPassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const wallet = await Wallet.findOne({ where: { userId: user.id } });
    console.log("Wallet found:", wallet ? "yes" : "no");

    res.json({
      token: generateToken(user.id),
      refreshToken: generateRefreshToken(user.id),
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        kycStatus: user.kycStatus,
        referralCode: user.referralCode,
        balance: wallet?.balance || 0,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR DETAILS:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });
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
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    res.json({ token: generateToken(decoded.id) });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
