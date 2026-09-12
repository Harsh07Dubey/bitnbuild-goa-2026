import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  HelpCircle,
  X,
  MessageCircleQuestion,
  ArrowLeft
} from 'lucide-react';

/**
 * Embedded Mock FAQ Dataset
 */
const FAQ_DATA = [
  // ─── For Merchants ───
  {
    id: 'mch-1',
    category: 'For Merchants',
    question: 'How does the programmatic repayment work?',
    answer:
      'Repayments are completely automated. A fixed percentage (e.g., 15%) is split directly from your daily Point-of-Sale (POS) transactions until the agreed cap is reached.'
  },
  {
    id: 'mch-2',
    category: 'For Merchants',
    question: 'What if I have a slow sales week?',
    answer:
      'Because repayments are revenue-based, you only pay a percentage of your actual sales. If you sell less, you pay less. However, contracts may have a small weekly minimum to ensure baseline progress.'
  },
  {
    id: 'mch-3',
    category: 'For Merchants',
    question: 'Do I need to provide physical collateral or property documents?',
    answer:
      'No physical collateral or personal property pledge is required. Funding eligibility is evaluated via our AI Trust Score engine using your historical POS terminal turnover, daily transaction volume, and operational consistency.'
  },
  {
    id: 'mch-4',
    category: 'For Merchants',
    question: 'How quickly are funds disbursed to my business?',
    answer:
      'Once your contract is 100% subscribed by community liquidity providers on the marketplace, funds are released from test escrow and deposited into your linked bank account within 24 to 48 hours.'
  },
  {
    id: 'mch-5',
    category: 'For Merchants',
    question: 'Can I settle the contract early if my business has surplus cash?',
    answer:
      'Yes. You can settle the remaining balance up to your contractual repayment cap at any point without incurring prepayment penalties or surprise compounding interest.'
  },

  // ─── For Investors ───
  {
    id: 'inv-1',
    category: 'For Investors',
    question: 'How is my capital protected?',
    answer:
      'Capital is deployed only when a contract is 100% funded. We use AI-driven trust scoring and POS transaction history to verify merchant reliability.'
  },
  {
    id: 'inv-2',
    category: 'For Investors',
    question: 'When do I receive my returns?',
    answer:
      'Returns are credited to your platform wallet in real-time as merchants make daily sales, automatically reflecting your share of the payout.'
  },
  {
    id: 'inv-3',
    category: 'For Investors',
    question: 'What is the typical return multiple and investment duration?',
    answer:
      'Contracts typically target a 1.15x to 1.35x return on invested capital (15% to 35% nominal gain) across a projected amortization window of 60 to 180 days, closely calibrated to the merchant’s daily card and QR turnover.'
  },
  {
    id: 'inv-4',
    category: 'For Investors',
    question: 'Can I diversify across multiple merchant contracts?',
    answer:
      'Yes. Investors can deploy micro-allocations starting from as low as ₹5,000 per contract across retail, food & beverage, grocery, and apparel sectors to optimize risk-adjusted yield.'
  },
  {
    id: 'inv-5',
    category: 'For Investors',
    question: 'What happens if a merchant experiences business disruptions?',
    answer:
      'If POS transaction flow pauses unexpectedly, protocol health monitors flag the anomaly. Automated covenants trigger field auditing and testnet liquidity reserve mechanics to protect capital interests.'
  },

  // ─── General ───
  {
    id: 'gen-1',
    category: 'General',
    question: 'Is this a loan?',
    answer:
      'No, this is a Merchant Cash Advance. You are selling a portion of your future receivables at a discount, rather than taking on traditional debt with compounding interest.'
  },
  {
    id: 'gen-2',
    category: 'General',
    question: 'How does CreditFlow verify merchant transaction metrics?',
    answer:
      'Our engine integrates with POS machines, digital payment aggregators (UPI, Razorpay, Paytm), and reconciled GST filings to ingest tamper-proof operational throughput in real time.'
  },
  {
    id: 'gen-3',
    category: 'General',
    question: 'Are contracts executed on the platform legally binding?',
    answer:
      'Yes. Contracts are executed as programmatic tripartite revenue-sharing and factoring agreements adhering to recognized commercial receivable discounting principles.'
  },
  {
    id: 'gen-4',
    category: 'General',
    question: 'What fees does CreditFlow charge?',
    answer:
      'CreditFlow levies a transparent 1% protocol facilitation fee deducted at transaction split settlement. There are no upfront appraisal fees or hidden application surcharges.'
  }
];

const CATEGORIES = ['All', 'General', 'For Merchants', 'For Investors'];

/**
 * CreditFlowFAQ — Standalone FAQ Component
 * Drop-in ready for React 19 + Tailwind CSS v4.
 */
export default function CreditFlowFAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({ 'mch-1': true }); // First item open by default

  // Filter items by category and search query
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Toggle individual question accordion
  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Expand all / Collapse all in view
  const handleExpandAll = () => {
    const allOpen = filteredFAQs.reduce((acc, item) => {
      acc[item.id] = true;
      return acc;
    }, {});
    setOpenItems(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenItems({});
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-start gap-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* ── 1. Header Section ── */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 text-xs font-semibold tracking-wide mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center & Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about investing and securing capital on CreditFlow.
          </p>
        </div>

        {/* ── 2. Search Bar ── */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by keyword (e.g., repayments, returns, collateral)..."
            className="w-full pl-11 pr-10 py-3.5 text-sm sm:text-base bg-white border border-slate-200 rounded-xl shadow-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── 3. Category Filter Tabs ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl border border-slate-200">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Quick Expand/Collapse toggles */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>{filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'}</span>
            <span className="text-slate-300">•</span>
            <button
              onClick={handleExpandAll}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Expand all
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={handleCollapseAll}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* ── 4. Accordion List ── */}
        <div className="space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((item) => {
              const isOpen = Boolean(openItems[item.id]);

              return (
                <div
                  key={item.id}
                  className={`bg-white border rounded-xl overflow-hidden transition-all duration-150 ${
                    isOpen
                      ? 'border-blue-200 shadow-xs ring-1 ring-blue-500/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4 text-left flex items-start justify-between gap-4 cursor-pointer select-none focus:outline-none"
                  >
                    <div className="space-y-1">
                      <span className="inline-block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                        {item.question}
                      </h3>
                    </div>

                    <div
                      className={`p-1.5 rounded-lg shrink-0 mt-0.5 transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 bg-blue-50 text-blue-600'
                          : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 px-4 bg-white border border-slate-200 rounded-xl">
              <MessageCircleQuestion className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-slate-800">
                No matching questions found
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                We couldn't find anything matching "{searchQuery}". Try searching for terms like "returns", "POS", or "collateral".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                Reset search filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
