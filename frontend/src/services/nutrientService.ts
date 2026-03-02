import foodData from '../data/food-composition.json';
import { nutrientMap, isValidNutrientKey, getNutrientInfo } from '../data/nutrientMap.ts';
import type { NutrientInfo, FoodSearchResult } from '../types/nutrient.ts';

export function getNutrients(): NutrientInfo[] {
  return nutrientMap;
}

export function searchFoodsByNutrient(
  nutrientKey: string,
  limit = 20,
  offset = 0,
): { nutrient: NutrientInfo; foods: FoodSearchResult[]; total: number; limit: number; offset: number } {
  if (!isValidNutrientKey(nutrientKey)) {
    throw new Error(`Invalid nutrient key: ${nutrientKey}`);
  }

  const info = getNutrientInfo(nutrientKey)!;

  const getValue = (item: Record<string, unknown>): number | null =>
    item[nutrientKey] as number | null;

  const filtered = (foodData as Record<string, unknown>[]).filter(
    (item) => getValue(item) != null,
  );

  const sorted = filtered.sort((a, b) => {
    const va = getValue(a) as number;
    const vb = getValue(b) as number;
    return vb - va;
  });

  const total = sorted.length;
  const paged = sorted.slice(offset, offset + limit);

  const foods: FoodSearchResult[] = paged.map((item) => ({
    foodId: item.foodId as number,
    foodName: item.foodName as string,
    value: getValue(item) as number,
    unit: info.unit,
  }));

  return { nutrient: info, foods, total, limit, offset };
}
