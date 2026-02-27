import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";
import sequelize from "./config/database.js";
import "./models/index.js";
import "dotenv/config";

// Routes
import foodRoutes from "./routes/food.routes.js";
import ingredientRoutes from "./routes/ingredient.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import ingredientTypeRoutes from "./routes/ingredientType.routes.js";

const app = express();

// ---------------------------
// ENVIRONMENT VALIDATION
// ---------------------------
const requiredEnvs = [
  "SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`);
  }
});

// ---------------------------
// MIDDLEWARE
// ---------------------------

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// JSON parser
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  }),
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ---------------------------
// ROUTES
// ---------------------------

// API routes
app.use("/api/foods", foodRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/ingredient-types", ingredientTypeRoutes);

// Google OAuth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate("google", (err, user) => {
    if (err || !user)
      return res.status(401).json({ error: "Authentication failed" });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ error: "Login failed" });
      // SPA-friendly: return user info as JSON
      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

// ---------------------------
// ERROR HANDLING
// ---------------------------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ---------------------------
// START SERVER
// ---------------------------
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Sync tables (development only)
    await sequelize.sync();
    console.log("✅ Tables synced successfully");

    app.listen(PORT, () =>
      console.log(`🚀 Backend running on http://localhost:${PORT}`),
    );
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
})();
