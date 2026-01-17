import { useState, useEffect } from 'react';

function App() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('/api/recipes') // Calls Express API
      .then(res => res.json())
      .then(data => setRecipes(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>{recipe.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
