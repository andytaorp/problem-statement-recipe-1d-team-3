import { RecipesContext } from '../context/RecipeContext'
import { useContext } from 'react'

export const useRecipesContext = () => {
  const context = useContext(RecipesContext)

  if (!context) {
    throw Error('useWorkoutsContext must be used inside an WorkoutsContextProvider')
  }

  return context
}