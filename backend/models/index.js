import sequelize from "../config/db.js";

// ================= MODELS =================
import User from "./User.js";
import Wallet from "./Wallet.js";
import Match from "./Match.js";
import Player from "./Player.js";
import Contest from "./Contest.js";
import ContestEntry from "./ContestEntry.js";
import Team from "./Team.js";
import TeamPlayer from "./TeamPlayer.js";
import Transaction from "./Transaction.js";
import Leaderboard from "./Leaderboard.js";
import KYC from "./KYC.js";
import Notification from "./Notification.js";
import PromoCode from "./PromoCode.js";

// Associassions
KYC.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(KYC, { foreignKey: "userId", as: "kyc" });

// ================= USER - WALLET =================
User.hasOne(Wallet, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Wallet.belongsTo(User, {
  foreignKey: "userId",
});

// ================= MATCH - PLAYER =================
Match.hasMany(Player, {
  foreignKey: "matchId",
  onDelete: "CASCADE",
});

Player.belongsTo(Match, {
  foreignKey: "matchId",
});

// ================= USER - TEAM =================
User.hasMany(Team, {
  foreignKey: "userId",
});

Team.belongsTo(User, {
  foreignKey: "userId",
});

// ================= MATCH - TEAM =================
Match.hasMany(Team, {
  foreignKey: "matchId",
});

Team.belongsTo(Match, {
  foreignKey: "matchId",
});

// ================= TEAM - PLAYER (MANY TO MANY) =================
Team.belongsToMany(Player, {
  through: TeamPlayer,
  foreignKey: "teamId",
});

Player.belongsToMany(Team, {
  through: TeamPlayer,
  foreignKey: "playerId",
});

// ================= CONTEST - ENTRY =================
Contest.hasMany(ContestEntry, {
  foreignKey: "contestId",
});

ContestEntry.belongsTo(Contest, {
  foreignKey: "contestId",
  as: "contest",
});

User.hasMany(ContestEntry, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

ContestEntry.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

Team.hasMany(ContestEntry, {
  foreignKey: "teamId",
  onDelete: "CASCADE",
});

ContestEntry.belongsTo(Team, {
  foreignKey: "teamId",
});

Match.hasMany(ContestEntry, {
  foreignKey: "matchId",
  onDelete: "CASCADE",
});

ContestEntry.belongsTo(Match, {
  foreignKey: "matchId",
  as: "match",
});

// ================= TRANSACTIONS =================
User.hasMany(Transaction, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Transaction.belongsTo(User, {
  foreignKey: "userId",
});

// ================= LEADERBOARD =================
Contest.hasMany(Leaderboard, {
  foreignKey: "contestId",
  onDelete: "CASCADE",
});

Leaderboard.belongsTo(Contest, {
  foreignKey: "contestId",
});

User.hasMany(Leaderboard, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Leaderboard.belongsTo(User, {
  foreignKey: "userId",
});

Team.hasMany(Leaderboard, {
  foreignKey: "teamId",
  onDelete: "CASCADE",
});

Leaderboard.belongsTo(Team, {
  foreignKey: "teamId",
});

// ================= KYC =================
User.hasOne(KYC, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

KYC.belongsTo(User, {
  foreignKey: "userId",
});

// ================= NOTIFICATION =================
User.hasMany(Notification, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Notification.belongsTo(User, {
  foreignKey: "userId",
});

// ================= PROMO CODE (optional relation later) =================

// ================= EXPORTS =================
export {
  sequelize,
  User,
  Wallet,
  Match,
  Player,
  Contest,
  ContestEntry,
  Team,
  TeamPlayer,
  Transaction,
  Leaderboard,
  KYC,
  Notification,
  PromoCode,
};
