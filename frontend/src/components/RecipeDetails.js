import {useRecipesContext} from '../hooks/useRecipesContext';
import { useAuthContext } from '../hooks/useAuthContext';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';

function RecipeDetails({recipe}) {
    const {dispatch} = useRecipesContext();
    const {user} = useAuthContext();

    const handleClick = async() => {
        if (!user) {
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe._id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        const json = await response.json();

        if (response.ok) {
            dispatch({type: 'DELETE_RECIPES', payload: json})
        }
    }

    return(
        <div className="recipe-details">
            <h4>{recipe.title}</h4>
            <p><strong>Load (kg):</strong>{recipe.load}</p>
            <p><strong>Reps:</strong>{recipe.reps}</p>
            <p>{formatDistanceToNow(new Date(recipe.createdAt), {addSuffix: true})}</p>
            <span className='material-symbols-outlined' onClick={handleClick}>delete</span>
        </div>
    )
}

export default RecipeDetails;