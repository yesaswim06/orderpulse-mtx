import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface IndexItem {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
}

const INITIAL_INDICES: IndexItem[] = [
  { symbol: 'NIFTY 50', name: 'NSE Nifty 50', value: 24852.15, change: 124.60, changePercent: 0.50, isPositive: true },
  { symbol: 'SENSEX', name: 'BSE Sensex', value: 81455.40, change: 392.20, changePercent: 0.48, isPositive: true },
  { symbol: 'BANK NIFTY', name: 'Nifty Bank Index', value: 51980.20, change: 210.40, changePercent: 0.41, isPositive: true },
  { symbol: 'NIFTY IT', name: 'Nifty IT Index', value: 42120.80, change: -45.10, changePercent: -0.11, isPositive: false },
  { symbol: 'DEMO SPOT', name: 'OrderPulse Continuous Auction', value: 100.00, change: 0.00, changePercent: 0.00, isPositive: true },
];

export const LiveIndicesTicker: React.FC = () => {
  const [indices, setIndices] = useState<IndexItem[]>(INITIAL_INDICES);

  // Subtle real-time tick pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev =>
        prev.map(idx => {
          if (idx.symbol === 'DEMO SPOT') return idx;
          const delta = (Math.random() - 0.49) * 2.5;
          const newValue = Number((idx.value + delta).toFixed(2));
          const newChange = Number((idx.change + delta).toFixed(2));
          const newChangePercent = Number(((newChange / (idx.value - newChange)) * 100).toFixed(2));
          return {
            ...idx,
            value: newValue,
            change: newChange,
            changePercent: newChangePercent,
            isPositive: newChange >= 0
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-neutral-50 dark:bg-[#121212] border-b border-[#E8E8E8] dark:border-white/10 overflow-x-auto no-scrollbar py-2.5">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-6 min-w-max">
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-[#00B386] animate-pulse" />
          <span>Live Indices:</span>
        </div>

        <div className="flex items-center gap-8">
          {indices.map(idx => (
            <div key={idx.symbol} className="flex items-center gap-2.5 font-mono text-xs">
              <span className="font-bold text-slate-700 dark:text-neutral-300">
                {idx.symbol}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                ₹{idx.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span
                className={`flex items-center text-[11px] font-medium ${
                  idx.isPositive ? 'text-[#00B386]' : 'text-[#EB5B3C]'
                }`}
              >
                {idx.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {idx.isPositive ? '+' : ''}
                {idx.change.toFixed(2)} ({idx.isPositive ? '+' : ''}
                {idx.changePercent}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
