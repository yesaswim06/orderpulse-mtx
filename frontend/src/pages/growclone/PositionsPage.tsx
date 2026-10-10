import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Activity,
  Filter,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { IndexTickerStrip } from '../../components/growclone/IndexTickerStrip';
import { SubNav } from '../../components/growclone/SubNav';
import { StockDetailModal } from '../../components/growclone/StockDetailModal';
import { StockItem } from '../../data/growcloneData';

interface PositionItem {
  symbol: string;
  name: string;
  product: 'MIS' | 'CNC';
  type: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  pnlPercent: number;
}

export const PositionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Positions');
  const [filterProduct, setFilterProduct] = useState<'ALL' | 'MIS' | 'CNC'>('ALL');
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  const [positions, setPositions] = useState<PositionItem[]>([
    {
      symbol: 'DEMO',
      name: 'OrderPulse Continuous Auction Equity',
      product: 'MIS',
      type: 'BUY',
      quantity: 50,
      entryPrice: 99.50,
      currentPrice: 100.00,
      unrealizedPnL: 25.00,
      pnlPercent: 0.50
    },
    {
      symbol: 'NIFTY',
      name: 'NIFTY 24,800 CE Index Option',
      product: 'MIS',
      type: 'BUY',
      quantity: 75,
      entryPrice: 142.00,
      currentPrice: 156.40,
      unrealizedPnL: 1080.00,
      pnlPercent: 10.14
    },
    {
      symbol: 'TATASTEEL',
      name: 'Tata Steel Limited - Intraday',
      product: 'MIS',
      type: 'SELL',
      quantity: 100,
      entryPrice: 174.20,
      currentPrice: 173.80,
      unrealizedPnL: 40.00,
      pnlPercent: 0.23
    }
  ]);

  const filteredPositions = positions.filter((p) => {
    if (filterProduct === 'ALL') return true;
    return p.product === filterProduct;
  });

  const totalPnL = filteredPositions.reduce((acc, p) => acc + p.unrealizedPnL, 0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      <IndexTickerStrip />
      <SubNav type="stocks" activeTab="Positions" onSelectTab={() => {}} />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#44475B] dark:text-white">
              Open Trading Positions
            </h1>
            <p className="text-xs text-[#7C7E8C] mt-1">
              Real-time intraday (MIS) & derivative risk positions derived from OrderPulse matching engine fills.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#181A1B] px-5 py-3 rounded-2xl border border-[#E8E8E8] dark:border-white/10">
            <div>
              <span className="text-[11px] text-[#7C7E8C] block">Total Open P&L</span>
              <span className={`text-base font-bold font-mono ${totalPnL >= 0 ? 'text-[#00B386]' : 'text-[#EB5B3C]'}`}>
                {totalPnL >= 0 ? '+' : ''}₹{totalPnL.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <Link
              to="/trade"
              className="ml-2 px-3.5 py-1.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-[#7C7E8C] mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['ALL', 'MIS', 'CNC'] as const).map((prod) => (
            <button
              key={prod}
              onClick={() => setFilterProduct(prod)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                filterProduct === prod
                  ? 'bg-[#00B386] text-white'
                  : 'bg-slate-100 dark:bg-neutral-800 text-[#7C7E8C] hover:bg-slate-200 dark:hover:bg-neutral-700'
              }`}
            >
              {prod === 'ALL' ? 'All Products' : prod}
            </button>
          ))}
        </div>

        {/* Positions Table */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-[#E8E8E8] dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] dark:bg-[#181A1B] text-[#7C7E8C] font-semibold border-b border-[#E8E8E8] dark:border-white/10">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Instrument</th>
                  <th className="py-3.5 px-3">Product</th>
                  <th className="py-3.5 px-3">Side</th>
                  <th className="py-3.5 px-3 text-right">Qty</th>
                  <th className="py-3.5 px-3 text-right">Avg Entry</th>
                  <th className="py-3.5 px-3 text-right">LTP</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Unrealized P&L</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] dark:divide-white/5 font-mono">
                {filteredPositions.map((p, idx) => {
                  const isProfit = p.unrealizedPnL >= 0;
                  return (
                    <tr key={idx} className="hover:bg-[#F9FAFB] dark:hover:bg-neutral-800/40 transition">
                      <td className="py-4 px-4 sm:px-6 font-sans">
                        <div className="font-bold text-sm text-[#44475B] dark:text-white">
                          {p.symbol}
                        </div>
                        <div className="text-[11px] text-[#7C7E8C] font-normal truncate max-w-[200px]">
                          {p.name}
                        </div>
                      </td>
                      <td className="py-4 px-3 font-sans">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
                          {p.product}
                        </span>
                      </td>
                      <td className="py-4 px-3 font-sans">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.type === 'BUY'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386]'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-[#EB5B3C]'
                          }`}
                        >
                          {p.type}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right font-bold text-[#44475B] dark:text-white">
                        {p.quantity}
                      </td>
                      <td className="py-4 px-3 text-right text-[#7C7E8C]">
                        ₹{p.entryPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-3 text-right font-bold text-[#44475B] dark:text-white">
                        ₹{p.currentPrice.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right font-bold">
                        <span className={isProfit ? 'text-[#00B386]' : 'text-[#EB5B3C]'}>
                          {isProfit ? '+' : ''}₹{p.unrealizedPnL.toFixed(2)} ({isProfit ? '+' : ''}{p.pnlPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center font-sans">
                        <button
                          onClick={() => {
                            setSelectedStock({
                              id: `stock-${p.symbol}`,
                              symbol: p.symbol,
                              name: p.name,
                              logo: p.symbol.slice(0, 2),
                              price: p.currentPrice,
                              change: 0.5,
                              changePercent: 0.5,
                              isPositive: true
                            });
                          }}
                          className="px-3 py-1 rounded-full border border-[#00B386] text-[#00B386] hover:bg-[#00B386] hover:text-white transition font-bold text-xs cursor-pointer"
                        >
                          Square Off
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Square Off / Order Modal */}
        {selectedStock && (
          <StockDetailModal
            stock={selectedStock}
            onClose={() => setSelectedStock(null)}
            apiBase=""
            walletBalance={1000000}
            onOrderSuccess={() => {
              setSelectedStock(null);
            }}
          />
        )}
      </main>
    </div>
  );
};
