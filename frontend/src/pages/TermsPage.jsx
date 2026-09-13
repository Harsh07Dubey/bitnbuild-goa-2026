import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Store,
  Wallet,
  Sparkles
} from 'lucide-react';
import TermsAgreementGate from '../components/TermsAgreementGate';

export default function TermsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read role & redirect destination from query params
  const roleQuery = (searchParams.get('role') || searchParams.get('type') || '').toLowerCase();
  const isInvestor = roleQuery.includes('investor');
  const initialType = isInvestor ? 'Investor Disclosure' : 'Merchant Agreement';

  const [selectedType, setSelectedType] = useState(initialType);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if URL search query changes
  useEffect(() => {
    setSelectedType(isInvestor ? 'Investor Disclosure' : 'Merchant Agreement');
  }, [isInvestor]);

  // Destination route after accepting terms
  const targetNextPage =
    searchParams.get('redirect') ||
    (selectedType === 'Investor Disclosure' ? '/investor/marketplace' : '/merchant/onboarding');

  const handleAcceptTerms = () => {
    setIsSubmitting(true);
    // Brief visual confirmation before navigating to the next page
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(targetNextPage);
    }, 500);
  };

  const isExplicitFlow = Boolean(roleQuery);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Bar (No FAQ connection button) */}
        <div className="flex items-center justify-start gap-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold tracking-wide mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Protocol Compliance & Risk Gates</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {selectedType === 'Merchant Agreement'
              ? 'Merchant Entry: Terms of Agreement & Risk Disclosure'
              : 'Investor Playground: Risk Disclosure & Protocol Terms'}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            Please review and accept the mandatory platform terms below to proceed to{' '}
            <span className="font-semibold text-slate-800">
              {selectedType === 'Merchant Agreement' ? 'Merchant Contract Portal' : 'Investor Playground'}
            </span>.
          </p>
        </div>

        {/* Role Toggle Switcher (Shown only if not arriving from a pre-selected entry point) */}
        {!isExplicitFlow && (
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex p-1 bg-slate-200/70 rounded-xl border border-slate-200">
              <button
                onClick={() => {
                  setSelectedType('Merchant Agreement');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === 'Merchant Agreement'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Merchant Agreement</span>
              </button>

              <button
                onClick={() => {
                  setSelectedType('Investor Disclosure');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedType === 'Investor Disclosure'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Investor Disclosure</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Terms Agreement Gate Component */}
        <TermsAgreementGate
          key={selectedType}
          contractType={selectedType}
          submitLabel={
            selectedType === 'Merchant Agreement'
              ? 'Accept & Proceed to Merchant Entry'
              : 'Accept & Enter Investor Playground'
          }
          isSubmitting={isSubmitting}
          onAccept={handleAcceptTerms}
        />

        {/* Footer info (No FAQ link) */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>CreditFlow / FairFuture Protocol v1.4</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <span>•</span>
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
