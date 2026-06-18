/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import 'dotenv/config';
import { createServer as createViteServer } from 'vite';

// Clean Architecture wiring
import { GeminiTravelPlannerGateway } from './src/adapters/gateways/GeminiTravelPlannerGateway';
import { GenerateItineraryUseCase } from './src/domain/usecases/GenerateItineraryUseCase';
import { ItineraryController } from './src/adapters/controllers/ItineraryController';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json());

  // Instantiate Clean Architecture layers
  const travelPlannerGateway = new GeminiTravelPlannerGateway();
  const generateItineraryUseCase = new GenerateItineraryUseCase(travelPlannerGateway);
  const itineraryController = new ItineraryController(generateItineraryUseCase);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Trip Itinerary Generation endpoint
  app.post('/api/itinerary', (req, res) => {
    itineraryController.handleGenerate(req, res);
  });

  // Integrate Vite for a seamless full-stack dev/prod environment
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server starting on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
  });
}

startServer().catch((err) => {
  console.error('SERVER_STARTUP_FAILED:', err);
  process.exit(1);
});
