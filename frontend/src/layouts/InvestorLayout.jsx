import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Wallet,
  Store,
  ChevronDown,
  Activity,
  ArrowRight,
  UserCheck,
  Filter,
  AlertTriangle,
  ShieldAlert
} from 'lucide-react';
import umeedLogo from '../assets/umeed-logo.png';

const marketplaceContracts = [
  {
    id: 'cf-101',
    businessName: 'Sharma General Store',
    category: 'Retail',
    location: 'Connaught Place, New Delhi',
    image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&q=80&w=800',
    trustScore: 94,
    trustLabel: 'High Trust',
    targetPrincipal: '₹1,50,000',
    revenueShare: '12% POS',
    repaymentCap: '₹1,80,000',
    duration: '90 Days',
    fundedAmount: '₹1,12,500',
    remainingAmount: '₹37,500',
    fundedPercentage: 75,
    verifiedMonthlyVolume: '₹4.2L POS/mo'
  },
  {
    id: 'cf-102',
    businessName: 'QuickMart Grocery',
    category: 'Grocery',
    location: 'Koramangala, Bengaluru',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
    trustScore: 91,
    trustLabel: 'High Trust',
    targetPrincipal: '₹4,00,000',
    revenueShare: '10% POS',
    repaymentCap: '₹4,72,000',
    duration: '90 Days',
    fundedAmount: '₹3,40,000',
    remainingAmount: '₹60,000',
    fundedPercentage: 85,
    verifiedMonthlyVolume: '₹8.9L POS/mo'
  },
  {
    id: 'cf-103',
    businessName: 'Fresh Bites Cafe',
    category: 'Food',
    location: 'Indiranagar, Bengaluru',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
    trustScore: 88,
    trustLabel: 'High Trust',
    targetPrincipal: '₹2,50,000',
    revenueShare: '14% POS',
    repaymentCap: '₹3,05,000',
    duration: '120 Days',
    fundedAmount: '₹2,00,000',
    remainingAmount: '₹50,000',
    fundedPercentage: 80,
    verifiedMonthlyVolume: '₹5.5L POS/mo'
  },
  {
    id: 'cf-104',
    businessName: 'Prestige Apparel',
    category: 'Retail',
    location: 'Bandra West, Mumbai',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800',
    trustScore: 82,
    trustLabel: 'High Trust',
    targetPrincipal: '₹3,20,000',
    revenueShare: '15% POS',
    repaymentCap: '₹3,96,800',
    duration: '105 Days',
    fundedAmount: '₹2,40,000',
    remainingAmount: '₹80,000',
    fundedPercentage: 75,
    verifiedMonthlyVolume: '₹6.8L POS/mo'
  },
  {
    id: 'cf-105',
    businessName: 'Apex Health Wellness',
    category: 'Retail',
    location: 'Gachibowli, Hyderabad',
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=800',
    trustScore: 79,
    trustLabel: 'High Trust',
    targetPrincipal: '₹1,80,000',
    revenueShare: '11% POS',
    repaymentCap: '₹2,12,400',
    duration: '75 Days',
    fundedAmount: '₹1,17,000',
    remainingAmount: '₹63,000',
    fundedPercentage: 65,
    verifiedMonthlyVolume: '₹4.5L POS/mo'
  },
  {
    id: 'cf-106',
    businessName: 'Chai Point Corner',
    category: 'Food',
    location: 'Cyber City, Gurugram',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
    trustScore: 68,
    trustLabel: 'Moderate',
    targetPrincipal: '₹1,20,000',
    revenueShare: '16% POS',
    repaymentCap: '₹1,47,600',
    duration: '60 Days',
    fundedAmount: '₹72,000',
    remainingAmount: '₹48,000',
    fundedPercentage: 60,
    verifiedMonthlyVolume: '₹3.1L POS/mo'
  },
  {
    id: 'cf-107',
    businessName: 'Sri Balaji Electronics',
    category: 'Retail',
    location: 'T. Nagar, Chennai',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=800',
    trustScore: 62,
    trustLabel: 'Moderate',
    targetPrincipal: '₹5,00,000',
    revenueShare: '9% POS',
    repaymentCap: '₹5,85,000',
    duration: '150 Days',
    fundedAmount: '₹2,25,000',
    remainingAmount: '₹2,75,000',
    fundedPercentage: 45,
    verifiedMonthlyVolume: '₹11.2L POS/mo'
  },
  {
    id: 'cf-108',
    businessName: 'Golden Spoon Kitchen',
    category: 'Food',
    location: 'Park Street, Kolkata',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    trustScore: 41,
    trustLabel: 'Risk Alert',
    targetPrincipal: '₹1,00,000',
    revenueShare: '18% POS',
    repaymentCap: '₹1,28,000',
    duration: '45 Days',
    fundedAmount: '₹38,000',
    remainingAmount: '₹62,000',
    fundedPercentage: 38,
    verifiedMonthlyVolume: '₹2.4L POS/mo'
  },
  {
    id: 'cf-109',
    businessName: 'Urban Nature Organics',
    category: 'Grocery',
    location: 'Aundh, Pune',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    trustScore: 35,
    trustLabel: 'Risk Alert',
    targetPrincipal: '₹90,000',
    revenueShare: '19% POS',
    repaymentCap: '₹1,15,200',
    duration: '40 Days',
    fundedAmount: '₹27,000',
    remainingAmount: '₹63,000',
    fundedPercentage: 30,
    verifiedMonthlyVolume: '₹1.9L POS/mo'
  }
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Retail', 'Food', 'Grocery'];

  const filteredContracts = marketplaceContracts.filter((c) => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTrustBadgeStyle = (score) => {
    if (score >= 75) {
      return {
        badgeBg: 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300',
        icon: ShieldCheck
      };
    } else if (score >= 60) {
      return {
        badgeBg: 'bg-amber-500/20 border-amber-400/50 text-amber-300',
        icon: AlertTriangle
      };
    } else {
      return {
        badgeBg: 'bg-rose-500/20 border-rose-400/50 text-rose-300',
        icon: ShieldAlert
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-400 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-cyan-500/15 to-purple-600/20 blur-[160px] rounded-full pointer-events-none -z-0" />
      <div className="fixed top-1/3 -right-48 w-[600px] h-[600px] bg-emerald-400/15 blur-[150px] rounded-full pointer-events-none -z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-0" />

      {/* Protocol Bar */}
      <div className="w-full bg-slate-950/90 border-b border-white/10 py-2.5 px-4 text-center sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold text-white tracking-widest uppercase">
              UMEED // INVESTOR LIQUIDITY PROTOCOL
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-emerald-400 font-semibold">
              AUTOMATED POS REVENUE SHARE ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <Link to="/merchant/dashboard" className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-bold">
              <span>Switch to Merchant Terminal</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-700">|</span>
            <Link to="/" className="hover:text-white transition-colors">
              Landing Page
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-30 max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 border border-emerald-300/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <img src={umeedLogo} alt="Umeed Logo" className="h-6 w-auto object-contain brightness-110" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl text-white tracking-tight">Umeed</span>
              <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                Investor Network
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2 font-mono text-xs font-bold">
            <button className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              Marketplace
            </button>
            <button className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all">
              Portfolio & Analytics
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center text-xs font-mono">
            <button className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black flex items-center gap-1.5 shadow-md">
              <Wallet className="w-3.5 h-3.5" />
              <span>Investor</span>
            </button>
            <Link to="/merchant/dashboard" className="px-3.5 py-1.5 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 font-bold">
              <Store className="w-3.5 h-3.5" />
              <span>Merchant</span>
            </Link>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-xs font-mono shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-bold">Liquid:</span>
            <span className="text-emerald-400 font-black text-sm">₹3,55,000</span>
          </div>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/20 flex items-center justify-center font-mono font-black text-xs text-white shadow-lg">
            AM
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[11px] font-mono font-bold uppercase tracking-wider mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>LP DIRECT MARKETPLACE • LIVE P2P SETTLEMENTS</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Investment Marketplace
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Discover and invest in short-term high-yield merchant cash advance contracts with automated daily POS sweeps.
            </p>
          </div>

          <div className="w-full lg:w-auto p-5 rounded-3xl bg-slate-900/90 border border-white/15 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] flex items-center justify-between sm:justify-end gap-8">
            <div className="text-left">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">ACTIVE VOLUME</span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                ₹18,45,000
              </span>
            </div>

            <div className="h-10 w-[1px] bg-slate-800" />

            <div className="text-left">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider block">CONTRACTS LISTED</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">34</span>
                <span className="text-xs font-mono font-bold text-emerald-300 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30">
                  Live
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="my-8 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 font-bold uppercase mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" /> FILTER BY:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-extrabold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105'
                    : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'Category: Retail, Food, Grocery' : cat}
              </button>
            ))}

            <button className="px-4 py-2 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono font-bold flex items-center gap-2 hover:border-slate-700">
              <span>Duration</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button className="px-4 py-2 rounded-xl bg-slate-950 text-slate-300 border border-slate-800 text-xs font-mono font-bold flex items-center gap-2 hover:border-slate-700">
              <span>Sort by Trust Score</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search merchant or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            <button className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 9 Marketplace Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredContracts.map((contract) => {
            const trustStyle = getTrustBadgeStyle(contract.trustScore);
            const TrustIcon = trustStyle.icon;

            return (
              <motion.div
                key={contract.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-400/60 transition-all shadow-xl hover:shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col justify-between overflow-hidden group relative"
              >
                {/* Header Image & Badges */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={contract.image}
                    alt={contract.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-emerald-400" />
                        {contract.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-[10px] font-mono font-black text-emerald-300 uppercase tracking-wider">
                        LISTED
                      </span>
                    </div>

                    <div className={`px-3 py-1 rounded-full backdrop-blur-md border text-xs font-mono font-black flex items-center gap-1.5 ${trustStyle.badgeBg}`}>
                      <TrustIcon className="w-4 h-4" />
                      <span>{contract.trustScore} {contract.trustLabel}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-md">
                      {contract.businessName}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-slate-300 font-medium mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{contract.location}</span>
                    </div>
                  </div>
                </div>

                {/* Contract Metrics */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">TARGET PRINCIPAL</span>
                      <span className="text-lg font-black font-mono text-white">{contract.targetPrincipal}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">REVENUE SHARE</span>
                      <span className="text-lg font-black font-mono text-emerald-400">{contract.revenueShare}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">REPAYMENT CAP</span>
                      <span className="text-sm font-bold font-mono text-slate-200">{contract.repaymentCap}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">DURATION</span>
                      <span className="text-sm font-bold font-mono text-slate-200">{contract.duration}</span>
                    </div>
                  </div>

                  {/* Funding Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-emerald-400">{contract.fundedAmount} funded</span>
                      <span className="text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                        {contract.fundedPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
                      <div
                        className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        style={{ width: `${contract.fundedPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Target: {contract.targetPrincipal}</span>
                      <span className="text-slate-300 font-semibold">Remaining: {contract.remainingAmount}</span>
                    </div>
                  </div>

                  {/* Volume Display */}
                  <div className="flex items-center justify-between text-[11px] font-mono p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      Verified Volume:
                    </span>
                    <span className="font-bold text-emerald-400">{contract.verifiedMonthlyVolume}</span>
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-black text-xs font-mono tracking-wider uppercase shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                    <span>View Details & Fund</span>
                    <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Demo Persona Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-emerald-400/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center">
            <UserCheck className="w-4.5 h-4.5" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              DEMO PERSONA
            </div>
            <div className="text-xs font-black text-white font-mono">Investor (LP)</div>
          </div>
        </div>
      </div>
    </div>
  );
}