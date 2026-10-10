import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Briefcase,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  RefreshCw,
  Wallet,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  dayChangePercent: number;
}

const SAMPLE_HOLDINGS: PortfolioHolding[] = [
  {
    symbol: 'DEMO',
    name: 'OrderPulse Continuous Auction Equity',
    shares: 100,
    avgBuyPrice: 99.20,
    currentPrice: 100.00,
    dayChangePercent: 2.14
  },
  {
    symbol: 'NSE',
    name: 'National Stock Exchange of India',
    shares: 25,
    avgBuyPrice: 1710.00,
    currentPrice: 1730.90,
    dayChangePercent: 0.37
  },
  {
    symbol: 'TATASTEEL',
    name: 'Tata Steel Limited',
    shares: 150,
    avgBuyPrice: 170.50,
    currentPrice: 173.80,
    dayChangePercent: 1.07
  },
  {
    symbol: 'UNIONBANK',
    name: 'Union Bank of India',
    shares: 80,
    avgBuyPrice: 139.20,
    currentPrice: 141.25,
    dayChangePercent: 1.45
  }
];

interface HoldingsPortfolioViewProps {
  walletBalance: number;
  onOpenWallet: () => void;
  onSelectStock?: (symbol: string) => void;
}

export const HoldingsPortfolioView: React.FC<HoldingsPortfolioViewProps> = ({
  walletBalance,
  onOpenWallet,
  onSelectStock
}) => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(SAMPLE_HOLDINGS);
  const [filter, setFilter] = useState<'ALL' | 'PROFIT' | 'LOSS'>('ALL');

  const totalInvested = holdings.reduce((acc, h) => acc + (h.shares * h.avgBuyPrice), 0);
  const totalCurrent = holdings.reduce((acc, h) => acc + (h.shares * h.currentPrice), 0);
  const totalPnL = totalCurrent - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const isOverallProfitable = totalPnL >= 0;

  // Day P&L calculation
  const totalDayPnL = holdings.reduce((acc, h) => {
    const dayGainPerShare = (h.currentPrice * (h.dayChangePercent / 100));
    return acc + (h.shares * dayGainPerShare);
  }, 0);

  const filteredHoldings = holdings.filter(h => {
    const pnl = (h.currentPrice - h.avgBuyPrice);
    if (filter === 'PROFIT') return pnl >= 0;
    if (filter === 'LOSS') return pnl < 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Portfolio Summary Banner (Groww style card) */}
      <div className="bg-white dark:bg-[#151515] rounded-2xl border border-[#E8E8E8] dark:border-white/10 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#F0F0F0] dark:border-white/[0.08] gap-4">
          <div>
            <span className="text-xs font-semibold text-[#7C7E8C] uppercase tracking-wider block mb-1">
              Total Portfolio Value
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#44475B] dark:text-white font-mono">
                ₹{(totalCurrent + walletBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                isOverallProfitable
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386]'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-[#EB5B3C]'
              }`}>
                {isOverallProfitable ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>{isOverallProfitable ? '+' : ''}{totalPnLPercent.toFixed(2)}% Overall</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenWallet}
              className="px-4 py-2 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Money (UPI)</span>
            </button>
            <Link
              to="/trade"
              className="px-4 py-2 rounded-full border border-[#E8E8E8] dark:border-white/10 text-xs font-semibold hover:bg-[#F8F8F8] dark:hover:bg-neutral-800 text-[#44475B] dark:text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-[#00B386]" />
              <span>Terminal</span>
            </Link>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div>
            <span className="text-xs text-[#7C7E8C] block mb-1">Total Invested</span>
            <span className="text-base font-bold text-[#44475B] dark:text-white font-mono">
              ₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-xs text-[#7C7E8C] block mb-1">Current Holdings</span>
            <span className="text-base font-bold text-[#44475B] dark:text-white font-mono">
              ₹{totalCurrent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-xs text-[#7C7E8C] block mb-1">Total Returns (P&L)</span>
            <div className={`text-base font-bold font-mono flex items-center gap-0.5 ${
              isOverallProfitable ? 'text-[#00B386]' : 'text-[#EB5B3C]'
            }`}>
              <span>{isOverallProfitable ? '+' : ''}₹{totalPnL.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-[#7C7E8C] block mb-1">1-Day Returns</span>
            <div className={`text-base font-bold font-mono flex items-center gap-0.5 ${
              totalDayPnL >= 0 ? 'text-[#00B386]' : 'text-[#EB5B3C]'
            }`}>
              <span>{totalDayPnL >= 0 ? '+' : ''}₹{totalDayPnL.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table Section */}
      <div className="bg-white dark:bg-[#151515] rounded-2xl border border-[#E8E8E8] dark:border-white/10 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-[#F0F0F0] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-sm text-[#44475B] dark:text-white">
              Your Holdings ({filteredHoldings.length})
            </h3>
            <div className="flex items-center gap-1 bg-[#F8F8F8] dark:bg-neutral-800 p-0.5 rounded-lg text-[11px]">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  filter === 'ALL'
                    ? 'bg-white dark:bg-neutral-700 text-[#44475B] dark:text-white shadow-xs'
                    : 'text-[#7C7E8C]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('PROFIT')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  filter === 'PROFIT'
                    ? 'bg-white dark:bg-neutral-700 text-[#00B386] shadow-xs'
                    : 'text-[#7C7E8C]'
                }`}
              >
                In Profit
              </button>
              <button
                onClick={() => setFilter('LOSS')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  filter === 'LOSS'
                    ? 'bg-white dark:bg-neutral-700 text-[#EB5B3C] shadow-xs'
                    : 'text-[#7C7E8C]'
                }`}
              >
                In Loss
              </button>
            </div>
          </div>

          <span className="text-xs text-[#7C7E8C] font-mono">
            Settlement: T+1 Rolling
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#F8F8F8] dark:bg-neutral-800/50 text-[#7C7E8C] text-[11px] uppercase border-b border-[#E8E8E8] dark:border-white/10">
              <tr>
                <th className="p-4 font-semibold">Instrument</th>
                <th className="p-4 font-semibold text-right">Shares</th>
                <th className="p-4 font-semibold text-right">Avg Price</th>
                <th className="p-4 font-semibold text-right">LTP (₹)</th>
                <th className="p-4 font-semibold text-right">Current Value</th>
                <th className="p-4 font-semibold text-right">P&L (Returns)</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06]">
              {filteredHoldings.map((h) => {
                const curVal = h.shares * h.currentPrice;
                const invVal = h.shares * h.avgBuyPrice;
                const pnl = curVal - invVal;
                const pnlPct = (pnl / invVal) * 100;
                const isPos = pnl >= 0;

                return (
                  <tr
                    key={h.symbol}
                    className="hover:bg-[#F9F9F9] dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] font-bold text-xs flex items-center justify-center shrink-0">
                          {h.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <span className="font-bold text-[#44475B] dark:text-white block">
                            {h.symbol}
                          </span>
                          <span className="text-[11px] text-[#7C7E8C] line-clamp-1">
                            {h.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-[#44475B] dark:text-white">
                      {h.shares}
                    </td>
                    <td className="p-4 text-right font-mono text-[#7C7E8C]">
                      ₹{h.avgBuyPrice.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-[#44475B] dark:text-white">
                      ₹{h.currentPrice.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-[#44475B] dark:text-white">
                      ₹{curVal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-right font-mono font-bold">
                      <div className={isPos ? 'text-[#00B386]' : 'text-[#EB5B3C]'}>
                        <span>{isPos ? '+' : ''}₹{pnl.toFixed(2)}</span>
                        <span className="text-[10px] block">({isPos ? '+' : ''}{pnlPct.toFixed(2)}%)</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onSelectStock && onSelectStock(h.symbol)}
                        className="px-3 py-1.5 rounded-lg border border-[#E8E8E8] dark:border-white/10 hover:border-[#00B386] hover:text-[#00B386] text-[11px] font-bold transition cursor-pointer"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
