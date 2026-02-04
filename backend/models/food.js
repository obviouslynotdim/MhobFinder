import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Food = sequelize.define(
  "Food",
  {
    food_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT },
    image_url: { type: DataTypes.STRING(255) },
    link_url: { type: DataTypes.STRING(255) },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "foods",
    timestamps: false,
  }
);

export default Food;
