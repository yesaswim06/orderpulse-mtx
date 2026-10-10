import React from 'react';
import { MutualFundItem } from '../../data/mockData';

interface FundCardProps {
  fund: MutualFundItem;
}

export const FundCard: React.FC<FundCardProps> = ({ fund }) => {
  return (
    <div className="bg-white dark:bg-[#1F222E] border border-[#E8E8E8] dark:border-[#2E3245] rounded-xl p-5 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer min-w-[210px] sm:min-w-0">
      <div>
        {/* Logo and Category */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-9 h-9 rounded-lg ${fund.logoBg} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
          >
            {fund.name.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-[11px] font-semibold text-[#7C7E8C] dark:text-[#94A3B8] bg-[#F8F8F8] dark:bg-[#2A2E3D] px-2 py-0.5 rounded">
            {fund.category}
          </span>
        </div>

        {/* Fund Name */}
        <h4 className="text-xs font-bold text-[#44475B] dark:text-white line-clamp-2 leading-snug mb-4">
          {fund.name}
        </h4>
      </div>

      {/* Bottom: 3Y return in green at bottom-left, "3Y" at bottom-right */}
      <div className="pt-3 border-t border-[#E8E8E8] dark:border-[#2E3245] flex items-center justify-between">
        <span className="text-sm font-extrabold text-[#00B386] font-mono">
          {fund.return3Y}
        </span>
        <span className="text-xs font-semibold text-[#7C7E8C] dark:text-[#94A3B8]">
          3Y
        </span>
      </div>
    </div>
  );
};
