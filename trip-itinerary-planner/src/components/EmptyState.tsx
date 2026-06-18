/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass, Sparkles, MapPin, CheckCircle } from 'lucide-react';

interface EmptyStateProps {
  onSelectSuggestion: (destination: string, days: number, theme: string) => void;
}

const SUGGESTIONS = [
  { destination: 'Kyoto, Japan', days: 5, theme: 'Culture & History', subtitle: 'Temples, tea houses & peaceful bamboo gardens' },
  { destination: 'Amalfi Coast, Italy', days: 4, theme: 'Relaxation', subtitle: 'Dramatic cliffs, lemon orchards & blue sea' },
  { destination: 'Reykjavik, Iceland', days: 7, theme: 'Adventure', subtitle: 'Waterfalls, volcanic hot springs & glaciers' },
  { destination: 'Paris, France', days: 3, theme: 'Foodie', subtitle: 'Artisanal bakeries, world-class museums & cafes' },
];

export default function EmptyState({ onSelectSuggestion }: EmptyStateProps) {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-md p-8 py-12 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 bg-slate-900 text-white rounded-sm mb-5 flex items-center justify-center">
        <Compass className="w-6 h-6 animate-spin-slow" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Explore Your Next Adventure</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
        Let Gemini curate a highly personalized, efficient, and memorable day-by-day sightseeing checklist tailored specifically to your speed and interests.
      </p>

      {/* Feature list */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 text-left w-full">
        <div className="p-3.5 bg-slate-50/50 rounded-sm border border-slate-200 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">Curation</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Optimized routing per day</p>
          </div>
        </div>
        <div className="p-3.5 bg-slate-50/50 rounded-sm border border-slate-200 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">Local Advice</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Cultural tips & transport secrets</p>
          </div>
        </div>
        <div className="p-3.5 bg-slate-50/50 rounded-sm border border-slate-200 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wide uppercase">Packing Guide</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Climate & style matching checklists</p>
          </div>
        </div>
      </div>

      {/* Suggestion Starter Cards */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-slate-400" />
          <h4 className="text-xs font-bold text-slate-500 tracking-widest uppercase">Start with a Popular Route</h4>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
          {SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSuggestion(sug.destination, sug.days, sug.theme)}
              className="p-4 bg-white hover:bg-slate-50/50 border border-slate-200 rounded-sm transition-all cursor-pointer group hover:border-slate-900 flex items-start justify-between gap-3 text-left focus:outline-none"
            >
              <div className="space-y-1 w-full">
                <span className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-sm mb-1">
                  {sug.theme} • {sug.days} Days
                </span>
                <span className="font-sans font-bold text-slate-900 group-hover:text-slate-900 transition-colors block flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {sug.destination}
                </span>
                <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">{sug.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
