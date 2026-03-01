import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { FoodItem, NutrientInfo, FoodSearchResult } from '../types/food.js';
import { nutrientMap, isValidNutrientKey, getNutrientInfo } from '../data/nutrientMap.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let foodData: FoodItem[] = [];

export async function loadFoodData(): Promise<void> {
  const filePath = join(__dirname, '..', 'data', 'food-composition.json');
  const raw = await readFile(filePath, 'utf-8');
  foodData = JSON.parse(raw) as FoodItem[];
}

export function getNutrients(): NutrientInfo[] {
  return nutrientMap;
}

export function searchFoodsByNutrient(
  nutrientKey: string,
  limit: number,
  offset: number,
): { foods: FoodSearchResult[]; total: number } {
  if (!isValidNutrientKey(nutrientKey)) {
    throw new Error(`Invalid nutrient key: ${nutrientKey}`);
  }

  const info = getNutrientInfo(nutrientKey)!;

  const getValue = (item: FoodItem): number | null =>
    (item as unknown as Record<string, number | null>)[nutrientKey];

  const filtered = foodData.filter(
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
    foodId: item.foodId,
    foodName: item.foodName,
    value: getValue(item) as number,
    unit: info.unit,
  }));

  return { foods, total };
}
