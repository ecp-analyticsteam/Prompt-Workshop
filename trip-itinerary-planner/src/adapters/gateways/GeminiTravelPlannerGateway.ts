/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';
import { TripItinerary } from '../../domain/entities/Itinerary';
import { ITravelPlannerGateway } from '../../domain/usecases/ports/ITravelPlannerGateway';

export class GeminiTravelPlannerGateway implements ITravelPlannerGateway {
  private readonly ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined. Please configure it in your Secrets settings.');
    }

    this.ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  async generate(destination: string, numberOfDays: number, theme: string): Promise<TripItinerary> {
    const prompt = `Create a fully-detailed, realistic, and curated day-by-day travel itinerary for "${destination}" for ${numberOfDays} days.
The itinerary theme focus should be: "${theme}".
Provide suggestions for packing and essential, local security or travel tips for visitors. Make it immersive, structured, and realistic.`;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are a veteran travel consultant, tour guide, and safety advisor. You construct highly precise, culturally respectful, engaging, and practical travel itineraries. Use the exact structural JSON requested. All costs should be approximated realistically in local currencies or general pricing tags. Duration should be in format like "2 hours", "Half Day", etc.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING },
              numberOfDays: { type: Type.INTEGER },
              theme: { type: Type.STRING },
              summary: { type: Type.STRING, description: 'A fascinating introductory overview highlighting the vibe of the trip.' },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    dayNumber: { type: Type.INTEGER },
                    title: { type: Type.STRING, description: 'Main theme status or summary of this day, e.g., "Exploring the Ancient Streets"' },
                    theme: { type: Type.STRING, description: 'Specific focus / mood of this day' },
                    activities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          timeOfDay: { type: Type.STRING, description: 'Must be Morning, Afternoon, Evening, or Night' },
                          title: { type: Type.STRING, description: 'Descriptive title of the activity' },
                          description: { type: Type.STRING, description: 'Detailed visual write-up of what to do, eat, or see.' },
                          location: { type: Type.STRING, description: 'The exact name of the neighborhood, landmark, or venue' },
                          estimatedCost: { type: Type.STRING, description: 'Appropriate price level (e.g. "Free", "$15 USD", "Local food stall: $5 - $8")' },
                          duration: { type: Type.STRING, description: 'Expected duration, e.g., "1.5 hours" or "3 hours"' },
                        },
                        required: ['timeOfDay', 'title', 'description', 'location', 'estimatedCost', 'duration'],
                      },
                    },
                  },
                  required: ['dayNumber', 'title', 'theme', 'activities'],
                },
              },
              packingSuggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Unique climate or culture specific packing suggestions with explanations.',
              },
              travelTips: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Local custom, transport hacks, language greetings, safety precautions, or secrets.',
              },
            },
            required: ['destination', 'numberOfDays', 'theme', 'summary', 'days', 'packingSuggestions', 'travelTips'],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Travel planner returned empty response.');
      }

      const rawData = JSON.parse(responseText.trim());
      
      // Inject stable/dynamic ID to days and activities for beautiful rendering keys
      const mappedItinerary: TripItinerary = {
        id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        destination: rawData.destination || destination,
        numberOfDays: Number(rawData.numberOfDays) || numberOfDays,
        theme: rawData.theme || theme,
        summary: rawData.summary || '',
        days: (rawData.days || []).map((day: any, dIndex: number) => ({
          dayNumber: day.dayNumber || (dIndex + 1),
          title: day.title || `Day ${dIndex + 1}`,
          theme: day.theme || theme,
          activities: (day.activities || []).map((activity: any, aIndex: number) => ({
            id: `act_${dIndex}_${aIndex}_${Math.random().toString(36).substr(2, 5)}`,
            timeOfDay: activity.timeOfDay || 'Morning',
            title: activity.title || 'Sightseeing',
            description: activity.description || 'Enjoy exploring the local attractions.',
            location: activity.location || 'Central area',
            estimatedCost: activity.estimatedCost || 'Free',
            duration: activity.duration || '2 hours',
          })),
        })),
        packingSuggestions: rawData.packingSuggestions || [],
        travelTips: rawData.travelTips || [],
      };

      return mappedItinerary;
    } catch (error: any) {
      console.error('Error generating itinerary in GeminiTravelPlannerGateway:', error);
      throw new Error(`Generation failed: ${error.message || error}`);
    }
  }
}
