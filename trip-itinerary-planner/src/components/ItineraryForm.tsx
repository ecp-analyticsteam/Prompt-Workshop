/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PlaneTakeoff, Compass, History, Trophy, Heart, Coffee, ShieldAlert, Sparkles, Tag, CircleDollarSign } from 'lucide-react';

export interface FormValues {
  destination: string;
  numberOfDays: number;
  theme: string;
}

interface ItineraryFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

const THEMES = [
  { id: 'General', label: 'Balanced', icon: Compass, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'Adventure', label: 'Adventure', icon: Trophy, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Relaxation', label: 'Relaxation', icon: Heart, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'Culture & History', label: 'Culture & History', icon: History, color: 'text-violet-600 bg-violet-50 border-violet-200' },
  { id: 'Foodie', label: 'Foodie & Coffee', icon: Coffee, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'Budget', label: 'Budget Friendly', icon: CircleDollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
];

export default function ItineraryForm({ onSubmit, isLoading }: ItineraryFormProps) {
  const [destination, setDestination] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(3);
  const [theme, setTheme] = useState('General');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs client-side
    const trimmedDest = destination.trim();
    if (!trimmedDest) {
      setError('Please input a destination (e.g., Tokyo, Paris, Rome).');
      return;
    }

    if (trimmedDest.length > 80) {
      setError('Destination name is too long.');
      return;
    }

    if (/[<>{}]/.test(trimmedDest)) {
      setError('Invalid characters. Special formatting HTML tags are not permitted.');
      return;
    }

    if (numberOfDays < 1 || numberOfDays > 14) {
      setError('Please select between 1 and 14 days.');
      return;
    }

    onSubmit({
      destination: trimmedDest,
      numberOfDays,
      theme,
    });
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-md p-6">
      <div className="mb-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Itinerary Parameters</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Destination Input */}
        <div>
          <label htmlFor="destination" className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
            Destination
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <PlaneTakeoff className="w-4 h-4" />
            </span>
            <input
              id="destination"
              type="text"
              placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-md bg-slate-50 text-slate-900 font-sans text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all disabled:opacity-50"
            />
          </div>
        </div>

        {/* Days Count */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="numberOfDays" className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Duration (Days)
            </label>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-sm">
              {numberOfDays < 10 ? `0${numberOfDays}` : numberOfDays}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="numberOfDays"
              type="range"
              min="1"
              max="14"
              step="1"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(Number(e.target.value))}
              disabled={isLoading}
              className="flex-1 h-1 bg-slate-200 appearance-none rounded-sm cursor-pointer accent-slate-900 disabled:opacity-50"
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-1.5">
            <span>01 Day</span>
            <span>07 Days</span>
            <span>14 Days</span>
          </div>
        </div>

        {/* Theme Grid */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
            Travel Focus / Theme
          </label>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
            {THEMES.map((themeObj) => {
              const Icon = themeObj.icon;
              const isSelected = theme === themeObj.id;
              return (
                <button
                  key={themeObj.id}
                  type="button"
                  onClick={() => setTheme(themeObj.id)}
                  disabled={isLoading}
                  className={`flex items-center gap-2 p-2.5 rounded-sm border text-left transition-all text-xs font-sans focus:outline-none cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white font-medium'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{themeObj.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-sm p-3 text-xs text-rose-800">
            <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !destination.trim()}
            className="w-full bg-slate-900 text-white py-3 rounded-md text-sm font-semibold hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Generating plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Plan</span>
              </>
            )}
          </button>

          <p className="mt-4 text-[10px] text-slate-400 text-center leading-relaxed italic">
            Architecture: Entities Layer • Use Case v2.1<br />Strict Input Validation Active
          </p>
        </div>
      </form>
    </div>
  );
}
