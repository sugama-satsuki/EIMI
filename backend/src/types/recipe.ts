export interface RakutenCategory {
  categoryId: string;
  categoryName: string;
  categoryUrl: string;
  parentCategoryId?: string;
}

export interface RakutenRecipe {
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
  recipes: RakutenRecipe[];
}
