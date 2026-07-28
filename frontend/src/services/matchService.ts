import api from "./api";

export const matchService = {
  getAll: (params?: Record<string, unknown>) => api.get("/matches", { params }),
  getById: (id?: string) => api.get(`/matches/${id}`),
  getPlayers: (id?: string) => api.get(`/matches/${id}/players`),
};
