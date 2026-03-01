import { World, setWorldConstructor } from '@cucumber/cucumber';
import supertest from 'supertest';
import { app } from '../../backend/src/app.js';
import { loadFoodData } from '../../backend/src/services/nutrientService.js';

let dataLoaded = false;

export class EimiWorld extends World {
  public response!: supertest.Response;

  async init(): Promise<void> {
    if (!dataLoaded) {
      await loadFoodData();
      dataLoaded = true;
    }
  }

  get request(): supertest.Agent {
    return supertest(app) as unknown as supertest.Agent;
  }
}

setWorldConstructor(EimiWorld);
