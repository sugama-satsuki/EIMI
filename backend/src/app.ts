import express from 'express';
import cors from 'cors';
import { nutrientRouter } from './routes/nutrients.js';
import { recipeRouter } from './routes/recipes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/nutrients', nutrientRouter);
app.use('/api/foods', nutrientRouter);
app.use('/api/recipes', recipeRouter);

app.use(errorHandler);

export { app };
