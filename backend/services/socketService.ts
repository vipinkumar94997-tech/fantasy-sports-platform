import type { Server } from "socket.io";

let socketServer: Server | null = null;

export const setSocketServer = (server: Server): void => {
  socketServer = server;
};

const getSocketServer = (): Server => {
  if (!socketServer) throw new Error("Socket.IO server has not been initialized");
  return socketServer;
};

export const emitScoreUpdate = (matchId, scoreData) => {
  getSocketServer().to(matchId).emit("score-update", scoreData);
};

export const emitLeaderboardUpdate = (matchId, leaderboard) => {
  getSocketServer().to(matchId).emit("leaderboard-update", leaderboard);
};

export const emitCommentary = (matchId, commentary) => {
  getSocketServer().to(matchId).emit("commentary", commentary);
};

export const emitMatchStatus = (matchId, status) => {
  getSocketServer().to(matchId).emit("match-status", { status });
};

export const emitNotification = (userId, notification) => {
  getSocketServer().to(`user_${userId}`).emit("notification", notification);
};
