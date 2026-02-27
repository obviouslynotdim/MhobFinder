import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const IngredientType = sequelize.define(
  "IngredientType",
  {
    type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  },
  { tableName: "ingredient_types", timestamps: false },
);

export default IngredientType;
