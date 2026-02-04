import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Rating = sequelize.define(
  "Rating",
  {
    rating_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER },
    food_id: { type: DataTypes.INTEGER },
    rating: { type: DataTypes.INTEGER },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "ratings",
    timestamps: false,
  }
);

export default Rating;
