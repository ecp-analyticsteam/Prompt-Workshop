/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Compass, Sparkles, MapPin, ClipboardList, BedDouble } from 'lucide-react';

const MESSAGES = [
  'Consulting veteran travel databases...',
  'Checking optimal routes and local geography...',
  'Organizing sightseeing spots from morning to dusk...',
  'Adding local safety hints & custom safety protocols...',
  'Creating customized packing guidelines for the climate...',
  'Polishing costs and estimated activity times...',
  'Assembling your perfect personalized guide...',
];

export default function Loader() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white border border-slate-200 rounded-md p-8 shadow-none flex flex-col items-center justify-center min-h-[460px]">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-slate-950">
          <Compass className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <h3 className="text-base font-bold text-slate-900 tracking-tight text-center mb-1 flex items-center gap-1.5 justify-center">
        <Sparkles className="w-4 h-4 text-slate-400" />
        Curating Your Custom Travel Experience
      </h3>
      <p className="text-xs font-mono text-slate-500 text-center animate-pulse min-h-[16px]">
        {MESSAGES[msgIndex]}
      </p>

      {/* Skeleton placeholders */}
      <div className="w-full max-w-md space-y-4 mt-8 animate-pulse text-slate-100">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
          <div className="space-y-2.5 w-full">
            <div className="h-4 bg-slate-100 rounded-md w-1/3" />
            <div className="h-3 bg-slate-100 rounded-md w-3/4" />
          </div>
        </div>

        <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
          <div className="h-3 bg-slate-100 rounded-md w-full" />
          <div className="h-3 bg-slate-100 rounded-md w-5/6" />
          <div className="h-3 bg-slate-100 rounded-md w-4/6" />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6 pt-6">
          <div className="h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 px-3">
            <ClipboardList className="w-4 h-4 text-slate-200" />
            <div className="h-2.5 bg-slate-100 rounded-md w-2/3" />
          </div>
          <div className="h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-2 px-3">
            <BedDouble className="w-4 h-4 text-slate-200" />
            <div className="h-2.5 bg-slate-100 rounded-md w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
