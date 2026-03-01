import type { RecipeItem } from '../../types/recipe';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: RecipeItem[];
}

export function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) return null;

  return (
    <div
      data-testid="recipe-list"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.recipeUrl} recipe={recipe} />
      ))}
    </div>
  );
}
