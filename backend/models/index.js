import sequelize from "../config/database.js";
import User from "./user.js";
import Food from "./food.js";
import Ingredient from "./ingredient.js";
import Category from "./category.js";
import Comment from "./comment.js";
import Rating from "./rating.js";
import Favorite from "./favorite.js";
import IngredientType from "./ingredientType.js";

// ---------------------------
// Food ↔ Ingredient
// ---------------------------
Food.belongsToMany(Ingredient, {
  through: "food_ingredients",
  foreignKey: "food_id",
  as: "ingredients", // important for include
  timestamps: false,
});
Ingredient.belongsToMany(Food, {
  through: "food_ingredients",
  foreignKey: "ingredient_id",
  as: "foods", // important for include
  timestamps: false,
});

// ---------------------------
// Ingredient ↔ IngredientType
// ---------------------------
Ingredient.belongsTo(IngredientType, {
  foreignKey: "type_id",
  as: "type",
});
IngredientType.hasMany(Ingredient, {
  foreignKey: "type_id",
  as: "ingredients",
});

// ---------------------------
// Food ↔ Category
// ---------------------------
Food.belongsToMany(Category, {
  through: "food_categories",
  foreignKey: "food_id",
  as: "categories", // important for include
  timestamps: false,
});
Category.belongsToMany(Food, {
  through: "food_categories",
  foreignKey: "category_id",
  as: "foods", // important for include
  timestamps: false,
});

// ---------------------------
// Favorites: User ↔ Food
// ---------------------------
User.belongsToMany(Food, {
  through: Favorite,
  foreignKey: "user_id",
  as: "FavoriteFoods", // user.getFavoriteFoods()
});
Food.belongsToMany(User, {
  through: Favorite,
  foreignKey: "food_id",
  as: "UsersWhoFavorited", // optional: food.getUsersWhoFavorited()
});

// ---------------------------
// Comments (self-reference & associations)
// ---------------------------
Comment.belongsTo(Comment, { as: "parent", foreignKey: "parent_id" });
Comment.hasMany(Comment, { as: "replies", foreignKey: "parent_id" });

User.hasMany(Comment, { foreignKey: "user_id", as: "comments" });
Comment.belongsTo(User, { foreignKey: "user_id", as: "user" });

Food.hasMany(Comment, { foreignKey: "food_id", as: "comments" });
Comment.belongsTo(Food, { foreignKey: "food_id", as: "food" });

// ---------------------------
// Ratings
// ---------------------------
User.hasMany(Rating, { foreignKey: "user_id", as: "ratings" });
Food.hasMany(Rating, { foreignKey: "food_id", as: "ratings" });
Rating.belongsTo(User, { foreignKey: "user_id", as: "user" });
Rating.belongsTo(Food, { foreignKey: "food_id", as: "food" });

// ---------------------------
// Export
// ---------------------------
export {
  sequelize,
  User,
  Food,
  Ingredient,
  Category,
  Comment,
  Rating,
  Favorite,
  IngredientType,
};
