// middleware/auth.js
import admin from "../config/firebase.js";
import User from "../models/User.js";

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Find or create user
    let user = await User.findOne({ where: { email: decodedToken.email } });
    if (!user) {
      user = await User.create({
        name: decodedToken.name,
        email: decodedToken.email,
        is_oauth: true,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};