import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Boxes,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Clock,
  ArrowRight,
  FileCheck,
  Info
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

export default function InventoryCheckpoint() {
  // Form states
  const [reportedStock, setReportedStock] = useState(90000);
  const [category, setCategory] = useState('Packaged FMCG & Grocery');
  const [hasPhoto, setHasPhoto] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState({
    estimatedStock: 85000,
    reportedStock: 90000,
    variance: '+5.8%',
    status: 'No Divergence Detected — Escrow Standing Verified',
    timestamp: 'Today, 10:15 AM'
  });

  const runAudit = (e) => {
    e.preventDefault();
    setIsAuditing(true);

    setTimeout(() => {
      setIsAuditing(false);
      const estStock = Math.round(reportedStock * 0.94);
      const diff = reportedStock - estStock;
      const varianceVal = ((diff / estStock) * 100).toFixed(1);

      setAuditResult({
        estimatedStock: estStock,
        reportedStock: Number(reportedStock),
        variance: `+${varianceVal}%`,
        status: 'No Divergence Detected — Escrow Standing Verified',
        timestamp: 'Just now'
      });
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-2">
            <Link to="/merchant/dashboard" className="hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span>Risk Controls</span>
            <span>/</span>
            <span className="font-bold text-slate-800">Inventory Verification</span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Weekly Stock Verification Portal
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Weekly inventory checkpoint for active Contract <strong className="text-slate-800">CON-001</strong> to confirm collateral health and prevent cash diversion.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-[#059669]">
          <ShieldCheck className="w-4 h-4" />
          <span>Escrow Compliance Active</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================
            LEFT COLUMN: INVENTORY SUBMISSION FORM (7 COLS)
        ======================================================== */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#2563EB] font-bold">
              VERIFICATION INPUT
            </span>
            <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight mt-1">
              Submit Current Store Inventory
            </h3>
            <p className="text-xs text-[#64748B] mt-1">
              Photographic proof is cross-referenced with your weekly point-of-sale sales volume using AI shelf-vision.
            </p>
          </div>

          <form onSubmit={runAudit} className="space-y-6">
            {/* Input 1: Reported Stock Value */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] block mb-2">
                1. Reported Stock Value (INR)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min={10000}
                  step={5000}
                  value={reportedStock}
                  onChange={(e) => setReportedStock(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xl font-black text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15"
                  required
                />
              </div>
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Total wholesale cost value of all on-premise store inventory.
              </span>
            </div>

            {/* Input 2: Primary Inventory Category */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] block mb-2">
                2. Primary Inventory Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-[#E2E8F0] rounded-xl text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="Packaged FMCG & Grocery">Packaged FMCG & Daily Essentials</option>
                <option value="Fresh Produce & Dairy">Fresh Produce & Perishables</option>
                <option value="Consumer Apparel & Fabrics">Consumer Apparel & Fabrics</option>
                <option value="Electronics & Accessories">Electronics & Mobile Accessories</option>
              </select>
            </div>

            {/* Input 3: Stock Shelf Photo Dropzone / Camera */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] block mb-2">
                3. Upload Stock Shelf Photo
              </label>

              {hasPhoto ? (
                <div className="relative rounded-2xl border border-blue-200 bg-blue-50/40 p-4 flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview Thumbnail */}
                  <div className="w-24 h-24 rounded-xl bg-slate-800 border-2 border-white shadow-md overflow-hidden relative shrink-0 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=300&q=80"
                      alt="Store shelf audit"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-blue-900/30 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-xs font-bold text-[#0F172A]">store_shelf_aisle_01.jpg</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-[#059669] font-bold">
                        TIMESTAMPED
                      </span>
                    </div>
                    <span className="text-xs text-[#64748B] block mt-1">
                      GPS Tagged • Geo-fenced inside Connaught Place Store premise
                    </span>
                    <button
                      type="button"
                      onClick={() => setHasPhoto(false)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold mt-2 cursor-pointer underline"
                    >
                      Replace photo
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setHasPhoto(true)}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50/60"
                >
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-sm font-bold text-[#0F172A] block">
                    Click to capture or upload stock photo
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">
                    Supports JPG, PNG with camera capture
                  </span>
                </div>
              )}
            </div>

            {/* Run AI Stock Audit Button */}
            <button
              type="submit"
              disabled={isAuditing}
              className="w-full py-4 px-6 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Shelf Density & Cross-Referencing POS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Stock Audit</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* ========================================================
            RIGHT COLUMN: AI VERIFICATION SIMULATION CARD (5 COLS)
        ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#059669] font-bold">
                  AUDIT RESULTS
                </span>
                <h3 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                  AI Verification Simulation
                </h3>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
            </div>

            {/* Comparison Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-mono text-slate-500 uppercase block">
                  AI Estimated Stock
                </span>
                <span className="text-xl font-black text-[#0F172A] font-mono mt-1 block">
                  {formatCurrency(auditResult.estimatedStock)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Computed via visual density</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
                <span className="text-[11px] font-mono text-blue-700 uppercase block">
                  Reported Stock
                </span>
                <span className="text-xl font-black text-blue-900 font-mono mt-1 block">
                  {formatCurrency(auditResult.reportedStock)}
                </span>
                <span className="text-[10px] text-blue-600 block mt-0.5">Merchant declared value</span>
              </div>
            </div>

            {/* Variance Metric */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 block">Inventory Variance</span>
                <span className="text-[11px] text-emerald-700">Within acceptable turnover threshold (±10%)</span>
              </div>
              <span className="text-xl font-black font-mono text-[#059669]">
                {auditResult.variance}
              </span>
            </div>

            {/* Audit Status Badge */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  VERIFICATION PASS
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {auditResult.status}
              </p>
              <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] font-mono text-slate-400">
                <span>AUDIT TIMESTAMP</span>
                <span>{auditResult.timestamp}</span>
              </div>
            </div>

            {/* Security note */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-[#64748B] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Consistent weekly audits increase your AI Trust Score by up to <strong>+6 points</strong> over a 90-day cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
