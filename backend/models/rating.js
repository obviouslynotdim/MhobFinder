import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Rating = sequelize.define(
  "Rating",
  {
    rating_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.INTEGER },
    food_id: { type: DataTypes.INTEGER },
    rating: { type: DataTypes.INTEGER },
  },
  {
    tableName: "ratings",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
);

export default Rating;
