import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Ingredient = sequelize.define(
  "Ingredient",
  {
    ingredient_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    type_id: {
      // foreign key to ingredient_types
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: "ingredients", timestamps: false },
);

export default Ingredient;
