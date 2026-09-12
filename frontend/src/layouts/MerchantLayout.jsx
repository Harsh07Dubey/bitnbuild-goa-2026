import React from 'react';
import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import {
  Store,
  LayoutDashboard,
  FilePlus2,
  FileText,
  QrCode,
  Boxes,
  ArrowUpRight,
  TrendingUp,
  Layers,
  ChevronRight
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
        {/* Micro status bar */}
        <div className="bg-[#0A0F1D] text-slate-400 px-4 sm:px-8 py-1.5 text-[11px] font-mono flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            <span className="text-slate-300 font-semibold">FAIRFUTURE // MERCHANT OPERATING SYSTEM</span>
            <span className="hidden md:inline text-slate-500">• REVENUE SHARE ENGINE ACTIVE</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/playground" className="hover:text-blue-400 transition-colors flex items-center gap-1">
              <span>Switch to Investor Terminal</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
            <span>•</span>
            <Link to="/" className="hover:text-white transition-colors">
              Landing Page
            </Link>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo & Nav Tabs */}
          <div className="flex items-center gap-6 lg:gap-10">
            <Link to="/merchant/dashboard" className="flex items-center gap-3 group select-none">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
                <Store className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider text-[#0F172A] leading-tight">
                  CREDIT<span className="text-[#2563EB]">FLOW</span>
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
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
                          ? 'text-[#2563EB] bg-blue-50/80 shadow-xs'
                          : 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100/70'
                      }`;
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Right Side Merchant Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Terminal Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#059669]">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              <span>POS Connected</span>
            </div>

            <div className="w-px h-6 bg-[#E2E8F0] hidden sm:block" aria-hidden="true" />

            {/* Merchant Profile Badge */}
            <div className="flex items-center gap-2.5 py-1 px-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                SG
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#0F172A] leading-tight">
                  Sharma General Store
                </span>
                <span className="text-[10px] font-mono text-slate-500">ID: CON-001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Nav */}
        <div className="md:hidden overflow-x-auto border-t border-slate-100 px-4 py-2 flex items-center gap-2 bg-slate-50/70">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-xs whitespace-nowrap px-3 py-1.5 rounded-lg font-medium shrink-0 ${
                  isActive ? 'bg-[#2563EB] text-white font-semibold' : 'text-slate-600 bg-white border border-slate-200'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Main Outlet View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
