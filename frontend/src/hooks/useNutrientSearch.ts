import { useState, useEffect, useCallback } from 'react';
import { fetchNutrients, searchFoodsByNutrient } from '../services/api';
import type { NutrientInfo, FoodSearchResult } from '../types/nutrient';

export function useNutrientSearch() {
  const [nutrients, setNutrients] = useState<NutrientInfo[]>([]);
  const [selectedNutrient, setSelectedNutrient] = useState('');
  const [foods, setFoods] = useState<FoodSearchResult[]>([]);
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nutrientsLoading, setNutrientsLoading] = useState(true);

  useEffect(() => {
    fetchNutrients()
      .then((data) => {
        setNutrients(data);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : '栄養素一覧の取得に失敗しました');
      })
      .finally(() => {
        setNutrientsLoading(false);
      });
  }, []);

  const search = useCallback(async () => {
    if (!selectedNutrient) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchFoodsByNutrient(selectedNutrient);
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
    nutrientsLoading,
    error,
    search,
  };
}
