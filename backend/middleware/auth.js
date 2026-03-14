// middleware/auth.js
import admin from "../config/firebase.js";
import User from "../models/User.js";
import crypto from "crypto";

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
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error.name?.includes("Sequelize")) {
      return res.status(500).json({ error: 'User sync failed', detail: error.message });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};