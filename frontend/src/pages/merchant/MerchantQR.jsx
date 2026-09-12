import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function MerchantQR() {
  const [amount, setAmount] = useState(500);
  const [isSimulating, setIsSimulating] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic split calculations (84% Merchant, 15% Investor, 1% Platform)
  const merchantPayout = (amount * 0.84).toFixed(2);
  const investorSplit = (amount * 0.15).toFixed(2);
  const platformFee = (amount * 0.01).toFixed(2);

  const presets = [150, 250, 500, 1000, 2500];

  const handleSimulatePayment = () => {
    setIsSimulating(true);
    setPaymentSuccess(false);

    setTimeout(() => {
      setIsSimulating(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        setPaymentSuccess(false);
      }, 4000);
    }, 1200);
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(`sharma.general@creditflow?am=${amount}&cu=INR`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
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

          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Point-of-Sale Split QR Terminal
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Display this QR to customers at checkout. Each customer payment is programmatically divided in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/merchant/dashboard"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN: THE INTERACTIVE POS QR TERMINAL (6 COLS)
        ======================================================== */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-6 text-center flex flex-col items-center">
          <div className="flex items-center justify-between w-full pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-left">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#0F172A] block">Sharma General Store</span>
                <span className="text-[10px] font-mono text-slate-400">POS TERMINAL ID: 0x9F8B...C41E</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#059669] border border-emerald-200 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              <span>UPI LIVE</span>
            </div>
          </div>

          {/* Amount Selector */}
          <div className="w-full text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] block mb-2">
              Bill / Transaction Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">₹</span>
              <input
                type="number"
                min={10}
                step={10}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-4 py-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-2xl font-black text-[#0F172A] focus:outline-none focus:border-[#2563EB] text-center"
              />
            </div>

            {/* Quick Amount Chips */}
            <div className="flex gap-2 mt-3 flex-wrap justify-center">
              {presets.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                    amount === amt
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* QR Code Container */}
          <div className="relative p-6 rounded-2xl bg-white border-2 border-slate-900 shadow-xl inline-block mt-2">
            {/* SVG Stylized QR Code */}
            <div className="w-56 h-56 bg-slate-950 p-3 rounded-xl relative flex items-center justify-center">
              {/* QR Pattern Simulation */}
              <svg viewBox="0 0 200 200" className="w-full h-full text-white fill-current">
                {/* Corner Positioning Squares */}
                <rect x="10" y="10" width="50" height="50" rx="6" fill="#2563EB" />
                <rect x="20" y="20" width="30" height="30" rx="3" fill="#0A0F1D" />
                <rect x="27" y="27" width="16" height="16" rx="2" fill="#FFFFFF" />

                <rect x="140" y="10" width="50" height="50" rx="6" fill="#2563EB" />
                <rect x="150" y="20" width="30" height="30" rx="3" fill="#0A0F1D" />
                <rect x="157" y="27" width="16" height="16" rx="2" fill="#FFFFFF" />

                <rect x="10" y="140" width="50" height="50" rx="6" fill="#2563EB" />
                <rect x="20" y="150" width="30" height="30" rx="3" fill="#0A0F1D" />
                <rect x="27" y="157" width="16" height="16" rx="2" fill="#FFFFFF" />

                {/* Random Data Pattern Dots */}
                <rect x="70" y="20" width="12" height="12" rx="2" />
                <rect x="90" y="20" width="12" height="12" rx="2" />
                <rect x="110" y="20" width="12" height="12" rx="2" />

                <rect x="70" y="40" width="12" height="12" rx="2" />
                <rect x="90" y="40" width="12" height="12" rx="2" />
                <rect x="110" y="40" width="12" height="12" rx="2" />

                <rect x="20" y="70" width="12" height="12" rx="2" />
                <rect x="40" y="70" width="12" height="12" rx="2" />
                <rect x="70" y="70" width="12" height="12" rx="2" />
                <rect x="90" y="70" width="20" height="20" rx="4" fill="#059669" />
                <rect x="120" y="70" width="12" height="12" rx="2" />
                <rect x="140" y="70" width="12" height="12" rx="2" />
                <rect x="170" y="70" width="12" height="12" rx="2" />

                <rect x="20" y="90" width="12" height="12" rx="2" />
                <rect x="40" y="90" width="12" height="12" rx="2" />
                <rect x="70" y="100" width="12" height="12" rx="2" />
                <rect x="120" y="100" width="12" height="12" rx="2" />
                <rect x="150" y="100" width="12" height="12" rx="2" />
                <rect x="170" y="100" width="12" height="12" rx="2" />

                <rect x="70" y="130" width="12" height="12" rx="2" />
                <rect x="90" y="130" width="12" height="12" rx="2" />
                <rect x="110" y="130" width="12" height="12" rx="2" />
                <rect x="130" y="130" width="12" height="12" rx="2" />
                <rect x="150" y="130" width="12" height="12" rx="2" />
                <rect x="170" y="130" width="12" height="12" rx="2" />

                <rect x="70" y="160" width="12" height="12" rx="2" />
                <rect x="100" y="160" width="12" height="12" rx="2" />
                <rect x="130" y="160" width="12" height="12" rx="2" />
                <rect x="160" y="160" width="12" height="12" rx="2" />
              </svg>

              {/* Center CreditFlow Badge */}
              <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-xl shadow-lg border-2 border-blue-600 flex items-center justify-center">
                <span className="font-serif font-black text-blue-600 text-sm">CF</span>
              </div>
            </div>

            <div className="mt-3 text-xs font-mono font-bold text-slate-800">
              UPI // SCAN TO PAY ₹{amount}
            </div>
          </div>

          {/* Copy UPI String Button */}
          <button
            onClick={handleCopyUPI}
            className="text-xs text-slate-500 hover:text-slate-800 font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'UPI Intent Copied!' : 'Copy UPI Intent String'}</span>
          </button>

          {/* Simulate Payment Trigger Button */}
          <button
            onClick={handleSimulatePayment}
            disabled={isSimulating}
            className="w-full py-4 px-6 rounded-xl bg-[#059669] hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating Customer PhonePe Scan...</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4" />
                <span>Simulate Customer UPI Payment (₹{amount})</span>
              </>
            )}
          </button>

          {/* Payment Success Toast Banner */}
          <AnimatePresence>
            {paymentSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="w-full p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />
                <div className="text-left">
                  <span className="block font-bold">Payment Verified & Split Settled!</span>
                  <span>
                    ₹{merchantPayout} routed to your bank • ₹{investorSplit} amortized to syndicate
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================
            RIGHT COLUMN: REAL-TIME SPLIT BREAKDOWN (6 COLS)
        ======================================================== */}
        <div className="lg:col-span-6 space-y-6">
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
                <div className="text-2xl font-black font-mono text-white">
                  ₹{merchantPayout}
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
                <div className="text-2xl font-black font-mono text-emerald-400">
                  ₹{investorSplit}
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
                <div className="text-2xl font-black font-mono text-purple-300">
                  ₹{platformFee}
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
        </div>
      </div>
    </div>
  );
}
