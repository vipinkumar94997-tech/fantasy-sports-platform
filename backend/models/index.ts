import User from "./User.js";
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
import OTP from "./Otp.js";
import Team from "./Team.js";
import Match from "./Match.js";
import AdminLog from "./AdminLog.js";
import TeamPlayer from "./TeamPlayer.js";

//Team
Team.belongsTo(User, { foreignKey: "userId", as: "user" });
Team.belongsTo(Match, { foreignKey: "matchId", as: "match" });
User.hasMany(Team, { foreignKey: "userId" });
Match.hasMany(Team, { foreignKey: "matchId" });
Player.belongsTo(Match, { foreignKey: "matchId", as: "match" });
Match.hasMany(Player, { foreignKey: "matchId", as: "players" });

Wallet.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasOne(Wallet, { foreignKey: "userId", as: "wallet" });

// ================= Team players =================
TeamPlayer.belongsTo(Team, { foreignKey: "teamId", as: "team" });
TeamPlayer.belongsTo(Player, { foreignKey: "playerId", as: "player" });
Team.hasMany(TeamPlayer, { foreignKey: "teamId", as: "teamPlayers" });
Player.hasMany(TeamPlayer, { foreignKey: "playerId", as: "teamPlayers" });

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

ContestEntry.belongsTo(Team, {
  foreignKey: "teamId",
  as: "team",
});

Team.hasMany(ContestEntry, {
  foreignKey: "teamId",
  as: "contestEntries",
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

Contest.belongsTo(Match, { foreignKey: "matchId", as: "match" });
Match.hasMany(Contest, { foreignKey: "matchId", as: "contests" });

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

Leaderboard.belongsTo(Contest, { foreignKey: "contestId", as: "contest" });
Leaderboard.belongsTo(Team, { foreignKey: "teamId", as: "team" });
Contest.hasMany(Leaderboard, { foreignKey: "contestId", as: "leaderboard" });
Team.hasMany(Leaderboard, { foreignKey: "teamId", as: "leaderboard" });

// ================= Notification =================
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Notification, { foreignKey: "userId" });

// ================= Referral =================
Referral.belongsTo(User, {
  foreignKey: "referrerId",
  as: "referrer",
});

User.hasMany(Referral, { foreignKey: "referrerId", as: "referralsMade" });
User.hasOne(Referral, { foreignKey: "referredUserId", as: "referral" });

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
  AdminLog,
  TeamPlayer,
};
