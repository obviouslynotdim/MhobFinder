import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BugReport = sequelize.define(
  "BugReport",
  {
    report_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason_code: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "other",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open",
    },
    admin_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    handled_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    handled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "bug_reports",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
);

export default BugReport;