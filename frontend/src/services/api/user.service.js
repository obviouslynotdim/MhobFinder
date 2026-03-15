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

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post("/users/register", userData);
  return response.data;
};
