// middleware/auth.js
import admin from "../config/firebase.js";
import User from "../models/user.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const normalizeEmailList = (value = "") =>
  String(value)
    .split(/[\s,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

let cachedEnvAdminEmails = null;

const readAdminEmailsFromDotenv = () => {
  if (cachedEnvAdminEmails) {
    return cachedEnvAdminEmails;
  }

  const envFilePath = path.resolve(process.cwd(), ".env");
  let fileContent = "";
  try {
    fileContent = fs.readFileSync(envFilePath, "utf8");
  } catch {
    cachedEnvAdminEmails = [];
    return cachedEnvAdminEmails;
  }

  const adminKeys = new Set([
    "ADMIN_EMAILS",
    "ADMIN_EMAIL",
    "VITE_ADMIN_EMAILS",
    "VITE_ADMIN_EMAIL",
  ]);

  const emails = [];
  for (const rawLine of fileContent.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eqIndex = line.indexOf("=");
    if (eqIndex < 0) continue;

    const key = line.slice(0, eqIndex).trim();
    if (!adminKeys.has(key)) continue;

    const value = line.slice(eqIndex + 1).trim().replace(/^['\"]|['\"]$/g, "");
    emails.push(...normalizeEmailList(value));
  }

  cachedEnvAdminEmails = Array.from(new Set(emails));
  return cachedEnvAdminEmails;
};

const isAdminEmail = (email = "") => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const envAdminEmails = normalizeEmailList(
    [
      process.env.ADMIN_EMAILS,
      process.env.ADMIN_EMAIL,
      process.env.VITE_ADMIN_EMAILS,
      process.env.VITE_ADMIN_EMAIL,
    ]
      .filter(Boolean)
      .join(","),
  );

  const fileAdminEmails = readAdminEmailsFromDotenv();
  const allAdminEmails = new Set([...envAdminEmails, ...fileAdminEmails]);
  return allAdminEmails.has(normalizedEmail);
};

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const email = (decodedToken.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(401).json({ error: 'Token does not contain email' });
    }

    // Find or create user
    let user = await User.findOne({ where: { email } });
    if (!user) {
      // User model requires password; generate a random placeholder for OAuth/Firebase users.
      const randomPassword = crypto.randomBytes(24).toString("hex");
      user = await User.create({
        name: decodedToken.name || "User",
        email,
        password: randomPassword,
        image_url: null,
        image_public_id: null,
      });
    }

    req.user = user;
    req.userIsAdmin = isAdminEmail(email);
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error.name?.includes("Sequelize")) {
      return res.status(500).json({ error: 'User sync failed', detail: error.message });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};