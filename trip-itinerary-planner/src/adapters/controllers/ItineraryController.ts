/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { GenerateItineraryUseCase } from '../../domain/usecases/GenerateItineraryUseCase';

export class ItineraryController {
  constructor(private readonly generateItineraryUseCase: GenerateItineraryUseCase) {}

  async handleGenerate(req: Request, res: Response): Promise<void> {
    try {
      const { destination, numberOfDays, theme } = req.body;

      // 1. Server-side type check and sanitization (OWASP A03:2021-Injection defense)
      if (typeof destination !== 'string') {
        res.status(400).json({ error: 'Destination must be a text string.' });
        return;
      }

      const daysNum = Number(numberOfDays);
      if (isNaN(daysNum) || !Number.isInteger(daysNum)) {
        res.status(400).json({ error: 'Number of days must be an integer.' });
        return;
      }

      if (typeof theme !== 'string') {
        res.status(400).json({ error: 'Theme must be a text string.' });
        return;
      }

      // Check range to avoid heavy billing or resource exhaustion (Denial of Service mitigation)
      if (daysNum < 1 || daysNum > 14) {
        res.status(400).json({ error: 'You can generate itineraries up to 14 days.' });
        return;
      }

      // 2. Execute business Use Case
      const itinerary = await this.generateItineraryUseCase.execute({
        destination,
        numberOfDays: daysNum,
        theme,
      });

      // 3. Return successful response with proper HTTP statuses
      res.status(200).json(itinerary);
    } catch (error: any) {
      // 4. Secure logging and error handling: Log details on server for debugging
      console.error('SERVER_ERROR (ItineraryController):', error);

      // Do NOT send stack traces or inner details to client (Defends against Information Exposure)
      const userFriendlyMessage = error.message && !error.message.includes('API_KEY') 
        ? error.message 
        : 'An unexpected internal error occurred while generating your itinerary. Please try again.';

      res.status(500).json({ error: userFriendlyMessage });
    }
  }
}
