// import express from "express";
// import cors from "cors";

// const app = express();
// app.use(cors());
// app.use(express.json());

// const ingredients = [
//   { ingredient_id: 1, name: "Eggs", color: "yellow" },
//   { ingredient_id: 2, name: "Bell Paper", color: "red" },
//   { ingredient_id: 3, name: "Pork", color: "orange" },
//   { ingredient_id: 4, name: "Carrots", color: "orange" },
//   { ingredient_id: 5, name: "Broccoli", color: "green" },
//   { ingredient_id: 6, name: "Mushroom", color: "yellow" }
// ];

// const foods = [
//   {
//     food_id: 1,
//     title: "Deviled Eggs, Purgatory Edition",
//     image_url: "https://www.supercook.com/images/recipes/Large/1000/deviled-eggs.jpg",
//     time: "10 mins", category: "Vegan", difficulty: "Easy",
//     matched: "Eggs, Mayonnaise, Mustard", ingredients: [1]
//   },
//   {
//     food_id: 2,
//     title: "Khmer Stir-fry Pork",
//     image_url: "https://grantourismotravels.com/wp-content/uploads/2021/01/Pork-Stir-Fry-with-Holy-Basil-Recipe-Pad-Kra-Pao-Copyright-2021-Terence-Carter-Grantourismo-f.jpg",
//     time: "15 mins", category: "Traditional", difficulty: "Medium",
//     matched: "Pork, Bell Paper, Garlic", ingredients: [2, 3]
//   }
// ];

// app.get("/api/ingredients", (req, res) => res.json(ingredients));
// app.get("/api/foods", (req, res) => res.json(foods));
// app.post("/api/foods/match", (req, res) => {
//   const { ingredients: selectedIds } = req.body;
//   if (!selectedIds || selectedIds.length === 0) return res.json(foods);
//   const filtered = foods.filter(f => f.ingredients.some(id => selectedIds.includes(id)));
//   res.json(filtered);
// });

// const PORT = 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


