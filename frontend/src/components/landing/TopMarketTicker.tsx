import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const DEFAULT_TICKERS: TickerItem[] = [
  { symbol: 'NIFTY 50', price: '24,842.10', change: '+0.68%', isPositive: true },
  { symbol: 'SENSEX', price: '81,381.36', change: '+0.54%', isPositive: true },
  { symbol: 'BANK NIFTY', price: '51,460.85', change: '-0.22%', isPositive: false },
  { symbol: 'NASDAQ 100', price: '19,820.40', change: '+1.14%', isPositive: true },
  { symbol: 'S&P 500', price: '5,634.50', change: '+0.42%', isPositive: true },
  { symbol: 'DEMO / INR', price: '₹100.00', change: '+0.00%', isPositive: true },
];

export const TopMarketTicker: React.FC = () => {
  const [tickers, setTickers] = useState<TickerItem[]>(DEFAULT_TICKERS);

  // Subtle live micro-ticks for realistic fintech animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev =>
        prev.map(item => {
          if (Math.random() > 0.3) return item;
          const delta = (Math.random() * 0.08 - 0.04);
          const isPos = delta >= 0;
          return {
            ...item,
            change: `${isPos ? '+' : ''}${delta.toFixed(2)}%`,
            isPositive: isPos,
          };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#0b1329] border-b border-white/[0.08] text-white py-1.5 px-4 text-xs font-mono overflow-hidden select-none">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-4">
        {/* Live Simulation Notice */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-sans font-medium text-emerald-400">
            SIMULATED DEMO FEED
          </span>
          <span className="hidden md:inline text-[10px] text-slate-400 font-sans">
            | MTX Matching Engine Active
          </span>
        </div>

        {/* Tickers Row */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-0.5">
          {tickers.map((t, idx) => (
            <div key={idx} className="flex items-center gap-2 shrink-0">
              <span className="text-slate-300 font-semibold text-[11px] font-sans">
                {t.symbol}
              </span>
              <span className="text-white text-[11px]">{t.price}</span>
              <span
                className={`flex items-center text-[10px] font-bold ${
                  t.isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {t.isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                )}
                {t.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
