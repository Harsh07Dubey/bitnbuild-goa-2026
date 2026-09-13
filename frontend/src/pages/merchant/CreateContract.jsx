import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FilePlus2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  Coins,
  Sliders,
  HelpCircle,
  Info,
  Loader2
} from 'lucide-react';
import TrustScoreCard from '../../components/TrustScoreCard';
import { formatCurrency } from '../../utils/formatCurrency';
import { getTrustScore } from '../../services/aiService';
import { createContract, listContract } from '../../services/contractService';

export default function CreateContract() {
  const navigate = useNavigate();

  // Form States with required defaults
  const [principal, setPrincipal] = useState(50000);
  const [capAmount, setCapAmount] = useState(60000);
  const [weeklyMinimum, setWeeklyMinimum] = useState(2500);
  const [sharePct, setSharePct] = useState(15);
  const [durationDays, setDurationDays] = useState(90);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // AI Underwriting State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState({
    trust_score: 82,
    max_contract_cap: 60000,
    risk_rationale: 'AI Underwriting: Positive daily POS run-rate justifies requested advance.',
  });

  // Debounced live AI Trust Score evaluation on form changes
  useEffect(() => {
    let isCancelled = false;
    setAiLoading(true);

    const timer = setTimeout(async () => {
      try {
        const result = await getTrustScore({
          principal,
          revenue: 180000,
          dailyPosVolume: 28500,
          businessAge: 3.5,
          gstVerified: true,
          repaymentRate: 96,
        });
        if (!isCancelled) {
          setAiEvaluation(result);
        }
      } catch (err) {
        console.warn('AI scoring debounce error:', err);
      } finally {
        if (!isCancelled) setAiLoading(false);
      }
    }, 450);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [principal, sharePct, durationDays]);

  // Dynamic AI recommended cap
  const aiRecommendedCap = useMemo(() => {
    return aiEvaluation.max_contract_cap || Math.round(principal * 1.20);
  }, [aiEvaluation, principal]);

  // Safety cap evaluation
  const isWithinSafetyCap = capAmount <= aiRecommendedCap && principal <= 500000;

  // Active Trust Score
  const currentTrustScore = aiEvaluation.trust_score || 82;

  // Estimated daily repayment from POS based on average sales of ₹28,500/day
  const estimatedDailySplit = useMemo(() => {
    const avgDailyPos = 28500;
    return Math.round(avgDailyPos * (sharePct / 100));
  }, [sharePct]);

  // Handle Quick Multiplier selection
  const handleMultiplier = (multiple) => {
    setCapAmount(Math.round(principal * multiple));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Create contract on live backend
      const newContract = await createContract({
        principal,
        share_pct: sharePct,
        cap_amount: capAmount,
        duration_days: durationDays,
        weekly_minimum: weeklyMinimum,
        trustScore: currentTrustScore,
        business_age_months: 42,
        monthly_revenue: 180000,
        previous_repayment_rate: 96,
      });

      // 2. Transition contract state to LISTED for marketplace visibility
      if (newContract?.id) {
        await listContract(newContract.id);
      }

      setIsSubmitting(false);
      setSubmittedSuccess(true);

      setTimeout(() => {
        navigate('/merchant/dashboard');
      }, 1600);
    } catch (err) {
      console.warn('Contract creation error:', err);
      setErrorMessage(err.message || 'Failed to create contract on server.');
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>AI-ASSISTED CONTRACT STRUCTURING</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Create Financing Contract
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Configure working capital requirements. Repayment is programmatically routed from your daily POS UPI volume.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            MERCHANT ID: <strong className="text-slate-800">SHARMA-GP-DELHI</strong>
          </span>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN: FORM INPUTS & ESTIMATED BANNER (7 COLS)
        ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-6">
            {/* Input 1: Requested Principal Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <span>1. Requested Working Capital (Principal)</span>
                </label>
                <span className="text-xs font-mono text-slate-500">Min: ₹10,000 • Step: ₹5,000</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min={10000}
                  max={500000}
                  step={5000}
                  value={principal}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPrincipal(val);
                    setCapAmount(Math.round(val * 1.20));
                  }}
                  className="w-full pl-9 pr-4 py-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xl font-black text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
                  required
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-2 mt-2.5 flex-wrap">
                {[25000, 50000, 100000, 150000].map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => {
                      setPrincipal(amt);
                      setCapAmount(Math.round(amt * 1.20));
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      principal === amt
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {formatCurrency(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Total Repayment Cap Amount */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] flex items-center gap-1.5">
                  <span>2. Total Repayment Cap Amount</span>
                </label>
                <span className="text-xs font-mono text-slate-500">
                  Multiplier: {(capAmount / (principal || 1)).toFixed(2)}x
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min={principal}
                  step={1000}
                  value={capAmount}
                  onChange={(e) => setCapAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xl font-black text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
                  required
                />
              </div>

              {/* Multiplier Presets */}
              <div className="flex items-center gap-2 mt-2.5">
                <span className="text-xs text-[#64748B] font-medium">Standard Caps:</span>
                {[1.15, 1.20, 1.25].map((mult) => (
                  <button
                    type="button"
                    key={mult}
                    onClick={() => handleMultiplier(mult)}
                    className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {mult}x ({formatCurrency(Math.round(principal * mult))})
                  </button>
                ))}
              </div>
            </div>

            {/* Two-Column Sub-inputs: Revenue Share Slider & Weekly Minimum */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Revenue Share Percentage Slider */}
              <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0F172A] uppercase">3. POS Revenue Share</span>
                  <span className="text-sm font-extrabold text-[#2563EB] font-mono">{sharePct}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={20}
                  step={1}
                  value={sharePct}
                  onChange={(e) => setSharePct(Number(e.target.value))}
                  className="w-full accent-[#2563EB] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                  <span>10% (Low Impact)</span>
                  <span>15%</span>
                  <span>20% (Fast Cap)</span>
                </div>
                <span className="text-[11px] text-[#64748B] block mt-2">
                  ~₹{estimatedDailySplit}/day based on average sales
                </span>
              </div>

              {/* Standard Minimum Weekly Commitment */}
              <div className="p-4 rounded-xl bg-slate-50 border border-[#E2E8F0]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0F172A] uppercase">4. Weekly Minimum</span>
                  <span className="text-sm font-extrabold text-[#0F172A] font-mono">{formatCurrency(weeklyMinimum)}</span>
                </div>
                <input
                  type="number"
                  min={1000}
                  step={500}
                  value={weeklyMinimum}
                  onChange={(e) => setWeeklyMinimum(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  required
                />
                <span className="text-[11px] text-[#64748B] block mt-2">
                  Satisfied automatically through POS UPI splits
                </span>
              </div>
            </div>

            {/* Input 5: Duration Days */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                  5. Expected Financing Horizon
                </label>
                <span className="text-xs font-mono text-slate-500">{durationDays} Calendar Days</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[60, 90, 120].map((days) => (
                  <button
                    type="button"
                    key={days}
                    onClick={() => setDurationDays(days)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      durationDays === days
                        ? 'bg-blue-50/80 border-[#2563EB] text-[#2563EB] shadow-xs'
                        : 'bg-white border-[#E2E8F0] text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>{days} Days Term</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ========================================================
                ESTIMATED CONTRACT BANNER
            ======================================================== */}
            <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  ESTIMATED CONTRACT SUMMARY
                </span>
                {/* Safety Status Pill */}
                {isWithinSafetyCap ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Terms are within AI safety cap</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Exceeds automated safety cap</span>
                  </div>
                )}
              </div>

              <div className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                {formatCurrency(capAmount)} maximum • {sharePct}% share • {durationDays} day term
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs font-mono text-slate-300">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Net Working Capital</span>
                  <span className="text-white font-bold">{formatCurrency(principal)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Weekly Split Min.</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(weeklyMinimum)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Fixed Cost</span>
                  <span className="text-blue-300 font-bold">{formatCurrency(capAmount - principal)}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || submittedSuccess}
              className="w-full py-4 px-6 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              {isSubmitting ? (
                <span>Validating & Registering Contract...</span>
              ) : submittedSuccess ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Contract Submitted & Listed Successfully!
                </span>
              ) : (
                <>
                  <span>Submit & Request Listing</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* ========================================================
            RIGHT COLUMN: STICKY LIVE AI ASSESSMENT CARD (5 COLS)
        ======================================================== */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          {/* Trust Score Radial Dial Card */}
          <TrustScoreCard
            score={currentTrustScore}
            maxScore={100}
            ratingLabel={currentTrustScore >= 75 ? 'Strong Profile' : 'Moderate Profile'}
            safetyAlert={!isWithinSafetyCap}
            stabilityMarker="A+ Stability (36 Mo. Track Record)"
          />

          {/* AI Recommended Cap Ceiling Box */}
          <div className="p-6 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#64748B] font-bold">
                AI UNDERWRITING CEILING
              </span>
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
            </div>

            <div>
              <span className="text-xs text-[#64748B] block">AI Recommended Cap</span>
              <span className="text-2xl font-black text-[#0F172A] font-mono">
                {formatCurrency(aiRecommendedCap)}
              </span>
              <span className="text-xs text-[#059669] font-medium block mt-0.5">
                Maximum non-collateralized limit for your POS run-rate
              </span>
            </div>

            {/* AI Risk Rationale Callout */}
            <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                <Info className="w-4 h-4 text-[#2563EB]" />
                <span>AI Risk Rationale</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                System enforces a hard cap based on AI Trust Score and POS daily run-rate. Terms submitted beyond the cap will require manual escrow review.
              </p>
            </div>

            {/* Historical Point-of-Sale Telemetry */}
            <div className="pt-2 border-t border-slate-200 space-y-2 text-xs text-[#64748B]">
              <div className="flex justify-between font-mono">
                <span>VERIFIED 90-DAY POS RUN-RATE</span>
                <span className="font-bold text-[#0F172A]">₹28,500 / Day</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>HISTORICAL BOUNCES</span>
                <span className="font-bold text-[#059669]">0 (Zero)</span>
              </div>
              <div className="flex justify-between font-mono">
                <span>GST STATUS</span>
                <span className="font-bold text-[#059669]">Verified • Spotless</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
