import apiClient from "./client.js";

const USERS_CACHE_TTL_MS = 60 * 1000;
const usersCache = {
  data: null,
  timestamp: 0,
};

export const invalidateUsersCache = () => {
  usersCache.data = null;
  usersCache.timestamp = 0;
};

export const fetchAllUsers = async (options = {}) => {
  const { forceRefresh = false } = options;

  if (!forceRefresh && Array.isArray(usersCache.data)) {
    const isFresh = Date.now() - usersCache.timestamp < USERS_CACHE_TTL_MS;
    if (isFresh) {
      return usersCache.data;
    }
  }

  const response = await apiClient.get("/users");
  const users = Array.isArray(response.data) ? response.data : [];

  usersCache.data = users;
  usersCache.timestamp = Date.now();

  return users;
};

export const fetchUserById = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

export const fetchMyProfile = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
  invalidateUsersCache();
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post("/users/register", userData);
  invalidateUsersCache();
  return response.data;
};

export const updateMyProfile = async (payload) => {
  const response = await apiClient.patch("/users/me/profile", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
