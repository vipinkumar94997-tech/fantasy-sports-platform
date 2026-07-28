import api from "./api";

export const contestService = {
  getByMatch: (matchId: number, params: Record<string, unknown> = {}) =>
    api.get(`/contests/${matchId}`, { params }),
  getById: (id?: string) => api.get(`/contests/detail/${id}`),
  join: (data: { contestId?: string; teamId: number }) =>
    api.post("/contests/join", data),
  getLeaderboard: (id: number | string) =>
    api.get(`/contests/${id}/leaderboard`),
  getMyContests: () => api.get("/contests/my-contests"),
};
