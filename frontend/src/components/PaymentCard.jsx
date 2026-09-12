import React, { useState, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Store,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  X,
  Loader2
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { calculateSplit, createPayment } from '../services/paymentService';
import { openRazorpayCheckout } from '../services/razorpayService';

const PRESET_AMOUNTS = [250, 500, 1200, 2500];

export default function PaymentCard({
  isStandalone = false,
  contractId: propContractId,
  merchantName = 'Sharma General Store',
  onClose,
  onSuccess
}) {
  const navigate = useNavigate();
  const params = useParams();

  // Resolve contract ID from props or URL route param
  const activeContractId = propContractId || params.contractId || 'CON-001';

  // Amount state (number)
  const [amount, setAmount] = useState(500);
  const [rawInput, setRawInput] = useState('500');
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi' | 'card'
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Live split calculation
  const split = useMemo(() => {
    return calculateSplit(amount);
  }, [amount]);

  // Handle manual input change
  const handleInputChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setRawInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setAmount(num);
      setError('');
      setNotice('');
    } else if (val === '') {
      setAmount(0);
    }
  };

  // Handle quick chip select
  const handleChipSelect = (preset) => {
    setAmount(preset);
    setRawInput(preset.toString());
    setError('');
    setNotice('');
  };

  // Handle payment execution
  const handlePay = async (e) => {
    e?.preventDefault?.();
    if (!amount || amount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setNotice('');

    // Branch 1: Card Gateway / Razorpay Test-Mode Checkout
    if (selectedMethod === 'card') {
      try {
        await openRazorpayCheckout({
          amount,
          contractId: activeContractId,
          merchantName,
          navigate,
          onSuccess: (tx) => {
            setIsProcessing(false);
            if (onSuccess) {
              onSuccess(tx);
            } else {
              navigate(`/payment/success?amount=${tx.amount}&ref=${tx.reference}&contract=${tx.contractId}`, {
                state: { transaction: tx }
              });
            }
          },
          onFailure: (err) => {
            setIsProcessing(false);
            setError(err?.description || err?.message || 'Razorpay checkout encountered an issue.');
          },
          onDismiss: () => {
            setIsProcessing(false);
            setNotice('Razorpay checkout modal dismissed. No funds were debited.');
          }
        });
      } catch (err) {
        console.error('Razorpay checkout trigger error:', err);
        setError('Failed to initiate Razorpay checkout. Please try again.');
        setIsProcessing(false);
      }
      return;
    }

    // Branch 2: UPI Test Simulator (Instant Settlement Simulation)
    try {
      const tx = await createPayment({
        contractId: activeContractId,
        amount,
        paymentMethod: 'UPI Test Simulator',
        merchantName
      });

      if (onSuccess) {
        onSuccess(tx);
      } else {
        // Navigate to payment success screen with params and state
        navigate(`/payment/success?amount=${tx.amount}&ref=${tx.reference}&contract=${tx.contractId}`, {
          state: { transaction: tx }
        });
      }
    } catch (err) {
      console.error('Payment simulation failed', err);
      setError('Payment simulation encountered an error. Please try again.');
      setIsProcessing(false);
    }
  };

  const cardContent = (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden relative">
      {/* Top Banner Security micro-tag */}
      <div className="bg-slate-900 px-5 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-slate-100">A FairFuture Secure Checkout</span>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            title="Close simulator"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-6">
        {/* Payee Identity */}
        <div className="flex items-start justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
              <Store className="w-3.5 h-3.5 text-blue-600" />
              <span>Verified Merchant Payee</span>
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 leading-snug">
              Pay {merchantName}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-semibold">
                Contract {activeContractId}
              </span>
              <span className="text-[11px] text-slate-400">• Dynamic Settlement</span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 font-bold text-sm">
            ₹
          </div>
        </div>

        {/* Amount Selector */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Enter Amount
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold font-display text-slate-400">
              ₹
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={rawInput}
              onChange={handleInputChange}
              disabled={isProcessing}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-2xl font-bold font-display text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {error && (
            <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {notice && (
            <div className="mt-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 font-medium flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{notice}</span>
              </div>
              <button
                type="button"
                onClick={() => setNotice('')}
                className="text-blue-500 hover:text-blue-700 p-0.5 rounded cursor-pointer"
                title="Dismiss notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick-Pick Preset Chips */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map((preset) => {
              const isSelected = amount === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handleChipSelect(preset)}
                  disabled={isProcessing}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {formatCurrency(preset)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Live Split Preview Accordion */}
        <div className="mt-5 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/60">
          <button
            type="button"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-slate-900">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Real-Time Split Preview</span>
              <span className="text-slate-400 font-normal">(Gross: {formatCurrency(split.gross, true)})</span>
            </div>
            {isAccordionOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <AnimatePresence initial={false}>
            {isAccordionOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-3.5 pt-1 space-y-2 border-t border-slate-200/60 bg-white">
                  {/* Merchant Receives */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <div>
                        <span className="font-semibold text-slate-800">Merchant Receives</span>
                        <span className="text-[11px] text-slate-500 ml-1.5">({split.merchantPct}%)</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">
                      {formatCurrency(split.merchant, true)}
                    </span>
                  </div>

                  {/* Investor Pool Repayment */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <div>
                        <span className="font-semibold text-slate-800">Investor Pool Repayment</span>
                        <span className="text-[11px] text-slate-500 ml-1.5">({split.investorPct}%)</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-blue-700">
                      {formatCurrency(split.investor, true)}
                    </span>
                  </div>

                  {/* Protocol Fee */}
                  <div className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <div>
                        <span className="font-semibold text-slate-800">Protocol Fee</span>
                        <span className="text-[11px] text-slate-500 ml-1.5">({split.platformFeePct}%)</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-purple-700">
                      {formatCurrency(split.platformFee, true)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Payment Method Selector (Radio Group) */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Select Payment Method
          </label>

          <div className="space-y-2">
            {/* Option 1: UPI Test Simulator */}
            <label
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === 'upi'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={selectedMethod === 'upi'}
                  onChange={() => setSelectedMethod('upi')}
                  disabled={isProcessing}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    UPI Test Simulator
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Instant automated split settlement
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Recommended
              </span>
            </label>

            {/* Option 2: Card Gateway / Razorpay */}
            <label
              className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedMethod === 'card'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={selectedMethod === 'card'}
                  onChange={() => setSelectedMethod('card')}
                  disabled={isProcessing}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div className="w-8 h-8 rounded-lg bg-indigo-100/80 flex items-center justify-center text-indigo-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Card Gateway / Razorpay
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Cards, UPI & Netbanking via Razorpay modal
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Live Test Mode
              </span>
            </label>
          </div>
        </div>

        {/* Action CTA */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handlePay}
            disabled={isProcessing || amount <= 0}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>
                  {selectedMethod === 'card'
                    ? 'Launching Razorpay modal...'
                    : 'Processing P2P split settlement...'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>
                  {selectedMethod === 'card'
                    ? `Pay ${formatCurrency(split.gross, true)} via Razorpay`
                    : `Pay ${formatCurrency(split.gross, true)} (UPI Simulator)`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </button>

          {/* Footnote */}
          <p className="mt-3 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Demo payment only. No real money will be charged.</span>
          </p>
        </div>
      </div>
    </div>
  );

  // If standalone view, wrap in a full-page container
  if (isStandalone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4">
        {/* FairFuture Brand Header */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/30">
              FF
            </div>
            <span className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
              FairFuture
            </span>
          </Link>
          <p className="text-xs text-slate-500 mt-1">
            Programmatic Revenue Split & Merchant Escrow
          </p>
        </div>

        {cardContent}

        <div className="mt-6 text-center text-xs text-slate-400">
          Powered by FairFuture Settlement Protocol • Instant Merchant Repayment Escrow
        </div>
      </div>
    );
  }

  return cardContent;
}
