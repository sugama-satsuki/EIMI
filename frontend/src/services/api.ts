import type { RecipeSearchResponse } from '../types/recipe.ts';

const API_BASE = '/api';

export async function searchRecipes(ingredient: string): Promise<RecipeSearchResponse> {
  const params = new URLSearchParams({ ingredient });
  const res = await fetch(`${API_BASE}/recipes/search?${params}`);
  if (!res.ok) throw new Error('レシピ検索に失敗しました');
  return res.json();
}
