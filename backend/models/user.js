import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Comment from "./Comment.js";
import Favorite from "./Favorite.js";

const User = sequelize.define(
  "User",
  {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
);

User.hasMany(Comment, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(Favorite, { foreignKey: "user_id", onDelete: "CASCADE" });

export default User;
