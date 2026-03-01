import { useState, useEffect, useCallback } from 'react';
import { searchRecipes } from '../services/api';
import type { RecipeItem } from '../types/recipe';

export function useRecipeSearch(initialIngredient: string) {
  const [ingredient, setIngredient] = useState(initialIngredient);
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchRecipes(query);
      setRecipes(data.recipes);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialIngredient) {
      search(initialIngredient);
    }
  }, [initialIngredient, search]);

  return { ingredient, setIngredient, recipes, loading, error, search };
}
