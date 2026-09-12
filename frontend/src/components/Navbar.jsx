import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowLeftRight, Wallet, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import umeedLogo from '../assets/umeed-logo.png';

export default function Navbar({
  brandTitle = 'UMEED',
  activeRole: overrideRole,
  onRoleToggle,
  onMobileMenuOpen
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const auth = useAuth();

  // Active role determination: override prop > auth context role > local state fallback ('investor')
  const currentRole = overrideRole || auth?.role || 'investor';
  const isInvestor = currentRole === 'investor';

  const handleRoleSwitch = (newRole) => {
    if (onRoleToggle) {
      onRoleToggle(newRole);
    } else if (auth?.switchRole) {
      auth.switchRole(newRole);
    } else if (newRole === 'investor') {
      navigate('/investor/marketplace');
    } else {
      navigate('/merchant/dashboard');
    }
  };

  // Dynamic Navigation Links
  const investorLinks = [
    { label: 'Marketplace', path: '/investor/marketplace' },
    { label: 'Portfolio & Analytics', path: '/investor/dashboard' }
  ];

  const merchantLinks = [
    { label: 'Dashboard', path: '/merchant/dashboard' },
    { label: 'Create Contract', path: '/merchant/contract/create' },
    { label: 'POS Terminal', path: '/merchant/qr' },
    { label: 'Inventory', path: '/merchant/inventory' }
  ];

  const activeLinks = isInvestor ? investorLinks : merchantLinks;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Mark with UMEED Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={umeedLogo}
              alt="UMEED Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-[#0F172A] leading-tight">
                {brandTitle}
              </span>
              <span className="text-[9px] font-mono font-bold text-[#64748B] tracking-wider uppercase">
                {isInvestor ? 'INVESTOR LIQUIDITY' : 'MERCHANT PAYOUT'} NETWORK
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {activeLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-[#2563EB] font-bold border border-blue-200/60'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100/80'
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
                <span>{formatCurrency(auth?.liquidBalance ?? 355000)} Liquid</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {auth?.user?.initials || 'AM'}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] font-mono text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{auth?.activeContractId || 'CON-001'} ACTIVE</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                {auth?.user?.initials || 'SG'}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu Trigger & Avatar */}
        <div className="flex items-center md:hidden gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-xs ${
            isInvestor ? 'bg-[#0F172A]' : 'bg-[#2563EB]'
          }`}>
            {auth?.user?.initials || (isInvestor ? 'AM' : 'SG')}
          </div>
          <button
            onClick={onMobileMenuOpen}
            className="p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Open Mobile Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}