const dummyFoods = [
  { 
    food_id: 1, 
    title: "Fish Amok (អាម៉ុកត្រី)", 
    image_url: "https://grantourismotravels.com/wp-content/uploads/2017/05/Authentic-Fish-Amok-Recipe-Steamed-Fish-Curry-Cambodia-Copyright-2022-Terence-Carter-Grantourismo-T.jpg", 
    time: "45 mins", category: "Traditional", difficulty: "Medium",
    matched: "Kroeung, Coconut Milk", ingredients: [2, 3, 4] 
  },
  { 
    food_id: 2, 
    title: "Beef Lok Lak (ឡុកឡាក់សាច់គោ)", 
    image_url: "https://spicygelato.kitchen/wp-content/uploads/2022/03/BeefLokLak-scaled.jpg", 
    time: "20 mins", category: "Fast Food", difficulty: "Easy",
    matched: "Beef, Kampot Pepper", ingredients: [6, 10]
  }
];

export const getAllFoods = async (req, res) => res.json(dummyFoods); //

export const getMatchedFoods = async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || ingredients.length === 0) return res.json(dummyFoods); //
  
  const filtered = dummyFoods.filter(food => 
    food.ingredients.some(id => ingredients.includes(id))
  );
  res.json(filtered); //
};