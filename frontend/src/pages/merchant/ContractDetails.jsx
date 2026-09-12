import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Download,
  FileText,
  Lock,
  Zap,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Building2,
  Calendar
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ContractDetails() {
  const { id = 'CON-001' } = useParams();
  const [downloading, setDownloading] = useState(false);

  // Contract parameters
  const contract = {
    id: id.toUpperCase().startsWith('CON-') ? id.toUpperCase() : `CON-${id}`,
    merchantName: 'Sharma General Store',
    businessCategory: 'Retail & Daily Essentials',
    targetPrincipal: 150000,
    fulfillmentCap: 180000,
    totalRepaid: 42500,
    revenueShare: 15,
    weeklyMinimum: 2500,
    durationDays: 90,
    daysElapsed: 26,
    investorBackers: 24,
    createdDate: 'Aug 17, 2026',
    escrowSigner: '0x8f29...b401 (Smart Escrow Multi-Sig)',
    currentStage: 3 // 0: Draft, 1: Listed, 2: Funded, 3: Active, 4: Fulfilled
  };

  const outstandingBalance = contract.fulfillmentCap - contract.totalRepaid;
  const progressPercent = Math.round((contract.totalRepaid / contract.fulfillmentCap) * 100);

  // 5 Lifecycle Stepper stages
  const lifecycleStages = [
    { title: 'Draft', desc: 'Terms Configured', status: 'completed' },
    { title: 'Listed', desc: 'Marketplace Active', status: 'completed' },
    { title: 'Funded', desc: '100% Escrow Reached', status: 'completed' },
    { title: 'Active', desc: 'POS Split Amortizing', status: 'active' },
    { title: 'Fulfilled', desc: 'Cap Reached (Closed)', status: 'pending' },
  ];

  const handleDownloadAgreement = () => {
    setDownloading(true);
    setTimeout(() => {
      // Create sample agreement text file download
      const agreementText = `CREDITFLOW P2P REVENUE SHARE FINANCING AGREEMENT
=====================================================
Contract ID: ${contract.id}
Merchant: ${contract.merchantName}
Disbursed Principal: INR ${contract.targetPrincipal}
Fulfillment Repayment Cap: INR ${contract.fulfillmentCap} (1.20x Multiple)
Programmatic Revenue Share: ${contract.revenueShare}% Gross POS Deductions
Weekly Repayment Minimum: INR ${contract.weeklyMinimum}
Tenure / Duration: ${contract.durationDays} Days
Escrow Protocol Signer: ${contract.escrowSigner}
Status: ACTIVE - Programmatic Amortization Active

Signed & Verified via CreditFlow Cryptographic Pos Node 2026.`;

      const blob = new Blob([agreementText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CreditFlow-Agreement-${contract.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-2">
            <Link to="/merchant/dashboard" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span>Contract Details</span>
            <span>/</span>
            <span className="font-bold text-slate-800">{contract.id}</span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Contract Lifecycle & Parameters
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Institutional programmatic revenue share agreement between {contract.merchantName} and syndicate LPs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/merchant/qr"
            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>POS QR Terminal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ========================================================
          1. STATE MACHINE PROGRESSION STEPPER (5-STAGE)
      ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              LIFECYCLE STATE MACHINE
            </span>
            <h3 className="text-lg font-bold text-[#0F172A]">Current Progression: Active Amortization</h3>
          </div>

          <div className="text-xs font-mono font-semibold text-slate-500 flex items-center gap-2">
            <span>VOCABULARY:</span>
            <span className="text-[#059669]">DRAFT</span>
            <span>•</span>
            <span className="text-[#059669]">LISTED</span>
            <span>•</span>
            <span className="text-[#059669]">FUNDED</span>
            <span>•</span>
            <span className="text-[#2563EB] font-bold underline decoration-2">ACTIVE</span>
            <span>•</span>
            <span className="text-slate-400">FULFILLED</span>
            <span>•</span>
            <span className="text-slate-400">CLOSED</span>
          </div>
        </div>

        {/* 5-Step Visual Stepper */}
        <div className="pt-8 pb-4 grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
          {lifecycleStages.map((stage, idx) => {
            const isCompleted = stage.status === 'completed';
            const isActive = stage.status === 'active';
            const isPending = stage.status === 'pending';

            return (
              <div key={stage.title} className="flex flex-col items-center sm:items-start text-center sm:text-left relative">
                {/* Step Circle & Connector */}
                <div className="flex items-center w-full mb-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-extrabold text-sm shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-[#059669] text-white shadow-sm'
                        : isActive
                        ? 'bg-[#2563EB] text-white ring-4 ring-blue-100 shadow-md animate-pulse'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>

                  {/* Horizontal Bar (Desktop) */}
                  {idx < lifecycleStages.length - 1 && (
                    <div
                      className={`hidden sm:block flex-1 h-1 mx-2 rounded-full ${
                        isCompleted ? 'bg-[#059669]' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>

                {/* Step Metadata */}
                <div>
                  <span
                    className={`text-sm font-bold block ${
                      isActive ? 'text-[#2563EB]' : isCompleted ? 'text-[#0F172A]' : 'text-slate-400'
                    }`}
                  >
                    {stage.title} {isActive && '(Current)'}
                  </span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">{stage.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          2. TWO-COLUMN DETAILED BREAKDOWN
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT CARD: P2P CONTRACT PARAMETERS (7 COLS)
        ======================================================== */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold">
                SYNDICATE TERMS
              </span>
              <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                P2P Contract Parameters
              </h3>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
              {contract.investorBackers} LP Backers
            </span>
          </div>

          {/* Parameters Table */}
          <div className="divide-y divide-slate-100 text-sm">
            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Contract Reference ID</span>
              <span className="font-mono font-bold text-[#0F172A]">{contract.id}</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Programmatic Revenue Share</span>
              <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg">
                {contract.revenueShare}% split per scan
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Disbursed Principal</span>
              <span className="font-mono font-bold text-[#0F172A]">
                {formatCurrency(contract.targetPrincipal)}
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Total Fulfillment Cap</span>
              <span className="font-mono font-bold text-[#059669]">
                {formatCurrency(contract.fulfillmentCap)} (1.20x)
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Required Weekly Minimum</span>
              <span className="font-mono font-bold text-slate-800">
                {formatCurrency(contract.weeklyMinimum)} / week
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Total Agreed Horizon</span>
              <span className="font-mono font-bold text-slate-800">{contract.durationDays} Days</span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <span className="text-slate-500 font-medium">Smart Escrow Signer</span>
              <span className="font-mono text-xs text-slate-600">{contract.escrowSigner}</span>
            </div>
          </div>

          {/* Smart Escrow Compliance Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-[#059669] shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block mb-0.5">Smart Escrow Compliance Guaranteed</strong>
              All capital was disbursed only upon 100% syndication. Amortization occurs dynamically per UPI customer scan without fixed monthly debtor compounding.
            </div>
          </div>
        </div>

        {/* ========================================================
            RIGHT CARD: REPAYMENT HEALTH & STATUS (5 COLS)
        ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0F172A] text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                REPAYMENT HEALTH & METRICS
              </span>
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-ping" />
            </div>

            {/* Outstanding Balance Display */}
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase block">Realtime Outstanding Balance</span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight mt-1">
                {formatCurrency(outstandingBalance)}
              </div>
              <span className="text-xs text-emerald-400 font-medium mt-1 block">
                Remaining to reach contractual fulfillment cap
              </span>
            </div>

            {/* Progress Metric */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Repaid: {formatCurrency(contract.totalRepaid)}</span>
                <span className="text-white font-bold">Cap: {formatCurrency(contract.fulfillmentCap)}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-[#2563EB] h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-right text-[11px] font-mono text-blue-400 font-semibold">
                {progressPercent}% Complete
              </div>
            </div>

            {/* Verification Checkmarks */}
            <div className="space-y-3 pt-2 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>Automatic Split Settlements Active (15% per scan)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>P2P Ledger Signature Verified</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>Smart Escalation Rules Complied</span>
              </div>
            </div>

            {/* Agreement Download Button */}
            <button
              onClick={handleDownloadAgreement}
              disabled={downloading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#2563EB]" />
              <span>{downloading ? 'Preparing Agreement...' : 'Download Full Contract Agreement'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
