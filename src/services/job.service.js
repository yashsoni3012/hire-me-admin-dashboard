
// import api from './api'

// // ─── Job service (default export) ──────────────────────────────
// const jobService = {
//   getAll: (params) => api.get('/jobs', { params }),
//   getById: (id) => api.get(`/jobs/${id}`),
//   create: (data) => api.post('/jobs', data),
//   update: (id, data) => {
//     return api.put(`/jobs/${id}`, data).catch(err => {
//       if (err.response?.status === 404 || err.response?.status === 405) {
//         return api.patch(`/jobs/${id}`, data)
//       }
//       throw err
//     })
//   },
//   delete: (id) => api.delete(`/jobs/${id}`),
//   deleteJobBenefits: (jobId) => api.delete(`/jobs/${jobId}/benefits`),
//   deleteWithRelations: async (id) => {
//     try {
//       await api.delete(`/jobs/${id}/benefits`);
//     } catch (e) {
//       // Ignore if no benefits
//     }
//     return api.delete(`/jobs/${id}`);
//   },
// }

// // ─── Additional services (named exports) ──────────────────────
// const companyService = {
//   getAll: () => api.get('/companies'),
//   getById: (id) => api.get(`/companies/${id}`),
//   // ─── NEW: Get companies with active subscription ──────────────
//   getActiveWithSubscription: () => api.get('/companies/active-with-subscription'),
// }

// const jobTypeService = {
//   getAll: () => api.get('/job-types'),
//   getById: (id) => api.get(`/job-types/${id}`),
// }

// const workplaceTypeService = {
//   getAll: () => api.get('/workplace-types'),
//   getById: (id) => api.get(`/workplace-types/${id}`),
// }

// const functionRoleService = {
//   getAll: () => api.get('/function-roles'),
//   getById: (id) => api.get(`/function-roles/${id}`),
// }

// // Export default for jobService, and named for the rest
// export default jobService
// export {
//   companyService,
//   jobTypeService,
//   workplaceTypeService,
//   functionRoleService,
// }



import api from './api'

// ─── Job service (default export) ──────────────────────────────
const jobService = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => {
    return api.put(`/jobs/${id}`, data).catch(err => {
      if (err.response?.status === 404 || err.response?.status === 405) {
        return api.patch(`/jobs/${id}`, data)
      }
      throw err
    })
  },
  delete: (id) => api.delete(`/jobs/${id}`),
  deleteJobBenefits: (jobId) => api.delete(`/jobs/${jobId}/benefits`),
  deleteWithRelations: async (id) => {
    try {
      await api.delete(`/jobs/${id}/benefits`);
    } catch (e) {
      // Ignore if no benefits
    }
    return api.delete(`/jobs/${id}`);
  },
}

// ─── Additional services (named exports) ──────────────────────
const companyService = {
  getAll: () => api.get('/companies'),
  getById: (id) => api.get(`/companies/${id}`),
  // ─── NEW: Get companies with active subscription ──────────────
  getActiveWithSubscription: () => api.get('/companies/active-with-subscription'),
}

const jobTypeService = {
  getAll: () => api.get('/job-types'),
  getById: (id) => api.get(`/job-types/${id}`),
}

const workplaceTypeService = {
  getAll: () => api.get('/workplace-types'),
  getById: (id) => api.get(`/workplace-types/${id}`),
}

const functionRoleService = {
  getAll: () => api.get('/function-roles'),
  getById: (id) => api.get(`/function-roles/${id}`),
}

// Export default for jobService, and named for the rest
export default jobService
export {
  companyService,
  jobTypeService,
  workplaceTypeService,
  functionRoleService,
}