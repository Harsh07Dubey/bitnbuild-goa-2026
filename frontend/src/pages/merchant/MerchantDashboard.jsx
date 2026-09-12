import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  QrCode,
  Boxes,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Wallet,
  Sparkles,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import TransactionTable from '../../components/TransactionTable';
import { formatCurrency } from '../../utils/formatCurrency';
import { getMerchantDashboard } from '../../services/dashboardService';

export default function MerchantDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getMerchantDashboard();
        if (isMounted) setDashboardData(data);
      } catch (err) {
        console.warn('Failed to fetch live merchant dashboard metrics:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Contract data with live backend override
  const summary = dashboardData?.summary || dashboardData?.contract || {};
  const activeContractFromApi = dashboardData?.contracts?.[0] || dashboardData?.contract;

  const contract = {
    id: activeContractFromApi?.contract_id || activeContractFromApi?.id || 'CON-001',
    merchantName: activeContractFromApi?.merchantName || 'Sharma General Store',
    disbursedPrincipal: activeContractFromApi?.principal ? Number(activeContractFromApi.principal) : (summary?.total_principal || 150000),
    repaymentCap: activeContractFromApi?.cap_amount ? Number(activeContractFromApi.cap_amount) : 180000,
    totalRepaid: summary?.total_repaid !== undefined ? Number(summary.total_repaid) : 42500,
    weeklyMinimum: 2500,
    weeklySatisfied: 3125,
    daysRemaining: 64,
    totalDuration: 90,
    trustScore: 82,
    trustStatus: 'High Trust',
    revenueShare: activeContractFromApi?.share_pct ? Number(activeContractFromApi.share_pct) * 100 : 15
  };

  const progressPct = Math.round((contract.totalRepaid / (contract.repaymentCap || 1)) * 100);

  return (
    <div className="space-y-8 pb-12">
      {/* ========================================================
          1. NAVIGATION & STATUS BAR
      ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-[#059669] border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping" />
              CONTRACT {contract.id} • ACTIVE
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {formatCurrency(contract.disbursedPrincipal)} • Direct P2P Settlement Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {contract.merchantName} Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Real-time Point-of-Sale split settlements, active amortization progress, and weekly compliance.
          </p>
        </div>

        {/* Quick Action Button to Terminal */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/merchant/contract/CON-001"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span>Contract Terms</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Link
            to="/merchant/qr"
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch POS QR Terminal</span>
          </Link>
        </div>
      </div>

      {/* ========================================================
          2. KEY METRIC CARDS (4-CARD GRID)
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Repaid to Date */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                Total Repaid to Date
              </span>
              <Wallet className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div className="text-2xl font-black text-[#0F172A] font-mono tracking-tight">
              {formatCurrency(contract.totalRepaid)}
            </div>
            <span className="text-xs text-[#64748B] mt-0.5 block">
              of {formatCurrency(contract.repaymentCap)} Total Cap ({progressPct}%)
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                className="bg-[#2563EB] h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#64748B] font-mono mt-1.5">
              <span>₹0</span>
              <span className="text-[#2563EB] font-bold">{progressPct}% Repaid</span>
              <span>{formatCurrency(contract.repaymentCap)}</span>
            </div>
          </div>
        </div>

        {/* Card 2: AI Trust Score */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                AI Trust Score
              </span>
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0F172A] font-mono tracking-tight">
                {contract.trustScore}
              </span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
              <span className="ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#059669] border border-emerald-200">
                {contract.trustStatus}
              </span>
            </div>
            <span className="text-xs text-[#64748B] mt-1 block">
              Historical stability marker active
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#059669] font-mono font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              0 Bounces in 36 Mo.
            </span>
            <span className="text-slate-400">A+ Tier</span>
          </div>
        </div>

        {/* Card 3: Days Remaining */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                Financing Horizon
              </span>
              <Calendar className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-[#0F172A] font-mono tracking-tight">
              {contract.daysRemaining} Days
            </div>
            <span className="text-xs text-[#64748B] mt-0.5 block">
              Remaining of {contract.totalDuration}-day duration
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono">
            <span>26 DAYS ELAPSED</span>
            <span className="text-[#2563EB] font-bold">ON SCHEDULE</span>
          </div>
        </div>

        {/* Card 4: Weekly Commitment Alert */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm flex flex-col justify-between bg-gradient-to-br from-white via-white to-emerald-50/50">
          <div>
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider font-mono">
                Weekly Commitment
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            </div>
            <div className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-100/80 text-[#059669] inline-block mb-1.5">
              Weekly Minimum Met
            </div>
            <div className="text-xs text-[#0F172A] font-medium leading-relaxed">
              <strong>{formatCurrency(contract.weeklyMinimum)}</strong> satisfied this week via direct POS revenue splits.
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] font-mono text-[#059669] flex items-center justify-between">
            <span>COLLECTED: {formatCurrency(contract.weeklySatisfied)}</span>
            <span>125% OF TARGET</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. POS SETTLEMENT & CHECKPOINT BANNER
      ======================================================== */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#0A0F1D] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <QrCode className="w-4 h-4" />
            <span>DYNAMIC POINT-OF-SALE AMORTIZATION</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Accept Everyday Customer Payments with Automated 15% Split
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All customer scans via your CreditFlow QR terminal automatically disburse 84% to your operational bank account, 15% towards your investor cap, and 1% protocol clearing fee.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/merchant/inventory"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold backdrop-blur-sm transition-all flex items-center gap-2"
          >
            <Boxes className="w-4 h-4 text-emerald-400" />
            <span>Stock Checkpoint Status</span>
          </Link>

          <Link
            to="/merchant/qr"
            className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/30 transition-all flex items-center gap-2 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch POS Terminal</span>
          </Link>
        </div>
      </div>

      {/* ========================================================
          4. EMBEDDED LEDGER COMPONENT (TransactionTable)
      ======================================================== */}
      <TransactionTable title="Recent Split Settlements Ledger" />
    </div>
  );
}
