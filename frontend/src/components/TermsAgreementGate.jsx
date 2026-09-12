import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  AlertCircle,
  FileText,
  ChevronDown,
  Loader2,
  Lock,
  Scale,
  ExternalLink
} from 'lucide-react';

/**
 * TermsAgreementGate — Exam-form style Terms & Conditions agreement gate.
 * 
 * @param {Object} props
 * @param {() => void} props.onAccept - Callback executed when terms are accepted and confirmed.
 * @param {string} [props.submitLabel="Confirm & Proceed"] - Text on the primary submission button.
 * @param {boolean} [props.isSubmitting=false] - Whether the action is currently processing.
 * @param {string} [props.contractType] - Optional context ('Merchant Agreement', 'Investor Disclosure', etc.).
 */
export default function TermsAgreementGate({
  onAccept,
  submitLabel = 'Confirm & Proceed',
  isSubmitting = false,
  contractType
}) {
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const termsContainerRef = useRef(null);

  // Check if terms are already fully visible or track scroll to bottom
  const checkScroll = () => {
    const el = termsContainerRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 18;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  useEffect(() => {
    const el = termsContainerRef.current;
    if (el) {
      if (el.scrollHeight <= el.clientHeight + 8) {
        setHasScrolledToBottom(true);
      }
    }
  }, [contractType]);

  const handleScrollToBottom = () => {
    const el = termsContainerRef.current;
    if (el) {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth'
      });
      setHasScrolledToBottom(true);
    }
  };

  const handleToggleAccept = () => {
    setAccepted((prev) => {
      const next = !prev;
      if (next) setError('');
      return next;
    });
  };

  const handleKeyDownCheckbox = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggleAccept();
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!accepted) {
      setError('You must accept the terms and conditions to proceed.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }

    setError('');
    if (onAccept && !isSubmitting) {
      onAccept();
    }
  };

  const isMerchant = contractType?.toLowerCase().includes('merchant');
  const isInvestor = contractType?.toLowerCase().includes('investor');

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 md:p-6 shadow-sm transition-all">
      {/* ── 1. Header ── */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-100/80 text-blue-600 shrink-0 mt-0.5">
            {accepted ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 transition-colors" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-blue-600 transition-colors" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
                {contractType ? `${contractType}: ` : ''}Terms of Agreement & Risk Disclosure
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/70 text-slate-700 tracking-wide uppercase">
                <Lock className="w-2.5 h-2.5 text-slate-500" /> Mandatory Gate
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Please review and accept the terms below to proceed.
            </p>
          </div>
        </div>

        {/* Scroll Indicator Badge */}
        <div className="hidden sm:flex items-center">
          {hasScrolledToBottom ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
              <Check className="w-3 h-3 text-emerald-600" /> Terms Reviewed
            </span>
          ) : (
            <button
              type="button"
              onClick={handleScrollToBottom}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/70 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
            >
              <ChevronDown className="w-3 h-3 text-blue-600 animate-bounce" /> Scroll to bottom
            </button>
          )}
        </div>
      </div>

      {/* ── 2. Scrollable Terms Box (Exam-form numbered layout) ── */}
      <div className="relative">
        <div
          ref={termsContainerRef}
          onScroll={checkScroll}
          tabIndex={0}
          aria-label="Terms of agreement scrollable box"
          style={{ scrollbarWidth: 'thin' }}
          className="max-h-44 sm:max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4 text-slate-700 text-xs leading-relaxed space-y-3.5 shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500/40"
        >
          {/* Item 1 */}
          <div className="flex gap-2.5 items-start">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold shrink-0 mt-0.5 border border-slate-200">
              1
            </span>
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900 block">
                Programmatic Amortization
              </span>
              <p className="text-slate-600">
                Acknowledgement that repayments are automatically deducted per Point-of-Sale (POS)
                transaction at the agreed revenue-share rate until the cap multiple is completely fulfilled.
                Settlement routing occurs through automated split logic without manual merchant invoicing.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-2.5 items-start">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold shrink-0 mt-0.5 border border-slate-200">
              2
            </span>
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900 block">
                Escrow Milestone Rule
              </span>
              <p className="text-slate-600">
                Understanding that funds remain locked in test-mode escrow until 100% of the principal target
                is subscribed by participating liquidity providers. If the funding milestone is not achieved
                within the designated window, committed capital is automatically released back to pool balances.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex gap-2.5 items-start">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold shrink-0 mt-0.5 border border-slate-200">
              3
            </span>
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900 block">
                Platform Risk & No Guarantee
              </span>
              <p className="text-slate-600">
                Confirmation that projected yields, repayment timelines, and return multipliers are variable
                and subject to merchant sales velocity, footfall seasonality, and operational continuity.
                FairFuture / CreditFlow provides underwriting intelligence and protocol rails, but does not
                act as an insurer of commercial debt or guarantor of liquidity.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex gap-2.5 items-start">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold shrink-0 mt-0.5 border border-slate-200">
              4
            </span>
            <div className="space-y-0.5">
              <span className="font-semibold text-slate-900 block">
                Hackathon Sandbox Declaration
              </span>
              <p className="text-slate-600">
                Affirmation that all transactions occur in a developer demonstration / testnet sandbox
                environment. Virtual rupee credits, mock Razorpay orders, and simulated tokenized shares do
                not involve real-world banking clearance, RBI-regulated deposits, or statutory credit liability.
              </p>
            </div>
          </div>

          {/* Contextual Item 5 if specific role */}
          {isMerchant && (
            <div className="flex gap-2.5 items-start pt-1 border-t border-slate-100">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold shrink-0 mt-0.5 border border-blue-200">
                5
              </span>
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900 block">
                  Merchant POS Continuity Commitment
                </span>
                <p className="text-slate-600">
                  Merchant covenants to channel primary shop payments through the designated Dynamic QR terminal
                  during the active contract lifespan to ensure fair, transparent, and continuous amortization.
                </p>
              </div>
            </div>
          )}

          {isInvestor && (
            <div className="flex gap-2.5 items-start pt-1 border-t border-slate-100">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold shrink-0 mt-0.5 border border-emerald-200">
                5
              </span>
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900 block">
                  Investor Risk Capital Acknowledgement
                </span>
                <p className="text-slate-600">
                  Investor acknowledges that capital allocations in micro-merchant advances involve credit risk.
                  Returns are linked directly to merchant daily collections, and past performance is not a guarantee
                  of future payout schedules.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Floating "Scroll to bottom" button for mobile screens */}
        {!hasScrolledToBottom && (
          <button
            type="button"
            onClick={handleScrollToBottom}
            className="sm:hidden absolute bottom-2 right-3 text-[10px] font-medium text-blue-700 bg-white/95 backdrop-blur-xs border border-blue-200 shadow-xs px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer"
          >
            <span>Scroll for more</span>
            <ChevronDown className="w-3 h-3 text-blue-600 animate-bounce" />
          </button>
        )}
      </div>

      {/* ── 3. Acceptance Checkbox & Error Display ── */}
      <motion.div
        animate={isShaking ? { x: [-4, 4, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="mt-4"
      >
        <div
          onClick={handleToggleAccept}
          onKeyDown={handleKeyDownCheckbox}
          role="checkbox"
          aria-checked={accepted}
          tabIndex={0}
          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer select-none transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
            accepted
              ? 'bg-blue-50/40 border-blue-200 text-slate-900'
              : error
              ? 'bg-rose-50/40 border-rose-300 text-rose-950 ring-1 ring-rose-200'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
          }`}
        >
          {/* Custom Styled Checkbox */}
          <div
            className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-all duration-150 ${
              accepted
                ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                : error
                ? 'bg-white border-rose-400'
                : 'bg-white border-slate-300 hover:border-slate-400'
            }`}
          >
            <AnimatePresence>
              {accepted && (
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Checkbox Label */}
          <label className="text-xs sm:text-[13px] font-medium leading-relaxed cursor-pointer">
            I have carefully read, understood, and agree to the{' '}
            <span className="font-semibold text-slate-900">Terms of Use</span>,{' '}
            <span className="font-semibold text-slate-900">Programmatic Revenue Split Rules</span>, and{' '}
            <span className="font-semibold text-slate-900">Platform Risk Disclosures</span>.
          </label>
        </div>

        {/* Inline Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 mt-2 px-1"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── 4. Submission CTA Button ── */}
      <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3.5 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
          <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Legally binding electronic signature under Sandbox Protocol v1.4</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
            accepted && !isSubmitting
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm hover:shadow active:scale-[0.99]'
              : isSubmitting
              ? 'bg-blue-500 text-white opacity-80 cursor-wait'
              : 'bg-slate-200 hover:bg-slate-300 text-slate-500 hover:text-slate-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <ShieldCheck className={`w-4 h-4 ${accepted ? 'text-white' : 'text-slate-400'}`} />
              <span>{submitLabel}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
