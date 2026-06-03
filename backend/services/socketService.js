import { io } from "../server.js";

export const emitScoreUpdate = (matchId, scoreData) => {
  io.to(matchId).emit("score-update", scoreData);
};

export const emitLeaderboardUpdate = (matchId, leaderboard) => {
  io.to(matchId).emit("leaderboard-update", leaderboard);
};

export const emitCommentary = (matchId, commentary) => {
  io.to(matchId).emit("commentary", commentary);
};

export const emitMatchStatus = (matchId, status) => {
  io.to(matchId).emit("match-status", { status });
};

export const emitNotification = (userId, notification) => {
  io.to(`user_${userId}`).emit("notification", notification);
};
