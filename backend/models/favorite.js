import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Favorite = sequelize.define(
  "Favorite",
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true },
    food_id: { type: DataTypes.INTEGER, primaryKey: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "favorites",
    timestamps: false,
  }
);

export default Favorite;
