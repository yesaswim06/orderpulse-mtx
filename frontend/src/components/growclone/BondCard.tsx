import React from 'react';
import { BondItem } from '../../data/mockData';

interface BondCardProps {
  bond: BondItem;
}

export const BondCard: React.FC<BondCardProps> = ({ bond }) => {
  return (
    <div className="bg-white dark:bg-[#1F222E] border border-[#E8E8E8] dark:border-[#2E3245] rounded-xl p-5 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer min-w-[210px] sm:min-w-0">
      <div>
        {/* Top: Logo square + Issuer & Maturity */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-9 h-9 rounded-lg ${bond.logoColor} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs`}
          >
            {bond.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#44475B] dark:text-white line-clamp-1 leading-snug">
              {bond.issuer}
            </h4>
            <span className="text-[11px] text-[#7C7E8C] dark:text-[#94A3B8]">
              {bond.maturity}
            </span>
          </div>
        </div>

        {/* Middle: Yield % in bold */}
        <div className="mb-3">
          <div className="text-lg font-extrabold text-[#44475B] dark:text-white font-mono">
            {bond.yieldPercent}
          </div>
          <div className="text-[10px] text-[#7C7E8C] dark:text-[#94A3B8] uppercase tracking-wider font-semibold">
            Yield to Maturity
          </div>
        </div>
      </div>

      {/* Bottom: Tenure & Credit Rating with colored dot */}
      <div className="pt-3 border-t border-[#E8E8E8] dark:border-[#2E3245] flex items-center justify-between text-xs text-[#7C7E8C] dark:text-[#94A3B8]">
        <span>{bond.tenure}</span>
        <div className="flex items-center gap-1.5 font-semibold text-[#44475B] dark:text-[#E2E8F0]">
          <span
            className={`w-2 h-2 rounded-full ${
              bond.ratingColor === 'orange' ? 'bg-[#F5A623]' : 'bg-[#00B386]'
            }`}
          />
          <span>{bond.rating}</span>
        </div>
      </div>
    </div>
  );
};
