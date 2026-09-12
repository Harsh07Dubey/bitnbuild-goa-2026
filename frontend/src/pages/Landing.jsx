import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  ArrowRight,
  QrCode,
  Layers,
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
  BarChart3,
  Globe2,
  PieChart,
  Store,
  Wallet,
  Check
} from 'lucide-react';
import ContractCard from '../components/ContractCard';
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
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-400 selection:text-slate-950 overflow-hidden relative">
      {/* High-Vibrance Ambient Glow Meshes */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-gradient-to-tr from-emerald-500/25 via-cyan-500/20 to-purple-600/25 blur-[160px] rounded-full pointer-events-none -z-0 animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="fixed top-1/4 -left-48 w-[600px] h-[600px] bg-amber-500/20 blur-[150px] rounded-full pointer-events-none -z-0" />
      <div className="fixed top-1/2 -right-48 w-[600px] h-[600px] bg-emerald-400/20 blur-[150px] rounded-full pointer-events-none -z-0" />

      {/* Grid Texture */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-0" />

      {/* ========================================================
          1. SYSTEM HEADER & NAVIGATION
      ======================================================== */}
      <header className="relative z-30 max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between border-b border-white/10 backdrop-blur-2xl bg-slate-950/70 sticky top-0 shadow-2xl">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative p-1.5 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 border border-emerald-300/40 group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <img src={umeedLogo} alt="Umeed Logo" className="h-7 w-auto object-contain brightness-110" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-2xl text-white tracking-tight flex items-center gap-2">
              Umeed
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </span>
            <span className="text-[10px] font-mono tracking-widest bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent uppercase font-bold">
              Small Steps • Brighter Tomorrows
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#artifact" className="hover:text-emerald-400 transition-colors">Split Engine</a>
          <a href="#marketplace" className="hover:text-emerald-400 transition-colors">Live Marketplace</a>
          <a href="#pillars" className="hover:text-emerald-400 transition-colors">Trust Pillars</a>
          <Link to="/playground" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Playground <span className="bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded text-[10px] font-black">LIVE</span>
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-mono font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors">
            Sign In
          </Link>
          <Link
            to="/playground"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 font-black text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
          >
            <span>Launch Terminal</span>
            <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* ========================================================
          2. HERO SECTION
      ======================================================== */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 pb-20 text-center flex flex-col items-center">
        {/* Floating Social Proof / Live Badges */}
        <div className="absolute top-24 left-4 hidden xl:block animate-bounce" style={{ animationDuration: '6s' }}>
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-400/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(16,185,129,0.25)] flex items-center gap-3 max-w-xs">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80" alt="Merchant" className="w-10 h-10 rounded-xl object-cover border border-emerald-400" />
            <div className="text-left">
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE SETTLEMENT
              </div>
<<<<<<< Updated upstream
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-slate-900">
                  Umeed
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-500">
                  Small Steps • Brighter Tomorrows
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#artifact" className="hover:text-slate-900 transition-colors">
                Split Architecture
              </a>
              <a href="#marketplace" className="hover:text-slate-900 transition-colors">
                How It Works
              </a>
              <a href="#pillars" className="hover:text-slate-900 transition-colors">
                Trust Framework
              </a>
              <Link
                to="/investor/marketplace"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors font-semibold"
              >
                <span>Marketplace</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  Live
                </span>
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="text-xs font-mono font-medium text-slate-600 hover:text-slate-900 px-2.5 sm:px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/login?role=investor"
                className="text-xs font-medium bg-[#2563EB] hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/30 flex items-center gap-1.5"
              >
                <span>Investor Portal</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-100" />
              </Link>
            </div>
          </div>
        </header>

        {/* ========================================================
            HERO NARRATIVE & MONUMENTAL TYPOGRAPHY
        ======================================================== */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-24 pb-12 sm:pb-16 text-center flex flex-col items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50 backdrop-blur-md text-[11px] sm:text-xs font-mono text-amber-700 shadow-md shadow-amber-200/60 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="tracking-wider">NEXT-GEN POINT-OF-SALE UNDERWRITING</span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-serif tracking-tight text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-900 font-medium leading-[1.08] max-w-4xl drop-shadow-sm"
            >
              Capital That Moves With{' '}
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 animate-gradient-text">
                Daily Commerce.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 sm:mt-6 text-slate-600 max-w-2xl text-base sm:text-lg md:text-xl font-normal leading-relaxed text-center px-2"
            >
              Zero predatory compound interest. Working capital funded directly by marketplace investors and repaid programmatically at the point of sale.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-lg px-2"
            >
              <Link
                to="/merchant/onboarding"
                className="w-full sm:w-auto text-center bg-[#059669] hover:bg-emerald-700 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Merchant Entry</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login?role=investor"
                className="w-full sm:w-auto text-center bg-[#2563EB] hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Investor Portal & Signup</span>
                <ArrowUpRight className="w-4 h-4 text-blue-100 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-mono"
            >
              <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Zero Collateral Friction</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>100% Escrow Milestone Protected</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Automated UPI Split Settlement</span>
              </div>
            </motion.div>
          </motion.div>
=======
              <div className="text-xs font-black text-white font-mono">₹1,850 Split Executed</div>
              <div className="text-[10px] text-slate-400">Pooja General Store • 2s ago</div>
            </div>
          </div>
>>>>>>> Stashed changes
        </div>

        <div className="absolute top-44 right-4 hidden xl:block animate-bounce" style={{ animationDuration: '7.5s' }}>
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-cyan-400/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.25)] flex items-center gap-3 max-w-xs">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="text-[10px] text-cyan-400 font-mono uppercase font-bold">AI TRUST SCORE</div>
              <div className="text-xs font-black text-white font-mono">96/100 • Tier 1 Prime</div>
              <div className="text-[10px] text-slate-400">Cash Flow Verified via POS</div>
            </div>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-emerald-400/40 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-purple-500/20 backdrop-blur-xl text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '5s' }} />
              <span>Next-Gen Point-Of-Sale Revenue Underwriting</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-black tracking-tight text-5xl sm:text-7xl md:text-8xl text-white leading-[1.05] max-w-5xl"
          >
            Capital That Moves With{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(16,185,129,0.4)]">
              Daily
            </span>{' '}
            <span className="italic font-serif font-normal bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent">
              Commerce.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-slate-300 max-w-2xl text-lg md:text-xl font-medium leading-relaxed text-center"
          >
            Zero predatory interest rates. Working capital funded directly by community investors and repaid programmatically via micro-splits on every customer POS transaction.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
          >
            <Link
              to="/merchant/contract/create"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-base shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_45px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              <Store className="w-5 h-5 text-slate-950" />
              <span>Merchant Portal</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/playground"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700 text-white font-bold text-base transition-all backdrop-blur-xl shadow-xl flex items-center justify-center gap-3 group hover:border-emerald-400/60"
            >
              <Coins className="w-5 h-5 text-emerald-400" />
              <span>Investor Terminal</span>
              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* HERO VISUAL CENTERPIECE: Real-time Split Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-14 w-full max-w-5xl rounded-3xl border border-white/15 bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-6 shadow-[0_0_80px_rgba(16,185,129,0.2)] relative"
        >
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/20 blur-3xl pointer-events-none rounded-full" />
          <div className="flex items-center justify-between pb-4 border-b border-white/10 px-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
              <span className="ml-3 text-xs font-mono text-slate-400 font-semibold">UMEED LIVE POS PROTOCOL VERIFIER</span>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              STATUS: ONLINE // 99.99% UPTIME
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-left">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=150&q=80" alt="Supermarket" className="w-14 h-14 rounded-xl object-cover border border-slate-700" />
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">ACTIVE MERCHANT</span>
                <h4 className="font-bold text-white text-sm">Sharma Supermarket</h4>
                <div className="text-xs text-emerald-400 font-mono font-semibold">₹1,50,000 Pool Target</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-400">
                <BarChart3 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">REPAYMENT PROGRESS</span>
                <h4 className="font-mono font-black text-white text-lg">78.4% Amortized</h4>
                <div className="text-xs text-slate-400 font-mono">₹1,17,600 / ₹1,50,000</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">POS SPLIT RATE</span>
                <h4 className="font-mono font-black text-emerald-400 text-xl">15% Gross Flow</h4>
                <div className="text-xs text-slate-400 font-mono">Sub-second Auto Split</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center animate-pulse">
                <Zap className="w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          3. INTERACTIVE 3-WAY SPLIT ARTIFACT
      ======================================================== */}
      <section id="artifact" className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 pb-28">
        <div className="relative rounded-3xl p-6 sm:p-10 bg-slate-900/95 border border-emerald-500/30 backdrop-blur-2xl shadow-[0_0_90px_rgba(16,185,129,0.15)] overflow-hidden">
          {/* Neon inner glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-extrabold">
                  Real-Time Settlement Engine
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Programmatic 3-Way Split Artifact
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold shadow-inner">
              <Activity className="w-4 h-4 animate-pulse text-emerald-400" />
              <span>ATOMIC POS TRANSACTION ROUTER</span>
            </div>
          </div>

          {/* Customer Scan Simulator */}
          <div className="my-8 p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-inner">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                  <QrCode className="w-7 h-7" />
                </div>
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider font-semibold">CUSTOMER SCAN SIMULATOR</span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  Gross Counter Payment: <span className="text-emerald-400">₹{selectedAmount}.00</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400 hidden lg:inline font-semibold">Simulate Transaction:</span>
              <div className="flex items-center gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => triggerSimulation(amt)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-black transition-all ${
                      selectedAmount === amt
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105'
                        : 'bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Split Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            {/* Lane 1 */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-blue-400 bg-blue-950/50 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105'
                  : 'border-slate-800 bg-slate-950/80 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-blue-300 font-bold px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-400/30">
                  LANE 01 // 84%
                </span>
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-4xl font-black font-mono text-white tracking-tight">
                ₹{merchantAmount}
              </div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                Routed to Merchant Stall
              </div>
              <p className="text-[11px] text-slate-400 mt-4 font-mono leading-relaxed border-t border-slate-800 pt-3">
                Immediate gross liquidity for stock, operations, & day-to-day merchant working capital.
              </p>
            </div>

            {/* Lane 2 */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-emerald-400 bg-emerald-950/50 shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-105'
                  : 'border-slate-800 bg-slate-950/80 hover:border-emerald-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-emerald-300 font-bold px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
                  LANE 02 // 15%
                </span>
                <Coins className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-4xl font-black font-mono text-emerald-400 tracking-tight">
                ₹{investorAmount}
              </div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                Credited to Investor Pool
              </div>
              <p className="text-[11px] text-slate-400 mt-4 font-mono leading-relaxed border-t border-slate-800 pt-3">
                Programmatic amortization progressing toward the fixed contract repayment cap.
              </p>
            </div>

            {/* Lane 3 */}
            <div
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-amber-400 bg-amber-950/50 shadow-[0_0_30px_rgba(245,158,11,0.3)] scale-105'
                  : 'border-slate-800 bg-slate-950/80 hover:border-amber-500/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-amber-300 font-bold px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30">
                  LANE 03 // 1%
                </span>
                <Zap className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-4xl font-black font-mono text-amber-400 tracking-tight">
                ₹{platformFee}
              </div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                Platform Protocol Fee
              </div>
              <p className="text-[11px] text-slate-400 mt-4 font-mono leading-relaxed border-t border-slate-800 pt-3">
                Automated webhook verification, node consensus, and escrow maintenance.
              </p>
            </div>
          </div>

          {/* Execution Bar */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2 font-bold text-slate-300">
                <RefreshCw className={`w-4 h-4 text-emerald-400 ${isSimulating ? 'animate-spin' : ''}`} />
                SUB-SECOND POS SETTLEMENT STATUS
              </span>
              <span className="text-emerald-400 font-bold">TXID: 0x9F8B...C41E VERIFIED</span>
            </div>
            <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-slate-900 border border-slate-700 shadow-inner">
              <div style={{ width: '84%' }} className="bg-blue-500 h-full transition-all duration-500" />
              <div style={{ width: '15%' }} className="bg-emerald-400 h-full transition-all duration-500" />
              <div style={{ width: '1%' }} className="bg-amber-400 h-full transition-all duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. LIVE MARKETPLACE PREVIEW WITH REAL IMAGES
      ======================================================== */}
      <section id="marketplace" className="relative bg-slate-950 text-white pt-24 pb-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2 font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>Verified Business Opportunities</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Active Investment Marketplace
              </h2>
              <p className="text-sm md:text-base text-slate-400 mt-2 max-w-xl">
                Pre-underwritten small businesses with live point-of-sale volume & verified cash flow trust scores.
              </p>
            </div>

            <Link
              to="/playground"
              className="inline-flex items-center gap-2 text-sm font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors group"
            >
              <span>Explore full marketplace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Custom Enhanced Cards with Imagery */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden hover:border-emerald-400/50 transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] flex flex-col justify-between group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=800"
                  alt="General Store"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[11px] font-mono font-bold">
                  TRUST SCORE 94/100
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded border border-white/10">Retail & FMCG</span>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">14% POS Split</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Sharma General Store</h3>
                  <p className="text-xs text-slate-400">High daily footfall grocery store expanding inventory for festive season.</p>

                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Target Raise</span>
                      <span className="text-white font-bold">₹1,50,000</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[75%]" />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>75% Funded</span>
                      <span className="text-emerald-400">₹1,12,500 Raised</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/playground"
                  className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white text-xs font-extrabold font-mono transition-all text-center block border border-slate-700 hover:border-emerald-400"
                >
                  INVEST IN POOL →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden hover:border-cyan-400/50 transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col justify-between group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"
                  alt="Cafe"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-[11px] font-mono font-bold">
                  TRUST SCORE 88/100
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded border border-white/10">Food & Beverage</span>
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/30">16% POS Split</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Fresh Bites Express</h3>
                  <p className="text-xs text-slate-400">Popular student hub cafe adding automated espresso setup and kitchen gear.</p>

                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Target Raise</span>
                      <span className="text-white font-bold">₹2,00,000</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="bg-cyan-400 h-full w-[88%]" />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>88% Funded</span>
                      <span className="text-cyan-400">₹1,76,000 Raised</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/playground"
                  className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 text-white text-xs font-extrabold font-mono transition-all text-center block border border-slate-700 hover:border-cyan-400"
                >
                  INVEST IN POOL →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden hover:border-amber-400/50 transition-all hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] flex flex-col justify-between group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800"
                  alt="Apparel Boutique"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-amber-300 text-[11px] font-mono font-bold">
                  TRUST SCORE 91/100
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded border border-white/10">Fashion Retail</span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-400/30">12% POS Split</span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Urban Threads Apparel</h3>
                  <p className="text-xs text-slate-400">Boutique clothing outlet stocking premium summer apparel line.</p>

                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Target Raise</span>
                      <span className="text-white font-bold">₹3,50,000</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="bg-amber-400 h-full w-[60%]" />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>60% Funded</span>
                      <span className="text-amber-400">₹2,10,000 Raised</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/playground"
                  className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-white text-xs font-extrabold font-mono transition-all text-center block border border-slate-700 hover:border-amber-400"
                >
                  INVEST IN POOL →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. THE THREE PILLARS OF TRUST
      ======================================================== */}
      <section id="pillars" className="relative bg-slate-950 border-t border-white/10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-extrabold">
              The Architecture of Confidence
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight">
              The Three Pillars of Trust
            </h2>
            <p className="text-base text-slate-400 mt-3">
              Eliminating predatory underwriting through automated cryptographic and cash flow verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-emerald-400/50 transition-all group backdrop-blur-xl flex flex-col justify-between hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-extrabold">
                  PILLAR 01 // OBJECTIVE METRICS
                </div>
                <h3 className="text-2xl font-bold text-white mt-2 mb-3">
                  AI Trust Scoring
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Cash flow-based scoring (0–100) computed purely from verifiable historical bank feeds and point-of-sale volume—without biased credit profiles or subjective collateral demands.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>0–100 REAL-TIME ADAPTIVE INDEX</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-cyan-400/50 transition-all group backdrop-blur-xl flex flex-col justify-between hover:shadow-[0_0_50px_rgba(6,182,212,0.2)]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-extrabold">
                  PILLAR 02 // CONDITIONAL ESCROW
                </div>
                <h3 className="text-2xl font-bold text-white mt-2 mb-3">
                  100% Escrow Milestone
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Contracts remain pending in smart escrow until 100% committed by pool investors, guaranteeing full required working capital is secured before point-of-sale routing commences.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>ZERO PARTIAL DISBURSEMENT RISK</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 hover:border-amber-400/50 transition-all group backdrop-blur-xl flex flex-col justify-between hover:shadow-[0_0_50px_rgba(245,158,11,0.2)]">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <QrCode className="w-7 h-7" />
                </div>
                <div className="text-xs font-mono uppercase text-amber-400 tracking-wider font-extrabold">
                  PILLAR 03 // SETTLEMENT PRIMITIVE
                </div>
                <h3 className="text-2xl font-bold text-white mt-2 mb-3">
                  Point-of-Sale QR Engine
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Everyday customer QR transactions trigger sub-second atomic split execution. Repayment amortizes proportionally with daily merchant earnings directly toward the fixed contract cap.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>MICRO-PAYMENT AUTO ROUTING</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. PROTOCOL FOOTER
      ======================================================== */}
      <footer className="bg-slate-950 text-slate-400 border-t border-white/10 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-xl bg-slate-900 border border-emerald-400/40">
                  <img src={umeedLogo} alt="Umeed" className="h-7 w-auto object-contain" />
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
                  <Link to="/playground" className="hover:text-emerald-400 transition-colors flex items-center gap-2 text-emerald-400 font-bold">
                    <span>Interactive Terminal</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black">LIVE</span>
                  </Link>
                </li>
                <li><Link to="/playground?tab=marketplace" className="hover:text-emerald-400 transition-colors">Contract Marketplace</Link></li>
                <li><Link to="/playground?tab=portfolio" className="hover:text-emerald-400 transition-colors">Portfolio Analytics</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
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