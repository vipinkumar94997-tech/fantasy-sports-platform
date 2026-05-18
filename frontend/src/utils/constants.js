export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const RESTRICTED_STATES = [
  "Assam",
  "Odisha",
  "Telangana",
  "Andhra Pradesh",
  "Nagaland",
  "Sikkim",
];

export const PLAYER_ROLES = {
  WK: "Wicket Keeper",
  BAT: "Batsman",
  AR: "All Rounder",
  BOWL: "Bowler",
};

export const TEAM_RULES = {
  TOTAL_PLAYERS: 11,
  MAX_CREDITS: 100,
  MAX_FROM_ONE_TEAM: 7,
  MIN_WK: 1,
  MAX_WK: 4,
  MIN_BAT: 3,
  MAX_BAT: 6,
  MIN_AR: 1,
  MAX_AR: 4,
  MIN_BOWL: 3,
  MAX_BOWL: 6,
};

export const FANTASY_POINTS = {
  RUN: 1,
  BOUNDARY: 1,
  SIX: 2,
  WICKET: 25,
  MAIDEN: 8,
  CATCH: 8,
  DUCK: -2,
  FIFTY_BONUS: 8,
  HUNDRED_BONUS: 16,
  THREE_WICKETS_BONUS: 4,
  FIVE_WICKETS_BONUS: 16,
  CAPTAIN_MULTIPLIER: 2,
  VC_MULTIPLIER: 1.5,
};

export const CONTEST_TYPES = {
  H2H: "Head to Head",
  SMALL: "Small League",
  MEGA: "Mega Contest",
};

export const MATCH_STATUS = {
  UPCOMING: "upcoming",
  LIVE: "live",
  COMPLETED: "completed",
};

export const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  CONTEST_JOIN: "contest_join",
  WINNING: "winning",
  BONUS: "bonus",
  REFUND: "refund",
};
