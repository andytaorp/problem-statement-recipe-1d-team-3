import { createContext, useReducer } from "react";

export const RecipesContext = createContext();

export const recipesReducer = (state, action) => {
    switch(action.type) {
        case 'SET_RECIPES':
            return {
                recipes: action.payload
            }
        case 'CREATE_RECIPES':
            return {
                recipes: [action.payload, ...state.recipes]
            }
        case 'DELETE_RECIPES':
            return {
                recipes: state.recipes.filter((recipe) => recipe._id !== action.payload._id)
            }
        default:
            return state
    }
}

export function RecipesContextProvider({children}) {
    const [state, dispatch] = useReducer(recipesReducer, {
        recipes: null
    });

    return(
        <RecipesContext.Provider value={{...state, dispatch}}>
            {children}
        </RecipesContext.Provider>
    )
}