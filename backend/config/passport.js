import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import "dotenv/config";
import crypto from "crypto";

// Serialize user ID
passport.serializeUser((user, done) => done(null, user.user_id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists
        let user = await User.findOne({ where: { email: profile.emails[0].value } });

        if (!user) {
          // Create a new user
          const randomPassword = crypto.randomBytes(20).toString("hex"); // random password
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: randomPassword, // stored hashed if you add bcrypt later
            is_oauth: true,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
