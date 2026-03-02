import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import type { EimiWorld } from '../support/world.js';
import {
  setFetchFn,
  resetFetchFn,
  clearCategoryCache,
} from '../../backend/src/services/recipeService.js';
import { resetRateLimit } from '../../backend/src/middleware/rateLimiter.js';

// --- Mock data ---

const mockCategoryListResponse = {
  result: {
    large: [
      {
        categoryId: 30,
        categoryName: '肉',
        categoryUrl: 'https://recipe.rakuten.co.jp/category/30/',
      },
      {
        categoryId: 31,
        categoryName: '魚',
        categoryUrl: 'https://recipe.rakuten.co.jp/category/31/',
      },
    ],
    medium: [
      {
        categoryId: 275,
        categoryName: '鶏肉',
        categoryUrl: 'https://recipe.rakuten.co.jp/category/30-275/',
        parentCategoryId: '30',
      },
      {
        categoryId: 276,
        categoryName: '豚肉',
        categoryUrl: 'https://recipe.rakuten.co.jp/category/30-276/',
        parentCategoryId: '30',
      },
    ],
    small: [],
  },
};

const mockRankingResponse = {
  result: [
    {
      recipeTitle: 'チキン南蛮',
      recipeUrl: 'https://recipe.rakuten.co.jp/recipe/123/',
      foodImageUrl: 'https://image.space.rakuten.co.jp/recipe/123.jpg',
      recipeMaterial: ['鶏もも肉', '卵', '小麦粉', '酢', '砂糖'],
      recipeIndication: '約30分',
      recipeCost: '300円前後',
      recipeDescription: '甘酢タレが絶品のチキン南蛮',
    },
    {
      recipeTitle: '親子丼',
      recipeUrl: 'https://recipe.rakuten.co.jp/recipe/456/',
      foodImageUrl: 'https://image.space.rakuten.co.jp/recipe/456.jpg',
      recipeMaterial: ['鶏もも肉', '卵', '玉ねぎ', 'だし汁'],
      recipeIndication: '約15分',
      recipeCost: '300円前後',
      recipeDescription: 'ふわとろ卵の親子丼',
    },
  ],
};

// --- Steps ---

Given('楽天レシピAPIがモックされている', function (this: EimiWorld) {
  // Clear cache and rate limit state so each scenario is independent
  clearCategoryCache();
  resetRateLimit();

  process.env.RAKUTEN_APP_ID = 'test_app_id';

  const mockFetch = async (input: string | URL | Request): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

    if (url.includes('CategoryList')) {
      return new Response(JSON.stringify(mockCategoryListResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.includes('CategoryRanking')) {
      return new Response(JSON.stringify(mockRankingResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  };

  setFetchFn(mockFetch as typeof globalThis.fetch);
});

When('食材{string}でレシピを検索する', async function (this: EimiWorld, ingredient: string) {
  this.response = await this.request.get(
    `/api/recipes/search?ingredient=${encodeURIComponent(ingredient)}`,
  );
});

Then('マッチしたカテゴリが返される', function (this: EimiWorld) {
  const body = this.response.body;
  assert.ok(Array.isArray(body.matchedCategories));
  assert.ok(body.matchedCategories.length > 0, 'Expected at least one matched category');
  const first = body.matchedCategories[0];
  assert.ok(typeof first.categoryId === 'string');
  assert.ok(typeof first.categoryName === 'string');
});

Then('レシピ一覧が返される', function (this: EimiWorld) {
  const body = this.response.body;
  assert.ok(Array.isArray(body.recipes));
  assert.ok(body.recipes.length > 0, 'Expected at least one recipe');
  const first = body.recipes[0];
  assert.ok(typeof first.recipeTitle === 'string');
  assert.ok(typeof first.recipeUrl === 'string');
  assert.ok(Array.isArray(first.recipeMaterial));
});

Then('空のレシピ一覧が返される', function (this: EimiWorld) {
  const body = this.response.body;
  assert.ok(Array.isArray(body.recipes));
  assert.strictEqual(body.recipes.length, 0);
  assert.ok(Array.isArray(body.matchedCategories));
  assert.strictEqual(body.matchedCategories.length, 0);
});
