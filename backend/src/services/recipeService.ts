import type {
  RakutenCategory,
  RakutenRecipe,
  RecipeSearchResponse,
} from '../types/recipe.js';
import { waitForRateLimit } from '../middleware/rateLimiter.js';

const RAKUTEN_BASE = 'https://app.rakuten.co.jp/services/api/Recipe';
const CATEGORY_LIST_URL = `${RAKUTEN_BASE}/CategoryList/20170426`;
const CATEGORY_RANKING_URL = `${RAKUTEN_BASE}/CategoryRanking/20170426`;

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CategoryCache {
  categories: RakutenCategory[];
  fetchedAt: number;
}

let categoryCache: CategoryCache | null = null;

/** Overridable fetch — tests can replace this */
export let fetchFn: typeof globalThis.fetch = globalThis.fetch;

export function setFetchFn(fn: typeof globalThis.fetch): void {
  fetchFn = fn;
}

export function resetFetchFn(): void {
  fetchFn = globalThis.fetch;
}

function getAppId(): string {
  const id = process.env.RAKUTEN_APP_ID;
  if (!id) {
    throw new Error('RAKUTEN_APP_ID environment variable is not set');
  }
  return id;
}

export async function fetchCategories(): Promise<RakutenCategory[]> {
  const now = Date.now();
  if (categoryCache && now - categoryCache.fetchedAt < CACHE_TTL_MS) {
    return categoryCache.categories;
  }

  await waitForRateLimit();

  const appId = getAppId();
  const url = `${CATEGORY_LIST_URL}?applicationId=${appId}`;
  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`Rakuten CategoryList API error: ${res.status}`);
  }
  const data = await res.json();

  // The API returns categories grouped by type (large, medium, small)
  // We flatten all into a single list
  const categories: RakutenCategory[] = [];

  interface RawCategory {
    categoryId: number | string;
    categoryName: string;
    categoryUrl: string;
    parentCategoryId?: string;
  }

  for (const cat of (data.result?.large ?? []) as RawCategory[]) {
    categories.push({
      categoryId: String(cat.categoryId),
      categoryName: cat.categoryName,
      categoryUrl: cat.categoryUrl,
    });
  }
  for (const cat of (data.result?.medium ?? []) as RawCategory[]) {
    categories.push({
      categoryId: `${cat.parentCategoryId}-${cat.categoryId}`,
      categoryName: cat.categoryName,
      categoryUrl: cat.categoryUrl,
      parentCategoryId: cat.parentCategoryId,
    });
  }
  for (const cat of (data.result?.small ?? []) as RawCategory[]) {
    categories.push({
      categoryId: String(cat.categoryId),
      categoryName: cat.categoryName,
      categoryUrl: cat.categoryUrl,
      parentCategoryId: cat.parentCategoryId,
    });
  }

  categoryCache = { categories, fetchedAt: Date.now() };
  return categories;
}

export async function fetchRanking(
  categoryId: string,
): Promise<RakutenRecipe[]> {
  await waitForRateLimit();

  const appId = getAppId();
  const url = `${CATEGORY_RANKING_URL}?applicationId=${appId}&categoryId=${categoryId}`;
  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`Rakuten CategoryRanking API error: ${res.status}`);
  }
  const data = await res.json();

  interface RawRecipe {
    recipeTitle: string;
    recipeUrl: string;
    foodImageUrl: string;
    recipeMaterial: string[];
    recipeIndication: string;
    recipeCost: string;
    recipeDescription: string;
  }

  return ((data.result ?? []) as RawRecipe[]).map((r: RawRecipe) => ({
    recipeTitle: r.recipeTitle,
    recipeUrl: r.recipeUrl,
    foodImageUrl: r.foodImageUrl,
    recipeMaterial: r.recipeMaterial,
    recipeIndication: r.recipeIndication,
    recipeCost: r.recipeCost,
    recipeDescription: r.recipeDescription,
  }));
}

export async function searchRecipes(
  ingredient: string,
): Promise<RecipeSearchResponse> {
  const categories = await fetchCategories();

  // Partial match on category name
  const matched = categories.filter((c) =>
    c.categoryName.includes(ingredient),
  );

  if (matched.length === 0) {
    return { ingredient, matchedCategories: [], recipes: [] };
  }

  // Fetch ranking for the first matched category to avoid excessive API calls
  const recipes = await fetchRanking(matched[0].categoryId);

  return {
    ingredient,
    matchedCategories: matched.map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
    })),
    recipes,
  };
}

/** Clear the category cache — useful for tests */
export function clearCategoryCache(): void {
  categoryCache = null;
}
