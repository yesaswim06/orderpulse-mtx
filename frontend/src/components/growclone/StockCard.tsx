import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockItem } from '../../data/mockData';

interface StockCardProps {
  stock: StockItem;
}

export const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  return (
    <div className="bg-white dark:bg-[#1F222E] border border-[#E8E8E8] dark:border-[#2E3245] rounded-xl p-4 sm:p-5 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer min-w-[210px] sm:min-w-0">
      {/* Top: Logo + Stock Name */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-9 h-9 rounded-lg ${stock.logoBg} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs`}
        >
          {stock.logoText}
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#44475B] dark:text-white line-clamp-1">
            {stock.symbol}
          </h4>
          <span className="text-[11px] text-[#7C7E8C] dark:text-[#94A3B8] line-clamp-1">
            {stock.name}
          </span>
        </div>
      </div>

      {/* Bottom: Price + Positive/Negative Change in bold */}
      <div className="mt-2">
        <div className="text-base font-extrabold text-[#44475B] dark:text-white font-mono">
          {stock.price}
        </div>
        <div
          className={`text-xs font-semibold flex items-center gap-1 mt-0.5 ${
            stock.isPositive ? 'text-[#00B386]' : 'text-[#EB5B3C]'
          }`}
        >
          {stock.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 inline" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 inline" />
          )}
          <span>{stock.change}</span>
          <span>({stock.percent})</span>
        </div>
      </div>
    </div>
  );
};
