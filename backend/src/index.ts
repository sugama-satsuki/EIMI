import { app } from './app.js';
import { loadFoodData } from './services/nutrientService.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function start() {
  await loadFoodData();
  app.listen(PORT, () => {
    console.log(`EIMI backend running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);
