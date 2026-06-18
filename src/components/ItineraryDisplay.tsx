/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { TripItinerary, DayPlan, Activity } from '../domain/entities/Itinerary';
import {
  Calendar, CheckSquare, Clock, MapPin, Tag, Square, Check,
  Sparkles, ShieldCheck, HelpCircle, Briefcase, Info, Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ItineraryDisplayProps {
  itinerary: TripItinerary;
}

export default function ItineraryDisplay({ itinerary }: ItineraryDisplayProps) {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'packing' | 'tips'>('itinerary');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [checkedActivities, setCheckedActivities] = useState<Record<string, boolean>>({});
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});

  const toggleActivityChecked = (id: string) => {
    setCheckedActivities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleActivityExpanded = (id: string) => {
    setExpandedActivities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getTimeOfDayIcon = (time: string) => {
    // Return appropriate colors and labels
    switch (time?.toLowerCase()) {
      case 'morning':
        return { label: '🌅 Morning', bg: 'bg-amber-50 text-amber-700 border-amber-100' };
      case 'afternoon':
        return { label: '☀️ Afternoon', bg: 'bg-sky-50 text-sky-700 border-sky-100' };
      case 'evening':
        return { label: '🌆 Evening', bg: 'bg-orange-50 text-orange-700 border-orange-100' };
      case 'night':
        return { label: '🌙 Night', bg: 'bg-indigo-50 text-indigo-700 border-indigo-100' };
      default:
        return { label: `🕒 ${time}`, bg: 'bg-slate-50 text-slate-700 border-slate-100' };
    }
  };

  const currentDay: DayPlan = itinerary.days[selectedDayIndex] || itinerary.days[0];

  return (
    <div className="w-full space-y-6">
      {/* Hero / Header Section in Clean Minimalism */}
      <div className="relative bg-white border border-slate-200 rounded-md p-6 transition-all hover:border-slate-300">
        <div>
          <p className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest mb-1.5">
            Current Itinerary
          </p>
          <h1 className="text-2xl md:text-3xl font-light text-slate-900 tracking-tight">
            {itinerary.destination}
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-2 leading-relaxed">
            {itinerary.numberOfDays < 10 ? `0${itinerary.numberOfDays}` : itinerary.numberOfDays}-Day explore plan focusing on <span className="font-semibold text-slate-800">{itinerary.theme}</span>: "{itinerary.summary}"
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border border-slate-200 bg-slate-50 p-1 rounded-sm">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs md:text-sm font-semibold rounded-sm transition-all cursor-pointer ${
            activeTab === 'itinerary'
              ? 'bg-slate-900 text-white shadow-none'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>Itinerary Matrix</span>
        </button>
        <button
          onClick={() => setActiveTab('packing')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs md:text-sm font-semibold rounded-sm transition-all cursor-pointer ${
            activeTab === 'packing'
              ? 'bg-slate-900 text-white shadow-none'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 shrink-0" />
          <span>Packing Suggestions</span>
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs md:text-sm font-semibold rounded-sm transition-all cursor-pointer ${
            activeTab === 'tips'
              ? 'bg-slate-900 text-white shadow-none'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 shrink-0" />
          <span>Local Protocols</span>
        </button>
      </div>

      {/* Animated content switch */}
      <AnimatePresence mode="wait">
        {activeTab === 'itinerary' && (
          <motion.div
            key="itinerary-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Days Selector - Left Column */}
            <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0 scrollbar-none sticky lg:top-24 max-h-[calc(100vh-140px)]">
              {itinerary.days.map((day, idx) => {
                const isActive = selectedDayIndex === idx;
                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`flex items-center gap-3 p-3 rounded-sm border text-left shrink-0 lg:shrink transition-all focus:outline-none cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 border-slate-900 text-white font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-mono font-bold leading-none ${
                        isActive ? 'bg-white text-slate-900' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                    </div>
                    <div className="hidden lg:block space-y-0.5">
                      <p className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        Day {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                      </p>
                      <p className={`text-[9px] font-mono uppercase tracking-widest ${isActive ? 'text-slate-300' : 'text-slate-400'} truncate max-w-[120px]`}>
                        {day.theme}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Timeline Activities - Right Column */}
            <div className="lg:col-span-9 space-y-4">
              <div className="bg-white border border-slate-200 rounded-md p-5 md:p-6">
                <div className="border-b border-slate-100 pb-3.5 mb-6">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-slate-100 text-slate-700 px-2 py-0.5 border border-slate-200 rounded-sm">
                    METRIC FOCUS: {currentDay.theme}
                  </span>
                  <h3 className="text-lg font-light text-slate-900 mt-2">
                    Day {currentDay.dayNumber < 10 ? `0${currentDay.dayNumber}` : currentDay.dayNumber} — {currentDay.title}
                  </h3>
                </div>

                {/* Timeline */}
                <div className="relative border-l border-slate-200 pl-6 ml-2 space-y-8">
                  {currentDay.activities.map((activity, aIdx) => {
                    const isChecked = !!checkedActivities[activity.id];
                    const isExpanded = !!expandedActivities[activity.id];
                    const badgeLabel = activity.timeOfDay;

                    return (
                      <div key={activity.id} className="relative group">
                        {/* Dot check button exactly matching Atlas Planner minimal dots */}
                        <span
                          onClick={() => toggleActivityChecked(activity.id)}
                          className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-slate-900 border-slate-900'
                              : 'bg-white border-slate-300 hover:border-slate-900'
                          }`}
                        />

                        {/* Title block */}
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-sm text-slate-600">
                              🕒 {badgeLabel}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                              • {activity.duration}
                            </span>
                          </div>

                          <h4
                            onClick={() => toggleActivityExpanded(activity.id)}
                            className={`font-sans font-semibold text-sm md:text-base cursor-pointer hover:text-slate-900 transition-colors ${
                              isChecked ? 'line-through text-slate-300' : 'text-slate-800'
                            }`}
                          >
                            {activity.title}
                          </h4>

                          {/* Content */}
                          <p className="text-xs text-slate-500 leading-relaxed font-sans">
                            {activity.description}
                          </p>

                          {/* Flat minimal parameters footer */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                              <span className="truncate max-w-[180px]">{activity.location}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              • EST: {activity.estimatedCost}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Packing suggestions */}
        {activeTab === 'packing' && (
          <motion.div
            key="packing-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-white border border-slate-200 rounded-md p-5 md:p-6 space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-slate-900" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Packing Recommendations</h3>
            </div>
            
            <p className="text-xs text-slate-500 max-w-xl">
              Specially selected checklist based on your destination's seasonal climate and cultural profile.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {itinerary.packingSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 bg-slate-55 border border-slate-200 rounded-sm flex items-start gap-3 transition-colors"
                >
                  <span className="p-1 px-1.5 bg-slate-100 border border-slate-200 text-slate-700 rounded-sm text-[9px] font-bold font-mono">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </span>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed pt-0.5">{suggestion}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Local travel tips */}
        {activeTab === 'tips' && (
          <motion.div
            key="tips-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-white border border-slate-200 rounded-md p-5 md:p-6 space-y-4"
          >
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Info className="w-4 h-4 text-slate-900" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Essential Local Travel & Safety Advice</h3>
            </div>
            
            <p className="text-xs text-slate-500 max-w-xl">
              Local protocols, tipping customs, transport secrets, and safety tips for visiting this region.
            </p>

            <div className="space-y-3 pt-2">
              {itinerary.travelTips.map((tip, index) => (
                <div
                  key={index}
                  className="p-3.5 border border-slate-200 rounded-sm bg-slate-50/50 flex items-start gap-3.5"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-900 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
