import { World, setWorldConstructor } from '@cucumber/cucumber';
import { chromium, type Browser, type Page, type BrowserContext } from 'playwright';

export class E2EWorld extends World {
  public browser!: Browser;
  public context!: BrowserContext;
  public page!: Page;

  async launchBrowser(): Promise<void> {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    // Mock rakuten API at the backend level by intercepting fetch
    await this.page.route('**/api/recipes/search**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ingredient: '鶏肉',
          matchedCategories: [{ categoryId: '30-275', categoryName: '鶏肉' }],
          recipes: [
            {
              recipeTitle: '鶏むね肉の照り焼き',
              recipeUrl: 'https://recipe.rakuten.co.jp/recipe/123/',
              foodImageUrl: 'https://via.placeholder.com/300x200',
              recipeMaterial: ['鶏むね肉 1枚', '醤油 大さじ2'],
              recipeIndication: '約30分',
              recipeCost: '300円前後',
              recipeDescription: 'おいしい照り焼き',
            },
          ],
        }),
      });
    });
  }

  async closeBrowser(): Promise<void> {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(E2EWorld);
