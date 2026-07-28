import api from "./api";

export const teamService = {
  create: (data: {
    matchId?: string;
    players: number[];
    captainId: number;
    viceCaptainId: number;
  }) => api.post("/teams/create", data),
  getMyTeams: (matchId: number | string) =>
    api.get(`/teams/my-teams/${matchId}`),
};
