import api from './api';

const skillsService = {
  // Get all skills
  getAll: (params) => api.get('/skills', { params }),

  // Get skill by ID - ensure the endpoint is correct
  getById: (id) => {
    console.log(`Calling API: GET /skills/${id}`);
    return api.get(`/skills/${id}`);
  },

  // Create new skill
  create: (data) => {
    console.log('Creating skill with data:', data);
    return api.post('/skills', data);
  },

  // Update skill
  update: (id, data) => {
    console.log(`Updating skill ${id} with data:`, data);
    return api.patch(`/skills/${id}`, data);
  },

  // Delete skill
  delete: (id) => {
    console.log(`Deleting skill ${id}`);
    return api.delete(`/skills/${id}`);
  },
};

export default skillsService;