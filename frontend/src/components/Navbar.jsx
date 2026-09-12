import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Menu, X, ArrowLeftRight, Wallet, Store, UserCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  brandTitle = 'CREDITFLOW',
  activeRole: overrideRole,
  onRoleToggle,
  onMobileMenuOpen
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Try retrieving auth context if wrapped in AuthProvider
  let auth = null;
  try {
    auth = useAuth();
  } catch (e) {
    // Gracefully handle if context is not present
  }

  // Active role determination: override prop > auth context role > local state fallback ('merchant')
  const currentRole = overrideRole || auth?.role || 'merchant';

  const handleRoleSwitch = (newRole) => {
    if (onRoleToggle) {
      onRoleToggle(newRole);
    } else if (auth?.setDemoMerchant && newRole === 'merchant') {
      auth.setDemoMerchant();
      navigate('/merchant/dashboard');
    } else if (newRole === 'investor') {
      navigate('/playground');
    } else {
      navigate('/merchant/dashboard');
    }
  };

  const isInvestor = currentRole === 'investor';

  // Dynamic Navigation Links
  const investorLinks = [
    { label: 'Marketplace', path: '/playground' },
    { label: 'My Portfolio', path: '/playground?tab=portfolio' },
    { label: 'Analytics', path: '/playground?tab=analytics' }
  ];

  const merchantLinks = [
    { label: 'Dashboard', path: '/merchant/dashboard' },
    { label: 'Create Contract', path: '/merchant/contract/create' },
    { label: 'POS Terminal', path: '/merchant/qr' },
    { label: 'Inventory', path: '/merchant/inventory' }
  ];

  const activeLinks = isInvestor ? investorLinks : merchantLinks;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Mark */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#0F172A] leading-tight">
                {brandTitle}
              </span>
              <span className="text-[9px] font-mono font-bold text-[#64748B] tracking-wider uppercase">
                {isInvestor ? 'INVESTOR LIQUIDITY' : 'MERCHANT PAYOUT'} NETWORK
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-1">
            {activeLinks.map((link) => {
              const isActive = location.pathname === link.path || (location.pathname + location.search) === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-100 text-[#2563EB] font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center/Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Segmented Persona Switcher */}
          <div className="p-1 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1">
            <button
              onClick={() => handleRoleSwitch('investor')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isInvestor
                  ? 'bg-white text-[#2563EB] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Investor</span>
            </button>
            <button
              onClick={() => handleRoleSwitch('merchant')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                !isInvestor
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Merchant</span>
            </button>
          </div>

          {/* Persona Readouts */}
          {isInvestor ? (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                <span>₹3,55,000 Liquid</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                AM
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] font-mono text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CON-001 ACTIVE</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                SG
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex items-center md:hidden gap-2">
          <button
            onClick={onMobileMenuOpen}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
