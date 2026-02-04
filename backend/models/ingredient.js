import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Ingredient = sequelize.define(
  "Ingredient",
  {
    ingredient_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    tableName: "ingredients",
    timestamps: false,
  }
);

export default Ingredient;
