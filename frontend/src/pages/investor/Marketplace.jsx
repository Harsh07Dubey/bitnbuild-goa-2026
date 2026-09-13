import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronDown,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  X,
  Store,
  Utensils,
  ShoppingBasket,
  ArrowUpRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { useAuth } from '../../context/AuthContext';
import { getContracts } from '../../services/contractService';
import { fundContract } from '../../services/fundingService';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { liquidBalance, updateBalance } = useAuth();

  // Filter & Sort States
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [durationFilter, setDurationFilter] = useState('ALL');
  const [sortFilter, setSortFilter] = useState('trust-desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Dropdown open states
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isDurOpen, setIsDurOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Contract list state
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Funding Modal State
  const [selectedContract, setSelectedContract] = useState(null);
  const [investAmount, setInvestAmount] = useState(25000);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch contracts on initial mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getContracts();
        if (isMounted) {
          setContracts(data);
        }
      } catch (err) {
        console.error('Error fetching contracts:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-open modal when deep-linked with ?fund= or ?contract=
  const fundParam = searchParams.get('fund') || searchParams.get('contract');
  useEffect(() => {
    if (fundParam && contracts.length > 0) {
      const match = contracts.find(
        (c) =>
          c.id.toLowerCase() === fundParam.toLowerCase() ||
          c.id.replace(/^cf-/, '') === fundParam.replace(/^cf-/, '')
      );
      if (match) {
        setSelectedContract(match);
      }
    }
  }, [fundParam, contracts]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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
    const newParams = new URLSearchParams(searchParams);
    newParams.set('fund', contract.id);
    setSearchParams(newParams, { replace: true });
  };

  // Close modal and clear contract/fund params from URL
  const handleCloseModal = () => {
    setSelectedContract(null);
    if (searchParams.has('fund') || searchParams.has('contract')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('fund');
      newParams.delete('contract');
      setSearchParams(newParams, { replace: true });
    }
  };

  // Handle funding execution
  const handleConfirmFund = async () => {
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

    try {
      await fundContract(selectedContract.id, { amount: amt });

      // Update local contract state
      setContracts((prev) =>
        prev.map((c) => {
          if (c.id === selectedContract.id) {
            const newFunded = Math.min(c.targetPrincipal, c.fundedAmount + amt);
            return {
              ...c,
              fundedAmount: newFunded,
              investorCount: c.investorCount + 1,
              status: newFunded >= c.targetPrincipal ? 'FUNDED' : c.status
            };
          }
          return c;
        })
      );

      // Deduct from investor liquid balance
      updateBalance(-amt);

      triggerToast(`Allocated ${formatCurrency(amt)} to ${selectedContract.merchantName}!`);
      handleCloseModal();
    } catch (err) {
      triggerToast(`Funding error: ${err.message}`);
    }
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
    <div className="space-y-8 font-sans">
      {/* 1. Page Header & Key Statistics */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        {/* Title Section */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              LP Direct Marketplace
            </span>
            <span className="text-[11px] font-mono text-slate-500">Live P2P Settlements</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Investment Marketplace
          </h1>
          <p className="mt-2 text-base text-[#64748B] font-normal leading-relaxed">
            Discover and invest in short-term high-yield merchant cash advance contracts with automated daily POS sweeps.
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

      {/* 2. Filter & Control Toolbar */}
      <div className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-2">
            FILTER BY:
          </span>

          {/* Category Filter Dropdown */}
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
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${isCatOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isCatOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-30">
                <button
                  onClick={() => {
                    setCategoryFilter('ALL');
                    setIsCatOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    categoryFilter === 'ALL'
                      ? 'bg-blue-50 text-[#2563EB] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  All (Retail, Food, Grocery)
                </button>
                <button
                  onClick={() => {
                    setCategoryFilter('Retail');
                    setIsCatOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    categoryFilter === 'Retail'
                      ? 'bg-blue-50 text-[#2563EB] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Retail
                </button>
                <button
                  onClick={() => {
                    setCategoryFilter('Food');
                    setIsCatOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    categoryFilter === 'Food'
                      ? 'bg-blue-50 text-[#2563EB] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Food & Beverage
                </button>
                <button
                  onClick={() => {
                    setCategoryFilter('Grocery');
                    setIsCatOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                    categoryFilter === 'Grocery'
                      ? 'bg-blue-50 text-[#2563EB] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Grocery
                </button>
              </div>
            )}
          </div>

          {/* Duration Filter Dropdown */}
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
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isDurOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDurOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-30">
                <button
                  onClick={() => {
                    setDurationFilter('ALL');
                    setIsDurOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Any Duration
                </button>
                <button
                  onClick={() => {
                    setDurationFilter('60');
                    setIsDurOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Under 60 Days
                </button>
                <button
                  onClick={() => {
                    setDurationFilter('90');
                    setIsDurOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  60 - 90 Days
                </button>
                <button
                  onClick={() => {
                    setDurationFilter('180');
                    setIsDurOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  90+ Days
                </button>
              </div>
            )}
          </div>

          {/* Sort Filter Dropdown */}
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
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isSortOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isSortOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-30">
                <button
                  onClick={() => {
                    setSortFilter('trust-desc');
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Trust Score (Highest first)
                </button>
                <button
                  onClick={() => {
                    setSortFilter('progress-desc');
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Funding % (Highest first)
                </button>
                <button
                  onClick={() => {
                    setSortFilter('rate-desc');
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Revenue Share % (Highest yield)
                </button>
                <button
                  onClick={() => {
                    setSortFilter('principal-asc');
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
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

      {/* 3. Marketplace Contract Grid (3-Column Responsive Grid) */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading marketplace listings...</span>
        </div>
      ) : (
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
                  advancedViewsActive
                    ? 'border-blue-300 ring-2 ring-blue-500/10'
                    : 'border-[#E2E8F0]'
                } p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-semibold text-slate-700">
                        {getCategoryIcon(contract.category)}
                        <span>{contract.category}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold tracking-wider text-[#2563EB] uppercase font-mono">
                        {contract.status}
                      </span>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${trustBadge.bg} ${trustBadge.text} ${trustBadge.border}`}
                      title={`Underwriting Trust Score: ${contract.trustScore}/100`}
                    >
                      <span className="font-extrabold text-sm">{contract.trustScore}</span>
                      <span className="text-[11px] font-semibold">{trustBadge.label}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#0F172A] tracking-tight group-hover:text-[#2563EB] transition-colors line-clamp-1 mt-1">
                    {contract.merchantName}
                  </h3>

                  <p className="text-xs text-[#64748B] mt-1 font-mono">{contract.location}</p>

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

                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-[#2563EB] rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>
                        Target:{' '}
                        <strong className="text-slate-800">
                          {formatCurrency(contract.targetPrincipal)}
                        </strong>
                      </span>
                      <span>
                        Remaining:{' '}
                        <strong className="text-slate-800">{formatCurrency(remaining)}</strong>
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
      )}

      {/* Empty State */}
      {!isLoading && filteredContracts.length === 0 && (
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
            className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-full text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* 4. Funding & Details Modal */}
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
                  <h3 className="text-xl font-bold text-[#0F172A]">
                    {selectedContract.merchantName}
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    {selectedContract.location} • {selectedContract.subCategory}
                  </p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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
                    <span className="text-slate-400 block text-[10px] uppercase">
                      Daily POS Run-Rate
                    </span>
                    <strong className="text-slate-900 font-bold">
                      {formatCurrency(selectedContract.dailyPosVolume)}/day
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Vintage</span>
                    <strong className="text-slate-900 font-bold">
                      {selectedContract.businessAge}
                    </strong>
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
                  <span className="text-xs text-slate-500">
                    Min: ₹5,000 | Available: {formatCurrency(liquidBalance)}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">
                    ₹
                  </span>
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
                      className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-full text-xs font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      +{formatCurrency(chipAmt)}
                    </button>
                  ))}
                </div>

                {/* Return Projection */}
                <div className="grid grid-cols-3 gap-3 bg-white border border-[#E2E8F0] rounded-xl p-3 mt-4 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                      Est. Repayment
                    </span>
                    <span className="text-sm font-extrabold text-[#0F172A]">
                      {formatCurrency(modalCalculations.repayment)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                      Projected Profit
                    </span>
                    <span className="text-sm font-extrabold text-emerald-600">
                      +{formatCurrency(modalCalculations.profit)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#94A3B8] block">
                      Horizon
                    </span>
                    <span className="text-sm font-extrabold text-[#0F172A]">
                      {modalCalculations.duration} Days
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
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
