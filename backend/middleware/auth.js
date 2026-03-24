// middleware/auth.js
import admin from "../config/firebase.js";
import User from "../models/user.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

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
    const firebaseName = String(decodedToken.name || "").trim();
    const firebaseImageUrl = String(decodedToken.picture || "").trim() || null;
    if (!email) {
      return res.status(401).json({ error: 'Token does not contain email' });
    }

    // Find or create user
    let user = await User.findOne({ where: { email } });
    if (!user) {
      // User model requires password; generate a random placeholder for OAuth/Firebase users.
      const randomPassword = crypto.randomBytes(24).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        name: firebaseName || "User",
        email,
        password: hashedPassword,
        is_oauth: true,
        image_url: firebaseImageUrl,
        image_public_id: null,
      });
    } else {
      const updates = {};

      if (firebaseName && user.is_oauth && user.name !== firebaseName) {
        updates.name = firebaseName;
      }

      if (firebaseImageUrl && user.is_oauth && !user.image_url && !user.image_public_id) {
        updates.image_url = firebaseImageUrl;
      }

      if (Object.keys(updates).length > 0) {
        await user.update(updates);
      }
    }

    req.user = user;
    req.userIsAdmin = isAdminEmail(email);
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error.name?.includes("Sequelize")) {
      return res.status(500).json({ error: 'User sync failed' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.userIsAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }

  return next();
};