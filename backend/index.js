import express from "express";
import cors from "cors";
import foodRoutes from "./routes/food.routes.js";
import ingredientRoutes from "./routes/ingredient.routes.js";
import sequelize from "./config/database.js";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ingredients", ingredientRoutes);
app.use("/api/foods", foodRoutes);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    app.listen(PORT, () =>
      console.log(`🚀 Backend running on http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();
