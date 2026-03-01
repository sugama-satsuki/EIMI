import type { RecipeItem } from '../../types/recipe';

interface RecipeCardProps {
  recipe: RecipeItem;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div
      data-testid="recipe-card"
      className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <img
        src={recipe.foodImageUrl}
        alt={recipe.recipeTitle}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{recipe.recipeTitle}</h3>
        <p className="text-gray-600 text-sm mb-2">{recipe.recipeDescription}</p>
        <div className="text-sm text-gray-500 mb-2">
          <span>調理時間: {recipe.recipeIndication}</span>
          <span className="ml-3">費用: {recipe.recipeCost}</span>
        </div>
        <div className="mb-3">
          <h4 className="text-sm font-semibold mb-1">材料:</h4>
          <ul className="text-sm text-gray-600">
            {recipe.recipeMaterial.map((material) => (
              <li key={material}>{material}</li>
            ))}
          </ul>
        </div>
        <a
          href={recipe.recipeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
        >
          楽天レシピで見る
        </a>
      </div>
    </div>
  );
}
