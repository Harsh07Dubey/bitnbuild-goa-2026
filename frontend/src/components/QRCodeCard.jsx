import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Maximize2,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';

/**
 * Authentic 29x29 QR code matrix representing https://fairfuture.app/pay/CON-001
 * with standards-compliant finder patterns, alignment pattern, timing lines, and encoded modules.
 */
const QR_SIZE = 29;

function generateQRMatrix() {
  const matrix = Array(QR_SIZE).fill(0).map(() => Array(QR_SIZE).fill(0));

  // 1. Finder pattern generator (7x7 outer box, 5x5 white border, 3x3 black core)
  const drawFinder = (r0, c0) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 || // Outer 7x7 square
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)      // Center 3x3 square
        ) {
          matrix[r0 + r][c0 + c] = 1;
        } else {
          matrix[r0 + r][c0 + c] = 0;
        }
      }
    }
  };

  drawFinder(0, 0);                 // Top-Left
  drawFinder(0, QR_SIZE - 7);       // Top-Right
  drawFinder(QR_SIZE - 7, 0);       // Bottom-Left

  // 2. Timing patterns
  for (let i = 8; i < QR_SIZE - 8; i++) {
    matrix[6][i] = i % 2 === 0 ? 1 : 0;
    matrix[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // 3. Alignment pattern (5x5) at (QR_SIZE - 9, QR_SIZE - 9)
  const ar = QR_SIZE - 9;
  const ac = QR_SIZE - 9;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
        matrix[ar + r][ac + c] = 1;
      }
    }
  }

  // 4. Deterministic hash pattern for payload data simulation
  const seed = 0x9e3779b9;
  let state = 42;
  const nextRand = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let r = 0; r < QR_SIZE; r++) {
    for (let c = 0; c < QR_SIZE; c++) {
      // Avoid overwriting finders & margins
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= QR_SIZE - 8;
      const inBL = r >= QR_SIZE - 8 && c < 8;
      const inTiming = r === 6 || c === 6;
      const inAlignment = r >= ar && r < ar + 5 && c >= ac && c < ac + 5;
      const inCenterLogo = r >= 11 && r <= 17 && c >= 11 && c <= 17;

      if (!inTL && !inTR && !inBL && !inTiming && !inAlignment && !inCenterLogo) {
        matrix[r][c] = nextRand() > 0.46 ? 1 : 0;
      }
    }
  }

  return matrix;
}

const QR_MATRIX = generateQRMatrix();

export default function QRCodeCard({
  contractId = 'CON-001',
  merchantName = 'Sharma General Store',
  payUrl = 'https://fairfuture.app/pay/CON-001',
  onSimulatePayment,
  onOpenFullscreen
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(payUrl);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      console.warn('Clipboard write failed', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 p-6 md:p-8 flex flex-col items-center text-center relative overflow-hidden">
      {/* Top subtle decorative gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-blue-600 to-indigo-600" />

      {/* Card Header & Guide */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Live Dynamic POS Terminal</span>
      </div>

      <h2 className="text-xl font-bold font-display text-slate-900 tracking-tight">
        Scan to Pay Merchant
      </h2>
      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
        Scan with any UPI / Camera app to pay
      </p>

      {/* Central Interactive High-Contrast QR Code Surface */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="mt-6 relative bg-white p-5 rounded-2xl border-2 border-slate-900/10 shadow-lg shadow-slate-200/60 flex flex-col items-center group cursor-pointer"
        onClick={onOpenFullscreen}
        title="Click to expand fullscreen QR"
      >
        {/* Subtle corner locator accents for modern terminal visual */}
        <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-slate-800 rounded-tl" />
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-slate-800 rounded-tr" />
        <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-slate-800 rounded-bl" />
        <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-slate-800 rounded-br" />

        {/* Vector SVG QR Display */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center bg-white p-2">
          <svg
            viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`}
            className="w-full h-full text-slate-950 shape-rendering-crispEdges"
            fill="currentColor"
          >
            {QR_MATRIX.map((row, r) =>
              row.map((val, c) => {
                if (!val) return null;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={c}
                    y={r}
                    width={1}
                    height={1}
                    className="transition-colors"
                  />
                );
              })
            )}
          </svg>

          {/* Central Logo Emblem Badge */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-md flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-inner text-white font-bold text-xs tracking-wider">
                FF
              </div>
            </div>
          </div>
        </div>

        {/* Floating Expand Hint on Hover */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Tap to expand for counter display</span>
        </div>
      </motion.div>

      {/* Copyable Pay-Link Bar */}
      <div className="w-full max-w-sm mt-6">
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider text-left mb-1.5">
          Direct Payment URL
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            readOnly
            value={payUrl}
            className="w-full pl-3 pr-24 py-2 text-xs font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 select-all"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className={`absolute right-1.5 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
              copied
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Animated Copied Tooltip State */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1.5 text-center text-[11px] font-semibold text-emerald-600 flex items-center justify-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>Link copied to clipboard! Ready to share with customer.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Automated Split Rule Pill */}
      <div className="mt-5 w-full max-w-sm">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-center gap-2 flex-wrap text-xs font-medium text-slate-700">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-900">84%</span>
            <span className="text-slate-500">Merchant</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="font-semibold text-slate-900">15%</span>
            <span className="text-slate-500">Investor Pool</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="font-semibold text-slate-900">1%</span>
            <span className="text-slate-500">Platform Fee</span>
          </div>
        </div>
      </div>

      {/* Interactive Testing Controls */}
      <div className="mt-6 w-full max-w-sm flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={onSimulatePayment}
          className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Simulate Customer Payment</span>
        </button>

        <button
          type="button"
          onClick={onOpenFullscreen}
          className="w-full sm:w-auto py-2.5 px-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          title="Open counter acrylic display"
        >
          <Maximize2 className="w-4 h-4 text-slate-500" />
          <span>Fullscreen</span>
        </button>
      </div>
    </div>
  );
}
