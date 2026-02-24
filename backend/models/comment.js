import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comment = sequelize.define(
  "Comment",
  {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    parent_id: { type: DataTypes.INTEGER, allowNull: true },
    user_id: { type: DataTypes.INTEGER },
    food_id: { type: DataTypes.INTEGER },
    comment_text: { type: DataTypes.TEXT },
  },
  {
    tableName: "comments",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
);

export default Comment;
