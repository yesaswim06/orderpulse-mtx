import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface StockCardItem {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  marketCap: string;
}

const TOP_INDIAN_STOCKS: StockCardItem[] = [
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy & Tech', price: 2984.50, change: 34.20, changePercent: 1.16, isPositive: true, marketCap: '₹20.19T' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT Services', price: 4256.00, change: 52.80, changePercent: 1.26, isPositive: true, marketCap: '₹15.40T' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking & Finance', price: 1682.40, change: -12.10, changePercent: -0.71, isPositive: false, marketCap: '₹12.78T' },
  { symbol: 'INFY', name: 'Infosys Limited', sector: 'IT Services', price: 1894.20, change: 22.40, changePercent: 1.20, isPositive: true, marketCap: '₹7.86T' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automotive', price: 986.75, change: 16.30, changePercent: 1.68, isPositive: true, marketCap: '₹3.62T' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking', price: 1248.60, change: 8.90, changePercent: 0.72, isPositive: true, marketCap: '₹8.77T' },
];

export const TopStocksBoard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="markets" className="scroll-mt-24 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] text-xs font-mono font-bold border border-emerald-500/20 mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Liquid Indian Equities</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#44475B] dark:text-white tracking-tight">
            Top Traded Large-Cap Equities
          </h3>
          <p className="text-xs sm:text-sm text-[#7C7E8C] dark:text-neutral-400 mt-1">
            Real-time simulated matching available across NSE/BSE benchmark stocks.
          </p>
        </div>

        <Link
          to="/stocks/user/explore"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00B386] hover:text-[#009e75] transition"
        >
          <span>Explore All 50+ Equities</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOP_INDIAN_STOCKS.map(stk => (
          <div
            key={stk.symbol}
            onClick={() => navigate('/stocks/user/explore')}
            className="p-5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8E8E8] dark:border-white/10 hover:border-[#00B386] transition-all cursor-pointer group shadow-sm hover:shadow-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-extrabold text-sm text-[#44475B] dark:text-white group-hover:text-[#00B386] transition">
                  {stk.name}
                </div>
                <div className="text-[11px] font-mono text-[#7C7E8C] flex items-center gap-2 mt-0.5">
                  <span className="font-bold">{stk.symbol}</span>
                  <span>•</span>
                  <span>{stk.sector}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-neutral-100 dark:bg-white/5 text-[#7C7E8C]">
                {stk.marketCap}
              </span>
            </div>

            <div className="flex items-end justify-between pt-2 border-t border-[#F0F0F0] dark:border-white/[0.06]">
              <div>
                <div className="text-base font-black font-mono text-[#44475B] dark:text-white">
                  ₹{stk.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div
                  className={`text-xs font-mono font-semibold flex items-center ${
                    stk.isPositive ? 'text-[#00B386]' : 'text-[#EB5B3C]'
                  }`}
                >
                  {stk.isPositive ? '+' : ''}
                  {stk.change.toFixed(2)} ({stk.isPositive ? '+' : ''}
                  {stk.changePercent}%)
                </div>
              </div>

              <button
                type="button"
                className="px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-[#00B386] hover:text-white text-xs font-semibold text-[#44475B] dark:text-neutral-300 transition"
              >
                Trade
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
