import React from 'react';

/**
 * Loading — Branded full-screen loading spinner
 * Matches the CreditFlow design system.
 */
export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-5">
      {/* Brand Mark */}
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white font-black text-base shadow-xl shadow-blue-500/25 animate-pulse">
          CF
        </div>
        <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#F8FAFC] animate-ping" />
      </div>

      {/* Shimmer Bar */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-32 h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400"
            style={{ animation: 'loadingShimmer 1.5s ease-in-out infinite alternate' }}
          />
        </div>
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
          {message}
        </span>
      </div>

      <style>{`
        @keyframes loadingShimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
