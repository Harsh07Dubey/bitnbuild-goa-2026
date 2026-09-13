import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  QrCode,
  TrendingUp,
  Lock,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Zap,
  Building2,
  Coins,
  ChevronRight,
  Activity,
  BarChart3
} from 'lucide-react';
import umeedLogo from '../assets/umeed-logo.png';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export default function Landing() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [isSimulating, setIsSimulating] = useState(false);

  const merchantAmount = (selectedAmount * 0.84).toFixed(2);
  const investorAmount = (selectedAmount * 0.15).toFixed(2);
  const platformFee = (selectedAmount * 0.01).toFixed(2);

  const presetAmounts = [250, 500, 1000, 2500];

  const triggerSimulation = (amt) => {
    setSelectedAmount(amt);
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 600);
  };

  return (
    <div className="min-h-screen bg-[#F1F5EE] text-slate-900 font-sans selection:bg-emerald-500 selection:text-white overflow-hidden relative">
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

      {/* Header & Navigation */}
      <header className="relative z-30 max-w-[96rem] mx-auto px-4 sm:px-8 lg:px-12 py-7 flex items-center justify-between gap-6 border-b border-emerald-900/10 backdrop-blur-xl bg-gradient-to-r from-teal-50/90 via-white/90 to-emerald-50/90 sticky top-0 shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-cyan-500 to-amber-400" />
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative p-2 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 border border-emerald-400/30 group-hover:scale-105 transition-transform shadow-md shadow-emerald-500/20">
            <img src={umeedLogo} alt="Umeed Logo" className="h-8 w-auto object-contain brightness-200 contrast-200" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[26px] text-slate-900 tracking-tight flex items-center gap-2 leading-tight">
              Umeed
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </span>
            <span className="text-[10px] font-mono tracking-widest bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent uppercase font-bold whitespace-nowrap">
              Small Steps • Brighter Tomorrows
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 xl:gap-10 text-[15px] font-semibold text-slate-600 shrink-0">
          <a href="#artifact" className="hover:text-emerald-600 transition-colors whitespace-nowrap">
            Split Architecture
          </a>
          <a href="#marketplace" className="hover:text-emerald-600 transition-colors whitespace-nowrap">
            Marketplace
          </a>
          <a href="#pillars" className="hover:text-emerald-600 transition-colors whitespace-nowrap">
            Trust Framework
          </a>
          <Link
            to="/investor/marketplace"
            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors font-semibold whitespace-nowrap"
          >
            <span>Marketplace</span>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
              Live
            </span>
          </Link>
        </nav>

        <div className="hidden 2xl:flex items-center gap-2.5 pl-2 shrink-0">
          <div className="flex -space-x-3">
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64&q=80" alt="Merchant 1" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64&q=80" alt="Merchant 2" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64&q=80" alt="Merchant 3" className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
          </div>
          <div className="text-xs leading-tight whitespace-nowrap">
            <div className="font-bold text-slate-800">500+ merchants</div>
            <div className="text-slate-500">onboarded this quarter</div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link to="/login" className="text-sm font-mono font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl transition-colors whitespace-nowrap">
            Sign In
          </Link>
          <Link
            to="/investor/marketplace"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-black text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group whitespace-nowrap"
          >
            <span>Launch Terminal</span>
            <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 pb-20 text-center flex flex-col items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[460px] pointer-events-none z-0 [mask-image:radial-gradient(ellipse_65%_60%_at_50%_35%,black_40%,transparent_100%)] opacity-25">
          <img
            src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1600&q=80"
            alt="Indian Finance Market Chart Background"
            className="w-full h-full object-cover hue-rotate-15 saturate-150 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/60 to-[#F1F5EE]" />
        </div>

        <div
          className="absolute top-10 right-0 sm:right-4 hidden sm:block text-[220px] md:text-[300px] font-black text-emerald-900/[0.06] leading-none pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          ₹
        </div>

        {/* Floating Badges */}
        <motion.div
          className="absolute top-20 left-2 hidden xl:block z-10"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="p-3.5 rounded-2xl bg-white/95 border border-emerald-400/50 backdrop-blur-xl shadow-xl shadow-emerald-500/20 flex items-center gap-3 max-w-xs">
            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80" alt="Young Merchant" className="w-10 h-10 rounded-xl object-cover border border-emerald-400" />
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE SETTLEMENT
              </div>
              <div className="text-xs font-black text-slate-900 font-mono">₹1,850 Split Executed</div>
              <div className="text-[10px] text-slate-500">Rahul General Store • 2s ago</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-20 right-2 hidden xl:block z-10"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          <div className="p-3.5 rounded-2xl bg-white/95 border border-cyan-400/50 backdrop-blur-xl shadow-xl shadow-cyan-500/20 flex items-center gap-3 max-w-xs">
            <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-cyan-600 font-mono uppercase font-bold">AI TRUST SCORE</div>
              <div className="text-xs font-black text-slate-900 font-mono">96/100 • Tier 1 Prime</div>
              <div className="text-[10px] text-slate-500">Cash Flow Verified via POS</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-emerald-300 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 backdrop-blur-xl text-emerald-700 text-xs font-mono font-bold uppercase tracking-widest shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '5s' }} />
              <span>Next-Gen Point-Of-Sale Revenue Underwriting</span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-black tracking-tight text-5xl sm:text-7xl md:text-8xl text-slate-900 leading-[1.05] max-w-5xl [text-shadow:0_2px_24px_rgba(255,255,255,0.8),0_1px_2px_rgba(255,255,255,0.9)]"
          >
            Capital That Moves With{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Daily
            </span>{' '}
            <span className="italic font-serif font-normal bg-gradient-to-r from-amber-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Commerce.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-slate-600 max-w-2xl text-lg md:text-xl font-medium leading-relaxed text-center"
          >
            Zero predatory interest rates. Working capital funded directly by community investors and repaid programmatically via micro-splits on every customer POS transaction.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-lg px-2"
          >
            <Link
              to="/merchant/contract/create"
              className="w-full sm:w-auto text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Merchant Entry</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/investor/marketplace"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold text-base transition-all backdrop-blur-xl shadow-md flex items-center justify-center gap-3 group hover:border-emerald-400"
            >
              <Coins className="w-5 h-5 text-emerald-600" />
              <span>Investor Terminal</span>
              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Real-time Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-14 w-full max-w-5xl rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-2xl p-4 sm:p-6 shadow-xl relative"
        >
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-400/10 blur-3xl pointer-events-none rounded-full" />
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 px-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
              <span className="ml-3 text-xs font-mono text-slate-500 font-semibold">UMEED LIVE POS PROTOCOL VERIFIER</span>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              STATUS: ONLINE // 99.99% UPTIME
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-left">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=150&q=80" alt="Supermarket" className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">ACTIVE MERCHANT</span>
                <h4 className="font-bold text-slate-900 text-sm">Sharma Supermarket</h4>
                <div className="text-xs text-emerald-600 font-mono font-semibold">₹1,50,000 Pool Target</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">REPAYMENT PROGRESS</span>
                <h4 className="font-mono font-black text-slate-900 text-lg">78.4% Amortized</h4>
                <div className="text-xs text-slate-500 font-mono">₹1,17,600 / ₹1,50,000</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">POS SPLIT RATE</span>
                <h4 className="font-mono font-black text-emerald-600 text-xl">15% Gross Flow</h4>
                <div className="text-xs text-slate-500 font-mono">Sub-second Auto Split</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center animate-pulse">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3-Way Split Artifact */}
      <section id="artifact" className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 pb-28">
        <div className="relative rounded-3xl p-6 sm:p-10 bg-white border border-emerald-200/80 backdrop-blur-2xl shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-extrabold">
                  Real-Time Settlement Engine
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                Programmatic 3-Way Split Artifact
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold shadow-sm">
              <Activity className="w-4 h-4 animate-pulse text-emerald-600" />
              <span>ATOMIC POS TRANSACTION ROUTER</span>
            </div>
          </div>

          <div className="my-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-emerald-600">
                  <QrCode className="w-7 h-7" />
                </div>
              </div>
              <div>
                <span className="text-xs font-mono text-slate-500 block uppercase tracking-wider font-semibold">CUSTOMER SCAN SIMULATOR</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  Gross Counter Payment: <span className="text-emerald-600">₹{selectedAmount}.00</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500 hidden lg:inline font-semibold">Simulate Transaction:</span>
              <div className="flex items-center gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => triggerSimulation(amt)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-black transition-all ${
                      selectedAmount === amt
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md scale-105'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-blue-400 bg-blue-50/70 shadow-md scale-105'
                  : 'border-slate-200 bg-slate-50/60 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-blue-700 font-bold px-3 py-1 rounded-lg bg-blue-100 border border-blue-200">
                  LANE 01 // 84%
                </span>
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-4xl font-black font-mono text-slate-900 tracking-tight">
                ₹{merchantAmount}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1">
                Routed to Merchant Stall
              </div>
              <p className="text-[11px] text-slate-500 mt-4 font-mono leading-relaxed border-t border-slate-200 pt-3">
                Immediate gross liquidity for stock, operations, & day-to-day merchant working capital.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-emerald-400 bg-emerald-50/70 shadow-md scale-105'
                  : 'border-slate-200 bg-slate-50/60 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-emerald-700 font-bold px-3 py-1 rounded-lg bg-emerald-100 border border-emerald-200">
                  LANE 02 // 15%
                </span>
                <Coins className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-4xl font-black font-mono text-emerald-600 tracking-tight">
                ₹{investorAmount}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1">
                Credited to Investor Pool
              </div>
              <p className="text-[11px] text-slate-500 mt-4 font-mono leading-relaxed border-t border-slate-200 pt-3">
                Programmatic amortization progressing toward the fixed contract repayment cap.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-amber-400 bg-amber-50/70 shadow-md scale-105'
                  : 'border-slate-200 bg-slate-50/60 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-amber-700 font-bold px-3 py-1 rounded-lg bg-amber-100 border border-amber-200">
                  LANE 03 // 1%
                </span>
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-4xl font-black font-mono text-amber-600 tracking-tight">
                ₹{platformFee}
              </div>
              <div className="text-xs font-bold text-slate-700 mt-1">
                Platform Protocol Fee
              </div>
              <p className="text-[11px] text-slate-500 mt-4 font-mono leading-relaxed border-t border-slate-200 pt-3">
                Automated webhook verification, node consensus, and escrow maintenance.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="flex items-center gap-2 font-bold text-slate-700">
                <RefreshCw className={`w-4 h-4 text-emerald-600 ${isSimulating ? 'animate-spin' : ''}`} />
                SUB-SECOND POS SETTLEMENT STATUS
              </span>
              <span className="text-emerald-600 font-bold">TXID: 0x9F8B...C41E VERIFIED</span>
            </div>
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-200 border border-slate-300 shadow-inner">
              <div style={{ width: '84%' }} className="bg-blue-500 h-full transition-all duration-500" />
              <div style={{ width: '15%' }} className="bg-emerald-500 h-full transition-all duration-500" />
              <div style={{ width: '1%' }} className="bg-amber-500 h-full transition-all duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Live Marketplace Preview */}
      <section id="marketplace" className="relative bg-white text-slate-900 pt-24 pb-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 mb-2 font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>Verified Business Opportunities</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                Active Investment Marketplace
              </h2>
              <p className="text-sm md:text-base text-slate-600 mt-2 max-w-xl">
                Pre-underwritten small businesses with live point-of-sale volume & verified cash flow trust scores.
              </p>
            </div>

            <Link
              to="/investor/marketplace"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-600 hover:text-emerald-700 transition-colors group"
            >
              <span>Explore full marketplace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden hover:border-emerald-400 transition-all hover:shadow-xl flex flex-col justify-between group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=800"
                  alt="General Store"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-emerald-300 text-emerald-700 text-[11px] font-mono font-bold shadow-sm">
                  TRUST SCORE 94/100
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-white bg-slate-900/80 px-2.5 py-0.5 rounded border border-white/20">Retail & FMCG</span>
                  <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-400/40">14% POS Split</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Sharma General Store</h3>
                  <p className="text-xs text-slate-600">High daily footfall grocery store expanding inventory for festive season.</p>

                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-500">Target Raise</span>
                      <span className="text-slate-900 font-bold">₹1,50,000</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[75%]" />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>75% Funded</span>
                      <span className="text-emerald-600 font-semibold">₹1,12,500 Raised</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/investor/marketplace"
                  className="mt-6 w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 hover:text-white text-white text-xs font-extrabold font-mono transition-all text-center block border border-slate-800 shadow-sm"
                >
                  INVEST IN POOL →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden hover:border-cyan-400 transition-all hover:shadow-xl flex flex-col justify-between group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"
                  alt="Cafe"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-cyan-300 text-cyan-700 text-[11px] font-mono font-bold shadow-sm">
                  TRUST SCORE 88/100
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-white bg-slate-900/80 px-2.5 py-0.5 rounded border border-white/20">Food & Beverage</span>
                  <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/40">16% POS Split</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Fresh Bites Express</h3>
                  <p className="text-xs text-slate-600">Popular student hub cafe adding automated espresso setup and kitchen gear.</p>

                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-500">Target Raise</span>
                      <span className="text-slate-900 font-bold">₹2,00,000</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="bg-cyan-500 h-full w-[88%]" />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>88% Funded</span>
                      <span className="text-cyan-600 font-semibold">₹1,76,000 Raised</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/investor/marketplace"
                  className="mt-6 w-full py-3 rounded-xl bg-slate-900 hover:bg-cyan-600 hover:text-white text-white text-xs font-extrabold font-mono transition-all text-center block border border-slate-800 shadow-sm"
                >
                  INVEST IN POOL →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden hover:border-amber-400 transition-all hover:shadow-xl flex flex-col justify-between group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
                  alt="Apparel Boutique"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 text-amber-700 text-[11px] font-mono font-bold shadow-sm">
                  TRUST SCORE 91/100
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-white bg-slate-900/80 px-2.5 py-0.5 rounded border border-white/20">Fashion Retail</span>
                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-400/40">12% POS Split</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Urban Threads Apparel</h3>
                  <p className="text-xs text-slate-600">Boutique clothing outlet stocking premium summer apparel line.</p>

                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-500">Target Raise</span>
                      <span className="text-slate-900 font-bold">₹3,50,000</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="bg-amber-500 h-full w-[60%]" />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-500">
                      <span>60% Funded</span>
                      <span className="text-amber-600 font-semibold">₹2,10,000 Raised</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/investor/marketplace"
                  className="mt-6 w-full py-3 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-extrabold font-mono transition-all text-center block border border-slate-800 shadow-sm"
                >
                  INVEST IN POOL →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars of Trust */}
      <section id="pillars" className="relative bg-slate-50 border-t border-slate-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 font-extrabold">
              The Architecture of Confidence
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mt-2 tracking-tight">
              The Three Pillars of Trust
            </h2>
            <p className="text-base text-slate-600 mt-3">
              Eliminating predatory underwriting through automated cryptographic and cash flow verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 transition-all group backdrop-blur-xl flex flex-col justify-between shadow-sm hover:shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="text-xs font-mono uppercase text-emerald-600 tracking-wider font-extrabold">
                  PILLAR 01 // OBJECTIVE METRICS
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-3">
                  AI Trust Scoring
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Cash flow-based scoring (0–100) computed purely from verifiable historical bank feeds and point-of-sale volume—without biased credit profiles or subjective collateral demands.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>0–100 REAL-TIME ADAPTIVE INDEX</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-cyan-400 transition-all group backdrop-blur-xl flex flex-col justify-between shadow-sm hover:shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="text-xs font-mono uppercase text-cyan-600 tracking-wider font-extrabold">
                  PILLAR 02 // CONDITIONAL ESCROW
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-3">
                  100% Escrow Milestone
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Contracts remain pending in smart escrow until 100% committed by pool investors, guaranteeing full required working capital is secured before point-of-sale routing commences.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-cyan-600 font-bold">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                <span>ZERO PARTIAL DISBURSEMENT RISK</span>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 transition-all group backdrop-blur-xl flex flex-col justify-between shadow-sm hover:shadow-xl">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <QrCode className="w-7 h-7" />
                </div>
                <div className="text-xs font-mono uppercase text-amber-600 tracking-wider font-extrabold">
                  PILLAR 03 // SETTLEMENT PRIMITIVE
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mt-2 mb-3">
                  Point-of-Sale QR Engine
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Everyday customer QR transactions trigger sub-second atomic split execution. Repayment amortizes proportionally with daily merchant earnings directly toward the fixed contract cap.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-amber-600 font-bold">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>MICRO-PAYMENT AUTO ROUTING</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-xl bg-slate-800 border border-emerald-400/30">
                  <img src={umeedLogo} alt="Umeed" className="h-7 w-auto object-contain brightness-200 contrast-200" />
                </div>
                <span className="font-black text-2xl text-white tracking-tight">
                  Umeed Protocol
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                The institutional programmatic revenue split protocol. Transforming merchant cash flow into an investable, transparent yield asset class.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-white font-extrabold mb-4">
                Merchant Portals
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/merchant/contract/create" className="hover:text-emerald-400 transition-colors">Create Contract</Link></li>
                <li><Link to="/merchant/dashboard" className="hover:text-emerald-400 transition-colors">Merchant Dashboard</Link></li>
                <li><Link to="/merchant/qr" className="hover:text-emerald-400 transition-colors">Dynamic POS QR</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-white font-extrabold mb-4">
                Investor Suite
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/investor/marketplace" className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-emerald-400 font-bold">
                    <span>Interactive Terminal</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black">LIVE</span>
                  </Link>
                </li>
                <li><Link to="/investor/marketplace" className="hover:text-emerald-400 transition-colors">Contract Marketplace</Link></li>
                <li><Link to="/investor/dashboard" className="hover:text-emerald-400 transition-colors">Portfolio Analytics</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div>© 2026 UMEED REVENUE PROTOCOL. ALL RIGHTS RESERVED.</div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                NODE CONSENSUS ACTIVE
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}