import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Store,
  MapPin,
  Tag,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Sparkles,
  Info,
  ShieldCheck,
  Building2,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PHASES = [
  { id: 1, label: 'PHONE LOGIN' },
  { id: 2, label: 'OTP VERIFICATION' },
  { id: 3, label: 'PROFILE ONBOARDING' },
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

const CATEGORIES = [
  { value: '', label: 'Select Business Category...' },
  { value: 'Retail (Food & Grocery)', label: '🛒 Retail (Food & Grocery)' },
  { value: 'Retail (Apparel & General)', label: '👕 Retail (Apparel & General)' },
  { value: 'Food & Beverage (Bistro / Cafe)', label: '☕ Food & Beverage (Bistro / Cafe)' },
  { value: 'Electronics & Appliances', label: '📱 Electronics & Appliances' },
];

export default function MerchantOnboarding() {
  const navigate = useNavigate();
  const { completeMerchantProfile, isLoading, error, clearError, user, setDemoMerchant } = useAuth();

  const [form, setForm] = useState({
    stallName: '',
    shopAddress: '',
    category: '',
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
    if (!form.stallName.trim()) errors.stallName = 'Shop name is required.';
    if (!form.shopAddress.trim()) errors.shopAddress = 'Shop address is required.';
    if (!form.category) errors.category = 'Please select a business category.';
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
      await completeMerchantProfile(form);
      navigate('/merchant/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Registration failed. Please try again.');
    }
  };

  // Demo bypass — fill and submit instantly
  const handleDemoBypass = () => {
    setDemoMerchant();
    navigate('/merchant/dashboard');
  };

  const errorMsg = localError || error;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-12">
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
          <span>DEMO SANDBOX FLOW • HACKATHON DEMONSTRATION MODE</span>
        </div>

        {/* Phase Stepper */}
        <div className="mb-4">
          <PhaseStepper currentPhase={3} />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#059669] via-emerald-500 to-teal-400" />

          <div className="p-7">
            {/* Heading */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#059669] shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold font-display text-slate-900 tracking-tight">
                  Complete Shop Profile
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Add your trade information to spin up verified POS terminals.
                </p>
              </div>
            </div>

            {/* Sandbox Disclaimer Box */}
            <div className="mb-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Demo Mode Active</span>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    No PAN card, GSTIN or real bank routing required for virtual presentation. This is a hackathon sandbox environment.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Stall Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stall / Shop Name
                </label>
                <div className={`flex items-center rounded-xl border-2 transition-all overflow-hidden ${
                  fieldErrors.stallName
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100'
                }`}>
                  <div className="px-3 py-3 bg-slate-50 border-r border-slate-200">
                    <Store className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={form.stallName}
                    onChange={(e) => handleChange('stallName', e.target.value)}
                    placeholder="Sharma General Store"
                    className="flex-1 px-4 py-3 text-sm font-medium text-slate-900 bg-white focus:outline-none placeholder:text-slate-300"
                  />
                </div>
                {fieldErrors.stallName && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.stallName}</p>
                )}
              </div>

              {/* Shop Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Shop Location / Address
                </label>
                <div className={`flex items-start rounded-xl border-2 transition-all overflow-hidden ${
                  fieldErrors.shopAddress
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100'
                }`}>
                  <div className="px-3 pt-3 bg-slate-50 border-r border-slate-200">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  <textarea
                    value={form.shopAddress}
                    onChange={(e) => handleChange('shopAddress', e.target.value)}
                    placeholder="Sector 4, Main Bazar Road, Jaipur"
                    rows={2}
                    className="flex-1 px-4 py-3 text-sm font-medium text-slate-900 bg-white focus:outline-none placeholder:text-slate-300 resize-none"
                  />
                </div>
                {fieldErrors.shopAddress && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.shopAddress}</p>
                )}
              </div>

              {/* Business Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Business Category
                </label>
                <div className={`relative flex items-center rounded-xl border-2 transition-all overflow-hidden ${
                  fieldErrors.category
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : 'border-slate-200 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100'
                }`}>
                  <div className="px-3 py-3 bg-slate-50 border-r border-slate-200">
                    <Tag className="w-4 h-4 text-slate-400" />
                  </div>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="flex-1 px-4 py-3 text-sm font-medium text-slate-900 bg-white focus:outline-none appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value} disabled={cat.value === ''}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                {fieldErrors.category && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">{fieldErrors.category}</p>
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
                className="w-full py-4 px-5 bg-[#059669] hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Your Merchant Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete Registration & Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Quick Demo Bypass */}
              <button
                type="button"
                onClick={handleDemoBypass}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Demo: Skip & Enter as Sharma General Store</span>
              </button>
            </form>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-5 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
          <span>Data encrypted end-to-end. Merchant profile stored in tamper-proof escrow ledger.</span>
        </div>
      </motion.div>
    </div>
  );
}
