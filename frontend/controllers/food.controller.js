const dummyFoods = [
  { 
    food_id: 1, 
    title: "Fish Amok (អាម៉ុកត្រី)", 
    image_url: "https://grantourismotravels.com/wp-content/uploads/2017/05/Authentic-Fish-Amok-Recipe-Steamed-Fish-Curry-Cambodia-Copyright-2022-Terence-Carter-Grantourismo-T.jpg", 
    time: "45 mins", category: "Traditional", difficulty: "Medium",
    matched: "Kroeung, Coconut Milk", ingredients: [2, 3, 30, 45, 46],
    tag: ["khmer"]
  },
  { 
    food_id: 2, 
    title: "Beef Lok Lak (ឡុកឡាក់សាច់គោ)", 
    image_url: "https://spicygelato.kitchen/wp-content/uploads/2022/03/BeefLokLak-scaled.jpg", 
    time: "20 mins", category: "Fast Food", difficulty: "Easy",
    matched: "Beef, Kampot Pepper", ingredients: [21, 10, 4, 5, 40, 42],
    tag: ["khmer"]
  },

  // ✅ Added foods (using your ingredient ids only)

  {
    food_id: 3,
    title: "Kuy Teav (គុយទាវ)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/9/97/Kuy_teav.jpg",
    time: "35 mins", category: "Noodles", difficulty: "Medium",
    matched: "Garlic, Green Onion", ingredients: [40, 50, 4, 11, 12],
    tag: ["khmer"]
  },
  {
    food_id: 4,
    title: "Bai Sach Chrouk (បាយសាច់ជ្រូក)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/6/63/Bai_sach_chrouk.jpg",
    time: "25 mins", category: "Breakfast", difficulty: "Easy",
    matched: "Pork Belly, Rice", ingredients: [20, 9, 4, 7, 40],
    tag: ["khmer"]
  },
  {
    food_id: 5,
    title: "Samlor Machu Trey (សម្លម្ជូរត្រី) – Sour Fish Soup",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/02/Samlor_machu.jpg",
    time: "45 mins", category: "Soup", difficulty: "Medium",
    matched: "Fish, Tamarind Paste", ingredients: [30, 8, 64, 40, 45, 86, 11],
    tag: ["khmer"]
  },
  {
    food_id: 6,
    title: "Prahok Ktis (ប្រហុកខ្ទិះ)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/5/55/Prahok_ktis.jpg",
    time: "30 mins", category: "Dip", difficulty: "Medium",
    matched: "Prahok, Coconut Milk", ingredients: [1, 3, 20, 40, 41, 80, 12],
    tag: ["khmer"]
  },
  {
    food_id: 7,
    title: "Cha Kdam (ឆាក្តាម) – Stir-fried Crab",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/3/39/Stir_fried_crab.jpg",
    time: "25 mins", category: "Seafood", difficulty: "Easy",
    matched: "Crab, Kampot Pepper", ingredients: [32, 10, 40, 41, 6, 13, 50],
    tag: ["khmer"]
  },
  {
    food_id: 8,
    title: "Cha Kroeung Sach Moan (ឆាគ្រឿងសាច់មាន់) – Lemongrass Chicken Stir-fry",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/1/15/Grilled_chicken.jpg",
    time: "30 mins", category: "Traditional", difficulty: "Easy",
    matched: "Kroeung, Chicken", ingredients: [2, 22, 45, 40, 5, 6, 13],
    tag: ["khmer"]
  },
  {
    food_id: 9,
    title: "Lort Cha (លតឆា)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Lort_cha.jpg",
    time: "20 mins", category: "Fast Food", difficulty: "Easy",
    matched: "Soy Sauce, Eggs", ingredients: [5, 23, 40, 60, 61, 13],
    tag: ["khmer"]
  },
  {
    food_id: 10,
    title: "Plea Sach Ko (ភ្លាសាច់គោ) – Beef Lime Salad",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Beef_salad.jpg",
    time: "20 mins", category: "Salad", difficulty: "Medium",
    matched: "Beef, Lime, Mint", ingredients: [21, 86, 49, 47, 80, 4, 12],
    tag: ["khmer"]
  },
  {
    food_id: 11,
    title: "Som Tam Khmer (បុកល្ហុង) – Papaya Salad (Style)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Green_papaya_salad.jpg",
    time: "15 mins", category: "Salad", difficulty: "Easy",
    matched: "Lime, Chili, Fish Sauce", ingredients: [86, 80, 4, 12, 40],
    tag: ["khmer"]
  },
  {
    food_id: 12,
    title: "Bai Cha (បាយឆា) – Fried Rice",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/6/65/Fried_rice.jpg",
    time: "15 mins", category: "Fast Food", difficulty: "Easy",
    matched: "Rice, Eggs", ingredients: [9, 23, 40, 50, 5, 13],
    tag: ["khmer"]
  },
  {
    food_id: 13,
    title: "Cha Trai (ឆាត្រី) – Stir-fried Fish with Basil",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Stir_fried_fish.jpg",
    time: "20 mins", category: "Seafood", difficulty: "Easy",
    matched: "Fish, Thai Basil, Chili", ingredients: [30, 48, 80, 40, 6, 13],
    tag: ["khmer"]
  },
  {
    food_id: 14,
    title: "Stir-fried Tofu & Veg (ឆាតៅហ៊ូបន្លែ)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Stir-fried_tofu.jpg",
    time: "20 mins", category: "Vegetarian", difficulty: "Easy",
    matched: "Tofu, Oyster Sauce", ingredients: [24, 6, 62, 63, 40, 13],
    tag: ["khmer"]
  },
  {
    food_id: 15,
    title: "Chicken Coconut Soup (ស៊ុបមាន់ខ្ទិះដូង)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Tom_kha_gai.jpg",
    time: "40 mins", category: "Soup", difficulty: "Medium",
    matched: "Coconut Milk, Chicken, Lemongrass", ingredients: [3, 22, 45, 43, 46, 86, 11],
    tag: ["khmer"]
  },
  {
    food_id: 16,
    title: "Samlor Korko (សម្លរកកូរ) – Veg & Prahok Soup (Style)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Samlor_korkor.jpg",
    time: "60 mins", category: "Soup", difficulty: "Hard",
    matched: "Prahok, Mixed Vegetables", ingredients: [1, 60, 66, 67, 69, 40, 45, 11],
    tag: ["khmer"]
  },
  {
    food_id: 17,
    title: "Grilled Chicken (មាន់អាំង)",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/1/15/Grilled_chicken.jpg",
    time: "35 mins", category: "BBQ", difficulty: "Easy",
    matched: "Chicken, Lemongrass", ingredients: [22, 45, 40, 7, 4, 13],
    tag: ["khmer"]
  },
  {
    food_id: 18,
    title: "Shrimp Stir-fry (ឆាបង្គា) – Garlic Shrimp",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Garlic_shrimp.jpg",
    time: "15 mins", category: "Seafood", difficulty: "Easy",
    matched: "Shrimp, Garlic", ingredients: [31, 40, 6, 13, 50, 10],
    tag: ["khmer"]
  }
];

export const getAllFoods = async (req, res) => res.json(dummyFoods);

export const getMatchedFoods = async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || ingredients.length === 0) return res.json(dummyFoods);

  const filtered = dummyFoods.filter(food =>
    food.ingredients.some(id => ingredients.includes(id))
  );

  res.json(filtered);
};
