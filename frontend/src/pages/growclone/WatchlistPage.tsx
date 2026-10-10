import React, { useState } from 'react';
import {
  Bookmark,
  TrendingUp,
  TrendingDown,
  Trash2,
  Plus,
  ArrowUpRight,
  Activity,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { IndexTickerStrip } from '../../components/growclone/IndexTickerStrip';
import { SubNav } from '../../components/growclone/SubNav';
import { StockDetailModal } from '../../components/growclone/StockDetailModal';
import { MOST_BOUGHT_STOCKS, StockItem } from '../../data/growcloneData';

export const WatchlistPage: React.FC = () => {
  const [watchlist, setWatchlist] = useState<StockItem[]>([
    ...MOST_BOUGHT_STOCKS.slice(0, 4),
    {
      id: 'stock-demo',
      symbol: 'DEMO',
      name: 'OrderPulse Continuous Auction Equity',
      logo: 'OP',
      price: 100.00,
      change: 1.50,
      changePercent: 1.52,
      isPositive: true
    }
  ]);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  const filteredWatchlist = watchlist.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      <IndexTickerStrip />
      <SubNav type="stocks" activeTab="Watchlist" onSelectTab={() => {}} />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#44475B] dark:text-white flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-[#00B386]" />
              <span>Personal Watchlist</span>
            </h1>
            <p className="text-xs text-[#7C7E8C] mt-1">
              Curate and track high-frequency instruments, bonds, and continuous auction equities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#7C7E8C] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter watchlist..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-neutral-800 border border-[#E8E8E8] dark:border-white/10 focus:outline-none focus:border-[#00B386]"
              />
            </div>
            <Link
              to="/trade"
              className="px-4 py-2 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Matching Terminal</span>
            </Link>
          </div>
        </div>

        {/* Watchlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWatchlist.map((stock) => (
            <div
              key={stock.id}
              className="bg-white dark:bg-[#141414] p-5 rounded-2xl border border-[#E8E8E8] dark:border-white/10 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-[#00B386]">
                    {stock.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#44475B] dark:text-white">
                      {stock.symbol}
                    </h3>
                    <p className="text-[11px] text-[#7C7E8C] truncate max-w-[150px]">
                      {stock.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeFromWatchlist(stock.symbol)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition cursor-pointer"
                  title="Remove from Watchlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8E8E8] dark:border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold font-mono text-[#44475B] dark:text-white">
                    ₹{stock.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-semibold flex items-center gap-0.5 ${
                      stock.isPositive ? 'text-[#00B386]' : 'text-[#EB5B3C]'
                    }`}
                  >
                    {stock.isPositive ? '+' : ''}₹{stock.change.toFixed(2)} ({stock.isPositive ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%)
                  </div>
                </div>

                <button
                  onClick={() => setSelectedStock(stock)}
                  className="px-4 py-1.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Trade
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedStock && (
          <StockDetailModal
            stock={selectedStock}
            onClose={() => setSelectedStock(null)}
            apiBase=""
            walletBalance={1000000}
            onOrderSuccess={() => setSelectedStock(null)}
          />
        )}
      </main>
    </div>
  );
};
