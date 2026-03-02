import type { FoodSearchResult } from '../../types/nutrient';

interface FoodResultListProps {
  foods: FoodSearchResult[];
  unit: string;
}

export function FoodResultList({ foods, unit }: FoodResultListProps) {
  if (foods.length === 0) {
    return <p className="text-gray-500 py-4">検索結果がありません。</p>;
  }

  return (
    <ul data-testid="food-result-list" className="divide-y divide-gray-200">
      {foods.map((food) => (
        <li key={food.foodId} className="py-3 flex items-center justify-between">
          <div>
            <span className="font-medium">{food.foodName}</span>
            <span className="ml-2 text-gray-600">
              {food.value} {unit}
            </span>
          </div>
          <a
            href={`/recipe-search?ingredient=${encodeURIComponent(food.foodName)}`}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            レシピを探す
          </a>
        </li>
      ))}
    </ul>
  );
}
