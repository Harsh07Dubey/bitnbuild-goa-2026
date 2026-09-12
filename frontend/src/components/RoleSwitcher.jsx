import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Store, ArrowLeftRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RoleSwitcher() {
  const { role, switchRole } = useAuth();
  const isInvestor = role === 'investor';

  const handleToggle = () => {
    switchRole(isInvestor ? 'merchant' : 'investor');
  };

  return (
    <aside
      aria-label="Demo Persona Switcher"
      className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 select-none print:hidden font-sans"
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-center gap-2"
      >
        {/* Main Pill Button */}
        <button
          onClick={handleToggle}
          id="demo-role-switcher-btn"
          aria-label={`Current role: ${role}. Click to switch to ${isInvestor ? 'merchant' : 'investor'}`}
          className="group relative flex items-center gap-2 sm:gap-3 pl-2.5 pr-3 sm:pl-3.5 sm:pr-4 py-2 sm:py-2.5 rounded-full bg-[#0F172A]/95 hover:bg-[#0F172A] text-white shadow-xl shadow-slate-900/30 border border-slate-700/60 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Subtle glowing ring indicator */}
          <span
            className={`absolute -inset-0.5 rounded-full opacity-30 blur-sm transition-all duration-500 group-hover:opacity-75 ${
              isInvestor ? 'bg-emerald-500' : 'bg-blue-500'
            }`}
          />

          {/* Active Mode Icon Badge */}
          <div
            className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm shrink-0 ${
              isInvestor
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
            }`}
          >
            {isInvestor ? (
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            ) : (
              <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            )}
          </div>

          {/* Label and Badge */}
          <div className="relative flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Persona
              </span>
              <span
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse ${
                  isInvestor ? 'bg-emerald-400' : 'bg-blue-400'
                }`}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] sm:text-xs font-extrabold text-white tracking-wide">
                {isInvestor ? 'Investor (LP)' : 'Merchant (POS)'}
              </span>
            </div>
          </div>

          {/* Quick Swap Icon */}
          <div className="relative ml-0.5 sm:ml-1 pl-1.5 sm:pl-2 border-l border-slate-700/80 flex items-center text-slate-400 group-hover:text-white transition-colors">
            <ArrowLeftRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:rotate-180 transition-transform duration-300" />
          </div>
        </button>
      </motion.div>
    </aside>
  );
}
