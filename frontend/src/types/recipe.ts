export interface RecipeItem {
  recipeTitle: string;
  recipeUrl: string;
  foodImageUrl: string;
  recipeMaterial: string[];
  recipeIndication: string;
  recipeCost: string;
  recipeDescription: string;
}

export interface RecipeSearchResponse {
  ingredient: string;
  matchedCategories: { categoryId: string; categoryName: string }[];
  recipes: RecipeItem[];
}
