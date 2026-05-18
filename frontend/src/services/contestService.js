import api from "./api";

export const contestService = {
  getByMatch: (matchId, params) => api.get(`/contests/${matchId}`, { params }),
  getById: (id) => api.get(`/contests/detail/${id}`),
  join: (data) => api.post("/contests/join", data),
  createPrivate: (data) => api.post("/contests/create-private", data),
  getLeaderboard: (id) => api.get(`/contests/${id}/leaderboard`),
  getMyContests: () => api.get("/contests/my-contests"),
};
