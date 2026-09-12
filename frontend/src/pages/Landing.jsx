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
import umeedLogo from '../assets/umeed-logo.png';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
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
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-emerald-600 selection:text-white">
      {/* ========================================================
          1. HERO SECTION & ATMOSPHERE
      ======================================================== */}
      <section className="relative min-h-screen bg-white text-slate-900 overflow-hidden flex flex-col justify-between">
        {/* Layered Atmosphere: dot-grid texture + vibrant color bursts */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '26px 26px'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-200/60 via-white/50 to-white" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-amber-400/40 blur-[140px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-1/4 -right-40 w-[460px] h-[460px] bg-blue-500/35 blur-[130px] rounded-full pointer-events-none animate-float-slow" />
        <div className="absolute top-1/3 -left-40 w-[460px] h-[460px] bg-emerald-500/35 blur-[130px] rounded-full pointer-events-none animate-float" />

        {/* Decorative bottom horizon */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-50 via-emerald-50/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-400" />

        {/* Floating decorative accents */}
        <div className="absolute top-40 left-16 hidden lg:block animate-float">
          <div className="w-14 h-14 rounded-2xl bg-white/80 border border-blue-200 shadow-lg shadow-blue-200/50 flex items-center justify-center backdrop-blur-sm">
            <Coins className="w-6 h-6 text-blue-500" />
          </div>
        </div>
        <div className="absolute top-64 right-20 hidden lg:block animate-float-slow">
          <div className="w-14 h-14 rounded-2xl bg-white/80 border border-emerald-200 shadow-lg shadow-emerald-200/50 flex items-center justify-center backdrop-blur-sm">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
        </div>
        <div className="absolute bottom-52 right-40 hidden lg:block animate-float">
          <div className="w-12 h-12 rounded-2xl bg-white/80 border border-amber-200 shadow-lg shadow-amber-200/50 flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        {/* ========================================================
            TOP MICRO-BAR / SYSTEM HEADER
        ======================================================== */}
        <header className="relative z-30 w-full border-b border-slate-200 bg-white/70 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-emerald-300/60 shadow-md shadow-emerald-500/20 group-hover:border-emerald-400 transition-colors bg-white">
                <img
                  src={umeedLogo}
                  alt="Umeed logo"
                  className="w-full h-full object-contain p-1.5"
                />
              </div>
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
                Marketplace
              </a>
              <a href="#pillars" className="hover:text-slate-900 transition-colors">
                Trust Framework
              </a>
              <Link
                to="/playground"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors font-semibold"
              >
                <span>Playground</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  Live
                </span>
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-mono font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/playground"
                className="text-xs font-medium bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/30 flex items-center gap-1.5"
              >
                <span>Launch Playground</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-100" />
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
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-300 bg-gradient-to-r from-amber-50 via-white to-amber-50 backdrop-blur-md text-xs font-mono text-amber-700 shadow-md shadow-amber-200/60 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="tracking-wider">NEXT-GEN POINT-OF-SALE UNDERWRITING</span>
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-serif tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-900 font-medium leading-[1.08] max-w-4xl drop-shadow-sm"
            >
              Capital That Moves With{' '}
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 animate-gradient-text">
                Daily Commerce.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-slate-600 max-w-2xl text-lg md:text-xl font-normal leading-relaxed text-center"
            >
              Zero predatory compound interest. Working capital funded directly by marketplace investors and repaid programmatically at the point of sale.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
            >
              <Link
                to="/merchant/contract/create"
                className="w-full sm:w-auto text-center bg-[#2563EB] hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Merchant Entry</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/playground"
                className="w-full sm:w-auto text-center border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-medium px-8 py-4 rounded-xl shadow-md shadow-slate-200/60 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Investor Playground</span>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
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
        </div>

        <div className="relative z-10 w-full pb-4" />
      </section>

      {/* ========================================================
          2. THE ARTIFACT: INTERACTIVE 3-WAY SPLIT DEMONSTRATION
      ======================================================== */}
      <section id="artifact" className="relative z-20 -mt-20 max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-xs font-mono uppercase tracking-widest text-blue-600">
                  Real-Time Settlement Engine
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-slate-900 tracking-tight mt-1">
                The Programmatic 3-Way Split Artifact
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-medium shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-ping" />
              <span>• IDEMPOTENCY KEY LOCKED & VERIFIED</span>
            </div>
          </div>

          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-slate-500 block">CUSTOMER SCAN SIMULATION</span>
                <span className="text-lg font-bold text-slate-900 font-mono">
                  Gross Counter Payment: ₹{selectedAmount}.00
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 hidden lg:inline">Simulate Value:</span>
              <div className="flex items-center gap-1.5">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => triggerSimulation(amt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      selectedAmount === amt
                        ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/30 scale-105'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
            <div
              className={`p-5 rounded-xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-blue-400 bg-blue-50 shadow-lg shadow-blue-500/10 scale-[1.02]'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-blue-600 font-semibold px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                  LANE 01 // 84%
                </span>
                <Building2 className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-3xl font-bold font-mono text-slate-900 tracking-tight">
                ₹{merchantAmount}
              </div>
              <div className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">
                <span>Routed directly to Merchant Stall</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 font-mono leading-relaxed border-t border-slate-200 pt-2">
                Instant gross liquidity into merchant's primary operational account for inventory & payroll.
              </p>
            </div>

            <div
              className={`p-5 rounded-xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-emerald-600 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                  LANE 02 // 15%
                </span>
                <Coins className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-600 tracking-tight">
                ₹{investorAmount}
              </div>
              <div className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">
                <span>Credited to Investor Pool</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 font-mono leading-relaxed border-t border-slate-200 pt-2">
                Programmatic amortization progressing toward the contract's fixed repayment cap.
              </p>
            </div>

            <div
              className={`p-5 rounded-xl border transition-all duration-300 ${
                isSimulating
                  ? 'border-amber-400 bg-amber-50 shadow-lg shadow-amber-500/10 scale-[1.02]'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-amber-700 font-semibold px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                  LANE 03 // 1%
                </span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-bold font-mono text-amber-600 tracking-tight">
                ₹{platformFee}
              </div>
              <div className="text-xs font-medium text-slate-600 mt-1 flex items-center gap-1">
                <span>Platform Clearing Fee</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 font-mono leading-relaxed border-t border-slate-200 pt-2">
                Automated webhook verification, node consensus, and dispute escrow maintenance.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <RefreshCw className={`w-3 h-3 text-[#059669] ${isSimulating ? 'animate-spin' : ''}`} />
                ATOMIC EXECUTION AT POS (100% DISBURSED)
              </span>
              <span className="text-slate-600">TXID: 0x9f8b...c41e</span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-200 border border-slate-300">
              <div style={{ width: '84%' }} className="bg-[#2563EB] h-full" title="Merchant: 84%" />
              <div style={{ width: '15%' }} className="bg-[#059669] h-full" title="Investors: 15%" />
              <div style={{ width: '1%' }} className="bg-amber-500 h-full" title="Protocol: 1%" />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
              <span className="text-blue-600">■ 84% Merchant Core</span>
              <span className="text-emerald-600">■ 15% Investor Cap</span>
              <span className="text-amber-600">■ 1% Clearing Fee</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. LIVE MARKETPLACE PREVIEW
      ======================================================== */}
      <section
        id="marketplace"
        className="relative bg-[#F8FAFC] text-slate-900 pt-24 pb-20 border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-y border-slate-200 py-16">
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

            <div className="px-6 md:px-8 py-8 md:py-0 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-6">
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
      <footer className="bg-slate-50 text-slate-600 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-white">
                  <img src={umeedLogo} alt="Umeed" className="w-full h-full object-contain p-1" />
                </div>
                <span className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
                  Umeed
                </span>
              </div>
              <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
                The institutional programmatic revenue split protocol. Transforming merchant cash flow into an investable, transparent yield asset class.
              </p>
              <div className="pt-2 text-xs font-mono text-slate-500">
                SYSTEM IDENTIFIER: CF-NODE-2026-PROD // VERIFIED
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-semibold mb-4">
                Merchant Portals
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/merchant/contract/create" className="hover:text-slate-900 transition-colors">
                    Create Contract
                  </Link>
                </li>
                <li>
                  <Link to="/merchant/dashboard" className="hover:text-slate-900 transition-colors">
                    Merchant Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/merchant/qr" className="hover:text-slate-900 transition-colors">
                    Dynamic POS QR
                  </Link>
                </li>
                <li>
                  <Link to="/merchant/inventory" className="hover:text-slate-900 transition-colors">
                    Inventory Checkpoints
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-900 font-semibold mb-4">
                Investor Suite
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/playground" className="hover:text-slate-900 transition-colors flex items-center gap-1.5 text-blue-600 font-medium">
                    <span>Interactive Playground</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-blue-50 text-blue-600">LIVE</span>
                  </Link>
                </li>
                <li>
                  <Link to="/playground?tab=marketplace" className="hover:text-slate-900 transition-colors">
                    Contract Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/playground?tab=portfolio" className="hover:text-slate-900 transition-colors">
                    Portfolio Analytics
                  </Link>
                </li>
                <li>
                  <Link to="/investor/onboarding" className="hover:text-slate-900 transition-colors">
                    Accredited Onboarding
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-slate-900 transition-colors">
                    Terminal Access
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
            <div>
              © 2026 UMEED REVENUE PROTOCOL. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-[#059669]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                CONSENSUS ACTIVE
              </span>
              <span className="hover:text-slate-900 cursor-pointer">PRIVACY POLICY</span>
              <span className="hover:text-slate-900 cursor-pointer">TERMS OF EXECUTION</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}