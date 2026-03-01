export default {
  requireModule: ['tsx'],
  require: [
    '../features/step_definitions/nutrient-search-ui.steps.ts',
    '../features/support/ui-world.ts',
  ],
  paths: ['../features/nutrient-search-ui.feature'],
  format: ['progress-bar'],
};

export const recipeUi = {
  requireModule: ['tsx'],
  require: [
    '../features/step_definitions/recipe-search-ui.steps.ts',
    '../features/support/ui-world.ts',
  ],
  paths: ['../features/recipe-search-ui.feature'],
  format: ['progress-bar'],
};
