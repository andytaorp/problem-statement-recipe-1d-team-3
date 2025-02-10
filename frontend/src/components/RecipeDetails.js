import { useRecipesContext } from '../hooks/useRecipesContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const RecipeDetails = ({ recipe }) => {
  const { dispatch } = useRecipesContext()
  const { user } = useAuthContext()

  const handleClick = async () => {
    if (!user) {
      return
    }

    const response = await fetch('/api/recipes/' + recipe._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_RECIPE', payload: json})
    }
  }

  return (
    <div className="workout-details">
      <h4>{recipe.title}</h4>
      <p><strong>Load (kg): </strong>{recipe.load}</p>
      <p><strong>Reps: </strong>{recipe.reps}</p>
      <p>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</p>
      <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
    </div>
  )
}

export default RecipeDetails