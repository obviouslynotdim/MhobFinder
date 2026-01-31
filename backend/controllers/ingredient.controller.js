const dummyIngredients = [
  { ingredient_id: 1, name: "Prahok", color: "orange" },
  { ingredient_id: 2, name: "Kroeung", color: "green" },
  { ingredient_id: 3, name: "Coconut Milk", color: "blue" },
  { ingredient_id: 4, name: "Fish", color: "teal" },
  { ingredient_id: 5, name: "Pork Belly", color: "red" },
  { ingredient_id: 6, name: "Beef", color: "yellow" },
  { ingredient_id: 10, name: "Kampot Pepper", color: "gray" }
];

export const getAllIngredients = async (req, res) => {
  res.json(dummyIngredients); // returns list for sidebars
};