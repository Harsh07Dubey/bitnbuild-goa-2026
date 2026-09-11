import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  X,
  Store,
  Utensils,
  ShoppingBasket,
  ArrowUpRight,
  PieChart,
  Wallet,
  Building2,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

// Mock Marketplace Contracts Dataset
const INITIAL_CONTRACTS = [
  {
    id: 'cf-101',
    merchantName: 'Sharma General Store',
    category: 'Retail',
    subCategory: 'FMCG & Daily Essentials',
    location: 'Connaught Place, New Delhi',
    status: 'LISTED',
    trustScore: 94,
    targetPrincipal: 150000,
    revenueSharePercent: 12,
    repaymentCap: 180000,
    durationDays: 90,
    fundedAmount: 112500,
    dailyPosVolume: 32000,
    businessAge: '5.2 Years',
    gstVerified: true,
    riskNotes: 'A+ bank rating, consistently exceeds average monthly card sales by 18%. Zero historical payment bounces.',
    investorCount: 14
  },
  {
    id: 'cf-102',
    merchantName: 'Fresh Bites Cafe',
    category: 'Food',
    subCategory: 'Artisanal Bakery & Cafe',
    location: 'Indiranagar, Bengaluru',
    status: 'LISTED',
    trustScore: 88,
    targetPrincipal: 250000,
    revenueSharePercent: 14,
    repaymentCap: 305000,
    durationDays: 120,
    fundedAmount: 200000,
    dailyPosVolume: 48000,
    businessAge: '3.8 Years',
    gstVerified: true,
    riskNotes: 'Prime footfall hub, verified Swiggy/Zomato POS reconciliation with steady recurring morning and evening peaks.',
    investorCount: 22
  },
  {
    id: 'cf-103',
    merchantName: 'Prestige Apparel',
    category: 'Retail',
    subCategory: 'Designer Ethnic Wear',
    location: 'Bandra West, Mumbai',
    status: 'LISTED',
    trustScore: 82,
    targetPrincipal: 320000,
    revenueSharePercent: 15,
    repaymentCap: 396800,
    durationDays: 105,
    fundedAmount: 240000,
    dailyPosVolume: 56000,
    businessAge: '6.1 Years',
    gstVerified: true,
    riskNotes: 'Strong festive season sales surge, robust merchant loyalty database, 24% return on capital multiple.',
    investorCount: 19
  },
  {
    id: 'cf-104',
    merchantName: 'QuickMart Grocery',
    category: 'Grocery',
    subCategory: 'Neighborhood Supermarket',
    location: 'Koramangala, Bengaluru',
    status: 'LISTED',
    trustScore: 91,
    targetPrincipal: 400000,
    revenueSharePercent: 10,
    repaymentCap: 472000,
    durationDays: 90,
    fundedAmount: 340000,
    dailyPosVolume: 82000,
    businessAge: '4.5 Years',
    gstVerified: true,
    riskNotes: 'High inventory turnover (14 days), tied to localized quick delivery partner, spotless tax compliance.',
    investorCount: 29
  },
  {
    id: 'cf-105',
    merchantName: 'Apex Health Wellness',
    category: 'Retail',
    subCategory: 'Pharmacy & Surgical Supplies',
    location: 'Gachibowli, Hyderabad',
    status: 'LISTED',
    trustScore: 79,
    targetPrincipal: 180000,
    revenueSharePercent: 11,
    repaymentCap: 212400,
    durationDays: 75,
    fundedAmount: 117000,
    dailyPosVolume: 36000,
    businessAge: '3.2 Years',
    gstVerified: true,
    riskNotes: 'Consistent chronic medicine subscription revenues, high defensibility against consumer spending slumps.',
    investorCount: 11
  },
  {
    id: 'cf-106',
    merchantName: 'Chai Point Corner',
    category: 'Food',
    subCategory: 'QSR & Quick Snacks',
    location: 'Cyber City, Gurugram',
    status: 'LISTED',
    trustScore: 68,
    targetPrincipal: 120000,
    revenueSharePercent: 16,
    repaymentCap: 147600,
    durationDays: 60,
    fundedAmount: 72000,
    dailyPosVolume: 26000,
    businessAge: '2.1 Years',
    gstVerified: true,
    riskNotes: 'Corporate corridor location subject to hybrid working cyclicality, backed by healthy cash gross margins (62%).',
    investorCount: 8
  },
  {
    id: 'cf-107',
    merchantName: 'Sri Balaji Electronics',
    category: 'Retail',
    subCategory: 'Consumer Electronics & Mobile',
    location: 'T. Nagar, Chennai',
    status: 'LISTED',
    trustScore: 62,
    targetPrincipal: 500000,
    revenueSharePercent: 9,
    repaymentCap: 585000,
    durationDays: 150,
    fundedAmount: 225000,
    dailyPosVolume: 74000,
    businessAge: '7.0 Years',
    gstVerified: true,
    riskNotes: 'Established wholesale/retail distributor. Slightly elevated supplier credit cycle, moderated by high collateral reserves.',
    investorCount: 16
  },
  {
    id: 'cf-108',
    merchantName: 'Golden Spoon Kitchen',
    category: 'Food',
    subCategory: 'Cloud Kitchen Network',
    location: 'Park Street, Kolkata',
    status: 'LISTED',
    trustScore: 41,
    targetPrincipal: 100000,
    revenueSharePercent: 18,
    repaymentCap: 128000,
    durationDays: 45,
    fundedAmount: 38000,
    dailyPosVolume: 19000,
    businessAge: '1.4 Years',
    gstVerified: false,
    riskNotes: 'Rapidly expanding multi-brand cloud kitchen with limited seasonal track record. High potential yield with volatility.',
    investorCount: 6
  },
  {
    id: 'cf-109',
    merchantName: 'Urban Nature Organics',
    category: 'Grocery',
    subCategory: 'Farm Produce & Cold Pressed Oils',
    location: 'Aundh, Pune',
    status: 'LISTED',
    trustScore: 35,
    targetPrincipal: 90000,
    revenueSharePercent: 19,
    repaymentCap: 115200,
    durationDays: 40,
    fundedAmount: 27000,
    dailyPosVolume: 14500,
    businessAge: '1.1 Years',
    gstVerified: false,
    riskNotes: 'New merchant with short banking history. Daily auto-sweep debits active to mitigate collection exposure.',
    investorCount: 4
  }
];

export default function Playground() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('Marketplace');

  // Filter & Sort States
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [durationFilter, setDurationFilter] = useState('ALL');
  const [sortFilter, setSortFilter] = useState('trust-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [advancedViewsActive, setAdvancedViewsActive] = useState(false);

  // Dropdown open states
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isDurOpen, setIsDurOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Contract list state (for live updates when funded)
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);

  // Funding Modal State
  const [selectedContract, setSelectedContract] = useState(null);
  const [investAmount, setInvestAmount] = useState(25000);
  const [toastMessage, setToastMessage] = useState(null);

  // User Profile liquid balance
  const [liquidBalance, setLiquidBalance] = useState(355000);

  // Helper for Category Icons
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-amber-600" />;
      case 'grocery':
        return <ShoppingBasket className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Store className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  // Helper for Trust Score Badges
  const getTrustBadge = (score) => {
    if (score >= 75) {
      return {
        bg: 'bg-[#ECFDF5]',
        text: 'text-[#059669]',
        border: 'border-emerald-200',
        label: 'High Trust'
      };
    } else if (score >= 50) {
      return {
        bg: 'bg-[#FEF9C3]',
        text: 'text-[#CA8A04]',
        border: 'border-amber-200',
        label: 'Moderate'
      };
    } else {
      return {
        bg: 'bg-[#FEF2F2]',
        text: 'text-[#DC2626]',
        border: 'border-rose-200',
        label: 'Risk Alert'
      };
    }
  };

  // Filtered & Sorted Contracts
  const filteredContracts = useMemo(() => {
    return contracts
      .filter((c) => {
        if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
        if (durationFilter === '60' && c.durationDays > 60) return false;
        if (durationFilter === '90' && (c.durationDays <= 60 || c.durationDays > 90)) return false;
        if (durationFilter === '180' && c.durationDays <= 90) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = c.merchantName.toLowerCase().includes(q);
          const matchCat = c.category.toLowerCase().includes(q);
          const matchLoc = c.location.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchLoc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortFilter === 'trust-desc') return b.trustScore - a.trustScore;
        if (sortFilter === 'progress-desc') {
          return b.fundedAmount / b.targetPrincipal - a.fundedAmount / a.targetPrincipal;
        }
        if (sortFilter === 'rate-desc') return b.revenueSharePercent - a.revenueSharePercent;
        if (sortFilter === 'principal-asc') return a.targetPrincipal - b.targetPrincipal;
        return 0;
      });
  }, [contracts, categoryFilter, durationFilter, sortFilter, searchQuery]);

  // Handle modal open
  const handleOpenFundModal = (contract) => {
    setSelectedContract(contract);
    setInvestAmount(25000);
  };

  // Handle funding execution
  const handleConfirmFund = () => {
    if (!selectedContract) return;
    const amt = Number(investAmount) || 0;
    if (amt < 5000) {
      triggerToast('Minimum investment is ₹5,000');
      return;
    }
    if (amt > liquidBalance) {
      triggerToast(`Insufficient liquid balance (${formatCurrency(liquidBalance)})`);
      return;
    }

    // Update contract funded amount
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id === selectedContract.id) {
          const newFunded = Math.min(c.targetPrincipal, c.fundedAmount + amt);
          return { ...c, fundedAmount: newFunded, investorCount: c.investorCount + 1 };
        }
        return c;
      })
    );

    // Update liquid balance
    setLiquidBalance((prev) => prev - amt);
    triggerToast(`Allocated ${formatCurrency(amt)} to ${selectedContract.merchantName}!`);
    setSelectedContract(null);
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculate estimated returns in modal
  const modalCalculations = useMemo(() => {
    if (!selectedContract) return { repayment: 0, profit: 0, duration: 0 };
    const amt = Number(investAmount) || 0;
    const multiplier = selectedContract.repaymentCap / selectedContract.targetPrincipal;
    const repayment = Math.round(amt * multiplier);
    const profit = Math.max(0, repayment - amt);
    return {
      repayment,
      profit,
      duration: selectedContract.durationDays
    };
  }, [selectedContract, investAmount]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex flex-col selection:bg-blue-600 selection:text-white">
      {/* ====================================================================
          1. Global Navigation Bar
          ==================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand/Logo & Nav Links */}
          <div className="flex items-center gap-8 lg:gap-12">
            <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('Marketplace')}>
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                {/* Minimalist upward trendline glyph */}
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-lg tracking-wider text-[#0F172A]">CREDITFLOW</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setActiveTab('Marketplace')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors relative ${
                  activeTab === 'Marketplace'
                    ? 'text-[#2563EB] bg-blue-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Marketplace
                {activeTab === 'Marketplace' && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('Portfolio')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors relative ${
                  activeTab === 'Portfolio'
                    ? 'text-[#2563EB] bg-blue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                My Portfolio
                {activeTab === 'Portfolio' && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('Analytics')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors relative ${
                  activeTab === 'Analytics'
                    ? 'text-[#2563EB] bg-blue-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Analytics
                {activeTab === 'Analytics' && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#2563EB] rounded-full" />
                )}
              </button>
            </nav>
          </div>

          {/* User Profile on far right */}
          <div className="flex items-center gap-4">
            {/* Liquid Balance Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{formatCurrency(liquidBalance)} Liquid</span>
            </div>

            <div className="w-px h-6 bg-[#E2E8F0]" aria-hidden="true" />

            {/* Profile Avatar & Name */}
            <div className="flex items-center gap-3 cursor-pointer py-1 px-2 rounded-full hover:bg-slate-100/80 transition-colors">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 border-2 border-white shadow-sm flex items-center justify-center font-bold text-xs text-slate-800 font-mono">
                AM
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-[#0F172A] leading-tight">A. Mehta</span>
                <span className="text-[11px] text-[#64748B] font-medium">Accredited LP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ====================================================================
          Main Container
          ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW 1: MARKETPLACE */}
        {activeTab === 'Marketplace' && (
          <div className="space-y-8">
            {/* 2. Page Header & Key Statistics */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              {/* Title Section */}
              <div className="max-w-2xl">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                  Investment Marketplace
                </h1>
                <p className="mt-2 text-base text-[#64748B] font-normal leading-relaxed">
                  Discover and invest in short-term high-yield merchant cash advance contracts.
                </p>
              </div>

              {/* Top Metric Counters (Right-aligned) */}
              <div className="flex items-center gap-6 sm:gap-8 bg-white border border-[#E2E8F0] px-6 py-4 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                {/* Active Volume */}
                <div className="text-right">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Active Volume
                  </span>
                  <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                    ₹18,45,000
                  </span>
                </div>

                <div className="w-px h-10 bg-[#E2E8F0]" aria-hidden="true" />

                {/* Contracts Listed */}
                <div className="text-right">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Contracts Listed
                  </span>
                  <span className="text-2xl font-extrabold text-[#2563EB] tracking-tight">
                    34 Live
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Filter & Control Toolbar */}
            <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-2">
                  FILTER BY:
                </span>

                {/* Category Filter Dropdown: Active blue pill */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsCatOpen(!isCatOpen);
                      setIsDurOpen(false);
                      setIsSortOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-[#2563EB] text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    <span>
                      {categoryFilter === 'ALL'
                        ? 'Category: Retail, Food, Grocery'
                        : `Category: ${categoryFilter}`}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCatOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCatOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-30">
                      <button
                        onClick={() => {
                          setCategoryFilter('ALL');
                          setIsCatOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                          categoryFilter === 'ALL' ? 'bg-blue-50 text-[#2563EB] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        All (Retail, Food, Grocery)
                      </button>
                      <button
                        onClick={() => {
                          setCategoryFilter('Retail');
                          setIsCatOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                          categoryFilter === 'Retail' ? 'bg-blue-50 text-[#2563EB] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Retail
                      </button>
                      <button
                        onClick={() => {
                          setCategoryFilter('Food');
                          setIsCatOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                          categoryFilter === 'Food' ? 'bg-blue-50 text-[#2563EB] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Food & Beverage
                      </button>
                      <button
                        onClick={() => {
                          setCategoryFilter('Grocery');
                          setIsCatOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors ${
                          categoryFilter === 'Grocery' ? 'bg-blue-50 text-[#2563EB] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        Grocery
                      </button>
                    </div>
                  )}
                </div>

                {/* Duration Filter Dropdown: White pill */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsDurOpen(!isDurOpen);
                      setIsCatOpen(false);
                      setIsSortOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#E2E8F0] text-[#0F172A] hover:border-slate-300 shadow-sm transition-all cursor-pointer"
                  >
                    <span>
                      {durationFilter === 'ALL'
                        ? 'Duration'
                        : durationFilter === '60'
                        ? '< 60 Days'
                        : durationFilter === '90'
                        ? '60-90 Days'
                        : '90+ Days'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDurOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDurOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-30">
                      <button
                        onClick={() => {
                          setDurationFilter('ALL');
                          setIsDurOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50"
                      >
                        Any Duration
                      </button>
                      <button
                        onClick={() => {
                          setDurationFilter('60');
                          setIsDurOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50"
                      >
                        Under 60 Days
                      </button>
                      <button
                        onClick={() => {
                          setDurationFilter('90');
                          setIsDurOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50"
                      >
                        60 - 90 Days
                      </button>
                      <button
                        onClick={() => {
                          setDurationFilter('180');
                          setIsDurOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50"
                      >
                        90+ Days
                      </button>
                    </div>
                  )}
                </div>

                {/* Sort Filter Dropdown: White pill */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsSortOpen(!isSortOpen);
                      setIsCatOpen(false);
                      setIsDurOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#E2E8F0] text-[#0F172A] hover:border-slate-300 shadow-sm transition-all cursor-pointer"
                  >
                    <span>
                      {sortFilter === 'trust-desc'
                        ? 'Sort by Trust Score'
                        : sortFilter === 'progress-desc'
                        ? 'Sort by Funding %'
                        : sortFilter === 'rate-desc'
                        ? 'Sort by Revenue Share'
                        : 'Sort by Target Principal'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isSortOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-30">
                      <button
                        onClick={() => {
                          setSortFilter('trust-desc');
                          setIsSortOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50"
                      >
                        Trust Score (Highest first)
                      </button>
                      <button
                        onClick={() => {
                          setSortFilter('progress-desc');
                          setIsSortOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50"
                      >
                        Funding % (Highest first)
                      </button>
                      <button
                        onClick={() => {
                          setSortFilter('rate-desc');
                          setIsSortOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50"
                      >
                        Revenue Share % (Highest yield)
                      </button>
                      <button
                        onClick={() => {
                          setSortFilter('principal-asc');
                          setIsSortOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50"
                      >
                        Target Principal (Lowest first)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Control: Search & Advanced Views */}
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search merchant..."
                    className="w-36 sm:w-48 pl-8 pr-3 py-1.5 bg-white border border-[#E2E8F0] rounded-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                {/* Advanced Views button */}
                <button
                  onClick={() => {
                    setAdvancedViewsActive(!advancedViewsActive);
                    triggerToast(
                      !advancedViewsActive
                        ? 'Advanced Underwriting Views Enabled'
                        : 'Default Grid View Restored'
                    );
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    advancedViewsActive
                      ? 'bg-blue-600 text-white'
                      : 'text-[#64748B] hover:text-[#2563EB] hover:bg-white/80'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Advanced Views</span>
                </button>
              </div>
            </div>

            {/* 4. Marketplace Contract Grid (3-Column Responsive Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContracts.map((contract) => {
                const trustBadge = getTrustBadge(contract.trustScore);
                const progressPercent = Math.min(
                  100,
                  Math.round((contract.fundedAmount / contract.targetPrincipal) * 100)
                );
                const remaining = Math.max(0, contract.targetPrincipal - contract.fundedAmount);

                return (
                  <article
                    key={contract.id}
                    className={`bg-white rounded-2xl border ${
                      advancedViewsActive ? 'border-blue-300 ring-2 ring-blue-500/10' : 'border-[#E2E8F0]'
                    } p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between`}
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {/* Left: Category Badge & Status Tag */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-slate-700">
                            {getCategoryIcon(contract.category)}
                            <span>{contract.category}</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold tracking-wider text-[#2563EB] uppercase font-mono">
                            {contract.status}
                          </span>
                        </div>

                        {/* Right: Trust Score Badge */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${trustBadge.bg} ${trustBadge.text} ${trustBadge.border}`}
                          title={`Underwriting Trust Score: ${contract.trustScore}/100`}
                        >
                          <span className="font-extrabold text-sm">{contract.trustScore}</span>
                          <span className="text-[11px] font-semibold">{trustBadge.label}</span>
                        </div>
                      </div>

                      {/* Merchant Title */}
                      <h3 className="text-xl font-bold text-[#0F172A] tracking-tight group-hover:text-[#2563EB] transition-colors line-clamp-1 mt-1">
                        {contract.merchantName}
                      </h3>

                      <p className="text-xs text-[#64748B] mt-1 font-mono">
                        {contract.location}
                      </p>

                      {/* Contract Metrics (2x2 Grid) */}
                      <div className="grid grid-cols-2 gap-3.5 my-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div>
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                            Target Principal
                          </span>
                          <span className="text-sm font-bold text-[#0F172A]">
                            {formatCurrency(contract.targetPrincipal)}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                            Revenue Share
                          </span>
                          <span className="text-sm font-bold text-[#2563EB]">
                            {contract.revenueSharePercent}% POS
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                            Repayment Cap
                          </span>
                          <span className="text-sm font-bold text-[#0F172A]">
                            {formatCurrency(contract.repaymentCap)}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                            Duration
                          </span>
                          <span className="text-sm font-bold text-[#0F172A]">
                            {contract.durationDays} Days
                          </span>
                        </div>
                      </div>

                      {/* Funding Progress Bar */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#0F172A]">
                            {formatCurrency(contract.fundedAmount)} funded
                          </span>
                          <span className="font-extrabold text-[#2563EB]">{progressPercent}%</span>
                        </div>

                        {/* Dual-color Progress Bar */}
                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-[#2563EB] rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                          <span>
                            Target: <strong className="text-slate-800">{formatCurrency(contract.targetPrincipal)}</strong>
                          </span>
                          <span>
                            Remaining: <strong className="text-slate-800">{formatCurrency(remaining)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Call to Action: Full-width outlined button */}
                    <button
                      onClick={() => handleOpenFundModal(contract)}
                      className="w-full py-3 px-4 rounded-xl border-1.5 border-[#2563EB] text-[#2563EB] font-bold text-sm hover:bg-blue-50 hover:text-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>View Details & Fund</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </article>
                );
              })}
            </div>

            {filteredContracts.length === 0 && (
              <div className="bg-white rounded-2xl border border-dashed border-[#E2E8F0] p-12 text-center">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No matching contracts</h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try adjusting your category or duration filters to explore active listings.
                </p>
                <button
                  onClick={() => {
                    setCategoryFilter('ALL');
                    setDurationFilter('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-full text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: MY PORTFOLIO */}
        {activeTab === 'Portfolio' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">My Portfolio</h1>
              <p className="mt-1 text-sm text-[#64748B]">
                Review deployed capital positions, daily automated repayments, and realized portfolio IRR.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Capital Deployed</span>
                <span className="text-2xl font-extrabold text-[#0F172A] block mt-1">₹6,45,000</span>
                <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">7 active contracts</span>
              </div>
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Portfolio Value</span>
                <span className="text-2xl font-extrabold text-[#0F172A] block mt-1">₹7,18,420</span>
                <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">+11.38% unrealized</span>
              </div>
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Realized Cash Returns</span>
                <span className="text-2xl font-extrabold text-[#0F172A] block mt-1">₹73,420</span>
                <span className="text-xs text-slate-500 mt-1 inline-block">Swept to reserve balance</span>
              </div>
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Net Annualized IRR</span>
                <span className="text-2xl font-extrabold text-[#2563EB] block mt-1">18.4%</span>
                <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">0 defaults to date</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
                <h2 className="font-bold text-base text-[#0F172A]">Active Deployments</h2>
                <span className="text-xs text-slate-500">Next daily automated settlement: <strong>Tomorrow 06:00 AM</strong></span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      <th className="py-3 px-5">Merchant Name</th>
                      <th className="py-3 px-5">Category</th>
                      <th className="py-3 px-5">Principal Invested</th>
                      <th className="py-3 px-5">Collected Return</th>
                      <th className="py-3 px-5">Cap Target</th>
                      <th className="py-3 px-5">Completion Horizon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    <tr>
                      <td className="py-4 px-5 font-bold text-[#0F172A]">Sharma General Store</td>
                      <td className="py-4 px-5"><span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-medium">Retail</span></td>
                      <td className="py-4 px-5 font-semibold">₹50,000</td>
                      <td className="py-4 px-5 text-emerald-600 font-bold">₹38,200</td>
                      <td className="py-4 px-5 font-semibold">₹60,000</td>
                      <td className="py-4 px-5 text-slate-500 font-mono text-xs">34 Days Remaining</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-5 font-bold text-[#0F172A]">Fresh Bites Cafe</td>
                      <td className="py-4 px-5"><span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-medium">Food</span></td>
                      <td className="py-4 px-5 font-semibold">₹1,00,000</td>
                      <td className="py-4 px-5 text-emerald-600 font-bold">₹84,000</td>
                      <td className="py-4 px-5 font-semibold">₹1,22,000</td>
                      <td className="py-4 px-5 text-slate-500 font-mono text-xs">42 Days Remaining</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-5 font-bold text-[#0F172A]">QuickMart Grocery</td>
                      <td className="py-4 px-5"><span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-medium">Grocery</span></td>
                      <td className="py-4 px-5 font-semibold">₹1,20,000</td>
                      <td className="py-4 px-5 text-emerald-600 font-bold">₹1,09,500</td>
                      <td className="py-4 px-5 font-semibold">₹1,41,600</td>
                      <td className="py-4 px-5 text-slate-500 font-mono text-xs">18 Days Remaining</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: ANALYTICS */}
        {activeTab === 'Analytics' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Marketplace Analytics</h1>
              <p className="mt-1 text-sm text-[#64748B]">
                Underwriting telemetry, sector diversification, and historical platform cashflow origination.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                <h2 className="font-bold text-base text-[#0F172A] mb-4">Historical Origination Volume (6 Months)</h2>
                <div className="h-56 flex items-end justify-between gap-4 pt-8 pb-2 border-b border-[#E2E8F0]">
                  {[
                    { month: 'Apr', vol: '₹11.2L', h: '60%' },
                    { month: 'May', vol: '₹13.4L', h: '72%' },
                    { month: 'Jun', vol: '₹14.9L', h: '80%' },
                    { month: 'Jul', vol: '₹16.8L', h: '91%' },
                    { month: 'Aug', vol: '₹17.9L', h: '96%' },
                    { month: 'Sep', vol: '₹18.45L', h: '100%' }
                  ].map((item) => (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div
                        className="w-full max-w-12 bg-gradient-to-t from-[#2563EB] to-blue-500 rounded-t-lg transition-all group-hover:brightness-110"
                        style={{ height: item.h }}
                        title={`${item.month}: ${item.vol}`}
                      />
                      <span className="text-xs font-semibold text-slate-500">{item.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
                  <span>Origination Peak: <strong>₹18,45,000 (Current Month)</strong></span>
                  <span>Average Weighted Return: <strong className="text-blue-600">18.4% p.a.</strong></span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="font-bold text-base text-[#0F172A] mb-4">Sector Distribution</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Retail & Apparel</span>
                        <span>44%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '44%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Food & QSR</span>
                        <span>32%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: '32%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Grocery & Supermarkets</span>
                        <span>24%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '24%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Point-of-Sale Integration</span>
                  </div>
                  Daily automated sweeps occur directly from UPI and card POS payment settlement terminals before merchant payout.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          Funding & Details Modal
          ==================================================================== */}
      <AnimatePresence>
        {selectedContract && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] max-w-xl w-full p-6 sm:p-7 overflow-y-auto max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                      {selectedContract.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      Trust Score {selectedContract.trustScore}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A]">{selectedContract.merchantName}</h3>
                  <p className="text-xs text-[#64748B]">{selectedContract.location} • {selectedContract.subCategory}</p>
                </div>

                <button
                  onClick={() => setSelectedContract(null)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Underwriting Metrics */}
              <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-4 mb-5 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8] block">
                  Underwriting & Settlement Telemetry
                </span>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Daily POS Run-Rate</span>
                    <strong className="text-slate-900 font-bold">{formatCurrency(selectedContract.dailyPosVolume)}/day</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Vintage</span>
                    <strong className="text-slate-900 font-bold">{selectedContract.businessAge}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">GST Filing</span>
                    <strong className="text-emerald-600 font-bold">Verified Active</strong>
                  </div>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed pt-1 border-t border-slate-200/60">
                  {selectedContract.riskNotes}
                </p>
              </div>

              {/* Investment Amount & Return Calculator */}
              <div className="bg-gradient-to-b from-blue-50/50 to-blue-50/20 border border-blue-200 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Investment Amount
                  </label>
                  <span className="text-xs text-slate-500">Min: ₹5,000 | Available: {formatCurrency(liquidBalance)}</span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    min={5000}
                    step={5000}
                    className="w-full pl-8 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-lg font-extrabold text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
                  />
                </div>

                {/* Quick Chips */}
                <div className="flex gap-2 mt-3 flex-wrap">
                  {[10000, 25000, 50000, 100000].map((chipAmt) => (
                    <button
                      key={chipAmt}
                      onClick={() => setInvestAmount(chipAmt)}
                      className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-xs font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors"
                    >
                      +{formatCurrency(chipAmt)}
                    </button>
                  ))}
                </div>

                {/* Return Projection */}
                <div className="grid grid-cols-3 gap-3 bg-white border border-[#E2E8F0] rounded-xl p-3 mt-4 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Est. Repayment</span>
                    <span className="text-sm font-extrabold text-[#0F172A]">
                      {formatCurrency(modalCalculations.repayment)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Projected Profit</span>
                    <span className="text-sm font-extrabold text-emerald-600">
                      +{formatCurrency(modalCalculations.profit)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">Horizon</span>
                    <span className="text-sm font-extrabold text-[#0F172A]">
                      {modalCalculations.duration} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedContract(null)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmFund}
                  className="flex-2 py-3 px-4 rounded-xl bg-[#2563EB] text-white font-bold text-sm hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Allocate Capital</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-xl shadow-2xl border-l-4 border-[#2563EB] flex items-center gap-3 text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
