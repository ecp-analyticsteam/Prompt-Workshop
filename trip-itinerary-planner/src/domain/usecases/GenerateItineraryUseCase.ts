/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TripItineraryEntity, TripItinerary } from '../entities/Itinerary';
import { ITravelPlannerGateway } from './ports/ITravelPlannerGateway';

export interface GenerateItineraryRequest {
  destination: string;
  numberOfDays: number;
  theme: string;
}

export class GenerateItineraryUseCase {
  constructor(private readonly travelPlannerGateway: ITravelPlannerGateway) {}

  async execute(request: GenerateItineraryRequest): Promise<TripItinerary> {
    const { destination, numberOfDays, theme } = request;

    // Validate using Entity rules
    const validation = TripItineraryEntity.validate(destination, numberOfDays);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid itinerary request.');
    }

    // Default theme validation
    const allowedThemes = ['General', 'Adventure', 'Relaxation', 'Culture & History', 'Family', 'Foodie', 'Budget', 'Luxury'];
    const sanitizedTheme = allowedThemes.includes(theme) ? theme : 'General';

    // Trigger Use Case business logic via the gateway interface
    return this.travelPlannerGateway.generate(destination.trim(), numberOfDays, sanitizedTheme);
  }
}
