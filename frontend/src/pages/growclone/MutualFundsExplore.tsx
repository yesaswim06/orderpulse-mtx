import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { GrowNavbar } from '../../components/growclone/GrowNavbar';
import { SubNav } from '../../components/growclone/SubNav';
import { FundCard } from '../../components/growclone/FundCard';
import { EmptyInvestments } from '../../components/growclone/EmptyInvestments';
import { ProductList } from '../../components/growclone/ProductList';
import {
  POPULAR_FUNDS,
  FUND_COLLECTIONS,
  FUNDS_BY_GROWCLONE,
  MF_PRODUCTS_TOOLS,
} from '../../data/mockData';

interface MutualFundsExploreProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const MutualFundsExplore: React.FC<MutualFundsExploreProps> = ({
  isDark,
  onToggleTheme,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const subNavItems = [
    { label: 'Explore', active: true },
    { label: 'Dashboard', active: false },
    { label: 'SIPs', active: false },
    { label: 'Watchlist', active: false },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#12141E] text-[#44475B] dark:text-[#E2E8F0] font-sans transition-colors">
      {/* 1. Global Navbar */}
      <GrowNavbar isDark={isDark} onToggleTheme={onToggleTheme} />

      {/* 2. Sub Navigation Bar with Cart Action Button */}
      <SubNav items={subNavItems} actionType="cart" />

      {/* Main Container */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (~2/3, 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Section 1: Popular Funds */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#44475B] dark:text-white">
                  Popular Funds
                </h2>
                <button className="text-xs font-bold text-[#00B386] hover:underline flex items-center gap-0.5 cursor-pointer">
                  <span>All Mutual Funds</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-40 bg-slate-100 dark:bg-slate-800/40 rounded-xl"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-1">
                  {POPULAR_FUNDS.map((fund) => (
                    <FundCard key={fund.id} fund={fund} />
                  ))}
                </div>
              )}
            </section>

            {/* Section 2: Collections Tiles */}
            <section>
              <h2 className="text-lg font-bold text-[#44475B] dark:text-white mb-4">
                Collections
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
                {FUND_COLLECTIONS.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-[#1F222E] border border-[#E8E8E8] dark:border-[#2E3245] hover:border-[#00B386] hover:shadow-xs transition flex flex-col items-center text-center cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#181A24] flex items-center justify-center text-2xl mb-2.5 shadow-2xs group-hover:scale-110 transition-transform">
                      {c.icon}
                    </div>
                    <span className="text-xs font-bold text-[#44475B] dark:text-white line-clamp-1">
                      {c.label}
                    </span>
                    <span className="text-[10px] text-[#7C7E8C] dark:text-[#94A3B8] mt-0.5 hidden sm:block">
                      {c.desc}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Funds by GrowClone */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#44475B] dark:text-white">
                  Funds by GrowClone
                </h2>
                <button className="text-xs font-bold text-[#00B386] hover:underline flex items-center gap-0.5 cursor-pointer">
                  <span>View all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-1">
                {FUNDS_BY_GROWCLONE.map((fund) => (
                  <FundCard key={fund.id} fund={fund} />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (~1/3, 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Your Investments Card */}
            <EmptyInvestments />

            {/* Products and Tools */}
            <ProductList
              title="Products and Tools"
              items={MF_PRODUCTS_TOOLS}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
