import React, { useState } from 'react';
import { Download, CheckCircle2, Search, Clock, Inbox, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-4920421',
    dateTime: 'Today, 02:40 PM',
    rawDate: '2026-09-12T14:40:00',
    grossSale: 500,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'SPLIT COMPLETED',
    method: 'UPI QR (GPay)'
  },
  {
    id: 'TXN-4920419',
    dateTime: 'Today, 01:15 PM',
    rawDate: '2026-09-12T13:15:00',
    grossSale: 1250,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'SPLIT COMPLETED',
    method: 'UPI QR (PhonePe)'
  },
  {
    id: 'TXN-4920404',
    dateTime: 'Today, 11:30 AM',
    rawDate: '2026-09-12T11:30:00',
    grossSale: 350,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'Settled',
    method: 'UPI QR (Paytm)'
  },
  {
    id: 'TXN-4920388',
    dateTime: 'Today, 10:05 AM',
    rawDate: '2026-09-12T10:05:00',
    grossSale: 2400,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'SPLIT COMPLETED',
    method: 'UPI QR (BHIM)'
  },
  {
    id: 'TXN-4920352',
    dateTime: 'Yesterday, 08:50 PM',
    rawDate: '2026-09-11T20:50:00',
    grossSale: 850,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'Settled',
    method: 'UPI QR (GPay)'
  },
  {
    id: 'TXN-4920310',
    dateTime: 'Yesterday, 06:12 PM',
    rawDate: '2026-09-11T18:12:00',
    grossSale: 1750,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'SPLIT COMPLETED',
    method: 'UPI QR (PhonePe)'
  },
  {
    id: 'TXN-4920289',
    dateTime: 'Yesterday, 03:22 PM',
    rawDate: '2026-09-11T15:22:00',
    grossSale: 420,
    merchantRate: 0.84,
    investorRate: 0.15,
    platformRate: 0.01,
    status: 'Settled',
    method: 'UPI QR (GPay)'
  }
];

export default function TransactionTable({
  transactions = INITIAL_TRANSACTIONS,
  mode = 'merchant',
  title = 'Recent Split Settlements Ledger',
  subtitle = 'Every scan on your FairFuture POS terminal immediately divides payouts to investors.',
  allowExport = true
}) {
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((tx) => {
    const q = search.toLowerCase();
    return (
      (tx.id && tx.id.toLowerCase().includes(q)) ||
      (tx.dateTime && tx.dateTime.toLowerCase().includes(q)) ||
      (tx.method && tx.method.toLowerCase().includes(q)) ||
      (tx.status && tx.status.toLowerCase().includes(q))
    );
  });

  const exportCSV = () => {
    const headers = [
      'Payment Ref',
      'Date/Time',
      'Gross Sale (INR)',
      'Merchant Payout 84% (INR)',
      'Investor Split 15% (INR)',
      'Platform Fee 1% (INR)',
      'Status'
    ];

    const rows = filtered.map((tx) => {
      const gross = tx.grossSale || 0;
      const mRate = tx.merchantRate ?? 0.84;
      const iRate = tx.investorRate ?? 0.15;
      const pRate = tx.platformRate ?? 0.01;

      return [
        tx.id || 'N/A',
        `"${tx.dateTime || ''}"`,
        gross.toFixed(2),
        (gross * mRate).toFixed(2),
        (gross * iRate).toFixed(2),
        (gross * pRate).toFixed(2),
        tx.status || 'Settled'
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'creditflow-ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isInvestorMode = mode === 'investor';

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden font-sans">
      {/* Top Action Header */}
      <div className="p-4 sm:p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">{title}</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-bold tracking-wider">
              {isInvestorMode ? 'INVESTOR REVENUE STREAM' : 'ATOMIC 84/15/1 SPLIT'}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-[#64748B] mt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reference or time..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-xs pl-8 pr-3 py-2 rounded-xl bg-slate-50 border border-[#E2E8F0] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-blue-500/20 w-full sm:w-56 text-[#0F172A]"
            />
          </div>

          {allowExport && (
            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Ledger (CSV)</span>
            </button>
          )}
        </div>
      </div>

      {/* 7-Column Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-slate-50/70 text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
              <th className="py-3 px-3 sm:py-3.5 sm:px-4">Date / Time</th>
              <th className="py-3 px-3 sm:py-3.5 sm:px-4">Payment Ref</th>
              <th className="py-3 px-3 sm:py-3.5 sm:px-4 text-right">Gross Sale</th>
              <th className={`py-3 px-3 sm:py-3.5 sm:px-4 text-right ${!isInvestorMode ? 'text-[#0F172A]' : ''}`}>
                Merchant Payout (84%)
              </th>
              <th className={`py-3 px-3 sm:py-3.5 sm:px-4 text-right ${isInvestorMode ? 'text-[#2563EB]' : ''}`}>
                Investor Split (15%)
              </th>
              <th className="py-3 px-3 sm:py-3.5 sm:px-4 text-right">Platform Fee (1%)</th>
              <th className="py-3 px-3 sm:py-3.5 sm:px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 px-4 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Inbox className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">No transactions found</span>
                    <span className="text-xs text-slate-400">
                      No split settlement items match your filter criteria.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const gross = tx.grossSale || 0;
                const mRate = tx.merchantRate ?? 0.84;
                const iRate = tx.investorRate ?? 0.15;
                const pRate = tx.platformRate ?? 0.01;

                const merchantAmount = gross * mRate;
                const investorAmount = gross * iRate;
                const platformAmount = gross * pRate;

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[#0F172A] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{tx.dateTime}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#2563EB] whitespace-nowrap">
                      {tx.id}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#0F172A] whitespace-nowrap">
                      {formatCurrency(gross, { decimals: true })}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap ${
                      !isInvestorMode ? 'text-[#0F172A]' : 'text-slate-700'
                    }`}>
                      {formatCurrency(merchantAmount, { decimals: true })}
                    </td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap ${
                      isInvestorMode
                        ? 'text-[#2563EB] bg-blue-50/50 px-2 py-1 rounded'
                        : 'text-[#059669]'
                    }`}>
                      +{formatCurrency(investorAmount, { decimals: true })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500 whitespace-nowrap">
                      {formatCurrency(platformAmount, { decimals: true })}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#059669] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{tx.status || 'Settled'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary */}
      <div className="p-4 bg-slate-50/80 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] font-mono gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>SHOWING {filtered.length} RECENT POINT-OF-SALE AUTOMATED SPLITS</span>
        </div>
        <div className="flex items-center gap-3">
          <span>MERCHANT: 84%</span>
          <span>•</span>
          <span className="text-[#2563EB] font-bold">INVESTOR ESCROW: 15%</span>
          <span>•</span>
          <span>FEE: 1%</span>
        </div>
      </div>
    </div>
  );
}
