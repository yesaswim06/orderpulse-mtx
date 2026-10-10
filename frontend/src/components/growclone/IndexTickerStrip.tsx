import React, { useState, useEffect } from 'react';
import { Globe, TrendingUp, TrendingDown } from 'lucide-react';
import { INDEX_TICKERS, IndexTicker } from '../../data/mockStocks';

interface IndexTickerStripProps {
  theme?: 'light' | 'dark';
}

export const IndexTickerStrip: React.FC<IndexTickerStripProps> = ({ theme = 'light' }) => {
  const [tickers, setTickers] = useState<IndexTicker[]>(INDEX_TICKERS);

  // Micro-fluctuations for realistic live ticker feeling
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.48) * 1.5;
          const currentPrice = parseFloat(t.price.replace(/,/g, ''));
          const newPrice = (currentPrice + delta).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });
          return { ...t, price: newPrice };
        })
      );
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full border-b text-[12px] transition-colors overflow-x-auto scrollbar-none font-sans ${
        theme === 'dark' ? 'bg-[#0A0D15] border-[#1A2234] text-[#A6AFC2]' : 'bg-[#FAFAFA] border-[#E8E8E8] text-[#44475B]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-2 flex items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-7 overflow-x-auto scrollbar-none">
          {tickers.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 shrink-0 font-medium">
              <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-[#2A2E3D]'}`}>
                {item.name}
              </span>
              <span className="font-mono tabular-nums">{item.price}</span>
              <span
                className={`flex items-center gap-0.5 text-[11px] font-mono tabular-nums ${
                  item.isPositive ? 'text-[#00B386]' : 'text-[#EB5B3C]'
                }`}
              >
                {item.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {item.change} ({item.changePercent})
                </span>
              </span>
            </div>
          ))}
        </div>

        <button
          className={`p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition shrink-0 ${
            theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'
          }`}
          title="Global Markets Overview"
        >
          <Globe className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
