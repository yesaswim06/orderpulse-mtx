import React, { useState, useEffect } from 'react';
import { ChevronRight, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { GrowNavbar } from '../../components/growclone/GrowNavbar';
import { TickerStrip } from '../../components/growclone/TickerStrip';
import { SubNav } from '../../components/growclone/SubNav';
import { CandleMini } from '../../components/growclone/CandleMini';
import { ProductList } from '../../components/growclone/ProductList';
import {
  FNO_TOP_TRADED,
  FNO_PRODUCTS_TOOLS,
} from '../../data/mockData';

interface FnOExploreProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const FnOExplore: React.FC<FnOExploreProps> = ({
  isDark,
  onToggleTheme,
}) => {
  const [activeTab, setActiveTab] = useState<'Equity' | 'Commodities'>('Equity');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const subNavItems = [
    { label: 'Explore', active: true },
    { label: 'Positions', active: false },
    { label: 'Orders', active: false },
  ];

  const filterChips = ['All', 'Most Active', 'Top Gainers', 'Top Losers', 'Open Interest'];

  return (
    <div className="min-h-screen bg-white dark:bg-[#12141E] text-[#44475B] dark:text-[#E2E8F0] font-sans transition-colors">
      {/* 1. Global Navbar */}
      <GrowNavbar isDark={isDark} onToggleTheme={onToggleTheme} />

      {/* 2. Top Index Ticker Strip */}
      <TickerStrip />

      {/* 3. Sub Navigation Bar */}
      <SubNav items={subNavItems} actionType="terminal" />

      {/* Main Container */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (~2/3, 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-9">
            {/* Top Traded Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-[#44475B] dark:text-white">
                    Top traded
                  </h2>
                  {/* Pill toggle chips */}
                  <div className="flex items-center bg-[#F8F8F8] dark:bg-[#1F222E] p-1 rounded-full border border-[#E8E8E8] dark:border-[#2E3245]">
                    <button
                      onClick={() => setActiveTab('Equity')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'Equity'
                          ? 'bg-white dark:bg-[#2A2E3D] text-[#44475B] dark:text-white shadow-xs'
                          : 'text-[#7C7E8C] dark:text-[#94A3B8] hover:text-[#44475B]'
                      }`}
                    >
                      Equity
                    </button>
                    <button
                      onClick={() => setActiveTab('Commodities')}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        activeTab === 'Commodities'
                          ? 'bg-white dark:bg-[#2A2E3D] text-[#44475B] dark:text-white shadow-xs'
                          : 'text-[#7C7E8C] dark:text-[#94A3B8] hover:text-[#44475B]'
                      }`}
                    >
                      Commodities
                    </button>
                  </div>
                </div>

                <button className="text-xs font-bold text-[#00B386] hover:underline flex items-center gap-0.5 cursor-pointer">
                  <span>See more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3x2 Grid of Cards */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="h-44 bg-slate-100 dark:bg-slate-800/40 rounded-xl"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {FNO_TOP_TRADED.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-[#1F222E] border border-[#E8E8E8] dark:border-[#2E3245] rounded-xl p-4 hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        {/* Title at top */}
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-bold text-[#44475B] dark:text-white truncate">
                            {card.name}
                          </h4>
                          <span className="text-[10px] text-[#7C7E8C] dark:text-[#94A3B8] bg-[#F8F8F8] dark:bg-[#181A24] px-1.5 py-0.5 rounded">
                            OPT
                          </span>
                        </div>

                        {/* Price & Change */}
                        <div className="mt-1">
                          <div className="text-base font-extrabold text-[#44475B] dark:text-white font-mono">
                            {card.price}
                          </div>
                          <div
                            className={`text-xs font-semibold flex items-center gap-0.5 mt-0.5 ${
                              card.isPositive ? 'text-[#00B386]' : 'text-[#EB5B3C]'
                            }`}
                          >
                            {card.isPositive ? (
                              <TrendingUp className="w-3 h-3 inline" />
                            ) : (
                              <TrendingDown className="w-3 h-3 inline" />
                            )}
                            <span>{card.change}</span>
                            <span>({card.percent})</span>
                          </div>
                        </div>
                      </div>

                      {/* Mini Candlestick Chart & Circular Link Button */}
                      <div className="mt-4 pt-3 border-t border-[#E8E8E8] dark:border-[#2E3245] flex items-center justify-between">
                        <CandleMini candles={card.candles} width={110} height={36} />

                        <div className="w-7 h-7 rounded-full bg-[#F8F8F8] dark:bg-[#2A2E3D] group-hover:bg-[#00B386] group-hover:text-white text-[#7C7E8C] flex items-center justify-center transition shadow-2xs">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* F&O Stocks Filter Section */}
            <section>
              <h2 className="text-lg font-bold text-[#44475B] dark:text-white mb-3">
                F&O Stocks
              </h2>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {filterChips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setSelectedFilter(chip)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedFilter === chip
                        ? 'bg-[#00B386] text-white shadow-xs'
                        : 'bg-[#F8F8F8] dark:bg-[#1F222E] text-[#7C7E8C] dark:text-[#94A3B8] border border-[#E8E8E8] dark:border-[#2E3245] hover:text-[#44475B]'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (~1/3, 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Positions Returns Card */}
            <div className="bg-white dark:bg-[#1F222E] rounded-xl border border-[#E8E8E8] dark:border-[#2E3245] p-5 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#44475B] dark:text-white">
                  Positions
                </h3>
                <button className="text-xs font-bold text-[#00B386] hover:underline cursor-pointer">
                  Dashboard
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#181A24] border border-[#E8E8E8] dark:border-[#2A2E3D]">
                  <span className="text-xs text-[#7C7E8C] dark:text-[#94A3B8] block mb-1">
                    F&O returns
                  </span>
                  <span className="text-lg font-extrabold text-[#44475B] dark:text-white font-mono">
                    ₹0.00
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-[#181A24] border border-[#E8E8E8] dark:border-[#2A2E3D]">
                  <span className="text-xs text-[#7C7E8C] dark:text-[#94A3B8] block mb-1">
                    Commodity returns
                  </span>
                  <span className="text-lg font-extrabold text-[#44475B] dark:text-white font-mono">
                    ₹0.00
                  </span>
                </div>
              </div>
            </div>

            {/* Products & Tools */}
            <ProductList
              title="Products & tools"
              items={FNO_PRODUCTS_TOOLS}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
