import api from "./api";

export const matchService = {
  getAll: (params) => api.get("/matches", { params }),
  getById: (id) => api.get(`/matches/${id}`),
  getPlayers: (id) => api.get(`/matches/${id}/players`),
  getLiveScore: (id) => api.get(`/matches/${id}/live-score`),
};
