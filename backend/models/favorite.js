import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Favorite = sequelize.define(
  "Favorite",
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    food_id: { type: DataTypes.INTEGER, primaryKey: true },
  },
  {
    tableName: "favorites",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: false,
  }
);

export default Favorite;

