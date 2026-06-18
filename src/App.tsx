/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Header from './components/Header';
import ItineraryForm, { FormValues } from './components/ItineraryForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import Loader from './components/Loader';
import EmptyState from './components/EmptyState';
import { TripItinerary } from './domain/entities/Itinerary';
import { ShieldAlert, RefreshCw, Sparkles, Compass } from 'lucide-react';

export default function App() {
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateItinerary = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error occurred while preparing itinerary.');
      }

      setItinerary(data);
    } catch (err: any) {
      console.error('CLIENT_FETCH_ERROR:', err);
      setError(err.message || 'An unexpected connection error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (destination: string, days: number, theme: string) => {
    generateItinerary({ destination, numberOfDays: days, theme });
  };

  const handleReset = () => {
    setItinerary(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-slate-900 selection:text-white">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form Left Side Column */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <ItineraryForm onSubmit={generateItinerary} isLoading={isLoading} />
            
            {itinerary && (
              <button
                onClick={handleReset}
                className="w-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-sm text-xs transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Start New Search</span>
              </button>
            )}
          </div>

          {/* Results/Detail Right Side Column */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <Loader />
            ) : error ? (
              <div className="bg-white border border-rose-200 rounded-sm p-6 space-y-4 shadow-none">
                <div className="flex items-center gap-2 text-rose-800">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <h3 className="font-bold tracking-tight text-sm uppercase">Generation Blocked</h3>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed bg-rose-50/20 p-4 border border-rose-100 rounded-sm">
                  {error}
                </p>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-sm transition-all focus:outline-none cursor-pointer"
                  >
                    Clear Error
                  </button>
                </div>
              </div>
            ) : itinerary ? (
              <ItineraryDisplay itinerary={itinerary} />
            ) : (
              <EmptyState onSelectSuggestion={handleSelectSuggestion} />
            )}
          </div>
        </div>
      </main>

      <footer className="w-full py-6 mt-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <p>© 2026 Voyager Travel Planner. Crafted with absolute Clean Architecture.</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Full-Stack Design</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
