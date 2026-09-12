import React from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  QrCode,
  Boxes,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import umeedLogo from '../assets/umeed-logo.png';

export default function MerchantLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/merchant/dashboard', icon: LayoutDashboard },
    { name: 'Create Contract', path: '/merchant/contract/create', icon: FilePlus2 },
    { name: 'Contract Status', path: '/merchant/contract/CON-001', icon: FileText },
    { name: 'POS QR Terminal', path: '/merchant/qr', icon: QrCode },
    { name: 'Stock Inventory', path: '/merchant/inventory', icon: Boxes },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans flex flex-col selection:bg-emerald-400 selection:text-slate-950 overflow-x-hidden relative">
      {/* High-Vibrance Ambient Glow Meshes */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 blur-[160px] rounded-full pointer-events-none -z-0" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-0" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        {/* Micro status bar */}
        <div className="bg-slate-950 text-slate-400 px-4 sm:px-8 py-1.5 text-[11px] font-mono flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold tracking-wider">UMEED // MERCHANT OPERATING SYSTEM</span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-emerald-400 font-medium">REVENUE SPLIT ENGINE ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/playground" className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-semibold">
              <span>Switch to Investor Terminal</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <span className="text-slate-700">•</span>
            <Link to="/" className="hover:text-white transition-colors">
              Landing Page
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Nav Tabs */}
          <div className="flex items-center gap-6 lg:gap-10">
            <Link to="/merchant/dashboard" className="flex items-center gap-3 group select-none">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 border border-emerald-300/40 group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <img src={umeedLogo} alt="Umeed Logo" className="h-6 w-auto object-contain brightness-110" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl text-white tracking-tight flex items-center gap-1.5">
                  Umeed
                </span>
                <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  Merchant Suite
                </span>
              </div>
            </Link>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path === '/merchant/contract/CON-001' && location.pathname.startsWith('/merchant/contract/'));

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive: directActive }) => {
                      const active = directActive || isActive;
                      return `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                        active
                          ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent'
                      }`;
                    }}
                  >
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right Side Merchant Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Direct customer checkout link */}
            <Link
              to="/pay/CON-001"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex py-1.5 px-3 rounded-xl border border-slate-800 text-xs font-mono font-semibold text-slate-300 hover:text-emerald-400 hover:border-emerald-400/40 hover:bg-slate-900 items-center gap-1.5 transition-all"
              title="Test customer checkout view"
            >
              <span>Customer View</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            {/* Live Terminal Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-xs font-mono font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>POS Connected</span>
            </div>

            <div className="w-px h-6 bg-slate-800 hidden sm:block" aria-hidden="true" />

            {/* Merchant Profile Badge */}
            <div className="flex items-center gap-2.5 py-1 px-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 font-black text-xs font-mono flex items-center justify-center shadow-xs">
                SG
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight">
                  Sharma General Store
                </span>
                <span className="text-[10px] font-mono text-slate-400">ID: CON-001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Nav */}
        <div className="md:hidden overflow-x-auto border-t border-white/10 px-4 py-2 flex items-center gap-2 bg-slate-950/90 backdrop-blur-md">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-xs font-mono whitespace-nowrap px-3 py-1.5 rounded-lg font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md'
                    : 'text-slate-300 bg-slate-900 border border-slate-800 hover:text-white'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Main Outlet View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}