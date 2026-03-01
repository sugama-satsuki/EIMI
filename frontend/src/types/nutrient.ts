export interface NutrientInfo {
  key: string;
  label: string;
  unit: string;
}

export interface FoodSearchResult {
  foodId: number;
  foodName: string;
  value: number;
  unit: string;
}

export interface FoodSearchResponse {
  nutrient: NutrientInfo;
  foods: FoodSearchResult[];
  total: number;
  limit: number;
  offset: number;
}
