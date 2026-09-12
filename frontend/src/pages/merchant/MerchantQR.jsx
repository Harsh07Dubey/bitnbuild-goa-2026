import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Zap,
  Building2,
  Coins,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Copy,
  Check,
  PlayCircle,
  Maximize2,
  History,
  Store,
  Printer,
  X
} from 'lucide-react';
import QRCodeCard from '../../components/QRCodeCard';
import PaymentCard from '../../components/PaymentCard';
import { formatCurrency } from '../../utils/formatCurrency';
import { getRecentPayments } from '../../services/paymentService';

export default function MerchantQR() {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [paymentNotice, setPaymentNotice] = useState(null);

  const merchantName = 'Sharma General Store';
  const contractId = 'CON-001';
  const payUrl = 'https://fairfuture.app/pay/CON-001';

  // Load recent transactions
  useEffect(() => {
    setTransactions(getRecentPayments());
  }, []);

  // When payment simulator completes inside modal
  const handlePaymentSuccess = (tx) => {
    setIsSimulatorOpen(false);
    // Prepend new transaction to recent list
    setTransactions((prev) => [tx, ...prev]);
    setPaymentNotice({
      amount: tx.amount,
      method: tx.paymentMethod || tx.method || 'Card Gateway / Razorpay',
      reference: tx.reference,
      merchantShare: tx.split?.merchant ?? (tx.amount * 0.84)
    });
    setTimeout(() => setPaymentNotice(null), 6000);
  };

  const handlePrintFullscreen = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Live Payment Success Toast Banner */}
      <AnimatePresence>
        {paymentNotice && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm flex items-center justify-between gap-3 text-emerald-950"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  Payment Received: {formatCurrency(paymentNotice.amount, true)} via {paymentNotice.method}
                </p>
                <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                  Ref: {paymentNotice.reference} • +{formatCurrency(paymentNotice.merchantShare, true)} credited directly to merchant pool
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPaymentNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumbs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-2">
            <Link to="/merchant/dashboard" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span>POS Systems</span>
            <span>/</span>
            <span className="font-bold text-slate-800">Dynamic Split QR</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            POS Payout Terminal • Split Active
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Display this QR to customers at checkout. Each customer payment is programmatically divided in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSimulatorOpen(true)}
            className="py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Simulate Customer Payment</span>
          </button>

          <Link
            to="/merchant/dashboard"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Merchant Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20 shrink-0">
            <Store className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold font-display text-slate-900">
                {merchantName}
              </h2>
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Retail Verified</span>
              </div>
              <div className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-bold">
                ACTIVE {contractId}
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Customers scan to pay. Funds automatically split 84% to you, 15% to contract repayment, and 1% platform fee.
            </p>
          </div>
        </div>

        {/* Quick Metrics Badge */}
        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Settlement Mode
            </span>
            <span className="text-xs font-bold font-mono text-emerald-700 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Auto P2P Escrow
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200/80" />
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Repayment Cap
            </span>
            <span className="text-xs font-bold font-mono text-slate-800 mt-0.5 block">
              1.15x Target
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: QR Terminal (Left) + Split Analytics & Settlement Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN: THE INTERACTIVE POS QR TERMINAL (6 COLS)
        ======================================================== */}
        <div className="lg:col-span-6 space-y-6">
          <QRCodeCard
            contractId={contractId}
            merchantName={merchantName}
            payUrl={payUrl}
            onSimulatePayment={() => setIsSimulatorOpen(true)}
            onOpenFullscreen={() => setIsFullscreenOpen(true)}
          />
        </div>

        {/* ========================================================
            RIGHT COLUMN: REAL-TIME SPLIT BREAKDOWN (6 COLS)
        ======================================================== */}
        <div className="lg:col-span-6 space-y-6">
          {/* Protocol Routing Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                  PROGRAMMATIC PROTOCOL ROUTING
                </span>
                <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">
                  Three-Way Split Execution Breakdown
                </h3>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                100% DISBURSED
              </span>
            </div>

            {/* Visual Lanes */}
            <div className="space-y-3">
              {/* Lane 1: Merchant Stall */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400 font-bold">LANE 01 // 84% MERCHANT CORE</span>
                  <Building2 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-black font-mono text-white">
                  84% of Gross Payment
                </div>
                <span className="text-xs text-slate-400 block">
                  Transferred directly into your primary merchant operational bank account.
                </span>
              </div>

              {/* Lane 2: Investor Syndicate */}
              <div className="p-4 rounded-xl bg-white/5 border border-emerald-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold">LANE 02 // 15% INVESTOR CAP</span>
                  <Coins className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-black font-mono text-emerald-400">
                  15% of Gross Payment
                </div>
                <span className="text-xs text-slate-400 block">
                  Programmatic repayment credited towards CON-001 cap fulfillment.
                </span>
              </div>

              {/* Lane 3: Platform Clearing Fee */}
              <div className="p-4 rounded-xl bg-white/5 border border-purple-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400 font-bold">LANE 03 // 1% CLEARING FEE</span>
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-black font-mono text-purple-300">
                  1% of Gross Payment
                </div>
                <span className="text-xs text-slate-400 block">
                  Instant webhook processing and cryptographic consensus verification.
                </span>
              </div>
            </div>

            {/* Split Progress Bar */}
            <div className="pt-2">
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
                <div style={{ width: '84%' }} className="bg-[#2563EB] h-full" title="Merchant: 84%" />
                <div style={{ width: '15%' }} className="bg-[#059669] h-full" title="Investor: 15%" />
                <div style={{ width: '1%' }} className="bg-purple-500 h-full" title="Fee: 1%" />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span className="text-blue-400">■ 84% Merchant</span>
                <span className="text-emerald-400">■ 15% Repayment</span>
                <span className="text-purple-400">■ 1% Clearing</span>
              </div>
            </div>

            {/* Cryptographic Idempotency guarantee */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#059669]" />
                <span>IDEMPOTENCY KEY LOCKED</span>
              </div>
              <span className="text-slate-500">SHA256: 0x4f...91e</span>
            </div>
          </div>

          {/* Live Settlement Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Recent Terminal Settlements
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live verifiable split audit logs
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>

            {/* Transactions List */}
            <div className="divide-y divide-slate-100 mt-2 max-h-72 overflow-y-auto">
              {transactions.map((tx) => (
                <div
                  key={tx.reference}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50/60 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {tx.reference}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          {tx.paymentMethod}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span>{tx.formattedDate || 'Just now'}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">
                          +{formatCurrency(tx.split?.merchant || tx.amount * 0.84, true)} to you
                        </span>
                        <span>•</span>
                        <span className="text-blue-700 font-medium">
                          {formatCurrency(tx.split?.investor || tx.amount * 0.15, true)} pool
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold font-mono text-slate-900">
                      {formatCurrency(tx.amount, true)}
                    </div>
                    <span className="inline-block text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                      Split Sealed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Acrylic Stand Counter Modal */}
      <AnimatePresence>
        {isFullscreenOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center relative border border-slate-200"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsFullscreenOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Physical Acrylic Counter Header */}
              <div className="flex flex-col items-center">
                <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase mb-2">
                  Countertop Display Stand
                </div>
                <h3 className="text-2xl font-bold font-display text-slate-900">
                  {merchantName}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Accepted via any UPI App • Google Pay, PhonePe, Paytm, BHIM
                </p>
              </div>

              {/* Enlarged Scannable QR Stand View */}
              <div className="my-6 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200 inline-block shadow-inner">
                <QRCodeCard
                  contractId={contractId}
                  merchantName={merchantName}
                  payUrl={payUrl}
                  onSimulatePayment={() => {
                    setIsFullscreenOpen(false);
                    setIsSimulatorOpen(true);
                  }}
                  onOpenFullscreen={() => {}}
                />
              </div>

              {/* Stand Footnote & Controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrintFullscreen}
                  className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Stand for Counter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFullscreenOpen(false)}
                  className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Customer Checkout Simulator Modal */}
      <AnimatePresence>
        {isSimulatorOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-md"
            >
              <PaymentCard
                isStandalone={false}
                contractId={contractId}
                merchantName={merchantName}
                onClose={() => setIsSimulatorOpen(false)}
                onSuccess={handlePaymentSuccess}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
