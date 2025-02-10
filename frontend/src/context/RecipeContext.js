import { createContext, useReducer } from 'react';

export const RecipesContext = createContext();

const recipesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RECIPES':
      return {
        recipes: action.payload,
      };
    case 'UPDATE_RECIPE':
      return {
        recipes: state.recipes.map((recipe) =>
          recipe._id === action.payload._id ? { ...recipe, ...action.payload } : recipe
        ),
      };
    case 'DELETE_RECIPE':
      return {
        recipes: state.recipes.filter((recipe) => recipe._id !== action.payload._id),
      };
    case 'TOGGLE_FAVORITE':
      return {
        recipes: state.recipes.map((recipe) =>
          recipe._id === action.payload._id
            ? { ...recipe, isFavorite: !recipe.isFavorite }
            : recipe
        ),
      };
    default:
      return state;
  }
};

export const RecipesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipesReducer, {
    recipes: [],
  });

  return (
    <RecipesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RecipesContext.Provider>
  );
};
