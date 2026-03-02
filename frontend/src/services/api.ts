import type { NutrientInfo, FoodSearchResponse } from '../types/nutrient';
import type { RecipeSearchResponse } from '../types/recipe';

const API_BASE = '/api';

export async function fetchNutrients(): Promise<NutrientInfo[]> {
  const res = await fetch(`${API_BASE}/nutrients`);
  if (!res.ok) throw new Error('栄養素一覧の取得に失敗しました');
  const data = await res.json();
  return data.nutrients;
}

export async function searchFoodsByNutrient(
  nutrient: string,
  limit = 20,
  offset = 0,
): Promise<FoodSearchResponse> {
  const params = new URLSearchParams({
    nutrient,
    limit: String(limit),
    offset: String(offset),
  });
  const res = await fetch(`${API_BASE}/foods/search?${params}`);
  if (!res.ok) throw new Error('食材検索に失敗しました');
  return res.json();
}

export async function searchRecipes(ingredient: string): Promise<RecipeSearchResponse> {
  const params = new URLSearchParams({ ingredient });
  const res = await fetch(`${API_BASE}/recipes/search?${params}`);
  if (!res.ok) throw new Error('レシピ検索に失敗しました');
  return res.json();
}
