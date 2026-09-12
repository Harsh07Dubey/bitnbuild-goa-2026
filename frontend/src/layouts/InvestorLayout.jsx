import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function InvestorLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { switchRole } = useAuth();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top micro-status bar */}
      <div className="bg-[#0A0F1D] text-slate-400 px-4 sm:px-8 py-1.5 text-[11px] font-mono flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
          <span className="text-slate-200 font-bold tracking-wider">UMEED</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <Link to="/merchant/dashboard" className="hover:text-blue-400 transition-colors flex items-center gap-1">
            <span>Switch to Merchant Terminal</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
          <span>•</span>
          <Link to="/" className="hover:text-white transition-colors">
            Landing Page
          </Link>
        </div>
      </div>

      {/* Main Persistent Navbar */}
      <Navbar
        activeRole="investor"
        brandTitle="UMEED"
        onMobileMenuOpen={() => setIsMobileMenuOpen(true)}
      />

      {/* Mobile Drawer */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeRole="investor"
        onRoleChange={switchRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>


      {/* Consistent Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#0F172A] tracking-wider">UMEED</span>
            <span>• Decentralized Merchant Cash Advance Liquidity Engine</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Settlement Protocol Verified
            </span>
            <span>v2.4.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}