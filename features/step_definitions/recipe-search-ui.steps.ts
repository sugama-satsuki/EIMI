import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import assert from 'node:assert';
import type { UIWorld } from '../support/ui-world.js';

const mockRecipeSearchResponse = {
  ingredient: '鶏肉',
  matchedCategories: [{ categoryId: '30-275', categoryName: '鶏肉' }],
  recipes: [
    {
      recipeTitle: '鶏むね肉のやわらか照り焼き',
      recipeUrl: 'https://recipe.rakuten.co.jp/recipe/123/',
      foodImageUrl: 'https://image.space.rakuten.co.jp/example.jpg',
      recipeMaterial: ['鶏むね肉 1枚', '醤油 大さじ2', 'みりん 大さじ2'],
      recipeIndication: '約30分',
      recipeCost: '300円前後',
      recipeDescription: '柔らかジューシーな照り焼きチキン',
    },
    {
      recipeTitle: 'チキン南蛮',
      recipeUrl: 'https://recipe.rakuten.co.jp/recipe/456/',
      foodImageUrl: 'https://image.space.rakuten.co.jp/example2.jpg',
      recipeMaterial: ['鶏もも肉 2枚', '卵 2個', '小麦粉 適量'],
      recipeIndication: '約40分',
      recipeCost: '500円前後',
      recipeDescription: '甘酢タレとタルタルソースが絶品',
    },
  ],
};

function createMockFetch() {
  return (url: string | URL | Request) => {
    const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.href : url.url;
    if (urlStr.includes('/api/recipes/search')) {
      return Promise.resolve(
        new Response(JSON.stringify(mockRecipeSearchResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    }
    return Promise.resolve(
      new Response('Not Found', { status: 404 }),
    );
  };
}

Before(async function (this: UIWorld) {
  this.setupDom();
  (globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
  (globalThis as Record<string, unknown>).fetch = createMockFetch();
});

After(function (this: UIWorld) {
  this.teardownDom();
});

async function renderRecipePage(world: UIWorld): Promise<void> {
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { MemoryRouter } = await import('react-router-dom');
  const { RecipeSearchPage } = await import(
    '../../frontend/src/pages/RecipeSearchPage.js'
  );
  const { act } = React;

  await act(async () => {
    const root = createRoot(world.container);
    root.render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/recipe-search'] },
        React.createElement(RecipeSearchPage),
      ),
    );
  });
}

async function renderRecipePageWithResults(world: UIWorld): Promise<void> {
  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { MemoryRouter } = await import('react-router-dom');
  const { RecipeSearchPage } = await import(
    '../../frontend/src/pages/RecipeSearchPage.js'
  );
  const { act } = React;

  // Render with ingredient param to trigger auto-search
  await act(async () => {
    const root = createRoot(world.container);
    root.render(
      React.createElement(
        MemoryRouter,
        { initialEntries: ['/recipe-search?ingredient=%E9%B6%8F%E8%82%89'] },
        React.createElement(RecipeSearchPage),
      ),
    );
  });

  // Wait for results to render
  await waitFor(async () => {
    const { act: innerAct } = await import('react');
    await innerAct(async () => {});
    const recipeList = world.dom.window.document.querySelector('[data-testid="recipe-list"]');
    assert.ok(recipeList, 'recipe-list should be rendered');
  });
}

Given('レシピ検索ページを開いている', async function (this: UIWorld) {
  await renderRecipePage(this);
});

Given('レシピ検索結果が表示されている', async function (this: UIWorld) {
  await renderRecipePageWithResults(this);
});

When('食材名{string}を入力する', async function (this: UIWorld, ingredientName: string) {
  const { act } = await import('react');

  const input = this.dom.window.document.querySelector('[data-testid="ingredient-input"]') as HTMLInputElement;
  assert.ok(input, 'ingredient-input not found');

  await act(async () => {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      this.dom.window.HTMLInputElement.prototype,
      'value',
    )!.set!;
    nativeInputValueSetter.call(input, ingredientName);
    input.dispatchEvent(new this.dom.window.Event('input', { bubbles: true }));
    input.dispatchEvent(new this.dom.window.Event('change', { bubbles: true }));
  });
});

When('検索ボタンをクリックする', async function (this: UIWorld) {
  const { act } = await import('react');

  const button = this.dom.window.document.querySelector('[data-testid="recipe-search-button"]') as HTMLButtonElement;
  assert.ok(button, 'recipe-search-button not found');

  await act(async () => {
    button.click();
  });

  // Wait for results
  await waitFor(async () => {
    const { act: innerAct } = await import('react');
    await innerAct(async () => {});
    const recipeList = this.dom.window.document.querySelector('[data-testid="recipe-list"]');
    assert.ok(recipeList, 'recipe-list should be rendered after search');
  });
});

Then('食材名入力欄が表示される', function (this: UIWorld) {
  const input = this.dom.window.document.querySelector('[data-testid="ingredient-input"]');
  assert.ok(input, 'ingredient-input should be present');
});

Then('検索ボタンが表示される', function (this: UIWorld) {
  const button = this.dom.window.document.querySelector('[data-testid="recipe-search-button"]');
  assert.ok(button, 'recipe-search-button should be present');
});

Then('レシピカードが一覧で表示される', function (this: UIWorld) {
  const recipeList = this.dom.window.document.querySelector('[data-testid="recipe-list"]');
  assert.ok(recipeList, 'recipe-list should be present');

  const cards = recipeList!.querySelectorAll('[data-testid="recipe-card"]');
  assert.ok(cards.length > 0, `Expected recipe cards, got ${cards.length}`);
});

Then('レシピタイトルが表示される', function (this: UIWorld) {
  const cards = this.dom.window.document.querySelectorAll('[data-testid="recipe-card"]');
  assert.ok(cards.length > 0, 'Expected recipe cards');

  const firstCard = cards[0];
  const title = firstCard.querySelector('h3');
  assert.ok(title, 'Recipe title h3 should exist');
  assert.ok(title!.textContent!.length > 0, 'Recipe title should not be empty');
});

Then('材料が表示される', function (this: UIWorld) {
  const cards = this.dom.window.document.querySelectorAll('[data-testid="recipe-card"]');
  assert.ok(cards.length > 0, 'Expected recipe cards');

  const firstCard = cards[0];
  const materials = firstCard.querySelectorAll('li');
  assert.ok(materials.length > 0, 'Should have material items');
});

Then('楽天レシピへのリンクが表示される', function (this: UIWorld) {
  const cards = this.dom.window.document.querySelectorAll('[data-testid="recipe-card"]');
  assert.ok(cards.length > 0, 'Expected recipe cards');

  const firstCard = cards[0];
  const link = firstCard.querySelector('a');
  assert.ok(link, 'Recipe link should exist');
  assert.ok(
    link!.getAttribute('href')?.includes('rakuten'),
    'Link should point to rakuten',
  );
  assert.ok(
    link!.textContent?.includes('楽天レシピ'),
    'Link text should mention 楽天レシピ',
  );
});

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
  await fn();
}
