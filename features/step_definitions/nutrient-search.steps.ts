import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import type { EimiWorld } from '../support/world.js';

Given('サーバーが起動している', async function (this: EimiWorld) {
  await this.init();
});

When('栄養素一覧APIにリクエストを送る', async function (this: EimiWorld) {
  this.response = await this.request.get('/api/nutrients');
});

When('栄養素{string}で食材を検索する', async function (this: EimiWorld, nutrientKey: string) {
  this.response = await this.request.get(`/api/foods/search?nutrient=${nutrientKey}`);
});

When(
  '栄養素{string}でlimit{int},offset{int}で食材を検索する',
  async function (this: EimiWorld, nutrientKey: string, limit: number, offset: number) {
    this.response = await this.request.get(
      `/api/foods/search?nutrient=${nutrientKey}&limit=${limit}&offset=${offset}`,
    );
  },
);

Then('ステータスコード{int}が返る', function (this: EimiWorld, statusCode: number) {
  assert.strictEqual(this.response.status, statusCode);
});

Then('栄養素の一覧が返される', function (this: EimiWorld) {
  const body = this.response.body;
  assert.ok(Array.isArray(body.nutrients));
  assert.ok(body.nutrients.length > 0);
  const first = body.nutrients[0];
  assert.ok(typeof first.key === 'string');
  assert.ok(typeof first.label === 'string');
  assert.ok(typeof first.unit === 'string');
});

Then('食材がビタミンC含有量の降順で返される', function (this: EimiWorld) {
  const body = this.response.body;
  assert.ok(Array.isArray(body.foods));
  assert.ok(body.foods.length > 0);

  for (let i = 1; i < body.foods.length; i++) {
    assert.ok(
      body.foods[i - 1].value >= body.foods[i].value,
      `Expected ${body.foods[i - 1].value} >= ${body.foods[i].value} at index ${i}`,
    );
  }
});

Then('{int}件の食材が返される', function (this: EimiWorld, count: number) {
  const body = this.response.body;
  assert.strictEqual(body.foods.length, count);
});

Then('totalが全件数を返す', function (this: EimiWorld) {
  const body = this.response.body;
  assert.ok(typeof body.total === 'number');
  assert.ok(body.total > body.foods.length);
});
