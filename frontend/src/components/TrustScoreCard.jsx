import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, AlertTriangle, CheckCircle2, Award } from 'lucide-react';

export default function TrustScoreCard({
  score = 82,
  maxScore = 100,
  ratingLabel = 'Strong Profile',
  stabilityMarker = 'A+ Stability (36 Mo. Track Record)',
  safetyAlert = false,
  compact = false
}) {
  // Normalize score
  const safeScore = Math.min(maxScore, Math.max(0, score));
  const percentage = (safeScore / maxScore) * 100;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Colors based on score and safety
  const isOptimal = safeScore >= 75 && !safetyAlert;
  const isModerate = safeScore >= 50 && safeScore < 75;

  const ringColor = safetyAlert
    ? '#EF4444'
    : isOptimal
    ? '#059669'
    : isModerate
    ? '#EAB308'
    : '#F97316';

  const badgeBg = safetyAlert
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : isOptimal
    ? 'bg-emerald-50 text-[#059669] border-emerald-200'
    : 'bg-amber-50 text-amber-700 border-amber-200';

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-12 h-12 -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#E2E8F0"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={ringColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute font-mono font-extrabold text-xs text-[#0F172A]">
            {safeScore}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#0F172A]">{ratingLabel}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeBg}`}>
              {safeScore}/100
            </span>
          </div>
          <span className="text-[11px] text-[#64748B] block mt-0.5">{stabilityMarker}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm relative overflow-hidden">
      {/* Corner Glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40"
        style={{ background: isOptimal ? '#059669' : '#2563EB' }}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className={`w-4 h-4 ${safetyAlert ? 'text-rose-500' : 'text-[#059669]'}`} />
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#64748B]">
              AI Underwriting Trust Score
            </span>
          </div>
          <h4 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
            {safetyAlert ? 'Cap Threshold Exceeded' : ratingLabel}
          </h4>
        </div>

        <div className={`px-2.5 py-1 rounded-full border text-xs font-bold font-mono ${badgeBg}`}>
          {safeScore >= 80 ? 'HIGH TRUST' : 'VERIFIED'}
        </div>
      </div>

      {/* Dial and Readouts */}
      <div className="my-6 flex items-center justify-around gap-6">
        {/* Radial Progress Gauge */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="#F1F5F9"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Value Track */}
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              stroke={ringColor}
              strokeWidth="9"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black font-mono tracking-tight text-[#0F172A]">
              {safeScore}
            </span>
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase">/ 100</span>
          </div>
        </div>

        {/* Historical Breakdown */}
        <div className="space-y-2.5 flex-1">
          <div>
            <span className="text-[11px] font-medium text-[#64748B] block">Historical Stability</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              <span className="text-xs font-bold text-[#0F172A]">{stabilityMarker}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#64748B] block">POS Sales Consistency</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-xs font-bold text-[#0F172A]">Top 8% in Delhi NCR Retail</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice or Warning */}
      {safetyAlert ? (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Requested terms exceed your automated AI safety cap. Submitting this proposal will require institutional escrow review.
          </p>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-[#64748B] flex items-center justify-between font-mono">
          <span>UNDERWRITING MODEL: POS-RUNRATE-v3</span>
          <span className="text-[#059669] font-bold">SYNCHRONIZED</span>
        </div>
      )}
    </div>
  );
}
