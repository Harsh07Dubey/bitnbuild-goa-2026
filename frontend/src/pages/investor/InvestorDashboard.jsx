import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  TrendingUp,
  Wallet,
  Building2,
  Layers,
  ArrowUpRight,
  PieChart,
  RefreshCw
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import TransactionTable from '../../components/TransactionTable';
import { fetchInvestorDashboard } from '../../services/dashboardService';
import { fetchTransactions } from '../../services/paymentService';

export default function InvestorDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      setIsLoading(true);
      try {
        const [dash, txs] = await Promise.all([
          fetchInvestorDashboard(),
          fetchTransactions('POOL-ALL')
        ]);
        if (isMounted) {
          setDashboardData(dash);
          setTransactions(txs);
        }
      } catch (err) {
        console.error('Error loading investor dashboard:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = dashboardData || {
    totalCapitalDeployed: 645000,
    totalReturnAccrued: 73420,
    projectedWeightedYield: 18.4,
    activePositions: 7,
    portfolioValue: 718420,
    unrealizedReturnPercent: 11.38,
    activeContracts: [],
    originationHistory: [
      { month: 'Apr', vol: '₹11.2L', height: '60%' },
      { month: 'May', vol: '₹13.4L', height: '72%' },
      { month: 'Jun', vol: '₹14.9L', height: '80%' },
      { month: 'Jul', vol: '₹16.8L', height: '91%' },
      { month: 'Aug', vol: '₹17.9L', height: '96%' },
      { month: 'Sep', vol: '₹18.45L', height: '100%' }
    ],
    sectorAllocation: [
      { name: 'Retail & Apparel', percent: 44, color: 'bg-[#2563EB]' },
      { name: 'Food & QSR', percent: 32, color: 'bg-sky-500' },
      { name: 'Grocery & Supermarkets', percent: 24, color: 'bg-emerald-500' }
    ]
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#059669] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              PORTFOLIO ACTIVE • 0 DEFAULTS
            </span>
            <span className="text-[11px] font-mono text-slate-500">Automated Daily Sweeps</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Investor Portfolio & Performance
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Review deployed capital positions, daily automated repayments, and realized portfolio IRR.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs text-xs font-semibold text-slate-700">
            Next settlement sweep: <strong className="text-blue-600">Tomorrow 06:00 AM</strong>
          </div>
        </div>
      </div>

      {/* 2. LP Performance Metric Cards (4-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Capital Deployed */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Capital Deployed
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#0F172A] block mt-2">
            {formatCurrency(metrics.totalCapitalDeployed)}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-xs text-emerald-600 font-semibold">
              {metrics.activePositions || 7} active contracts
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">100% On Schedule</span>
          </div>
        </div>

        {/* Portfolio Value */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Portfolio Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#0F172A] block mt-2">
            {formatCurrency(metrics.portfolioValue)}
          </span>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-emerald-600 font-bold">
              +{metrics.unrealizedReturnPercent || 11.38}%
            </span>
            <span className="text-xs text-slate-500 font-medium">unrealized accrued</span>
          </div>
        </div>

        {/* Realized Cash Returns */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Total Return Accrued
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#0F172A] block mt-2">
            {formatCurrency(metrics.totalReturnAccrued)}
          </span>
          <span className="text-xs text-slate-500 mt-2 inline-block">
            Swept to liquid reserve pool
          </span>
        </div>

        {/* Projected Weighted Yield */}
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
              Projected Weighted Yield
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-[#2563EB] block mt-2">
            {metrics.projectedWeightedYield}% p.a.
          </span>
          <span className="text-xs text-emerald-600 font-semibold mt-2 inline-block">
            Zero historical defaults
          </span>
        </div>
      </div>

      {/* 3. Active Deployments Portfolio Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-extrabold text-base text-[#0F172A]">Active LP Deployments</h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live automated merchant cash advance contracts generating daily revenue share.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Next settlement sweep: <strong className="text-slate-900">Tomorrow 06:00 AM</strong>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-[#E2E8F0] text-[11px] font-mono font-bold uppercase tracking-wider text-[#94A3B8]">
                <th className="py-3 px-5">Merchant Name</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5 text-right">Principal Invested</th>
                <th className="py-3 px-5 text-right">Collected Return</th>
                <th className="py-3 px-5 text-right">Cap Target</th>
                <th className="py-3 px-5 text-center">Completion Horizon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {(metrics.activeContracts?.length > 0 ? metrics.activeContracts : [
                {
                  id: 'cf-101',
                  merchantName: 'Sharma General Store',
                  category: 'Retail',
                  principalInvested: 50000,
                  collectedReturn: 38200,
                  capTarget: 60000,
                  completionHorizon: '34 Days Remaining'
                },
                {
                  id: 'cf-102',
                  merchantName: 'Fresh Bites Cafe',
                  category: 'Food',
                  principalInvested: 100000,
                  collectedReturn: 84000,
                  capTarget: 122000,
                  completionHorizon: '42 Days Remaining'
                },
                {
                  id: 'cf-104',
                  merchantName: 'QuickMart Grocery',
                  category: 'Grocery',
                  principalInvested: 120000,
                  collectedReturn: 109500,
                  capTarget: 141600,
                  completionHorizon: '18 Days Remaining'
                }
              ]).map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-5 font-bold text-[#0F172A]">{c.merchantName}</td>
                  <td className="py-4 px-5">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-medium text-slate-700">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-right text-slate-900">
                    {formatCurrency(c.principalInvested)}
                  </td>
                  <td className="py-4 px-5 text-emerald-600 font-bold text-right">
                    {formatCurrency(c.collectedReturn)}
                  </td>
                  <td className="py-4 px-5 font-semibold text-right text-slate-800">
                    {formatCurrency(c.capTarget)}
                  </td>
                  <td className="py-4 px-5 text-center text-slate-500 font-mono text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                      {c.completionHorizon}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Risk / Return Allocation Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical Origination Volume */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-base text-[#0F172A]">
                Historical Origination Volume (6 Months)
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                Monthly loan liquidity origination through FairFuture POS underwriting.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              Peak: ₹18.45L
            </span>
          </div>

          <div className="h-56 flex items-end justify-between gap-4 pt-8 pb-2 border-b border-[#E2E8F0]">
            {metrics.originationHistory.map((item) => (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                <div
                  className="w-full max-w-12 bg-gradient-to-t from-[#2563EB] to-blue-500 rounded-t-lg transition-all duration-300 group-hover:brightness-110 shadow-xs"
                  style={{ height: item.height }}
                  title={`${item.month}: ${item.vol}`}
                />
                <span className="text-xs font-semibold text-slate-500">{item.month}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 mt-4 gap-2">
            <span>
              Origination Peak: <strong>₹18,45,000 (Current Month)</strong>
            </span>
            <span>
              Average Weighted Return: <strong className="text-blue-600">18.4% p.a.</strong>
            </span>
          </div>
        </div>

        {/* Sector Allocation & POS Integration Telemetry */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-base text-[#0F172A]">Sector Allocation</h2>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {metrics.sectorAllocation.map((sec) => (
                <div key={sec.name}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{sec.name}</span>
                    <span className="font-mono">{sec.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${sec.color} rounded-full transition-all duration-500`}
                      style={{ width: `${sec.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Underwriting Assurance Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
            <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Point-of-Sale Integration</span>
            </div>
            Daily automated sweeps occur directly from UPI and card POS payment settlement terminals before merchant payout.
          </div>
        </div>
      </div>

      {/* 5. Settlement Payout Ledger using TransactionTable.jsx in mode="investor" */}
      <TransactionTable
        transactions={transactions}
        mode="investor"
        title="Automated Split Settlements Ledger"
        subtitle="Live automated settlements credited to investor escrow from customer scans."
        allowExport={true}
      />
    </div>
  );
}
