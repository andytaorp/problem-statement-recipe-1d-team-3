import { useState } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext";
import { useAuthContext } from "../hooks/useAuthContext";

function RecipeForm() {
  const { dispatch } = useRecipesContext();
  const { user } = useAuthContext();

  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in!");
      return;
    }

    if (!name || !ingredients || !instructions || !prepTime || !difficulty) {
      setError("Please fill in all fields.");
      return;
    }

    const recipe = {
      name,
      ingredients: ingredients.split(",").map((item) => item.trim()),
      instructions,
      prepTime: Number(prepTime),
      difficulty: difficulty.toLowerCase(),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
        method: "POST",
        body: JSON.stringify(recipe),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (!response.ok) {
        setError(json.error || "An error occurred. Please try again.");
        setEmptyFields(json.emptyFields || []);
        return;
      }

      // Reset form fields
      setName("");
      setIngredients("");
      setInstructions("");
      setPrepTime("");
      setDifficulty("");
      setError(null);
      setEmptyFields([]);

      dispatch({ type: "CREATE_RECIPE", payload: json });
    } catch (error) {
      setError("Failed to submit. Please try again later.");
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Recipe</h3>

      <label>Recipe Name:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        className={emptyFields.includes("name") ? "error" : ""}
      />

      <label>Ingredients (comma-separated):</label>
      <textarea
        onChange={(e) => setIngredients(e.target.value)}
        value={ingredients}
        className={emptyFields.includes("ingredients") ? "error" : ""}
      />

      <label>Instructions:</label>
      <textarea
        onChange={(e) => setInstructions(e.target.value)}
        value={instructions}
        className={emptyFields.includes("instructions") ? "error" : ""}
      />

      <label>Prep Time (in minutes):</label>
      <input
        type="number"
        onChange={(e) => setPrepTime(e.target.value)}
        value={prepTime}
        className={emptyFields.includes("prepTime") ? "error" : ""}
      />

      <label>Difficulty Level:</label>
      <select
        onChange={(e) => setDifficulty(e.target.value)}
        value={difficulty}
        className={emptyFields.includes("difficulty") ? "error" : ""}
      >
        <option value="">Select Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <button>Add Recipe</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default RecipeForm;
