import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Food = sequelize.define(
  "Food",
  {
    food_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    link_url: DataTypes.STRING,
  },
  { tableName: "foods", timestamps: false },
);

export default Food;
