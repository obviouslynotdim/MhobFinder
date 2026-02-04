import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Comment = sequelize.define(
  "Comment",
  {
    comment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    parent_id: { type: DataTypes.INTEGER, allowNull: true },
    user_id: { type: DataTypes.INTEGER },
    food_id: { type: DataTypes.INTEGER },
    comment_text: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "comments",
    timestamps: false,
  }
);

export default Comment;
