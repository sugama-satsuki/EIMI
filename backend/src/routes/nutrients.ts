import { Router } from 'express';
import { getNutrients, searchFoodsByNutrient } from '../services/nutrientService.js';

const router = Router();

router.get('/', (_req, res) => {
  const nutrients = getNutrients();
  res.json({ nutrients });
});

router.get('/search', (req, res) => {
  const nutrient = req.query.nutrient as string | undefined;
  const limit = Math.max(1, parseInt(req.query.limit as string, 10) || 20);
  const offset = Math.max(0, parseInt(req.query.offset as string, 10) || 0);

  if (!nutrient) {
    res.status(400).json({ error: 'nutrient query parameter is required' });
    return;
  }

  try {
    const result = searchFoodsByNutrient(nutrient, limit, offset);
    const nutrients = getNutrients();
    const nutrientInfo = nutrients.find((n) => n.key === nutrient);

    res.json({
      nutrient: nutrientInfo,
      foods: result.foods,
      total: result.total,
      limit,
      offset,
    });
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Invalid nutrient key')) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

export { router as nutrientRouter };
