/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Activity {
  id: string; // Dynamic client/server UUID or ID
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  title: string;
  description: string;
  location: string;
  estimatedCost: string;
  duration: string;
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  title: string;
  activities: Activity[];
}

export interface TripItinerary {
  id: string;
  destination: string;
  numberOfDays: number;
  theme: string;
  summary: string;
  days: DayPlan[];
  packingSuggestions: string[];
  travelTips: string[];
}

export class TripItineraryEntity {
  static validate(destination: string, numberOfDays: number): { isValid: boolean; error?: string } {
    if (!destination || typeof destination !== 'string' || destination.trim().length === 0) {
      return { isValid: false, error: 'Destination is required.' };
    }
    if (destination.length > 100) {
      return { isValid: false, error: 'Destination is too long (maximum 100 characters).' };
    }
    // Prevent malicious input characters in destination to secure against XSS/injection at Entity level
    if (/[<>{}]/.test(destination)) {
      return { isValid: false, error: 'Invalid characters in destination.' };
    }
    if (isNaN(numberOfDays) || numberOfDays < 1 || numberOfDays > 14) {
      return { isValid: false, error: 'Number of days must be between 1 and 14.' };
    }
    return { isValid: true };
  }
}
