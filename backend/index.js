import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import { DataTypes } from "sequelize";
import "./config/firebase.js"; // Initialize Firebase Admin
import sequelize from "./config/database.js";
import "./models/index.js";
import "dotenv/config";

// Polyfill __dirname and __filename for ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import foodRoutes from "./routes/food.routes.js";
import ingredientRoutes from "./routes/ingredient.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import ingredientTypeRoutes from "./routes/ingredientType.routes.js";
import usersRoutes from "./routes/user.routes.js";
import bugReportRoutes from "./routes/bugReport.routes.js";

const app = express();

// ENVIRONMENT VALIDATION
const requiredEnvs = [
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

// MIDDLEWARE
const corsOrigins = (process.env.CORS_ORIGINS || "https://mhobfinder-frontend.onrender.com")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// CORS
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// JSON parser
app.use(express.json({ limit: "200kb" }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ROUTES
// Serve static files from frontend/dist
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
        app.use(express.static(frontendDistPath));

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/foods", foodRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/ingredient-types", ingredientTypeRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/bug-reports", bugReportRoutes);

// Serve index.html for any non-API GET request (for SPA routing)
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.status || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode >= 500
      ? "Internal server error"
      : err.message || "Internal server error";

  res.status(statusCode).json({ error: message });
});

// START SERVER
const PORT = process.env.PORT || 5000;

async function ensureUserProfileColumns() {
  const queryInterface = sequelize.getQueryInterface();
  const usersTable = await queryInterface.describeTable("users");

  if (!usersTable.is_oauth) {
    await queryInterface.addColumn("users", "is_oauth", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    console.log("✅ Added users.is_oauth column");
  }

  if (!usersTable.image_url) {
    await queryInterface.addColumn("users", "image_url", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    console.log("✅ Added users.image_url column");
  }

  if (!usersTable.image_public_id) {
    await queryInterface.addColumn("users", "image_public_id", {
      type: DataTypes.STRING,
      allowNull: true,
    });
    console.log("✅ Added users.image_public_id column");
  }
}

async function ensureBugReportColumns() {
  const queryInterface = sequelize.getQueryInterface();
  const tableDefinition = await queryInterface.describeTable("bug_reports");

  if (!tableDefinition.reason_code) {
    await queryInterface.addColumn("bug_reports", "reason_code", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "other",
    });
    console.log("✅ Added bug_reports.reason_code column");
  }
}


async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await ensureUserProfileColumns();
    await ensureBugReportColumns();

    await sequelize.sync();
    console.log("✅ Tables synced successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on https://mhobfinder-backend.onrender.com:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
}

startServer();
