import { useState, useCallback } from 'react';
import { getNutrients, searchFoodsByNutrient } from '../services/nutrientService.ts';
import type { NutrientInfo, FoodSearchResult } from '../types/nutrient.ts';

export function useNutrientSearch() {
  const [nutrients] = useState<NutrientInfo[]>(getNutrients());
  const [selectedNutrient, setSelectedNutrient] = useState('');
  const [foods, setFoods] = useState<FoodSearchResult[]>([]);
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(() => {
    if (!selectedNutrient) return;
    setLoading(true);
    setError(null);
    try {
      const data = searchFoodsByNutrient(selectedNutrient);
      setFoods(data.foods);
      setUnit(data.nutrient.unit);
    } catch (e) {
      setError(e instanceof Error ? e.message : '食材検索に失敗しました');
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [selectedNutrient]);

  return {
    nutrients,
    selectedNutrient,
    setSelectedNutrient,
    foods,
    unit,
    loading,
    nutrientsLoading: false,
    error,
    search,
  };
}
