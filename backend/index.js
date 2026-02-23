import app from "./server.js";
import sequelize from "./config/database.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    // Sync tables (development only)
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synced successfully");

    app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
})();