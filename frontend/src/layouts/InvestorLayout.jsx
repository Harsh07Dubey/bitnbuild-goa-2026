import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function InvestorLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { switchRole } = useAuth();

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

      {/* Main Persistent Navbar */}
      <Navbar
        activeRole="investor"
        brandTitle="UMEED"
        onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
      />

      {/* Mobile Drawer */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeRole="investor"
        onRoleChange={switchRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>


      {/* Consistent Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#0F172A] tracking-wider">UMEED</span>
            <span>• Decentralized Merchant Cash Advance Liquidity Engine</span>
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