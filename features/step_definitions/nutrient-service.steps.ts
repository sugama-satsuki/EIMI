import { When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { getNutrients, searchFoodsByNutrient } from '../../frontend/src/services/nutrientService.ts';
import type { NutrientInfo, FoodSearchResult } from '../../frontend/src/types/nutrient.ts';

interface NutrientServiceWorld {
  nutrients?: NutrientInfo[];
  searchResult?: {
    nutrient: NutrientInfo;
    foods: FoodSearchResult[];
    total: number;
    limit: number;
    offset: number;
  };
  error?: Error;
  previousFoods?: FoodSearchResult[];
}

When('getNutrients を呼び出す', function (this: NutrientServiceWorld) {
  this.nutrients = getNutrients();
});

Then('{int}件の栄養素が返される', function (this: NutrientServiceWorld, count: number) {
  assert.strictEqual(this.nutrients!.length, count);
});

Then('各栄養素にkey、label、unitが含まれる', function (this: NutrientServiceWorld) {
  for (const n of this.nutrients!) {
    assert.ok(n.key, 'key should be present');
    assert.ok(n.label, 'label should be present');
    assert.ok(n.unit, 'unit should be present');
  }
});

When('{string}で食材を検索する', function (this: NutrientServiceWorld, key: string) {
  try {
    this.searchResult = searchFoodsByNutrient(key);
  } catch (e) {
    this.error = e as Error;
  }
});

When('{string}でlimit {int}、offset {int}で食材を検索する', function (
  this: NutrientServiceWorld,
  key: string,
  limit: number,
  offset: number,
) {
  if (this.searchResult) {
    this.previousFoods = this.searchResult.foods;
  }
  this.searchResult = searchFoodsByNutrient(key, limit, offset);
});

Then('食材が含有量の降順で返される', function (this: NutrientServiceWorld) {
  const foods = this.searchResult!.foods;
  assert.ok(foods.length > 0, 'Should have results');
  for (let i = 1; i < foods.length; i++) {
    assert.ok(
      foods[i - 1].value >= foods[i].value,
      `Expected ${foods[i - 1].value} >= ${foods[i].value} at index ${i}`,
    );
  }
});

Then('各食材にfoodId、foodName、value、unitが含まれる', function (this: NutrientServiceWorld) {
  for (const food of this.searchResult!.foods) {
    assert.ok(food.foodId != null, 'foodId should be present');
    assert.ok(food.foodName, 'foodName should be present');
    assert.ok(food.value != null, 'value should be present');
    assert.ok(food.unit, 'unit should be present');
  }
});

Then('エラーが発生する', function (this: NutrientServiceWorld) {
  assert.ok(this.error, 'Error should have been thrown');
});

Then('{int}件の食材が返される', function (this: NutrientServiceWorld, count: number) {
  assert.strictEqual(this.searchResult!.foods.length, count);
});

Then('最初のページと異なる食材が返される', function (this: NutrientServiceWorld) {
  assert.ok(this.previousFoods, 'Previous page results should exist');
  const currentIds = this.searchResult!.foods.map((f) => f.foodId);
  const prevIds = this.previousFoods!.map((f) => f.foodId);
  const hasOverlap = currentIds.some((id) => prevIds.includes(id));
  assert.ok(!hasOverlap, 'Pages should have different foods');
});
