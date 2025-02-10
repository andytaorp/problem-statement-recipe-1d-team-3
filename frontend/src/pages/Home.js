import { useEffect, useState } from 'react'
import { useRecipesContext } from '../hooks/useRecipesContext'
import { useAuthContext } from "../hooks/useAuthContext"

// components
import RecipeForm from '../components/RecipeForm'
import RecipeDetails from '../components/RecipeDetails'

const Home = () => {
  const { recipes, dispatch } = useRecipesContext()
  const { user } = useAuthContext()
  const [filter, setFilter] = useState(null) // Difficulty filter state
  const [searchQuery, setSearchQuery] = useState('') // Search query state

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_RECIPES', payload: json })
      }
    }

    if (user) {
      fetchRecipes()
    }
  }, [dispatch, user])

  // Function to filter recipes by difficulty, favorites, and name
  const filteredRecipes = () => {
    if (!recipes) return []

    let filtered = recipes

    // Filter by difficulty
    if (filter && filter !== 'favorites') {
      filtered = filtered.filter(recipe => recipe.difficulty.toLowerCase() === filter)
    }

    // Filter by favorites
    if (filter === 'favorites') {
      filtered = filtered.filter(recipe => recipe.isFavorite)
    }

    // Filter by name (search query)
    if (searchQuery) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  return (
    <div className="home">
      <div className="filters-search-container">
        <div className="filters">
          <button
            onClick={() => setFilter('easy')}
            className={filter === 'easy' ? 'active' : ''}
          >
            Show Easy
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={filter === 'medium' ? 'active' : ''}
          >
            Show Medium
          </button>
          <button
            onClick={() => setFilter('hard')}
            className={filter === 'hard' ? 'active' : ''}
          >
            Show Hard
          </button>
          <button
            onClick={() => setFilter(null)}
            className={filter === null ? 'active' : ''}
          >
            Show All
          </button>
          <button
            onClick={() => setFilter('favorites')}
            className={filter === 'favorites' ? 'active' : ''}
          >
            Show Favorites
          </button>
        </div>

        <div className="search">
          <input
            type="text"
            placeholder="Search by recipe name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <br />

      <div className="recipes">
        {filteredRecipes().map((recipe) => (
          <RecipeDetails key={recipe._id} recipe={recipe} />
        ))}
      </div>

      <RecipeForm />
    </div>
  )
}

export default Home
