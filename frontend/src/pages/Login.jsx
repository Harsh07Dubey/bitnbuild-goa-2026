import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  Phone,
  Sparkles,
  CheckCircle2,
  Info,
  Lock,
  ArrowLeft
} from 'lucide-react';
import umeedLogo from '../assets/umeed-logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoOtpCode = '123456';

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/playground');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-400 selection:text-slate-950 flex flex-col justify-between overflow-hidden relative">
      {/* Background Meshes */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-purple-600/20 blur-[150px] rounded-full pointer-events-none -z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-0" />

      {/* Header / Brand */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 border border-emerald-300/40 group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <img src={umeedLogo} alt="Umeed Logo" className="h-7 w-auto object-contain brightness-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl text-white tracking-tight">
              Umeed <span className="text-xs font-mono font-normal text-slate-400">PROTOCOL</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-bold uppercase">
              Small Steps • Brighter Tomorrows
            </span>
          </div>
        </Link>
      </header>

      {/* Main Authentication Flow Container */}
      <main className="relative z-10 max-w-lg mx-auto w-full px-4 py-8 flex flex-col items-center">
        {/* Hackathon / Demo Banner */}
        <div className="w-full mb-6 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl flex items-center justify-center gap-2 text-amber-300 text-xs font-mono font-bold tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>DEMO SANDBOX FLOW • HACKATHON DEMONSTRATION MODE</span>
        </div>

        {/* Phase Stepper Bar */}
        <div className="w-full mb-8 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl flex items-center gap-2">
          <div
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
              step === 'phone'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 bg-slate-950/50'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-950/30 flex items-center justify-center text-[10px]">1</span>
            <span>PHASE A: PHONE LOGIN</span>
          </div>

          <div
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
              step === 'otp'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-500 bg-slate-950/30'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-slate-950/30 flex items-center justify-center text-[10px]">2</span>
            <span>PHASE B: OTP VERIFICATION</span>
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full rounded-3xl p-6 sm:p-8 bg-slate-900/90 border border-white/15 backdrop-blur-2xl shadow-[0_0_60px_rgba(16,185,129,0.15)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {step === 'phone' ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome to Umeed
                </h1>
                <p className="text-sm text-slate-400 mt-1 font-medium">
                  Enter your mobile number to sign in or register instantly.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                    Mobile Number
                  </label>
                  <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-950/80 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all overflow-hidden">
                    <div className="px-4 py-3.5 bg-slate-900 border-r border-slate-800 text-slate-300 font-mono text-sm font-bold flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>+91 <span className="text-slate-500 text-xs font-normal">(India)</span></span>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full bg-transparent px-4 py-3.5 text-white font-mono font-semibold placeholder:text-slate-600 outline-none text-base tracking-wider"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 10}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{isLoading ? 'Sending OTP...' : 'Send OTP Verification Code'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Sandbox info box */}
              <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-300/90 leading-relaxed font-mono">
                  <span className="font-bold">Sandbox Mode:</span> Enter any 10-digit number. Demo OTP code will be shown on the next screen.
                </p>
              </div>

              {/* Security guarantee */}
              <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Instant security check powered by P2P escrow protocol.</span>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('phone')}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to phone input
              </button>

              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Verify Passcode
                </h1>
                <p className="text-sm text-slate-400 mt-1 font-medium">
                  Enter the 6-digit verification code sent to <span className="text-emerald-400 font-mono font-bold">+91 {phoneNumber}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-mono font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-950/80 border border-slate-700 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 rounded-2xl px-4 py-3.5 text-center text-2xl font-mono font-black text-emerald-400 tracking-[0.5em] placeholder:tracking-normal placeholder:text-slate-600 outline-none transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-sm tracking-wide uppercase shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>{isLoading ? 'Verifying...' : 'Verify & Continue'}</span>
                </button>
              </form>

              {/* Sandbox Code Helper */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">DEMO OTP CODE</span>
                <span className="text-xl font-black font-mono text-amber-400 tracking-widest mt-1 block">{demoOtpCode}</span>
                <button
                  onClick={() => setOtp(demoOtpCode)}
                  className="text-[11px] font-mono text-emerald-400 hover:underline mt-2 inline-block font-bold"
                >
                  Auto-fill Demo Code
                </button>
              </div>
            </>
          )}
        </motion.div>

        {/* Skip Link */}
        <Link
          to="/playground"
          className="mt-6 text-xs font-mono font-bold text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5 group"
        >
          <span>Skip to Investor Marketplace</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
        </Link>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 py-6 text-center text-[11px] font-mono text-slate-500 border-t border-white/5">
        Umeed Protocol • Secure P2P Escrow Authentication Mode
      </footer>
    </div>
  );
}