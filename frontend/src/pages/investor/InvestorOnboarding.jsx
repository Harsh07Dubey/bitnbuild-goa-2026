import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Wallet,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronDown,
  Building2,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';

const PHASES = [
  { id: 1, label: 'PHONE LOGIN' },
  { id: 2, label: 'OTP VERIFICATION' },
  { id: 3, label: 'INVESTOR PROFILE' },
];

function PhaseStepper({ currentPhase = 3 }) {
  return (
    <div className="flex items-center gap-0 text-[11px] font-mono font-bold overflow-x-auto pb-1">
      {PHASES.map((phase, idx) => {
        const isActive = phase.id === currentPhase;
        const isDone = phase.id < currentPhase;
        return (
          <React.Fragment key={phase.id}>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : isDone
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                isActive ? 'bg-white/20' : isDone ? 'bg-emerald-500/20' : 'bg-slate-200/60'
              }`}>
                {isDone ? '✓' : phase.id}
              </span>
              <span>PHASE {phase.id === 1 ? 'A' : phase.id === 2 ? 'B' : 'C'}: {phase.label}</span>
            </div>
            {idx < PHASES.length - 1 && (
              <div className={`h-px w-4 shrink-0 ${isDone || isActive ? 'bg-blue-300' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const INVESTOR_TYPES = [
  { value: 'Accredited LP / Angel', label: '🌟 Individual Angel / Accredited LP' },
  { value: 'Syndicate Member', label: '🤝 Syndicate & Micro-Fund Member' },
  { value: 'Family Office / Institutional', label: '🏛️ Family Office / Institutional' },
  { value: 'Retail Liquidity Provider', label: '💼 Retail Liquidity Provider' }
];

const ALLOCATION_PRESETS = [100000, 250000, 500000, 1000000];

export default function InvestorOnboarding() {
  const navigate = useNavigate();
  const { completeInvestorProfile, isLoading, error, clearError, user, setDemoInvestor } = useAuth();

  const [form, setForm] = useState({
    name: user?.name && user.name !== 'A. Mehta' ? user.name : '',
    email: user?.email || '',
    investorType: 'Accredited LP / Angel',
    allocationCommitment: 500000,
    payoutRef: 'lp-sandbox@okaxis'
  });
  const [localError, setLocalError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    if (localError) setLocalError('');
    if (error) clearError();
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full name is required.';
    if (!form.email.trim() || !form.email.includes('@')) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!form.payoutRef.trim()) {
      errors.payoutRef = 'Payout reference or UPI ID is required.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    try {
      await completeInvestorProfile(form);
      navigate('/investor/marketplace');
    } catch (err) {
      setLocalError(err.message || 'Registration failed. Please try again.');
    }
  };

  // Demo bypass — fill and submit instantly
  const handleDemoBypass = () => {
    setDemoInvestor();
    navigate('/investor/marketplace');
  };

  const errorMsg = localError || error;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-8 sm:py-12 font-sans">
      {/* Brand */}
      <div className="mb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            CF
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-extrabold text-lg text-slate-900 leading-none tracking-tight">
              CREDIT<span className="text-[#2563EB]">FLOW</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              FairFuture Protocol
            </span>
          </div>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        {/* Sandbox Banner */}
        <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>INVESTOR ONBOARDING • HACKATHON DEMONSTRATION MODE</span>
        </div>

        {/* Phase Stepper */}
        <div className="mb-4">
          <PhaseStepper currentPhase={3} />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#2563EB] via-indigo-500 to-emerald-400" />

          <div className="p-5 sm:p-7">
            {/* Heading */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 tracking-tight">
                  Investor & LP Onboarding
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Set up your liquidity profile to deploy capital into verified merchant cash advances.
                </p>
              </div>
            </div>

            {/* Sandbox Disclaimer Box */}
            <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">No Friction Guarantee</span>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    No PAN, accredited net-worth filings or card details stored. Connect simulated sandbox funds instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name / Entity Name
                </label>
                <div className={`flex items-center rounded-xl border-2 transition-all overflow-hidden ${
                  fieldErrors.name
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100'
                }`}>
                  <div className="px-3 py-3 bg-slate-50 border-r border-slate-200">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Ananya Mehta"
                    className="flex-1 px-4 py-3 text-sm font-medium text-slate-900 bg-white focus:outline-none placeholder:text-slate-300"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (for Settlement Reports)
                </label>
                <div className={`flex items-center rounded-xl border-2 transition-all overflow-hidden ${
                  fieldErrors.email
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100'
                }`}>
                  <div className="px-3 py-3 bg-slate-50 border-r border-slate-200">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="ananya@syndicate.capital"
                    className="flex-1 px-4 py-3 text-sm font-medium text-slate-900 bg-white focus:outline-none placeholder:text-slate-300"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Investor Profile Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Investor Category
                </label>
                <div className="relative flex items-center rounded-xl border-2 border-slate-200 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100 transition-all overflow-hidden">
                  <div className="px-3 py-3 bg-slate-50 border-r border-slate-200">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <select
                    value={form.investorType}
                    onChange={(e) => handleChange('investorType', e.target.value)}
                    className="flex-1 px-4 py-3 text-sm font-medium text-slate-900 bg-white focus:outline-none appearance-none cursor-pointer"
                  >
                    {INVESTOR_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Allocation Commitment (Liquid Balance) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Simulated Liquid Capital (LP Pool)
                  </label>
                  <span className="text-xs font-mono font-bold text-[#2563EB]">
                    {formatCurrency(form.allocationCommitment)}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {ALLOCATION_PRESETS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleChange('allocationCommitment', amt)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                        form.allocationCommitment === amt
                          ? 'bg-[#2563EB] text-white shadow-sm shadow-blue-500/20'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test-Mode Payout Reference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Test Payout Setup Ref (UPI VPA / Sandbox Escrow)
                </label>
                <div className={`flex items-center rounded-xl border-2 transition-all overflow-hidden ${
                  fieldErrors.payoutRef
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100'
                }`}>
                  <div className="px-3 py-3 bg-slate-50 border-r border-slate-200 font-mono text-xs text-slate-500">
                    VPA
                  </div>
                  <input
                    type="text"
                    value={form.payoutRef}
                    onChange={(e) => handleChange('payoutRef', e.target.value)}
                    placeholder="lp-sandbox@okaxis"
                    className="flex-1 px-4 py-3 text-sm font-mono text-slate-900 bg-white focus:outline-none placeholder:text-slate-300"
                  />
                </div>
                {fieldErrors.payoutRef && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.payoutRef}</p>
                )}
              </div>

              {/* Global error */}
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold"
                >
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  {errorMsg}
                </motion.div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 sm:py-4 px-5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Activating Investor Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete LP Signup & Enter Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Bypass */}
              <button
                type="button"
                onClick={handleDemoBypass}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Demo: Skip & Enter as Ananya Mehta (Accredited LP)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-5 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
          <span>Tier-2 KYC Simulation. Automated P2P POS sweep returns connected.</span>
        </div>
      </motion.div>
    </div>
  );
}
