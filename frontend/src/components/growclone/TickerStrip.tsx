import React from 'react';
import { Globe, TrendingUp, TrendingDown } from 'lucide-react';
import { TICKER_INDICES } from '../../data/mockData';

export const TickerStrip: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#12141E] border-b border-[#E8E8E8] dark:border-[#2E3245] py-2 px-4 sm:px-6 lg:px-12 transition-colors">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        {/* Indices list */}
        <div className="flex items-center gap-6 sm:gap-8 font-mono shrink-0 text-xs">
          {TICKER_INDICES.map((idx) => (
            <div key={idx.symbol} className="flex items-center gap-2 shrink-0">
              <span className="font-semibold text-[#44475B] dark:text-[#E2E8F0] tracking-tight">
                {idx.symbol}
              </span>
              <span className="font-bold text-[#44475B] dark:text-white">
                {idx.price}
              </span>
              <span
                className={`flex items-center text-[11px] font-medium ${
                  idx.isPositive ? 'text-[#00B386]' : 'text-[#EB5B3C]'
                }`}
              >
                {idx.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5 inline" />
                )}
                <span>{idx.change}</span>
                <span className="ml-1">({idx.percent})</span>
              </span>
            </div>
          ))}
        </div>

        {/* Globe Markets Button */}
        <button
          className="p-1.5 rounded-full hover:bg-[#F8F8F8] dark:hover:bg-[#1F222E] text-[#7C7E8C] dark:text-[#94A3B8] transition shrink-0"
          title="Global Market Indices"
        >
          <Globe className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
