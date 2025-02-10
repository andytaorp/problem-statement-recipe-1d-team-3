import { useState } from 'react';
import { useRecipesContext } from '../hooks/useRecipesContext';
import { useAuthContext } from '../hooks/useAuthContext';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const RecipeDetails = ({ recipe }) => {
  const { dispatch } = useRecipesContext();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedRecipe, setUpdatedRecipe] = useState({
    name: recipe.name,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    prepTime: recipe.prepTime,
    difficulty: recipe.difficulty,
  });

  console.log("Rendering RecipeDetails for", recipe.name);

  const handleUpdate = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      dispatch({ type: "UPDATE_RECIPE", payload: json });
      setUpdatedRecipe(json);
      setIsEditing(false);

      window.location.reload();
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      let json;
      try {
        json = await response.json();
      } catch (error) {
        console.error("Failed to parse JSON response:", error);
        return;
      }

      if (response.ok) {
        dispatch({ type: 'DELETE_RECIPE', payload: { _id: recipe._id } });
      } else {
        console.error("Failed to delete:", json.error);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({ isFavorite: !recipe.isFavorite }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      dispatch({ type: "TOGGLE_FAVORITE", payload: json });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="recipe-card">
      {isEditing ? (
        <div className="recipe-content">
          <p><strong>Name</strong></p>
          <input
            type="text"
            value={updatedRecipe.name}
            onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, name: e.target.value })}
          />

          <p><strong>Ingredients</strong></p>
          <input
            type="text"
            value={updatedRecipe.ingredients}
            onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, ingredients: e.target.value })}
          />

          <p><strong>Cooking Instructions</strong></p>
          <textarea
            value={updatedRecipe.instructions}
            onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, instructions: e.target.value })}
          />

          <p><strong>Preparation Time (Mins)</strong></p>
          <input
            type="number"
            value={updatedRecipe.prepTime}
            onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, prepTime: e.target.value })}
          />

          <p><strong>Difficulty Level</strong></p>
          <select
            value={updatedRecipe.difficulty}
            onChange={(e) => setUpdatedRecipe({ ...updatedRecipe, difficulty: e.target.value })}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
            <button onClick={handleUpdate}>Save</button>
          </div>
        </div>
      ) : (
        <div className="recipe-content">
          <h4>{recipe.name}</h4>
          <p><strong>Ingredients:</strong></p>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>

          <p><strong>Cooking Instructions: </strong>{recipe.instructions}</p>
          <p><strong>Preparation Time: </strong>{recipe.prepTime}</p>
          <p><strong>Difficulty Level: </strong>{recipe.difficulty}</p>
          <p>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</p>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleToggleFavorite}>
              {recipe.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
