import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle API call
  const searchRecipes = async () => {
    // Reset states
    setError(null);
    setRecipes([]);
    
    // Validate input
    if (!query.trim()) {
      setError('Please enter a dish name to search');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      
      // Checking if the response is okay
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Checking if meals were found
      if (!data.meals) {
        setError(`No recipes found for "${query}". Try a different dish name.`);
      } else {
        setRecipes(data.meals);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to fetch recipes. Please check your connection and try again.');
    }
    
    setLoading(false);
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    searchRecipes();
  };

  return (
    <div className="App">
      <h1>Recipe Finder</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter a dish name (e.g., pizza, pasta)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <div className="status-message">Loading recipes...</div>}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <p className="suggestion">Try searching for: pasta, pizza, chicken, etc.</p>
        </div>
      )}

      <div className="recipes">
        {recipes.map((recipe) => (
          <div key={recipe.idMeal} className="recipe">
            <h2>{recipe.strMeal}</h2>
            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
            <h3>Ingredients:</h3>
            <ul>
              {Object.keys(recipe)
                .filter(key => key.startsWith('strIngredient') && recipe[key])
                .map(key => {
                  const index = key.replace('strIngredient', '');
                  return (
                    <li key={key}>
                      {recipe[key]} - {recipe[`strMeasure${index}`]}
                    </li>
                  );
                })}
            </ul>
            <h3>Instructions:</h3>
            <p>{recipe.strInstructions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;