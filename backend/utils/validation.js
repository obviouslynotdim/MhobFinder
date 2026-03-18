export const parsePositiveInt = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

export const parseIdArray = (data) => {
  if (!data) return [];

  const values = Array.isArray(data) ? data : String(data).split(",");
  const unique = new Set();

  for (const value of values) {
    const parsed = parsePositiveInt(value);
    if (parsed !== null) {
      unique.add(parsed);
    }
  }

  return Array.from(unique);
};

export const cleanText = (value, maxLength) => {
  const normalized = String(value ?? "").trim();

  if (!normalized) return null;
  if (typeof maxLength === "number" && normalized.length > maxLength) {
    return null;
  }

  return normalized;
};

export const normalizeEmail = (value) => {
  const email = String(value ?? "").trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? email : null;
};