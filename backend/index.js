const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/api/recipes', (req, res) => {
  res.json([
    { id: 1, name: 'Egg' },
    { id: 2, name: 'Tomato' },
    { id: 3, name: 'Garlic' },
  ]);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
