import api from "./api";

export const teamService = {
  create: (data) => api.post("/teams/create", data),
  getMyTeams: (matchId) => api.get(`/teams/my-teams/${matchId}`),
  edit: (id, data) => api.put(`/teams/${id}/edit`, data),
  preview: (id) => api.get(`/teams/${id}/preview`),
};
