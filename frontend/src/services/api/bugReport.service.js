import apiClient from "./client.js";

export const createBugReport = async (payload) => {
  const response = await apiClient.post("/bug-reports", payload);
  return response.data;
};

export const getBugReports = async (status = "all") => {
  const response = await apiClient.get("/bug-reports", {
    params: { status },
  });
  return Array.isArray(response.data) ? response.data : [];
};

export const updateBugReportStatus = async (reportId, payload) => {
  const response = await apiClient.patch(`/bug-reports/${reportId}`, payload);
  return response.data;
};

export const deleteBugReport = async (reportId) => {
  const response = await apiClient.delete(`/bug-reports/${reportId}`);
  return response.data;
};