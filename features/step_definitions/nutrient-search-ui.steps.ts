import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import assert from 'node:assert';
import type { UIWorld } from '../support/ui-world.js';

// No mock data needed — useNutrientSearch now uses local data (nutrientService.ts)

Before(async function (this: UIWorld) {
  this.setupDom();

  // Enable React act() environment
  (globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
});

After(function (this: UIWorld) {
  this.teardownDom();
});

async function renderPage(world: UIWorld): Promise<void> {
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { NutrientSearchPage } = await import(
    '../../frontend/src/pages/NutrientSearchPage.js'
  );
  const { act } = React;

  await act(async () => {
    const root = createRoot(world.container);
    root.render(React.createElement(NutrientSearchPage));
  });

  // Wait for nutrients to load - the select should have multiple options
  await waitFor(async () => {
    const { act: innerAct } = await import('react');
    await innerAct(async () => {});
    const select = world.dom.window.document.querySelector('[data-testid="nutrient-select"]');
    assert.ok(select, 'nutrient-select should be rendered');
    const options = select!.querySelectorAll('option');
    assert.ok(options.length > 1, `Expected more than 1 option, got ${options.length}`);
  });
}

Given('栄養素検索ページを開いている', async function (this: UIWorld) {
  await renderPage(this);
});

Given('栄養素検索結果が表示されている', async function (this: UIWorld) {
  const { act } = await import('react');

  await renderPage(this);

  // Select vitamin C (real nutrient key is 'vitC')
  const select = this.dom.window.document.querySelector('[data-testid="nutrient-select"]') as HTMLSelectElement;
  assert.ok(select, 'nutrient-select not found');

  await act(async () => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      this.dom.window.HTMLSelectElement.prototype,
      'value',
    )!.set!;
    nativeInputValueSetter.call(select, 'vitC');
    select.dispatchEvent(new this.dom.window.Event('change', { bubbles: true }));
  });

  // Click search
  const button = this.dom.window.document.querySelector('[data-testid="search-button"]') as HTMLButtonElement;
  assert.ok(button, 'search-button not found');

  await act(async () => {
    button.click();
  });

  // Wait for results
  await waitFor(async () => {
    const { act: innerAct } = await import('react');
    await innerAct(async () => {});
    const resultList = this.dom.window.document.querySelector('[data-testid="food-result-list"]');
    assert.ok(resultList, 'food-result-list should be rendered');
  });
});

When('栄養素{string}を選択する', async function (this: UIWorld, nutrientLabel: string) {
  const { act } = await import('react');

  const select = this.dom.window.document.querySelector('[data-testid="nutrient-select"]') as HTMLSelectElement;
  assert.ok(select, 'nutrient-select not found');

  // Find the option with matching label text
  const options = Array.from(select.querySelectorAll('option'));
  const targetOption = options.find((opt) => opt.textContent?.includes(nutrientLabel));
  assert.ok(targetOption, `Option with label "${nutrientLabel}" not found`);

  await act(async () => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      this.dom.window.HTMLSelectElement.prototype,
      'value',
    )!.set!;
    nativeInputValueSetter.call(select, targetOption!.value);
    select.dispatchEvent(new this.dom.window.Event('change', { bubbles: true }));
  });
});

When('検索ボタンをクリックする', async function (this: UIWorld) {
  const { act } = await import('react');

  const button = this.dom.window.document.querySelector('[data-testid="search-button"]') as HTMLButtonElement;
  assert.ok(button, 'search-button not found');

  await act(async () => {
    button.click();
  });

  // Wait for results to render
  await waitFor(async () => {
    const { act: innerAct } = await import('react');
    await innerAct(async () => {});
    const resultList = this.dom.window.document.querySelector('[data-testid="food-result-list"]');
    assert.ok(resultList, 'food-result-list should be rendered after search');
  });
});

When('食材の"レシピを探す"ボタンをクリックする', function (this: UIWorld) {
  const resultList = this.dom.window.document.querySelector('[data-testid="food-result-list"]');
  assert.ok(resultList, 'food-result-list not found');

  const link = resultList!.querySelector('a');
  assert.ok(link, 'recipe link not found');

  // Store the href for verification
  (this as UIWorld & { lastClickedHref?: string }).lastClickedHref = link!.getAttribute('href') || '';
});

Then('栄養素のドロップダウンが表示される', function (this: UIWorld) {
  const select = this.dom.window.document.querySelector('[data-testid="nutrient-select"]');
  assert.ok(select, 'nutrient-select should be present');

  const options = select!.querySelectorAll('option');
  // Default placeholder + nutrient options
  assert.ok(options.length > 1, `Expected more than 1 option, got ${options.length}`);
});

Then('食材の一覧が含有量の降順で表示される', function (this: UIWorld) {
  const resultList = this.dom.window.document.querySelector('[data-testid="food-result-list"]');
  assert.ok(resultList, 'food-result-list should be present');

  const items = resultList!.querySelectorAll('li');
  assert.ok(items.length > 0, 'Should have food items');

  // Verify order is descending by checking the text content includes the values
  const values = Array.from(items).map((item) => {
    const text = item.textContent || '';
    const match = text.match(/(\d+(?:\.\d+)?)\s*mg/);
    return match ? parseFloat(match[1]) : 0;
  });

  for (let i = 1; i < values.length; i++) {
    assert.ok(
      values[i - 1] >= values[i],
      `Expected ${values[i - 1]} >= ${values[i]} at index ${i}`,
    );
  }
});

Then('レシピ検索ページに遷移する', function (this: UIWorld) {
  const href = (this as UIWorld & { lastClickedHref?: string }).lastClickedHref || '';
  assert.ok(
    href.includes('/recipe-search'),
    `Expected href to include /recipe-search, got: ${href}`,
  );
});

Then('食材名が検索欄に入力されている', function (this: UIWorld) {
  const href = (this as UIWorld & { lastClickedHref?: string }).lastClickedHref || '';
  assert.ok(
    href.includes('ingredient='),
    `Expected href to include ingredient=, got: ${href}`,
  );
  // Verify the ingredient parameter has a non-empty food name
  const params = new URLSearchParams(href.split('?')[1]);
  const ingredient = params.get('ingredient');
  assert.ok(
    ingredient && ingredient.length > 0,
    `Expected ingredient to have a value, got: ${ingredient}`,
  );
});

// Helper to poll for a condition (supports async assertions)
async function waitFor(fn: () => void | Promise<void>, timeout = 5000, interval = 50): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await fn();
      return;
    } catch {
      await new Promise((r) => setTimeout(r, interval));
    }
  }
  await fn(); // Final attempt - will throw if still failing
}
