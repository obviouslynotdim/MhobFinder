// backend/index.js
import express from "express";
import cors from "cors";
import foodRoutes from "./routes/food.routes.js";
import ingredientRoutes from "./routes/ingredient.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/ingredients", ingredientRoutes);
app.use("/api/foods", foodRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
