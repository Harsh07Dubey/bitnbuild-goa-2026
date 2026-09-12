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
  ChevronRight
} from 'lucide-react';
import ContractCard from '../components/ContractCard';

// Hero text container animation as required
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function Landing() {
  // Interactive Simulation State
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [isSimulating, setIsSimulating] = useState(false);

  // Dynamic calculations based on selectedAmount
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
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* ========================================================
          1. HERO SECTION & ATMOSPHERE
      ======================================================== */}
      <section className="relative min-h-screen bg-[#0A0F1D] text-white overflow-hidden flex flex-col justify-between">
        {/* Radial Atmosphere Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-[#0A0F1D] to-[#0A0F1D] pointer-events-none" />

        {/* Ambient Mist & Twilight Light Beam */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Architectural Ridge Silhouettes & Blue Horizon Glow (Lapis Inspired) */}
        <div className="absolute inset-x-0 bottom-0 h-[380px] pointer-events-none overflow-hidden opacity-60">
          <svg
            className="absolute bottom-0 w-full h-full text-[#0A0F1D]"
            viewBox="0 0 1440 380"
            fill="none"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="horizonGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.35" />
                <stop offset="40%" stopColor="#1E3A8A" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0A0F1D" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="mountainBack" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#172554" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0A0F1D" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="mountainFront" x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0A0F1D" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Glowing horizon line */}
            <path d="M0 240 Q 720 180 1440 240 L1440 380 L0 380 Z" fill="url(#horizonGlow)" />

            {/* Background Mountainous Ridge */}
            <path
              d="M0 320 L180 260 L360 290 L540 220 L760 270 L980 210 L1200 270 L1440 230 L1440 380 L0 380 Z"
              fill="url(#mountainBack)"
            />

            {/* Foreground Architectural Monolith Silhouette */}
            <path
              d="M0 350 L240 310 L480 340 L720 285 L960 330 L1220 295 L1440 335 L1440 380 L0 380 Z"
              fill="url(#mountainFront)"
            />
          </svg>
        </div>

        {/* ========================================================
            TOP MICRO-BAR / SYSTEM HEADER
        ======================================================== */}
        <header className="relative z-30 w-full border-b border-white/5 bg-[#0A0F1D]/80 backdrop-blur-md">
          {/* Minimalist Logo & Navigation Row */}
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2563EB] to-blue-900 flex items-center justify-center border border-blue-400/30 shadow-md shadow-blue-500/20 group-hover:border-blue-400 transition-colors">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                  Credit<span className="text-[#2563EB]">Flow</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                  Revenue Protocol
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
              <a href="#artifact" className="hover:text-white transition-colors">
                Split Architecture
              </a>
              <a href="#marketplace" className="hover:text-white transition-colors">
                Marketplace
              </a>
              <a href="#pillars" className="hover:text-white transition-colors">
                Trust Framework
              </a>
              <Link
                to="/playground"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-semibold"
              >
                <span>Playground</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Live
                </span>
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-mono font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-transparent hover:border-white/10 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/playground"
                className="text-xs font-medium bg-[#2563EB]/90 hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg border border-blue-400/30 transition-all shadow-sm shadow-blue-500/20 backdrop-blur-sm flex items-center gap-1.5"
              >
                <span>Launch Playground</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
              </Link>
            </div>
          </div>
        </header>

        {/* ========================================================
            HERO NARRATIVE & MONUMENTAL TYPOGRAPHY
        ======================================================== */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 pt-16 md:pt-24 pb-16 text-center flex flex-col items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            {/* Architectural Sub-Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-md text-xs font-mono text-[#EFF6FF] shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="tracking-wider">NEXT-GEN POINT-OF-SALE UNDERWRITING</span>
              </div>
            </motion.div>

            {/* Monumental Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-serif tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-medium leading-[1.08] max-w-4xl"
            >
              Capital That Moves With{' '}
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-[#EFF6FF] to-blue-400">
                Daily Commerce.
              </span>
            </motion.h1>

            {/* Crisp Subtext */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-slate-300/90 max-w-2xl text-lg md:text-xl font-normal leading-relaxed text-center"
            >
              Zero predatory compound interest. Working capital funded directly by marketplace investors and repaid programmatically at the point of sale.
            </motion.p>

            {/* Dual Action Portals */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
            >
              <Link
                to="/merchant/contract/create"
                className="w-full sm:w-auto text-center bg-[#2563EB] hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Merchant Entry</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/playground"
                className="w-full sm:w-auto text-center border border-white/20 bg-white/5 hover:bg-[#EFF6FF]/10 text-white font-medium px-8 py-4 rounded-xl backdrop-blur-sm transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Investor Playground</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Link>
            </motion.div>

            {/* Micro Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Zero Collateral Friction</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>100% Escrow Milestone Protected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>Automated UPI Split Settlement</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Ambient bottom anchor */}
        <div className="relative z-10 w-full pb-4" />
      </section>

      {/* ========================================================
          2. THE ARTIFACT: INTERACTIVE 3-WAY SPLIT DEMONSTRATION
      ======================================================== */}
      <section id="artifact" className="relative z-20 -mt-20 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        {/* Floating Frosted Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Corner Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Artifact Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-xs font-mono uppercase tracking-widest text-blue-300">
                  Real-Time Settlement Engine
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white tracking-tight mt-1">
                The Programmatic 3-Way Split Artifact
              </h2>
            </div>

            {/* Idempotency Key Badge in #059669 text and #EFF6FF/10 background */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF]/10 border border-[#059669]/30 text-[#059669] text-xs font-mono font-medium shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-ping" />
              <span>• IDEMPOTENCY KEY LOCKED & VERIFIED</span>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="my-6 p-4 rounded-xl bg-black/30 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-400 block">CUSTOMER SCAN SIMULATION</span>
                <span className="text-lg font-bold text-white font-mono">
                  Gross Counter Payment: ₹{selectedAmount}.00
                </span>
              </div>
            </div>

            {/* Amount Presets */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 hidden lg:inline">Simulate Value:</span>
              <div className="flex items-center gap-1.5">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => triggerSimulation(amt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      selectedAmount === amt
                        ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/30 scale-105'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Three Visual Lanes Demonstrating Automated Deduction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            {/* Lane 1: Merchant Stall (84%) */}
            <div
              className={`p-5 rounded-xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-blue-400/60 bg-blue-500/20 shadow-lg shadow-blue-500/20 scale-[1.02]'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-blue-300 font-semibold px-2 py-0.5 rounded bg-blue-500/20 border border-blue-400/30">
                  LANE 01 // 84%
                </span>
                <Building2 className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-white tracking-tight">
                ₹{merchantAmount}
              </div>
              <div className="text-xs font-medium text-slate-300 mt-1 flex items-center gap-1">
                <span>Routed directly to Merchant Stall</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 font-mono leading-relaxed border-t border-white/5 pt-2">
                Instant gross liquidity into merchant's primary operational account for inventory & payroll.
              </p>
            </div>

            {/* Lane 2: Investor Pool (15%) */}
            <div
              className={`p-5 rounded-xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-emerald-400/60 bg-emerald-500/20 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-emerald-300 font-semibold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30">
                  LANE 02 // 15%
                </span>
                <Coins className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">
                ₹{investorAmount}
              </div>
              <div className="text-xs font-medium text-slate-300 mt-1 flex items-center gap-1">
                <span>Credited to Investor Pool</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 font-mono leading-relaxed border-t border-white/5 pt-2">
                Programmatic amortization progressing toward the contract's fixed repayment cap.
              </p>
            </div>

            {/* Lane 3: Platform Clearing Fee (1%) */}
            <div
              className={`p-5 rounded-xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-purple-400/60 bg-purple-500/20 shadow-lg shadow-purple-500/20 scale-[1.02]'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-purple-300 font-semibold px-2 py-0.5 rounded bg-purple-500/20 border border-purple-400/30">
                  LANE 03 // 1%
                </span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-purple-300 tracking-tight">
                ₹{platformFee}
              </div>
              <div className="text-xs font-medium text-slate-300 mt-1 flex items-center gap-1">
                <span>Platform Clearing Fee</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 font-mono leading-relaxed border-t border-white/5 pt-2">
                Automated webhook verification, node consensus, and dispute escrow maintenance.
              </p>
            </div>
          </div>

          {/* Lane Routing Progress Visualizer */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <RefreshCw className={`w-3 h-3 text-[#059669] ${isSimulating ? 'animate-spin' : ''}`} />
                ATOMIC EXECUTION AT POS (100% DISBURSED)
              </span>
              <span className="text-slate-300">TXID: 0x9f8b...c41e</span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-900 border border-white/10">
              <div style={{ width: '84%' }} className="bg-[#2563EB] h-full" title="Merchant: 84%" />
              <div style={{ width: '15%' }} className="bg-[#059669] h-full" title="Investors: 15%" />
              <div style={{ width: '1%' }} className="bg-purple-500 h-full" title="Protocol: 1%" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
              <span className="text-blue-400">■ 84% Merchant Core</span>
              <span className="text-emerald-400">■ 15% Investor Cap</span>
              <span className="text-purple-400">■ 1% Clearing Fee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. LIVE MARKETPLACE PREVIEW
          (Blend from dark twilight into #F8FAFC light canvas)
      ======================================================== */}
      <section
        id="marketplace"
        className="relative bg-[#F8FAFC] text-slate-900 pt-24 pb-20 border-t border-slate-200"
      >
        {/* Soft Gradient Mask from twilight to daylight */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#0A0F1D] to-[#F8FAFC] pointer-events-none opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2563EB] mb-2 font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>Curated Liquidity Opportunities</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-medium text-slate-900 tracking-tight">
                Active Investment Opportunities
              </h2>
              <p className="text-sm md:text-base text-[#475569] mt-2 max-w-xl">
                Pre-underwritten small businesses with verified point-of-sale volume and verified cash flow trust scores.
              </p>
            </div>

            <Link
              to="/playground"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-blue-800 transition-colors group"
            >
              <span>View all live contracts</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 3-Column Responsive Grid with Exact Required ContractCard Instances */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Instance 1: Sharma General Store */}
            <ContractCard
              id="cf-101"
              businessName="Sharma General Store"
              category="Retail"
              status="LISTED"
              trustScore={94}
              trustLabel="HIGH TRUST"
              targetAmount="₹1,50,000"
              fundedPercentage={75}
              dailySplit="14% Gross"
              repaymentCap="1.14x"
              duration="90 Days"
              investorCount={24}
            />

            {/* Instance 2: Fresh Bites Cafe */}
            <ContractCard
              id="cf-102"
              businessName="Fresh Bites Cafe"
              category="Food"
              status="LISTED"
              trustScore={82}
              trustLabel="HIGH TRUST"
              targetAmount="₹2,00,000"
              fundedPercentage={80}
              dailySplit="16% Gross"
              repaymentCap="1.15x"
              duration="120 Days"
              investorCount={31}
            />

            {/* Instance 3: QuickMart Grocery Hub */}
            <ContractCard
              id="cf-104"
              businessName="QuickMart Grocery"
              category="Grocery"
              status="LISTED"
              trustScore={91}
              trustLabel="HIGH TRUST"
              targetAmount="₹4,00,000"
              fundedPercentage={85}
              dailySplit="10% Gross"
              repaymentCap="1.18x"
              duration="90 Days"
              investorCount={29}
            />
          </div>

          {/* Secondary Marketplace Note */}
          <div className="mt-12 p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-600">
              <ShieldCheck className="w-5 h-5 text-[#059669] shrink-0" />
              <span>
                All investor capital remains in a verified smart escrow until 100% funding is reached. If unfulfilled, 100% of funds are released back without deductions.
              </span>
            </div>
            <Link
              to="/playground"
              className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Explore All 28 Contracts
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. THE THREE PILLARS OF TRUST (EDITORIAL GRID)
      ======================================================== */}
      <section id="pillars" className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2563EB] font-semibold">
              The Architecture of Confidence
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mt-2 font-medium tracking-tight">
              The Three Pillars of Trust
            </h2>
            <p className="text-base text-[#475569] mt-3">
              Eliminating predatory underwriting through automated cryptographic and cash flow verification.
            </p>
          </div>

          {/* 3-Column layout separated by divide-y md:divide-y-0 md:divide-x divide-slate-200 border-y border-slate-200 py-16 */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-y border-slate-200 py-16">
            {/* Pillar 1: AI Trust Scoring */}
            <div className="px-6 md:px-8 py-8 md:py-0 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  PILLAR 01 // OBJECTIVE METRICS
                </div>
                <h3 className="text-2xl font-serif text-slate-900 mt-2 mb-3">
                  AI Trust Scoring
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Cash flow-based scoring (0–100) computed purely from verifiable historical bank feeds and point-of-sale volume—without biased personal credit profiles or subjective collateral demands.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-[#059669]">
                <span className="w-2 h-2 rounded-full bg-[#059669]" />
                <span>0–100 REAL-TIME ADAPTIVE INDEX</span>
              </div>
            </div>

            {/* Pillar 2: 100% Escrow Milestone */}
            <div className="px-6 md:px-8 py-8 md:py-0 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#059669] mb-6">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  PILLAR 02 // CONDITIONAL ESCROW
                </div>
                <h3 className="text-2xl font-serif text-slate-900 mt-2 mb-3">
                  100% Escrow Milestone
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Contracts remain pending in smart escrow until 100% committed by pool investors, guaranteeing full required working capital is secured before programmatic point-of-sale routing ever commences.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                <span>ZERO PARTIAL DISBURSEMENT RISK</span>
              </div>
            </div>

            {/* Pillar 3: Point-of-Sale QR Engine */}
            <div className="px-6 md:px-8 py-8 md:py-0 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  PILLAR 03 // SETTLEMENT PRIMITIVE
                </div>
                <h3 className="text-2xl font-serif text-slate-900 mt-2 mb-3">
                  Point-of-Sale QR Engine
                </h3>
                <p className="text-sm text-[#475569] leading-relaxed">
                  Everyday customer QR transactions trigger sub-second atomic split execution. Repayment amortizes proportionally with daily merchant earnings directly toward the fixed contract cap.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-mono text-[#2563EB]">
                <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>MICRO-PAYMENT AUTO ROUTING</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. EDITORIAL PROTOCOL FOOTER
      ======================================================== */}
      <footer className="bg-[#0A0F1D] text-slate-400 border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            {/* Col 1: Brand & Statement */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="font-serif text-2xl font-bold text-white tracking-tight">
                  Credit<span className="text-[#2563EB]">Flow</span>
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                The institutional programmatic revenue split protocol. Transforming merchant cash flow into an investable, transparent yield asset class.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500">
                SYSTEM IDENTIFIER: CF-NODE-2026-PROD // VERIFIED
              </div>
            </div>

            {/* Col 2: Protocol Links */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-200 font-semibold mb-4">
                Merchant Portals
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/merchant/contract/create" className="hover:text-white transition-colors">
                    Create Contract
                  </Link>
                </li>
                <li>
                  <Link to="/merchant/dashboard" className="hover:text-white transition-colors">
                    Merchant Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/merchant/qr" className="hover:text-white transition-colors">
                    Dynamic POS QR
                  </Link>
                </li>
                <li>
                  <Link to="/merchant/inventory" className="hover:text-white transition-colors">
                    Inventory Checkpoints
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Investor Portals */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-200 font-semibold mb-4">
                Investor Suite
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/playground" className="hover:text-white transition-colors flex items-center gap-1.5 text-blue-400 font-medium">
                    <span>Interactive Playground</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-blue-500/20 text-blue-300">LIVE</span>
                  </Link>
                </li>
                <li>
                  <Link to="/playground?tab=marketplace" className="hover:text-white transition-colors">
                    Contract Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/playground?tab=portfolio" className="hover:text-white transition-colors">
                    Portfolio Analytics
                  </Link>
                </li>
                <li>
                  <Link to="/investor/onboarding" className="hover:text-white transition-colors">
                    Accredited Onboarding
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Terminal Access
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <div>
              © 2026 CREDITFLOW REVENUE PROTOCOL. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-[#059669]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                CONSENSUS ACTIVE
              </span>
              <span className="hover:text-slate-400 cursor-pointer">PRIVACY POLICY</span>
              <span className="hover:text-slate-400 cursor-pointer">TERMS OF EXECUTION</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
