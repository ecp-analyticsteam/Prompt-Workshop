/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-8 h-8 bg-slate-900 rounded-sm flex items-center justify-center transition-transform hover:scale-105">
            <div className="w-3.5 h-3.5 border-2 border-white rotate-45"></div>
          </div>
          <div>
            <h1 className="text-base font-bold font-sans text-slate-900 tracking-wider uppercase">
              VOYAGER <span className="text-slate-400 font-normal">PLANNER</span>
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Strict Use Case Layers</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-500 bg-slate-50 border border-slate-200/60 px-3 py-1.5 rounded-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>System Secure</span>
        </div>
      </div>
    </header>
  );
}
