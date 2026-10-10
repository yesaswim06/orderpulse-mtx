import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { GrowNavbar } from '../../components/growclone/GrowNavbar';
import { TickerStrip } from '../../components/growclone/TickerStrip';
import { SubNav } from '../../components/growclone/SubNav';
import { BondCard } from '../../components/growclone/BondCard';
import { StockCard } from '../../components/growclone/StockCard';
import { EmptyInvestments } from '../../components/growclone/EmptyInvestments';
import { ProductList } from '../../components/growclone/ProductList';
import {
  POPULAR_BONDS,
  MOST_BOUGHT_STOCKS,
  STOCKS_PRODUCTS_TOOLS,
} from '../../data/mockData';

interface StocksExploreProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const StocksExplore: React.FC<StocksExploreProps> = ({
  isDark,
  onToggleTheme,
}) => {
  const [loading, setLoading] = useState(true);

  // Skeleton loader on first render (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const subNavItems = [
    { label: 'Explore', active: true },
    { label: 'Holdings', active: false },
    { label: 'Positions', active: false },
    { label: 'Orders', active: false },
    { label: 'Watchlist', active: false },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#12141E] text-[#44475B] dark:text-[#E2E8F0] font-sans transition-colors">
      {/* 1. Global Navbar */}
      <GrowNavbar isDark={isDark} onToggleTheme={onToggleTheme} />

      {/* 2. Top Index Ticker Strip */}
      <TickerStrip />

      {/* 3. Sub Navigation Bar */}
      <SubNav items={subNavItems} actionType="terminal" />

      {/* Main Container (~1280px, centered) */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (~2/3, 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-9">
            {/* Section 1: Popular Bonds */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#44475B] dark:text-white">
                  Popular Bonds
                </h2>
                <button className="text-xs font-bold text-[#00B386] hover:underline flex items-center gap-0.5 cursor-pointer">
                  <span>See more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-44 bg-slate-100 dark:bg-slate-800/40 rounded-xl"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-1">
                  {POPULAR_BONDS.map((bond) => (
                    <BondCard key={bond.id} bond={bond} />
                  ))}
                </div>
              )}
            </section>

            {/* Section 2: Most bought stocks */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#44475B] dark:text-white">
                  Most bought stocks
                </h2>
                <button className="text-xs font-bold text-[#00B386] hover:underline flex items-center gap-0.5 cursor-pointer">
                  <span>See more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-36 bg-slate-100 dark:bg-slate-800/40 rounded-xl"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-1">
                  {MOST_BOUGHT_STOCKS.map((stock) => (
                    <StockCard key={stock.id} stock={stock} />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column (~1/3, 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Your Investments Card */}
            <EmptyInvestments />

            {/* Products & Tools Card */}
            <ProductList
              title="Products & Tools"
              items={STOCKS_PRODUCTS_TOOLS}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
