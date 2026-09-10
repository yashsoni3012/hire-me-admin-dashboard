// src/utils/getUserName.js
import { storage } from './storage';
import api from '../services/axiosInstance';

// Cache for user data to avoid repeated API calls
let userCache = {};
let isFetching = false;
let fetchPromise = null;

/**
 * Fetch all users from the API and cache them
 * @returns {Promise<Object>} User map with id as key and user object as value
 */
export const fetchUsers = async () => {
    // If already fetching, return the existing promise
    if (isFetching && fetchPromise) {
        return fetchPromise;
    }

    // If we already have users in cache, return them
    if (Object.keys(userCache).length > 0) {
        return userCache;
    }

    isFetching = true;
    fetchPromise = (async () => {
        try {
            const response = await api.get('/user');
            const userData = response.data?.data || response.data || [];

            if (Array.isArray(userData)) {
                const userMap = {};
                userData.forEach(user => {
                    userMap[user.id] = {
                        name: user.name || user.email || `User ${user.id}`,
                        email: user.email || `User ${user.id}`,
                        id: user.id,
                        mobile: user.mobile || '',
                        image: user.image || null,
                        role_id: user.role_id || null
                    };
                });
                userCache = userMap;
                return userCache;
            }
            return {};
        } catch (error) {
            console.error('Failed to fetch users:', error);
            // Try to get current user from localStorage as fallback
            const currentUser = storage.getUser();
            if (currentUser) {
                userCache = {
                    [currentUser.id]: {
                        name: currentUser.name || currentUser.email || `User ${currentUser.id}`,
                        email: currentUser.email || `User ${currentUser.id}`,
                        id: currentUser.id
                    }
                };
                return userCache;
            }
            return {};
        } finally {
            isFetching = false;
            fetchPromise = null;
        }
    })();

    return fetchPromise;
};

/**
 * Get user name by ID
 * @param {number|string} userId - User ID
 * @param {Object} options - Options object
 * @param {boolean} options.useCache - Use cached data without fetching (default: false)
 * @param {string} options.fallback - Fallback value if user not found (default: '-')
 * @returns {string} User name or fallback value
 */
export const getUserName = async (userId, options = {}) => {
    const { useCache = false, fallback = '-' } = options;

    if (!userId) return fallback;

    // Check in cache first
    if (userCache[userId]) {
        return userCache[userId].name;
    }

    // Check if it's the current user
    const currentUser = storage.getUser();
    if (currentUser && Number(userId) === Number(currentUser.id)) {
        return currentUser.name || currentUser.email || `User ${userId}`;
    }

    // If useCache is true and user not found in cache, return fallback
    if (useCache) {
        return `User ${userId}`;
    }

    // Try to fetch users if not already fetched
    try {
        await fetchUsers();
        if (userCache[userId]) {
            return userCache[userId].name;
        }
        return `User ${userId}`;
    } catch (error) {
        console.error('Error fetching user:', error);
        return `User ${userId}`;
    }
};

/**
 * Get user email by ID
 * @param {number|string} userId - User ID
 * @param {string} fallback - Fallback value if user not found (default: '-')
 * @returns {string} User email or fallback value
 */
export const getUserEmail = async (userId, fallback = '-') => {
    if (!userId) return fallback;

    // Check in cache first
    if (userCache[userId]) {
        return userCache[userId].email;
    }

    // Check if it's the current user
    const currentUser = storage.getUser();
    if (currentUser && Number(userId) === Number(currentUser.id)) {
        return currentUser.email || `User ${userId}`;
    }

    // Try to fetch users if not already fetched
    try {
        await fetchUsers();
        if (userCache[userId]) {
            return userCache[userId].email;
        }
        return `User ${userId}`;
    } catch (error) {
        console.error('Error fetching user email:', error);
        return `User ${userId}`;
    }
};

/**
 * Get user object by ID
 * @param {number|string} userId - User ID
 * @returns {Object|null} User object or null
 */
export const getUser = async (userId) => {
    if (!userId) return null;

    // Check in cache first
    if (userCache[userId]) {
        return userCache[userId];
    }

    // Check if it's the current user
    const currentUser = storage.getUser();
    if (currentUser && Number(userId) === Number(currentUser.id)) {
        return {
            name: currentUser.name || currentUser.email || `User ${userId}`,
            email: currentUser.email || `User ${userId}`,
            id: currentUser.id
        };
    }

    // Try to fetch users if not already fetched
    try {
        await fetchUsers();
        return userCache[userId] || null;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
};

/**
 * Clear user cache (useful for logout or refresh)
 */
export const clearUserCache = () => {
    userCache = {};
    isFetching = false;
    fetchPromise = null;
};

/**
 * Get all users from cache or fetch if needed
 * @returns {Promise<Object>} User map
 */
export const getAllUsers = async () => {
    if (Object.keys(userCache).length > 0) {
        return userCache;
    }
    return await fetchUsers();
};

// For React components - Hook version
import { useState, useEffect } from 'react';

/**
 * React Hook to get user name by ID with automatic fetching
 * @param {number|string} userId - User ID
 * @param {string} fallback - Fallback value if user not found (default: '-')
 * @returns {Object} { userName, isLoading, error }
 */
export const useUserName = (userId, fallback = '-') => {
    const [userName, setUserName] = useState(fallback);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserName = async () => {
            if (!userId) {
                setUserName(fallback);
                setIsLoading(false);
                return;
            }

            try {
                const name = await getUserName(userId);
                setUserName(name || fallback);
            } catch (err) {
                setError(err);
                setUserName(fallback);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserName();
    }, [userId, fallback]);

    return { userName, isLoading, error };
};

/**
 * React Hook to get user email by ID with automatic fetching
 * @param {number|string} userId - User ID
 * @param {string} fallback - Fallback value if user not found (default: '-')
 * @returns {Object} { userEmail, isLoading, error }
 */
export const useUserEmail = (userId, fallback = '-') => {
    const [userEmail, setUserEmail] = useState(fallback);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserEmail = async () => {
            if (!userId) {
                setUserEmail(fallback);
                setIsLoading(false);
                return;
            }

            try {
                const email = await getUserEmail(userId);
                setUserEmail(email || fallback);
            } catch (err) {
                setError(err);
                setUserEmail(fallback);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserEmail();
    }, [userId, fallback]);

    return { userEmail, isLoading, error };
};

export default {
    fetchUsers,
    getUserName,
    getUserEmail,
    getUser,
    getAllUsers,
    clearUserCache,
    useUserName,
    useUserEmail
};