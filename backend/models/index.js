import User from "./User.js";
import Match from "./Match.js";
import Player from "./Player.js";
import Wallet from "./Wallet.js";
import Transaction from "./Transaction.js";
import Contest from "./Contest.js";
import ContestEntry from "./ContestEntry.js";
import KYC from "./KYC.js";
import Withdrawal from "./Withdrawal.js";
import Leaderboard from "./Leaderboard.js";
import Notification from "./Notification.js";
import PromoCode from "./PromoCode.js";
import Referral from "./Referral.js";
import OTP from "./OTP.js";

// ================= KYC =================
KYC.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(KYC, { foreignKey: "userId", as: "kyc" });

// ================= ContestEntry =================
ContestEntry.belongsTo(Contest, {
  foreignKey: "contestId",
  as: "contest",
});

ContestEntry.belongsTo(Match, {
  foreignKey: "matchId",
  as: "match",
});

ContestEntry.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Contest.hasMany(ContestEntry, {
  foreignKey: "contestId",
});

Match.hasMany(ContestEntry, {
  foreignKey: "matchId",
});

User.hasMany(ContestEntry, {
  foreignKey: "userId",
});

// ================= Withdrawal =================
Withdrawal.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Withdrawal, {
  foreignKey: "userId",
});

// ================= Transaction =================
Transaction.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(Transaction, {
  foreignKey: "userId",
});

// ================= Leaderboard =================
Leaderboard.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(Leaderboard, {
  foreignKey: "userId",
});

// ================= Notification =================
Notification.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(Notification, {
  foreignKey: "userId",
});

// ================= Referral =================
Referral.belongsTo(User, {
  foreignKey: "referrerId",
  as: "referrer",
});

Referral.belongsTo(User, {
  foreignKey: "referredUserId",
  as: "referredUser",
});

// ================= EXPORTS =================
export {
  User,
  Match,
  Player,
  Wallet,
  Transaction,
  Contest,
  ContestEntry,
  KYC,
  Withdrawal,
  Leaderboard,
  Notification,
  PromoCode,
  Referral,
  OTP,
};
