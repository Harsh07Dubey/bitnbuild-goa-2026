import React, { useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Check,
  ArrowLeft,
  Share2,
  Download,
  Store,
  ShieldCheck,
  Calendar,
  Hash,
  ExternalLink,
  Printer,
  CreditCard
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateSplit, getPaymentDetails } from '../../services/paymentService';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve params from location.state or URL query params, falling back to prompt defaults
  const stateTx = location.state?.transaction;
  const paramAmount = searchParams.get('amount');
  const paramRef = searchParams.get('ref');
  const paramContract = searchParams.get('contract');

  // Amount
  const amount = stateTx?.amount || (paramAmount ? parseFloat(paramAmount) : 500);
  // Payment Reference
  const ref = stateTx?.reference || paramRef || 'PAY-948271';
  // Contract ID
  const contractId = stateTx?.contractId || paramContract || 'CON-001';
  // Merchant Name
  const merchantName = stateTx?.merchantName || 'Sharma General Store';

  // Formatted date
  const timestamp = stateTx?.formattedDate || new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(new Date());

  // Compute live split
  const split = useMemo(() => {
    return stateTx?.split || calculateSplit(amount);
  }, [stateTx, amount]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-100 flex flex-col items-center justify-center p-4 py-8">
      {/* Brand header */}
      <div className="mb-6 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/20">
            FF
          </div>
          <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">
            FairFuture
          </span>
        </Link>
      </div>

      {/* Main Centered Modern Receipt Container */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100 relative overflow-hidden print:shadow-none print:border-none"
      >
        {/* Top green receipt accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

        {/* Success Visual with Large Animated Emerald Checkmark */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 18,
              delay: 0.1
            }}
            className="w-16 h-16 rounded-full bg-emerald-100/80 border-4 border-emerald-50 flex items-center justify-center shadow-lg shadow-emerald-500/20"
          >
            <Check className="w-9 h-9 text-[#059669] stroke-[3]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-2xl font-bold font-display text-slate-900 tracking-tight"
          >
            Payment Successful
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed"
          >
            Your payment has been recorded and split across escrow accounts.
          </motion.p>
        </div>

        {/* Amount Paid Highlight */}
        <div className="mt-6 text-center py-4 bg-slate-50/80 border border-slate-100 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Amount Paid
          </span>
          <div className="text-3xl font-extrabold font-display text-slate-900 mt-0.5">
            {formatCurrency(amount, true)}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Settlement Confirmed</span>
          </div>
        </div>

        {/* Receipt Key Metadata */}
        <div className="mt-6 space-y-2.5 text-xs border-t border-b border-slate-100 py-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              Payment Ref
            </span>
            <span className="font-mono font-bold text-slate-900 tracking-wide bg-slate-100 px-2 py-0.5 rounded">
              {ref}
            </span>
          </div>

          {(stateTx?.gateway || (typeof ref === 'string' && ref.startsWith('pay_'))) && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                Gateway
              </span>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {stateTx?.gateway || 'Razorpay Test Mode'}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              Merchant Payee
            </span>
            <span className="font-semibold text-slate-800">
              {merchantName}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Contract ID
            </span>
            <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {contractId}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Timestamp
            </span>
            <span className="font-medium text-slate-600">
              {timestamp}
            </span>
          </div>
        </div>

        {/* Automated Split Breakdown Section */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Automated Split Breakdown
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">100% Gross</span>
          </div>

          {/* Distinct 3-column pill layout */}
          <div className="grid grid-cols-3 gap-2">
            {/* Green Card: Merchant */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                Merchant ({split.merchantPct}%)
              </span>
              <span className="text-sm font-bold font-mono text-emerald-900 mt-1">
                {formatCurrency(split.merchant, true)}
              </span>
              <span className="text-[10px] text-emerald-600 mt-0.5">
                Direct Payout
              </span>
            </div>

            {/* Blue Card: Investor Pool */}
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                Investor ({split.investorPct}%)
              </span>
              <span className="text-sm font-bold font-mono text-blue-900 mt-1">
                {formatCurrency(split.investor, true)}
              </span>
              <span className="text-[10px] text-blue-600 mt-0.5">
                Repayment Pool
              </span>
            </div>

            {/* Purple Card: Protocol Fee */}
            <div className="bg-purple-50/80 border border-purple-200/80 rounded-xl p-3 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                Fee ({split.platformFeePct}%)
              </span>
              <span className="text-sm font-bold font-mono text-purple-900 mt-1">
                {formatCurrency(split.platformFee, true)}
              </span>
              <span className="text-[10px] text-purple-600 mt-0.5">
                Protocol Fee
              </span>
            </div>
          </div>
        </div>

        {/* Status badge: SPLIT COMPLETED • RECORD SEALED */}
        <div className="mt-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SPLIT COMPLETED • RECORD SEALED</span>
          </div>
        </div>

        {/* Navigation & Action CTAs */}
        <div className="mt-6 space-y-2.5 print:hidden">
          <button
            type="button"
            onClick={() => navigate('/merchant/dashboard')}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md shadow-slate-900/10 transition-colors flex items-center justify-center gap-2"
          >
            <span>Done</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/merchant/qr')}
              className="flex-1 py-2.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to POS Terminal</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              title="Print receipt"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Security Footnote */}
      <div className="mt-6 text-center text-[11px] text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>Cryptographically verified on FairFuture Programmatic Split Protocol</span>
      </div>
    </div>
  );
}
