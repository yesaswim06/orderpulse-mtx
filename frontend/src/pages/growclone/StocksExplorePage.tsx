import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Coins,
  Landmark,
  Layers,
  Search,
  Zap,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import { IndexTickerStrip } from '../../components/growclone/IndexTickerStrip';
import { SubNav } from '../../components/growclone/SubNav';
import { EmptyState } from '../../components/growclone/EmptyState';
import {
  POPULAR_BONDS,
  MOST_BOUGHT_STOCKS,
  PRODUCTS_AND_TOOLS,
} from '../../data/growcloneData';

export const StocksExplorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Explore');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      {/* Index Ticker Strip */}
      <IndexTickerStrip />

      {/* Sub-Nav */}
      <SubNav
        type="stocks"
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Layout */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        {activeTab !== 'Explore' ? (
          /* Placeholder for Holdings/Positions/Orders/Watchlist tabs */
          <div className="py-12 bg-white dark:bg-[#151515] rounded-2xl border border-[#E8E8E8] dark:border-white/10 p-8 text-center max-w-xl mx-auto shadow-sm">
            <h3 className="text-base font-bold text-[#44475B] dark:text-white mb-2">
              {activeTab} Management
            </h3>
            <p className="text-xs text-[#7C7E8C] mb-6">
              Track your live portfolio, view execution fills from the OrderPulse C++ matching engine, or place new orders.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveTab('Explore')}
                className="px-4 py-2 rounded-full border border-[#E8E8E8] dark:border-white/10 text-xs font-semibold hover:bg-[#F8F8F8] dark:hover:bg-neutral-800"
              >
                Back to Explore
              </button>
              <Link
                to="/trade"
                className="px-5 py-2 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Open Matching Terminal</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN (~2/3) */}
            <div className="lg:col-span-8 flex flex-col gap-10">
              {/* Section 1: Popular Bonds */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#44475B] dark:text-white tracking-tight">
                    Popular Bonds
                  </h2>
                  <span className="text-xs text-[#7C7E8C]">Fixed returns up to 14% p.a.</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {POPULAR_BONDS.map((bond) => (
                    <div
                      key={bond.id}
                      className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
                    >
                      {/* Logo square */}
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-[#E8E8E8] dark:border-white/10 flex items-center justify-center font-bold text-xs text-[#44475B] dark:text-neutral-200 mb-3">
                        {bond.logo}
                      </div>

                      <h3 className="font-bold text-xs text-[#44475B] dark:text-white line-clamp-1 mb-1">
                        {bond.issuer}
                      </h3>
                      <p className="text-[11px] text-[#7C7E8C] mb-3">Matures {bond.maturity}</p>

                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-base font-extrabold text-[#44475B] dark:text-white font-mono">
                          {bond.yieldPercent}
                        </span>
                        <span className="text-[10px] text-[#7C7E8C]">Yield</span>
                      </div>

                      <div className="pt-2 border-t border-[#F0F0F0] dark:border-white/[0.06] flex items-center justify-between text-[11px]">
                        <span className="text-[#7C7E8C]">{bond.tenure}</span>
                        <div className="flex items-center gap-1 font-semibold text-[#44475B] dark:text-neutral-300">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              bond.ratingColor === 'orange' ? 'bg-[#F5A623]' : 'bg-[#00B386]'
                            }`}
                          />
                          <span>{bond.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <button className="text-xs font-bold text-[#00B386] hover:text-[#009e75] flex items-center gap-1 cursor-pointer">
                    <span>See more</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </section>

              {/* Section 2: Most bought stocks */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#44475B] dark:text-white tracking-tight">
                    Most bought stocks
                  </h2>
                  <span className="text-xs text-[#7C7E8C]">Based on active trader flow</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {MOST_BOUGHT_STOCKS.slice(0, 4).map((stock) => (
                    <div
                      key={stock.id}
                      className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[#00B386] font-bold text-xs flex items-center justify-center mb-3">
                          {stock.logo}
                        </div>
                        <h3 className="font-bold text-xs text-[#44475B] dark:text-white line-clamp-1 mb-0.5">
                          {stock.name}
                        </h3>
                        <span className="text-[10px] font-mono text-[#7C7E8C] block mb-3">
                          {stock.symbol}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-[#F0F0F0] dark:border-white/[0.06]">
                        <div className="font-extrabold text-sm text-[#44475B] dark:text-white font-mono">
                          ₹{stock.price.toFixed(2)}
                        </div>
                        <div className="text-[11px] font-semibold text-[#00B386] flex items-center gap-0.5 mt-0.5">
                          <TrendingUp className="w-3 h-3" />
                          <span>+{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <button className="text-xs font-bold text-[#00B386] hover:text-[#009e75] flex items-center gap-1 cursor-pointer">
                    <span>See more</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </section>

              {/* OrderPulse C++ Matching Engine Highlight Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/60 dark:from-emerald-950/20 dark:to-teal-950/10 border border-[#00B386]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#00B386] text-white text-[10px] font-extrabold tracking-wide uppercase">
                      MTX Hackathon 2026
                    </span>
                    <span className="text-xs font-bold text-[#44475B] dark:text-white font-mono">
                      2.1 µs In-Memory Matching
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#44475B] dark:text-white">
                    Experience Continuous Auction with Volatility Circuit Breakers
                  </h4>
                  <p className="text-xs text-[#7C7E8C] mt-0.5">
                    Test limit orders, inspect Level-2 depth, trigger price shock scenarios, and query Railway MySQL & MongoDB Atlas audits.
                  </p>
                </div>
                <Link
                  to="/trade"
                  className="px-5 py-2.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white font-bold text-xs shrink-0 shadow-md shadow-[#00B386]/20 transition flex items-center gap-1.5"
                >
                  <Activity className="w-4 h-4" />
                  <span>Launch Terminal →</span>
                </Link>
              </div>
            </div>

            {/* RIGHT COLUMN (~1/3) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Card 1: Your investments empty-state */}
              <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0] dark:border-white/[0.06] mb-3">
                  <h3 className="font-bold text-sm text-[#44475B] dark:text-white">
                    Your investments
                  </h3>
                  <Link to="/trade" className="text-xs font-bold text-[#00B386] hover:underline">
                    Dashboard
                  </Link>
                </div>

                <EmptyState
                  title="You haven't invested yet"
                  description="Start trading with simulated ₹10,00,000 cash balance on live FIFO order matching."
                  actionText="Trade DEMO Symbol"
                  onAction={() => navigate('/trade')}
                />
              </div>

              {/* Card 2: Products & Tools */}
              <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-[#44475B] dark:text-white mb-4 pb-2 border-b border-[#F0F0F0] dark:border-white/[0.06]">
                  Products & Tools
                </h3>

                <div className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06] text-xs">
                  {PRODUCTS_AND_TOOLS.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => item.id === 'terminal' && navigate('/trade')}
                      className="py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-2 rounded-xl transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-neutral-800 flex items-center justify-center text-[#7C7E8C]">
                          {item.id === 'ipo' && <Coins className="w-4 h-4 text-[#F5A623]" />}
                          {item.id === 'bonds' && <Landmark className="w-4 h-4 text-[#00B386]" />}
                          {item.id === 'etfs' && <Layers className="w-4 h-4 text-blue-500" />}
                          {item.id === 'screener' && <Search className="w-4 h-4 text-purple-500" />}
                          {item.id === 'terminal' && <Zap className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <span className="font-medium text-[#44475B] dark:text-neutral-200">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.pill && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00B386]/10 text-[#00B386] border border-[#00B386]/20">
                            {item.pill}
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
