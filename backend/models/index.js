import sequelize from "../config/database.js";
import User from "User.js";
import Food from "Food.js";
import Ingredient from "Ingredient.js";
import Category from "Category.js";
import Comment from "Comment.js";
import Rating from "Rating.js";
import Favorite from "Favorite.js";

// Food ↔ Ingredient (many-to-many)
Food.belongsToMany(Ingredient, { through: "food_ingredients", foreignKey: "food_id" });
Ingredient.belongsToMany(Food, { through: "food_ingredients", foreignKey: "ingredient_id" });

// Food ↔ Category (many-to-many)
Food.belongsToMany(Category, { through: "food_categories", foreignKey: "food_id" });
Category.belongsToMany(Food, { through: "food_categories", foreignKey: "category_id" });

// Favorites: User ↔ Food
User.belongsToMany(Food, { through: Favorite, foreignKey: "user_id" });
Food.belongsToMany(User, { through: Favorite, foreignKey: "food_id" });

// Comments (self-reference)
Comment.belongsTo(Comment, { as: "parent", foreignKey: "parent_id" });
Comment.hasMany(Comment, { as: "replies", foreignKey: "parent_id" });

// Other relationships
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

Food.hasMany(Comment, { foreignKey: "food_id" });
Comment.belongsTo(Food, { foreignKey: "food_id" });

User.hasMany(Rating, { foreignKey: "user_id" });
Food.hasMany(Rating, { foreignKey: "food_id" });

export { sequelize, User, Food, Ingredient, Category, Comment, Rating, Favorite };
