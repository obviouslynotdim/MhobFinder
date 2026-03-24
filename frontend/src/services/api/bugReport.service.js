import apiClient from "./client.js";

const BUG_REPORTS_CACHE_TTL_MS = 60 * 1000;
const bugReportsCache = new Map();

const toStatusCacheKey = (status = "all") => String(status || "all");

export const invalidateBugReportsCache = (status) => {
  if (status == null) {
    bugReportsCache.clear();
    return;
  }
  bugReportsCache.delete(toStatusCacheKey(status));
};

export const createBugReport = async (payload) => {
  const response = await apiClient.post("/bug-reports", payload);
  return response.data;
};

export const getBugReports = async (status = "all", options = {}) => {
  const { forceRefresh = false } = options;
  const key = toStatusCacheKey(status);

  if (!forceRefresh && bugReportsCache.has(key)) {
    const cached = bugReportsCache.get(key);
    const isFresh = Date.now() - cached.timestamp < BUG_REPORTS_CACHE_TTL_MS;
    if (isFresh) {
      return cached.data;
    }
  }

  const response = await apiClient.get("/bug-reports", {
    params: { status },
  });
  const data = Array.isArray(response.data) ? response.data : [];

  bugReportsCache.set(key, {
    data,
    timestamp: Date.now(),
  });

  return data;
};

export const updateBugReportStatus = async (reportId, payload) => {
  const response = await apiClient.patch(`/bug-reports/${reportId}`, payload);
  invalidateBugReportsCache();
  return response.data;
};

export const deleteBugReport = async (reportId) => {
  const response = await apiClient.delete(`/bug-reports/${reportId}`);
  invalidateBugReportsCache();
  return response.data;
};