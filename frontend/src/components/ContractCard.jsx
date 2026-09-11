import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, TrendingUp, Store, Utensils, ShoppingBasket, Layers } from 'lucide-react';

export default function ContractCard({
  id = '1',
  businessName = 'Sharma General Store',
  category = 'Retail',
  status = 'LISTED',
  trustScore = 94,
  trustLabel = 'HIGH TRUST',
  targetAmount = '₹1,50,000',
  fundedPercentage = 75,
  dailySplit = '15% Gross',
  repaymentCap = '1.15x',
  duration = '90 Days',
  investorCount = 18
}) {
  // Category icon mapping
  const getCategoryIcon = () => {
    switch (category?.toLowerCase()) {
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-amber-600" />;
      case 'grocery':
        return <ShoppingBasket className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Store className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  // Dynamic trust badge styling
  const isHighTrust = trustScore >= 80;
  const isMediumTrust = trustScore >= 60 && trustScore < 80;

  const trustBadgeColor = isHighTrust
    ? 'text-[#059669] bg-emerald-50 border-emerald-200/60'
    : isMediumTrust
    ? 'text-teal-700 bg-teal-50 border-teal-200/60'
    : 'text-amber-700 bg-amber-50 border-amber-200/60';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between">
      {/* Top Row: Category + Status & Trust Score */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/80 border border-slate-200/50 text-xs font-mono font-medium text-slate-600 tracking-wider">
            {getCategoryIcon()}
            <span>{category}</span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-semibold">{status}</span>
          </div>

          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${trustBadgeColor}`}>
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span>{trustScore} {trustScore >= 80 ? 'HIGH TRUST' : 'VERIFIED'}</span>
          </div>
        </div>

        {/* Business Title */}
        <h3 className="text-xl font-semibold text-slate-900 tracking-tight group-hover:text-[#2563EB] transition-colors flex items-center justify-between">
          <span>{businessName}</span>
          <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 -translate-x-1 transition-all">
            <ArrowUpRight className="w-4 h-4 text-[#2563EB]" />
          </span>
        </h3>

        <p className="text-xs text-slate-500 mt-1 font-mono">
          CONTRACT #{id.toString().padStart(4, '0')} // POINT-OF-SALE ROUTED
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 my-5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Target Pool</span>
            <span className="text-base font-bold text-slate-900">{targetAmount}</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Repayment Cap</span>
            <span className="text-base font-bold text-slate-900">{repaymentCap}</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Split Rate</span>
            <span className="text-xs font-semibold text-slate-700">{dailySplit}</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Est. Horizon</span>
            <span className="text-xs font-semibold text-slate-700">{duration}</span>
          </div>
        </div>

        {/* Progress Bar in #2563EB */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Progress</span>
            <span className="font-bold text-[#2563EB]">{fundedPercentage}% Funded</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${fundedPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-mono">
          {investorCount} Backers Active
        </span>
        <Link
          to={`/investor/fund/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors duration-200"
        >
          <span>Fund Contract</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
