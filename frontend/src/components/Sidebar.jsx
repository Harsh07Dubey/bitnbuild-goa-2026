import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Wallet, Store, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';

export default function Sidebar({
  isOpen = false,
  onClose,
  activeRole = 'merchant',
  onRoleChange
}) {
  const location = useLocation();
  const isInvestor = activeRole === 'investor';

  const investorLinks = [
    { label: 'Marketplace', path: '/investor/marketplace' },
    { label: 'Portfolio & Analytics', path: '/investor/dashboard' },
    { label: 'LP Onboarding Profile', path: '/investor/onboarding' }
  ];

  const merchantLinks = [
    { label: 'Dashboard', path: '/merchant/dashboard' },
    { label: 'Create Contract', path: '/merchant/contract/create' },
    { label: 'POS QR Terminal', path: '/merchant/qr' },
    { label: 'Stock Inventory', path: '/merchant/inventory' },
    { label: 'Shop Onboarding Profile', path: '/merchant/onboarding' }
  ];

  const activeLinks = isInvestor ? investorLinks : merchantLinks;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 md:hidden"
          />

          {/* Drawer Container */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col justify-between font-sans border-l border-slate-200 md:hidden"
          >
            {/* Header */}
            <div>
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#0F172A]">CreditFlow</h3>
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
                      {isInvestor ? 'Investor Portal' : 'Merchant POS'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Persona Switcher Block */}
              <div className="p-4 bg-slate-50 border-b border-[#E2E8F0]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] font-bold block mb-2">
                  Active Persona Mode
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/80 rounded-xl">
                  <button
                    onClick={() => {
                      if (onRoleChange) onRoleChange('investor');
                      if (onClose) onClose();
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      isInvestor ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Investor</span>
                  </button>
                  <button
                    onClick={() => {
                      if (onRoleChange) onRoleChange('merchant');
                      if (onClose) onClose();
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      !isInvestor ? 'bg-[#0F172A] text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Merchant</span>
                  </button>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1">
                {activeLinks.map((link) => {
                  const isActive = location.pathname === link.path || (location.pathname + location.search) === link.path;
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      onClick={onClose}
                      className={`flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-50 text-[#2563EB] border border-blue-100'
                          : 'text-[#0F172A] hover:bg-slate-50'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Footer & Disclaimer */}
            <div className="p-5 border-t border-[#E2E8F0] space-y-4 bg-slate-50">
              {/* Profile summary pill */}
              <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  isInvestor ? 'bg-[#0F172A]' : 'bg-[#2563EB]'
                }`}>
                  {isInvestor ? 'AM' : 'SG'}
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0F172A] block">
                    {isInvestor ? 'Ananya Mehta' : 'Sharma General Store'}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {isInvestor ? 'KYC Tier-2 Verified' : 'POS Contract Active'}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono leading-relaxed">
                FairFuture Network — Decoupled POS Settlement Sandbox v1.4
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
