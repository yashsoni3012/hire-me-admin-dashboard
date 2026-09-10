// // import api from './api';

// // const companyService = {
// //   // Main company CRUD
// //   getAll: (params) => api.get('/companies', { params }),
// //   getById: (id) => api.get(`/companies/${id}`),
// //   create: (data) => api.post('/companies', data),
// //   update: (id, data) => api.put(`/companies/${id}`, data),
// //   delete: (id) => api.delete(`/companies/${id}`),

// //   // Related data endpoints
// //   getCompanyUsers: () => api.get('/company-users'),
// //   getCompanySizes: () => api.get('/company-sizes'),
// //   getIndustries: () => api.get('/industry'),
// // };

// // export default companyService;

// // services/company.service.js

// // services/company.service.js

// const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// // ─── Helper: Get auth token ─────────────────────────────────────
// const getAuthToken = () => {
//   return localStorage.getItem('token');
// };

// // ─── Helper: Handle API responses ──────────────────────────────
// // ─── Helper: Handle API responses ──────────────────────────────
// const handleResponse = async (response) => {
//   const responseData = await response.json().catch(() => ({}));
  
//   if (!response.ok) {
//     // Log the full error response for debugging
//     console.error('API Error Response:', {
//       status: response.status,
//       statusText: response.statusText,
//       data: responseData
//     });
    
//     // Build a more detailed error message
//     let errorMessage = responseData.message || responseData.error || `HTTP error ${response.status}`;
    
//     // Check for validation errors
//     if (responseData.errors) {
//       if (typeof responseData.errors === 'object') {
//         const errorDetails = Object.entries(responseData.errors)
//           .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
//           .join('; ');
//         errorMessage = `Validation failed: ${errorDetails}`;
//       } else {
//         errorMessage = `Validation failed: ${responseData.errors}`;
//       }
//     }
    
//     // Check for specific field errors in data property
//     if (responseData.data && typeof responseData.data === 'object') {
//       const fieldErrors = Object.entries(responseData.data)
//         .filter(([_, value]) => value && typeof value === 'string')
//         .map(([field, error]) => `${field}: ${error}`)
//         .join('; ');
//       if (fieldErrors) {
//         errorMessage = `Validation failed: ${fieldErrors}`;
//       }
//     }
    
//     throw {
//       status: response.status,
//       message: errorMessage,
//       data: responseData
//     };
//   }
//   return responseData;
// };

// // ─── Helper: Build headers ──────────────────────────────────────
// const getHeaders = (isFormData = false) => {
//   const token = getAuthToken();
//   const headers = {
//     'Accept': 'application/json',
//   };

//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   if (!isFormData) {
//     headers['Content-Type'] = 'application/json';
//   }

//   return headers;
// };

// // ─── Company Service ─────────────────────────────────────────────
// const companyService = {
//   // Get all companies
//   getAll: async (params = {}) => {
//     const queryString = new URLSearchParams(params).toString();
//     const url = `${API_BASE}/companies${queryString ? `?${queryString}` : ''}`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: getHeaders(),
//       mode: 'cors',
//       credentials: 'include',
//     });

//     return handleResponse(response);
//   },

//   // Get company by ID
//   getById: async (id) => {
//     const url = `${API_BASE}/companies/${id}`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: getHeaders(),
//       mode: 'cors',
//       credentials: 'include',
//     });

//     return handleResponse(response);
//   },

//   // Create company
//   create: async (data, config = {}) => {
//     const isFormData = data instanceof FormData;
//     const url = `${API_BASE}/companies`;

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: getHeaders(isFormData),
//       body: isFormData ? data : JSON.stringify(data),
//       mode: 'cors',
//       credentials: 'include',
//     });

//     return handleResponse(response);
//   },

//   // Update company (using PATCH)
//   update: async (id, data, config = {}) => {
//     const isFormData = data instanceof FormData;
//     const url = `${API_BASE}/companies/${id}`;

//     const response = await fetch(url, {
//       method: 'PATCH',
//       headers: getHeaders(isFormData),
//       body: isFormData ? data : JSON.stringify(data),
//       mode: 'cors',
//       credentials: 'include',
//     });

//     return handleResponse(response);
//   },

//   // Delete company
//   delete: async (id) => {
//     const url = `${API_BASE}/companies/${id}`;

//     const response = await fetch(url, {
//       method: 'DELETE',
//       headers: getHeaders(),
//       mode: 'cors',
//       credentials: 'include',
//     });

//     return handleResponse(response);
//   },

//   // Get company users
//   getCompanyUsers: async () => {
//     const url = `${API_BASE}/company-users`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: getHeaders(),
//       mode: 'cors',
//       credentials: 'include',
//     });

//     return handleResponse(response);
//   },

//   // Get company sizes
//   getCompanySizes: async () => {
//     const url = `${API_BASE}/company-sizes`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: getHeaders(),
//       mode: 'cors',
//       credentials: 'include',
//     });

//     return handleResponse(response);
//   },

//   // Get industries
//   getIndustries: async () => {
//     const url = `${API_BASE}/industry`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: getHeaders(),
//       mode: 'cors',
//       credentials: 'include',
//     });

//     return handleResponse(response);
//   },

//   // ─── UPDATED: Get users with fallback ──────────────────────────
//   getUsers: async () => {
//     try {
//       const url = `${API_BASE}/users`;
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: getHeaders(),
//         mode: 'cors',
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         // If /users doesn't exist, try to get users from company-users
//         console.warn('Users endpoint not found, trying alternative...');
//         return companyService.getCompanyUsers();
//       }

//       return handleResponse(response);
//     } catch (error) {
//       // If both fail, return empty array
//       console.warn('Could not fetch users, using empty array:', error.message);
//       return { data: [] };
//     }
//   },

//   // ─── NEW: Get company by ID with user info included ────────────
//   getCompanyWithUsers: async (id) => {
//     const url = `${API_BASE}/companies/${id}?_expand=companyUser`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: getHeaders(),
//       mode: 'cors',
//       credentials: 'include',
//     });

//     return handleResponse(response);
//   },

//   // Get companies with active subscription
//   getActiveWithSubscription: async () => {
//     const url = `${API_BASE}/companies/active-with-subscription`;

//     const response = await fetch(url, {
//       method: 'GET',
//       headers: getHeaders(),
//       mode: 'cors',
//       credentials: 'include',
//     });

//     return handleResponse(response);
//   },
// };

// export default companyService;

// import api from './api';

// const companyService = {
//   // Main company CRUD
//   getAll: (params) => api.get('/companies', { params }),
//   getById: (id) => api.get(`/companies/${id}`),
//   create: (data) => api.post('/companies', data),
//   update: (id, data) => api.put(`/companies/${id}`, data),
//   delete: (id) => api.delete(`/companies/${id}`),

//   // Related data endpoints
//   getCompanyUsers: () => api.get('/company-users'),
//   getCompanySizes: () => api.get('/company-sizes'),
//   getIndustries: () => api.get('/industry'),
// };

// export default companyService;

// services/company.service.js

// services/company.service.js

const API_BASE = import.meta.env.VITE_API_URL || "https://apidata.hiremejobs.in";

// ─── Helper: Get auth token ─────────────────────────────────────
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// ─── Helper: Handle API responses ──────────────────────────────
// ─── Helper: Handle API responses ──────────────────────────────
const handleResponse = async (response) => {
  const responseData = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    // Log the full error response for debugging
    console.error('API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });
    
    // Build a more detailed error message
    let errorMessage = responseData.message || responseData.error || `HTTP error ${response.status}`;
    
    // Check for validation errors
    if (responseData.errors) {
      if (typeof responseData.errors === 'object') {
        const errorDetails = Object.entries(responseData.errors)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('; ');
        errorMessage = `Validation failed: ${errorDetails}`;
      } else {
        errorMessage = `Validation failed: ${responseData.errors}`;
      }
    }
    
    // Check for specific field errors in data property
    if (responseData.data && typeof responseData.data === 'object') {
      const fieldErrors = Object.entries(responseData.data)
        .filter(([_, value]) => value && typeof value === 'string')
        .map(([field, error]) => `${field}: ${error}`)
        .join('; ');
      if (fieldErrors) {
        errorMessage = `Validation failed: ${fieldErrors}`;
      }
    }
    
    throw {
      status: response.status,
      message: errorMessage,
      data: responseData
    };
  }
  return responseData;
};

// ─── Helper: Build headers ──────────────────────────────────────
const getHeaders = (isFormData = false) => {
  const token = getAuthToken();
  const headers = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

// ─── Company Service ─────────────────────────────────────────────
const companyService = {
  // Get all companies
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE}/companies${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  },

  // Get company by ID
  getById: async (id) => {
    const url = `${API_BASE}/companies/${id}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  },

  // Create company
  create: async (data, config = {}) => {
    const isFormData = data instanceof FormData;
    const url = `${API_BASE}/companies`;

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  },

  // Update company (using PATCH)
  update: async (id, data, config = {}) => {
    const isFormData = data instanceof FormData;
    const url = `${API_BASE}/companies/${id}`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  },

  // Delete company
  delete: async (id) => {
    const url = `${API_BASE}/companies/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  },

  // Get company users
  getCompanyUsers: async () => {
    const url = `${API_BASE}/company-users`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  },

  // Get company sizes
  getCompanySizes: async () => {
    const url = `${API_BASE}/company-sizes`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  },

  // Get industries
  getIndustries: async () => {
    const url = `${API_BASE}/industry`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  },

  // ─── UPDATED: Get users with fallback ──────────────────────────
  getUsers: async () => {
    try {
      const url = `${API_BASE}/users`;
      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        // If /users doesn't exist, try to get users from company-users
        console.warn('Users endpoint not found, trying alternative...');
        return companyService.getCompanyUsers();
      }

      return handleResponse(response);
    } catch (error) {
      // If both fail, return empty array
      console.warn('Could not fetch users, using empty array:', error.message);
      return { data: [] };
    }
  },

  // ─── NEW: Get company by ID with user info included ────────────
  getCompanyWithUsers: async (id) => {
    const url = `${API_BASE}/companies/${id}?_expand=companyUser`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  },

  // Get companies with active subscription
  getActiveWithSubscription: async () => {
    const url = `${API_BASE}/companies/active-with-subscription`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
      credentials: 'include',
    });

    return handleResponse(response);
  },
};

export default companyService;