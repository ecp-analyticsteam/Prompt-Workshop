/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response } from 'express';
import { GeminiTravelPlannerGateway } from '../src/adapters/gateways/GeminiTravelPlannerGateway';
import { GenerateItineraryUseCase } from '../src/domain/usecases/GenerateItineraryUseCase';

// Initialize the core services
// Clean Architecture decoupling makes it extremely clean to spin up in Serverless runtime
const travelPlannerGateway = new GeminiTravelPlannerGateway();
const generateItineraryUseCase = new GenerateItineraryUseCase(travelPlannerGateway);

export default async function handler(req: any, res: any) {
  // Defend against wrong HTTP methods (Security Mandate)
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed. Please use POST.` });
  }

  try {
    const { destination, numberOfDays, theme } = req.body || {};

    // 1. Server-side type check and sanitization (OWASP A03:2021-Injection defense)
    if (typeof destination !== 'string') {
      return res.status(400).json({ error: 'Destination must be a text string.' });
    }

    const daysNum = Number(numberOfDays);
    if (isNaN(daysNum) || !Number.isInteger(daysNum)) {
      return res.status(400).json({ error: 'Number of days must be an integer.' });
    }

    if (typeof theme !== 'string') {
      return res.status(400).json({ error: 'Theme must be a text string.' });
    }

    if (daysNum < 1 || daysNum > 14) {
      return res.status(400).json({ error: 'You can generate itineraries up to 14 days.' });
    }

    // 2. Execute business Use Case
    const itinerary = await generateItineraryUseCase.execute({
      destination,
      numberOfDays: daysNum,
      theme,
    });

    // 3. Return results
    return res.status(200).json(itinerary);
  } catch (error: any) {
    console.error('VERCEL_SERVERLESS_ERROR:', error);

    // Fail-secure error handling (Security Mandate)
    const userFriendlyMessage = error.message && !error.message.includes('API_KEY') 
      ? error.message 
      : 'An unexpected internal error occurred on Vercel handler. Please try again.';

    return res.status(500).json({ error: userFriendlyMessage });
  }
}
