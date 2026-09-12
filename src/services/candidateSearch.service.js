// services/candidateSearch.service.js
import api from "./api";

const candidateSearchService = {
  getAll: (params = {}) => api.get("/candidate-search-logs", params),
  getById: (id) => api.get(`/candidate-search-logs/${id}`),
  delete: (id) => api.delete(`/candidate-search-logs/${id}`),
};

export default candidateSearchService;
