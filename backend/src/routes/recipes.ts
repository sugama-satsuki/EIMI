import { Router } from 'express';
import { searchRecipes } from '../services/recipeService.js';

const router = Router();

router.get('/search', async (req, res, next) => {
  try {
    const ingredient = req.query.ingredient as string | undefined;

    if (!ingredient) {
      res.status(400).json({ error: 'ingredient query parameter is required' });
      return;
    }

    const result = await searchRecipes(ingredient);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export { router as recipeRouter };
