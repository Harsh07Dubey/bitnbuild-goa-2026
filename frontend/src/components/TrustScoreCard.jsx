import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Info, CheckCircle2, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

export default function TrustScoreCard({
  score = 82,
  recommendedCap = 60000,
  rationale = 'System enforces a hard cap based on AI Trust Score and POS run-rate. Refreshing live.',
  variant = 'widget',
  // Backward compatibility legacy props
  compact = false,
  safetyAlert = false,
  ratingLabel,
  stabilityMarker = 'A+ Stability (36 Mo. Track Record)',
  maxScore = 100
}) {
  // Normalize score
  const safeScore = Math.min(maxScore, Math.max(0, Number(score) || 0));
  const percentage = (safeScore / maxScore) * 100;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine Tier (High Trust >= 75, Moderate >= 50, Risk Alert < 50)
  const isHighTrust = safeScore >= 75 && !safetyAlert;
  const isModerate = safeScore >= 50 && safeScore < 75 && !safetyAlert;
  const isRiskAlert = safeScore < 50 || safetyAlert;

  const tier = isRiskAlert
    ? {
        label: 'RISK ALERT',
        rating: ratingLabel || 'High Default Risk',
        badgeBg: 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
        ringColor: '#DC2626',
        glowColor: '#EF4444'
      }
    : isModerate
    ? {
        label: 'MODERATE',
        rating: ratingLabel || 'Acceptable Risk',
        badgeBg: 'bg-[#FEF9C3] text-[#CA8A04] border-[#FDE047]',
        ringColor: '#CA8A04',
        glowColor: '#EAB308'
      }
    : {
        label: 'HIGH TRUST',
        rating: ratingLabel || 'Strong Profile',
        badgeBg: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
        ringColor: '#059669',
        glowColor: '#10B981'
      };

  // Determine active render style from variant or compact prop
  const activeVariant = compact ? 'compact-badge' : variant;

  // ── Variant 1: Compact Badge ──────────────────────────────────────────────
  if (activeVariant === 'compact-badge') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E2E8F0] shadow-sm font-sans">
        <div className="relative w-11 h-11 flex items-center justify-center shrink-0">
          <svg className="w-11 h-11 -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} stroke="#E2E8F0" strokeWidth="10" fill="transparent" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={tier.ringColor}
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

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-[#0F172A] truncate">{tier.rating}</span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${tier.badgeBg}`}>
              {tier.label}
            </span>
          </div>
          <span className="text-[11px] text-[#64748B] block mt-0.5 truncate">{stabilityMarker}</span>
        </div>
      </div>
    );
  }

  // ── Variant 2 & 3: Widget / Full-Card ──────────────────────────────────────
  const isFullCard = activeVariant === 'full-card';

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm relative overflow-hidden font-sans">
      {/* Dynamic Ambient Glow */}
      <div
        className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-30"
        style={{ background: tier.glowColor }}
      />

      {/* Card Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck className={`w-4 h-4 ${isRiskAlert ? 'text-rose-500' : 'text-[#059669]'}`} />
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#64748B]">
              AI Underwriting Trust Score
            </span>
          </div>
          <h4 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
            {isRiskAlert ? 'Cap Threshold Alert' : tier.rating}
          </h4>
        </div>

        <div className={`px-2.5 py-1 rounded-full border text-xs font-bold font-mono tracking-wider ${tier.badgeBg}`}>
          {tier.label}
        </div>
      </div>

      {/* Visual Dial & Score Gauge */}
      <div className="my-6 flex items-center justify-around gap-6">
        {/* Radial Progress Meter */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <svg className="w-28 h-28 -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} stroke="#F1F5F9" strokeWidth="9" fill="transparent" />
            <motion.circle
              cx="50"
              cy="50"
              r={radius}
              stroke={tier.ringColor}
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

        {/* Readouts / Breakdown */}
        <div className="space-y-3 flex-1 min-w-0">
          <div>
            <span className="text-[11px] font-medium text-[#64748B] block">Historical Stability</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span className="text-xs font-bold text-[#0F172A] truncate">{stabilityMarker}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#64748B] block">POS Sales Consistency</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <span className="text-xs font-bold text-[#0F172A] truncate">Top 8% in Retail POS Run-Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommended Cap Ceiling Box */}
      {recommendedCap !== undefined && (
        <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#64748B] font-medium">AI Recommended Cap:</span>
            <div className="group relative cursor-pointer">
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-[#0F172A] text-white text-[10px] rounded-lg shadow-lg z-10 font-sans">
                Max safe borrowing cap calculated from 90-day POS sales volume.
              </div>
            </div>
          </div>
          <span className="text-sm font-mono font-black text-[#0F172A]">
            {formatCurrency(recommendedCap)}
          </span>
        </div>
      )}

      {/* Rationale Explanation Box */}
      {isRiskAlert ? (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            {rationale || 'Requested terms exceed automated AI safety cap. Requires institutional review.'}
          </p>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-[#64748B] space-y-1">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="font-bold text-slate-500 uppercase">AI Underwriting Rationale</span>
            <span className="text-[#059669] font-bold">SYNCHRONIZED</span>
          </div>
          <p className="text-[11px] text-[#475569] leading-relaxed">
            {rationale}
          </p>
        </div>
      )}
    </div>
  );
}
