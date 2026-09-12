import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Sparkles,
  Info,
  Globe,
  Store,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Phase stepper config
const PHASES = [
  { id: 1, label: 'PHONE LOGIN', active: true },
  { id: 2, label: 'OTP VERIFICATION', active: false },
  { id: 3, label: 'PROFILE SETUP', active: false },
];

function PhaseStepper({ currentPhase = 1 }) {
  return (
    <div className="flex items-center gap-0 text-[11px] font-mono font-bold overflow-x-auto pb-1 no-scrollbar">
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
                {phase.id}
              </span>
              <span>PHASE {phase.id === 1 ? 'A' : phase.id === 2 ? 'B' : 'C'}: {phase.label}</span>
            </div>
            {idx < PHASES.length - 1 && (
              <div className={`h-px w-3 sm:w-4 shrink-0 ${isDone || isActive ? 'bg-blue-300' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sendOtp, isLoading, error, clearError } = useAuth();

  const initialRole = searchParams.get('role') === 'investor' ? 'investor' : 'merchant';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'investor' || r === 'merchant') {
      setSelectedRole(r);
    }
  }, [searchParams]);

  // Format phone input — only digits, max 10
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    if (localError) setLocalError('');
    if (error) clearError();
  };

  // Format for display: "98765 43210"
  const displayPhone = phone.length > 5
    ? `${phone.slice(0, 5)} ${phone.slice(5)}`
    : phone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setLocalError('Please enter a valid 10-digit mobile number.');
      return;
    }
    try {
      await sendOtp(phone);
      navigate(`/verify-otp?phone=${phone}&role=${selectedRole}`);
    } catch (err) {
      // error already set in context
    }
  };

  const errorMsg = localError || error;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-8 font-sans">
      {/* Top Brand Bar */}
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
        className="w-full max-w-md"
      >
        {/* Sandbox Callout Banner */}
        <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>DEMO SANDBOX FLOW • HACKATHON DEMONSTRATION MODE</span>
        </div>

        {/* Phase Stepper */}
        <div className="mb-4">
          <PhaseStepper currentPhase={1} />
        </div>

        {/* Main Auth Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Top Accent */}
          <div className={`h-1.5 bg-gradient-to-r ${
            selectedRole === 'investor'
              ? 'from-[#2563EB] via-indigo-500 to-emerald-400'
              : 'from-[#059669] via-emerald-500 to-teal-400'
          }`} />

          <div className="p-5 sm:p-7">
            {/* Persona Role Selection Tabs */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Account Type / Persona
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedRole('merchant')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'merchant'
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Merchant (POS)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('investor')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'investor'
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Investor (LP)</span>
                </button>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 tracking-tight">
                {selectedRole === 'investor' ? 'Investor Sign In & Onboarding' : 'Merchant Sign In & Onboarding'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {selectedRole === 'investor'
                  ? 'Enter phone to access the LP investment marketplace and deploy capital.'
                  : 'Enter phone to register your shop and activate automatic split POS terminal.'}
              </p>
            </div>

            {/* Phone Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mobile Number
                </label>
                <div className="flex rounded-xl border-2 border-slate-200 focus-within:border-[#2563EB] focus-within:ring-4 focus-within:ring-blue-100 overflow-hidden transition-all bg-white">
                  {/* Country Code Pill */}
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-3 bg-slate-50 border-r border-slate-200 text-sm font-semibold text-slate-700 shrink-0">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span className="font-mono">+91</span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline">(India)</span>
                  </div>
                  {/* Phone Input */}
                  <input
                    id="phone-input"
                    type="tel"
                    inputMode="numeric"
                    value={displayPhone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    autoFocus
                    maxLength={11} // 10 digits + 1 space
                    className="flex-1 px-3 sm:px-4 py-3 text-sm sm:text-base font-mono font-semibold text-slate-900 bg-white focus:outline-none placeholder:text-slate-300 placeholder:font-normal min-w-0"
                  />
                </div>

                {errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5" />
                    {errorMsg}
                  </motion.p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                className="w-full py-3.5 px-5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4" />
                    <span>Send OTP Verification Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Hint */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>
                  <strong>Sandbox:</strong> Enter any 10-digit number. Demo OTP code will be shown on the next screen.
                </span>
              </div>
            </form>

            {/* Security Disclaimer */}
            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span>Instant security check powered by P2P escrow protocol.</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-slate-400 px-2">
          <Link
            to={selectedRole === 'investor' ? '/investor/onboarding' : '/merchant/onboarding'}
            className="hover:text-blue-600 transition-colors font-medium"
          >
            Direct Onboarding Setup →
          </Link>
          <Link to="/investor/marketplace" className="hover:text-blue-600 transition-colors font-medium">
            Explore Marketplace →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

