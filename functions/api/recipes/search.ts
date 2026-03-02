interface Env {
  RAKUTEN_APP_ID: string;
}

interface RakutenCategory {
  categoryId: string;
  categoryName: string;
  categoryUrl: string;
  parentCategoryId?: string;
}

interface RakutenRecipe {
  recipeTitle: string;
  recipeUrl: string;
  foodImageUrl: string;
  recipeMaterial: string[];
  recipeIndication: string;
  recipeCost: string;
  recipeDescription: string;
}

const RAKUTEN_BASE = 'https://app.rakuten.co.jp/services/api/Recipe';
const CATEGORY_LIST_URL = `${RAKUTEN_BASE}/CategoryList/20170426`;
const CATEGORY_RANKING_URL = `${RAKUTEN_BASE}/CategoryRanking/20170426`;

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CategoryCache {
  categories: RakutenCategory[];
  fetchedAt: number;
}

let categoryCache: CategoryCache | null = null;
let lastCallTime = 0;

async function waitForRateLimit(intervalMs = 1000): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < intervalMs) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs - elapsed));
  }
  lastCallTime = Date.now();
}

async function fetchCategories(appId: string): Promise<RakutenCategory[]> {
  const now = Date.now();
  if (categoryCache && now - categoryCache.fetchedAt < CACHE_TTL_MS) {
    return categoryCache.categories;
  }

  await waitForRateLimit();

  const url = `${CATEGORY_LIST_URL}?applicationId=${appId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Rakuten CategoryList API error: ${res.status}`);
  }
  const data = await res.json() as Record<string, unknown>;

  const categories: RakutenCategory[] = [];

  interface RawCategory {
    categoryId: number | string;
    categoryName: string;
    categoryUrl: string;
    parentCategoryId?: string;
  }

  const result = data.result as Record<string, RawCategory[]> | undefined;

  for (const cat of (result?.large ?? []) as RawCategory[]) {
    categories.push({
      categoryId: String(cat.categoryId),
      categoryName: cat.categoryName,
      categoryUrl: cat.categoryUrl,
    });
  }
  for (const cat of (result?.medium ?? []) as RawCategory[]) {
    categories.push({
      categoryId: `${cat.parentCategoryId}-${cat.categoryId}`,
      categoryName: cat.categoryName,
      categoryUrl: cat.categoryUrl,
      parentCategoryId: cat.parentCategoryId,
    });
  }
  for (const cat of (result?.small ?? []) as RawCategory[]) {
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

async function fetchRanking(appId: string, categoryId: string): Promise<RakutenRecipe[]> {
  await waitForRateLimit();

  const url = `${CATEGORY_RANKING_URL}?applicationId=${appId}&categoryId=${categoryId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Rakuten CategoryRanking API error: ${res.status}`);
  }
  const data = await res.json() as Record<string, unknown>;

  interface RawRecipe {
    recipeTitle: string;
    recipeUrl: string;
    foodImageUrl: string;
    recipeMaterial: string[];
    recipeIndication: string;
    recipeCost: string;
    recipeDescription: string;
  }

  return ((data.result ?? []) as RawRecipe[]).map((r) => ({
    recipeTitle: r.recipeTitle,
    recipeUrl: r.recipeUrl,
    foodImageUrl: r.foodImageUrl,
    recipeMaterial: r.recipeMaterial,
    recipeIndication: r.recipeIndication,
    recipeCost: r.recipeCost,
    recipeDescription: r.recipeDescription,
  }));
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const ingredient = url.searchParams.get('ingredient');

  if (!ingredient) {
    return new Response(
      JSON.stringify({ error: 'ingredient parameter is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  try {
    const appId = context.env.RAKUTEN_APP_ID;
    if (!appId) {
      throw new Error('RAKUTEN_APP_ID environment variable is not set');
    }

    const categories = await fetchCategories(appId);
    const matched = categories.filter((c) => c.categoryName.includes(ingredient));

    if (matched.length === 0) {
      return new Response(
        JSON.stringify({ ingredient, matchedCategories: [], recipes: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const recipes = await fetchRanking(appId, matched[0].categoryId);

    return new Response(
      JSON.stringify({
        ingredient,
        matchedCategories: matched.map((c) => ({
          categoryId: c.categoryId,
          categoryName: c.categoryName,
        })),
        recipes,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
