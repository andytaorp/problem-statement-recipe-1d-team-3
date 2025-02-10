import { useEffect }from 'react'
import { useRecipesContext } from '../hooks/useRecipesContext'
import { useAuthContext } from "../hooks/useAuthContext"

// components
import RecipeForm from '../components/RecipeForm'
import RecipeDetails from '../components/RecipeDetails'

const Home = () => {
  const {recipes, dispatch} = useRecipesContext()
  const {user} = useAuthContext()

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
        headers: {'Authorization': `Bearer ${user.token}`},
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({type: 'SET_RECIPES', payload: json})
      }
    }

    if (user) {
      fetchRecipes()
    }
  }, [dispatch, user])

  return (
    <div className="home">
      <div className="workouts">
        {recipes && recipes.map((recipe) => (
          <RecipeDetails key={recipe._id} recipe={recipe} />
        ))}
      </div>
      <RecipeForm />
    </div>
  )
}

export default Home