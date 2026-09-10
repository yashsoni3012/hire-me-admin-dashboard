// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // On mount, check localStorage for saved auth data
//   useEffect(() => {
//     const storedToken = localStorage.getItem('token');
//     const storedUser = localStorage.getItem('user');
//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));
//       // Optionally set axios default header
//       axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
//     }
//   }, []);

//   // Login function
//   const login = async (credentials) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.post(
//         'https://apidata.hiremejobs.in/user/login',
//         credentials
//       );
//       const { success, message, token, user } = response.data;

//       if (!success) {
//         throw new Error(message || 'Login failed');
//       }

//       // Save to state
//       setToken(token);
//       setUser(user);

//       // Persist to localStorage
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));

//       // Set axios default header for future requests
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//       return { success: true, user };
//     } catch (err) {
//       const errorMsg =
//         err.response?.data?.message || err.message || 'An error occurred';
//       setError(errorMsg);
//       return { success: false, error: errorMsg };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout function
//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     delete axios.defaults.headers.common['Authorization'];
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     error,
//     login,
//     logout,
//     isAuthenticated: !!token && !!user,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Start with true
  const [error, setError] = useState(null);

  // On mount, check localStorage for saved auth data
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false); // Restore complete
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        'https://apidata.hiremejobs.in/user/login',
        credentials
      );
      const { success, message, token, user } = response.data;

      if (!success) {
        throw new Error(message || 'Login failed');
      }

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, user };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};