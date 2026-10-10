import React from 'react';

export const EmptyInvestments: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#1F222E] rounded-xl border border-[#E8E8E8] dark:border-[#2E3245] p-6 text-center transition-all">
      <h3 className="text-sm font-bold text-[#44475B] dark:text-white text-left mb-4">
        Your investments
      </h3>
      <div className="py-6 flex flex-col items-center justify-center">
        {/* Empty state financial wallet & coin illustration */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-3 text-[#00B386]">
          <svg
            viewBox="0 0 64 64"
            className="w-12 h-12 fill-none stroke-current stroke-[2.2]"
          >
            <rect x="8" y="16" width="48" height="36" rx="6" />
            <path d="M8 26h48" />
            <circle cx="44" cy="38" r="4" fill="#00B386" />
            <path d="M24 10l8 6 8-6" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#44475B] dark:text-white">
          You haven't invested yet
        </p>
        <p className="text-xs text-[#7C7E8C] dark:text-[#94A3B8] mt-1 max-w-[200px]">
          Start building your wealth with stocks, bonds or mutual funds.
        </p>
      </div>
    </div>
  );
};
