import { Given, When, Then, Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import assert from 'node:assert';
import type { E2EWorld } from '../support/world.js';

setDefaultTimeout(30000);

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:5173';

Before(async function (this: E2EWorld) {
  await this.launchBrowser();
});

After(async function (this: E2EWorld) {
  await this.closeBrowser();
});

Given('トップページを開いている', async function (this: E2EWorld) {
  await this.page.goto(BASE_URL);
  await this.page.waitForLoadState('domcontentloaded');
});

Given('レシピ検索ページを開いている', async function (this: E2EWorld) {
  await this.page.goto(`${BASE_URL}/recipe-search`);
  await this.page.waitForLoadState('domcontentloaded');
});

Then('ページタイトルに{string}が含まれる', async function (this: E2EWorld, text: string) {
  const header = await this.page.textContent('header');
  assert.ok(header?.includes(text), `Expected header to contain "${text}", got: ${header}`);
});

Then('栄養素のドロップダウンが表示されている', async function (this: E2EWorld) {
  const select = this.page.locator('[data-testid="nutrient-select"]');
  await select.waitFor({ state: 'visible', timeout: 10000 });
  const options = await select.locator('option').count();
  assert.ok(options > 1, `Expected more than 1 option, got ${options}`);
});

When('栄養素{string}を選択する', async function (this: E2EWorld, nutrientLabel: string) {
  const select = this.page.locator('[data-testid="nutrient-select"]');
  // Find option by label text
  const options = await select.locator('option').all();
  let targetValue = '';
  for (const opt of options) {
    const text = await opt.textContent();
    if (text?.includes(nutrientLabel)) {
      targetValue = (await opt.getAttribute('value')) || '';
      break;
    }
  }
  assert.ok(targetValue, `Option with "${nutrientLabel}" not found`);
  await select.selectOption(targetValue);
});

When('検索ボタンをクリックする', async function (this: E2EWorld) {
  const button = this.page.locator('[data-testid="search-button"]');
  await button.click();
  // Wait for results to load
  await this.page.locator('[data-testid="food-result-list"]').waitFor({
    state: 'visible',
    timeout: 10000,
  });
});

Then('食材一覧が表示される', async function (this: E2EWorld) {
  const resultList = this.page.locator('[data-testid="food-result-list"]');
  await resultList.waitFor({ state: 'visible' });
  const items = await resultList.locator('li').count();
  assert.ok(items > 0, `Expected food items, got ${items}`);
});

When('最初の食材の"レシピを探す"リンクをクリックする', async function (this: E2EWorld) {
  const firstLink = this.page.locator('[data-testid="food-result-list"] li a').first();
  await firstLink.click();
  await this.page.waitForURL('**/recipe-search**');
});

Then('レシピ検索ページに遷移する', async function (this: E2EWorld) {
  const url = this.page.url();
  assert.ok(url.includes('/recipe-search'), `Expected URL to include /recipe-search, got: ${url}`);
});

When('食材名に{string}と入力する', async function (this: E2EWorld, ingredientName: string) {
  const input = this.page.locator('[data-testid="ingredient-input"]');
  await input.fill(ingredientName);
});

When('レシピ検索ボタンをクリックする', async function (this: E2EWorld) {
  const button = this.page.locator('[data-testid="recipe-search-button"]');
  await button.click();
  // Wait for recipe cards to appear
  await this.page.locator('[data-testid="recipe-list"]').waitFor({
    state: 'visible',
    timeout: 10000,
  });
});

Then('レシピカードが表示される', async function (this: E2EWorld) {
  const cards = await this.page.locator('[data-testid="recipe-card"]').count();
  assert.ok(cards > 0, `Expected recipe cards, got ${cards}`);
});
