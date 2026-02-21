import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import "./config/passport.js"; // <-- import passport config
import foodRoutes from "./routes/food.routes.js";
import ingredientRoutes from "./routes/ingredient.routes.js";
import sequelize from "./config/database.js";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/ingredients", ingredientRoutes);
app.use("/api/foods", foodRoutes);

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/dashboard",
  })
);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();