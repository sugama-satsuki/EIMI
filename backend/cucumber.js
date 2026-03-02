export default {
  requireModule: ['tsx'],
  require: [
    '../features/step_definitions/nutrient-search.steps.ts',
    '../features/step_definitions/recipe-search.steps.ts',
    '../features/support/world.ts',
  ],
  paths: ['../features/nutrient-search.feature', '../features/recipe-search.feature'],
  format: ['progress-bar'],
  publishQuiet: true,
};
