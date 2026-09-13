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
  Wallet,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import umeedLogo from '../assets/umeed-logo.png';

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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isActive ? 'bg-white/20' : isDone ? 'bg-emerald-500/20' : 'bg-slate-200/60'
                }`}
              >
                {phase.id}
              </span>
              <span>PHASE {phase.id === 1 ? 'A' : phase.id === 2 ? 'B' : 'C'}: {phase.label}</span>
            </div>
            {idx < PHASES.length - 1 && (
              <div
                className={`h-px w-3 sm:w-4 shrink-0 ${
                  isDone || isActive ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
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
      // error set in context
    }
  };

  const errorMsg = localError || error;

  return (
    <div className="min-h-screen bg-[#F1F5EE] text-slate-900 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden flex flex-col items-center justify-center p-4 py-12">
      {/* Paper Grain Overlay */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none -z-0 opacity-[0.05] mix-blend-multiply">
        <filter id="umeed-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.85 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#umeed-grain)" />
      </svg>

      {/* Background Split Linework */}
      <svg
        className="fixed top-0 left-0 w-full h-[960px] pointer-events-none -z-0 opacity-80"
        viewBox="0 0 1440 960"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
      >
        <path d="M -120 90 C 260 90, 480 300, 740 300" stroke="#0F766E" strokeOpacity="0.09" strokeWidth="1.5" />
        <path d="M 740 300 C 900 300, 980 130, 1300 110 L 1560 100" stroke="#0F766E" strokeOpacity="0.09" strokeWidth="1.5" />
        <path d="M 740 300 C 860 430, 900 600, 1120 700" stroke="#059669" strokeOpacity="0.12" strokeWidth="1.5" />
        <path d="M 740 300 C 660 470, 590 610, 470 760" stroke="#B45309" strokeOpacity="0.10" strokeWidth="1.5" />
        <circle cx="740" cy="300" r="3.5" fill="#0F766E" fillOpacity="0.3" />
      </svg>

      {/* Brand Logo Header */}
      <div className="mb-6 text-center z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 border border-emerald-400/30 group-hover:scale-105 transition-transform shadow-md shadow-emerald-500/20">
            <img src={umeedLogo} alt="Umeed Logo" className="h-8 w-auto object-contain brightness-200 contrast-200" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-black text-[24px] text-slate-900 tracking-tight flex items-center gap-2 leading-tight">
              Umeed
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </span>
            <span className="text-[10px] font-mono tracking-widest bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent uppercase font-bold whitespace-nowrap">
              Small Steps • Brighter Tomorrows
            </span>
          </div>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Sandbox Callout Banner */}
        <div className="mb-4 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-300 text-emerald-800 text-[11px] font-mono font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-spin" style={{ animationDuration: '5s' }} />
          <span>DEMO SANDBOX FLOW • HACKATHON DEMONSTRATION MODE</span>
        </div>

        {/* Phase Stepper */}
        <div className="mb-4">
          <PhaseStepper currentPhase={1} />
        </div>

        {/* Main Card Wrapper */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative">
          {/* Top Accent Bar */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

          <div className="p-6 sm:p-8">
            {/* Account Persona Selector */}
            <div className="mb-6">
              <label className="block text-[11px] font-mono font-extrabold text-slate-500 uppercase tracking-widest mb-2">
                Select Account Type / Persona
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedRole('merchant')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'merchant'
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Merchant (POS)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('investor')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    selectedRole === 'investor'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Investor (LP)</span>
                </button>
              </div>
            </div>

            {/* Heading Section */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedRole === 'investor' ? 'Investor Sign In & Onboarding' : 'Merchant Sign In & Onboarding'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium leading-relaxed">
                {selectedRole === 'investor'
                  ? 'Enter phone to access the LP investment marketplace and deploy capital.'
                  : 'Enter phone to register your shop and activate automatic split POS terminal.'}
              </p>
            </div>

            {/* Phone Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-extrabold text-slate-700 uppercase tracking-widest mb-2">
                  Mobile Number
                </label>
                <div className="flex rounded-2xl border-2 border-slate-200 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-100 overflow-hidden transition-all bg-white shadow-xs">
                  {/* Country Code Badge */}
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 bg-slate-50 border-r border-slate-200 text-sm font-semibold text-slate-700 shrink-0">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="font-mono font-bold">+91</span>
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">(India)</span>
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
                    maxLength={11}
                    className="flex-1 px-3 sm:px-4 py-3 text-sm sm:text-base font-mono font-bold text-slate-900 bg-white focus:outline-none placeholder:text-slate-300 placeholder:font-normal min-w-0"
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

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading || phone.length < 10}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Demo Info Box */}
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-800">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  <strong>Sandbox:</strong> Enter any 10-digit number. Demo OTP code will be shown on the next screen.
                </span>
              </div>
            </form>

            {/* Escrow Notice */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-mono text-slate-500 pt-4 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Instant security check powered by P2P escrow protocol.</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Links */}
        <div className="mt-6 flex items-center justify-between text-xs font-mono font-semibold text-slate-500 px-2">
          <Link
            to={`/register?role=${selectedRole}`}
            className="hover:text-emerald-600 transition-colors flex items-center gap-1"
          >
            <span>New here? Create Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={selectedRole === 'investor' ? '/investor/onboarding' : '/merchant/onboarding'}
            className="hover:text-emerald-600 transition-colors flex items-center gap-1"
          >
            <span>Direct Onboarding Setup</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}