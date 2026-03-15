import apiClient from "./client.js";

export const fetchAllUsers = async () => {
  const response = await apiClient.get("/users");
  const users = Array.isArray(response.data) ? response.data : [];
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
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post("/users/register", userData);
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
