import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  Sparkles,
  Info,
  RefreshCw,
  CheckCircle2,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_OTP_CODE } from '../services/authService';

const PHASES = [
  { id: 1, label: 'PHONE LOGIN', active: false },
  { id: 2, label: 'OTP VERIFICATION', active: true },
  { id: 3, label: 'PROFILE SETUP', active: false },
];

function PhaseStepper({ currentPhase = 2, isInvestor = false }) {
  const phases = [
    { id: 1, label: 'PHONE LOGIN' },
    { id: 2, label: 'OTP VERIFICATION' },
    { id: 3, label: isInvestor ? 'INVESTOR SETUP' : 'SHOP ONBOARDING' },
  ];
  return (
    <div className="flex items-center gap-0 text-[11px] font-mono font-bold overflow-x-auto pb-1 no-scrollbar">
      {phases.map((phase, idx) => {
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
            {idx < phases.length - 1 && (
              <div className={`h-px w-3 sm:w-4 shrink-0 ${isDone || isActive ? 'bg-blue-300' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OTPVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyOtp, isLoading, error, clearError } = useAuth();

  const phone = searchParams.get('phone') || '';
  const role = searchParams.get('role') === 'investor' ? 'investor' : 'merchant';

  // 6 separate digit slots
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef([]);

  // Resend countdown
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);
  const [resendLoading, setResendLoading] = useState(false);
  const timerRef = useRef(null);

  // Success animation before navigation
  const [verified, setVerified] = useState(false);
  const [localError, setLocalError] = useState('');

  // Start countdown on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setResendSeconds((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Auto-focus first box
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (idx, val) => {
    const digit = val.replace(/\D/g, '').slice(-1); // single digit only
    const updated = [...digits];
    updated[idx] = digit;
    setDigits(updated);
    setLocalError('');
    if (error) clearError();

    // Advance focus
    if (digit && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const updated = [...digits];
        updated[idx] = '';
        setDigits(updated);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
        const updated = [...digits];
        updated[idx - 1] = '';
        setDigits(updated);
      }
    }
    if (e.key === 'ArrowLeft' && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  // Paste: split string across all 6 inputs
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (pasted.length > 0) {
      const updated = [...digits];
      for (let i = 0; i < OTP_LENGTH; i++) {
        updated[i] = pasted[i] || '';
      }
      setDigits(updated);
      // Focus the last filled or the next empty
      const nextIdx = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[nextIdx]?.focus();
    }
  };

  // Demo auto-fill
  const fillDemoCode = () => {
    const code = DEMO_OTP_CODE;
    setDigits(code.split(''));
    inputRefs.current[OTP_LENGTH - 1]?.focus();
    setLocalError('');
    if (error) clearError();
  };

  const currentCode = digits.join('');

  const handleVerify = useCallback(async (e) => {
    e?.preventDefault?.();
    if (currentCode.length < OTP_LENGTH) {
      setLocalError('Please enter the complete 6-digit OTP.');
      return;
    }
    try {
      await verifyOtp(phone, currentCode);
      setVerified(true);
      setTimeout(() => {
        if (role === 'investor') {
          navigate('/investor/onboarding');
        } else {
          navigate('/merchant/onboarding');
        }
      }, 800);
    } catch (err) {
      setLocalError(err.message || 'Invalid OTP. Please try again.');
    }
  }, [currentCode, phone, role, verifyOtp, navigate]);

  // Auto-submit when all 6 digits filled
  useEffect(() => {
    if (currentCode.length === OTP_LENGTH && !verified && !isLoading) {
      handleVerify();
    }
  }, [currentCode]);

  const handleResend = async () => {
    setResendLoading(true);
    setDigits(Array(OTP_LENGTH).fill(''));
    setLocalError('');
    if (error) clearError();
    setTimeout(() => {
      setResendLoading(false);
      setResendSeconds(RESEND_SECONDS);
      // Restart timer
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setResendSeconds((s) => {
          if (s <= 1) { clearInterval(timerRef.current); return 0; }
          return s - 1;
        });
      }, 1000);
      inputRefs.current[0]?.focus();
    }, 800);
  };

  const errorMsg = localError || error;
  const maskedPhone = phone ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : '+91 XXXXXXXXXX';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 py-8 font-sans">
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
        className="w-full max-w-md"
      >
        {/* Sandbox Banner */}
        <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>DEMO SANDBOX FLOW • HACKATHON DEMONSTRATION MODE</span>
        </div>

        {/* Phase Stepper */}
        <div className="mb-4">
          <PhaseStepper currentPhase={2} isInvestor={role === 'investor'} />
        </div>

        {/* OTP Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className={`h-1.5 bg-gradient-to-r ${
            role === 'investor'
              ? 'from-[#2563EB] via-indigo-500 to-emerald-400'
              : 'from-[#059669] via-emerald-500 to-teal-400'
          }`} />

          <div className="p-5 sm:p-7">
            {/* Heading */}
            <div className="mb-6 flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900 tracking-tight">
                    Verify Your Number
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Enter the 6-digit code sent to{' '}
                  <span className="font-semibold font-mono text-slate-800">{maskedPhone}</span>
                  {' '}·{' '}
                  <Link
                    to={`/login?role=${role}`}
                    className="text-[#2563EB] hover:underline font-semibold text-xs"
                  >
                    Change Number
                  </Link>
                </p>
              </div>
            </div>

            {/* Demo OTP Hint */}
            <div className="mb-5 flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100 gap-2">
              <div className="flex items-center gap-2 text-xs text-blue-700 min-w-0">
                <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate sm:overflow-visible">
                  Demo: <span className="font-mono font-bold tracking-wider">{DEMO_OTP_CODE}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={fillDemoCode}
                className="text-[11px] font-bold text-[#2563EB] bg-white border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Auto-fill →
              </button>
            </div>

            {/* 6-Box OTP Input */}
            <div className="flex gap-1.5 sm:gap-2.5 justify-center mb-5" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <motion.input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  animate={
                    verified
                      ? { scale: 1.05, borderColor: '#059669', backgroundColor: '#f0fdf4' }
                      : errorMsg
                      ? { x: [0, -4, 4, -4, 4, 0] }
                      : {}
                  }
                  transition={{ duration: 0.3 }}
                  className={`w-9 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-black font-mono rounded-xl border-2 focus:outline-none transition-all ${
                    verified
                      ? 'border-[#059669] bg-emerald-50 text-[#059669]'
                      : digit
                      ? 'border-[#2563EB] bg-blue-50/50 text-slate-900 shadow-sm shadow-blue-100'
                      : 'border-slate-200 bg-white text-slate-900 focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100'
                  }`}
                />
              ))}
            </div>

            {/* Error message */}
            <AnimatePresence>
              {errorMsg && !verified && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-rose-600 font-semibold text-center flex items-center justify-center gap-1.5 mb-4"
                >
                  <Info className="w-3.5 h-3.5" />
                  {errorMsg}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Success state */}
            <AnimatePresence>
              {verified && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm mb-4"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verified! Redirecting to {role === 'investor' ? 'investor' : 'merchant'} onboarding...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verify Button */}
            {!verified && (
              <button
                type="button"
                onClick={handleVerify}
                disabled={isLoading || currentCode.length < OTP_LENGTH}
                className="w-full py-3.5 px-5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2.5 active:scale-[0.99] cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {/* Resend Timer */}
            <div className="mt-4 text-center text-xs text-slate-500">
              {resendSeconds > 0 ? (
                <span className="font-mono">
                  Resend OTP in{' '}
                  <span className="text-slate-700 font-bold">{resendSeconds}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-[#2563EB] font-bold hover:underline flex items-center gap-1.5 mx-auto transition-colors cursor-pointer"
                >
                  {resendLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>Resend OTP</span>
                </button>
              )}
            </div>

            {/* Back to login */}
            <div className="mt-4 text-center">
              <Link
                to={`/login?role=${role}`}
                className="text-xs text-slate-400 hover:text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back to Phone Login
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

