/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TripItinerary } from '../../entities/Itinerary';

export interface ITravelPlannerGateway {
  generate(destination: string, numberOfDays: number, theme: string): Promise<TripItinerary>;
}
