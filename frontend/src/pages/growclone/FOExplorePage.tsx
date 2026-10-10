import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  CalendarCheck,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Activity,
  SlidersHorizontal
} from 'lucide-react';
import { IndexTickerStrip } from '../../components/growclone/IndexTickerStrip';
import { SubNav } from '../../components/growclone/SubNav';
import { CandleMini } from '../../components/growclone/CandleMini';
import { FO_TOP_TRADED } from '../../data/growcloneData';

export const FOExplorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Explore');
  const [marketSegment, setMarketSegment] = useState<'Equity' | 'Commodities'>('Equity');
  const [stockFilter, setStockFilter] = useState('All');

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      {/* Index Ticker Strip */}
      <IndexTickerStrip />

      {/* Sub-Nav */}
      <SubNav
        type="fo"
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (~2/3) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Top traded section */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-bold text-[#44475B] dark:text-white tracking-tight">
                    Top traded
                  </h2>
                  {/* Segment Chips */}
                  <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F4F4F4] dark:bg-neutral-800">
                    <button
                      onClick={() => setMarketSegment('Equity')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        marketSegment === 'Equity'
                          ? 'bg-white dark:bg-neutral-700 text-[#44475B] dark:text-white shadow-sm'
                          : 'text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white'
                      }`}
                    >
                      Equity
                    </button>
                    <button
                      onClick={() => setMarketSegment('Commodities')}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                        marketSegment === 'Commodities'
                          ? 'bg-white dark:bg-neutral-700 text-[#44475B] dark:text-white shadow-sm'
                          : 'text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white'
                      }`}
                    >
                      Commodities
                    </button>
                  </div>
                </div>

                <button className="text-xs font-bold text-[#00B386] hover:text-[#009e75] flex items-center gap-0.5 cursor-pointer">
                  <span>See more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3x2 Grid of Top Traded F&O Contracts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {FO_TOP_TRADED.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-[#44475B] dark:text-white">
                          {card.symbol}
                        </span>
                        <span className="text-[10px] text-[#7C7E8C]">Fut</span>
                      </div>
                      <span className="text-[11px] text-[#7C7E8C] line-clamp-1 mb-3">
                        {card.name}
                      </span>

                      {/* Mini Candlestick SVG chart */}
                      <div className="py-2 flex items-center justify-center">
                        <CandleMini candles={card.candles} width={130} height={46} />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#F0F0F0] dark:border-white/[0.06] flex items-end justify-between">
                      <div>
                        <div className="font-extrabold text-sm text-[#44475B] dark:text-white font-mono">
                          {card.price}
                        </div>
                        <div
                          className={`text-[11px] font-semibold flex items-center gap-0.5 mt-0.5 ${
                            card.isPositive ? 'text-[#00B386]' : 'text-[#EB5B3C]'
                          }`}
                        >
                          {card.isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>
                            {card.change} ({card.changePercent})
                          </span>
                        </div>
                      </div>

                      {/* Circular link icon button */}
                      <div className="w-7 h-7 rounded-full border border-[#E8E8E8] dark:border-white/10 flex items-center justify-center text-[#7C7E8C] hover:text-[#00B386] hover:border-[#00B386] transition">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* F&O Stocks with Filter Chips */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#44475B] dark:text-white tracking-tight">
                  F&O Stocks
                </h2>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {['All', 'High Volatility', 'Most Active', 'Index Options', 'DEMO Continuous'].map(
                    (filter) => (
                      <button
                        key={filter}
                        onClick={() => setStockFilter(filter)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                          stockFilter === filter
                            ? 'bg-[#00B386] text-white shadow-sm'
                            : 'bg-[#F4F4F4] dark:bg-neutral-800 text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white'
                        }`}
                      >
                        {filter}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* F&O Contract List Table preview */}
              <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAFAFA] dark:bg-neutral-800/50 border-b border-[#E8E8E8] dark:border-white/10 text-[#7C7E8C]">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Contract</th>
                      <th className="py-3 px-4 font-semibold">Expiry</th>
                      <th className="py-3 px-4 font-semibold">Price</th>
                      <th className="py-3 px-4 font-semibold">Change</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06]">
                    <tr className="hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 transition">
                      <td className="py-3 px-4 font-bold text-[#44475B] dark:text-white">
                        NIFTY 25APR 22500 CE
                      </td>
                      <td className="py-3 px-4 text-[#7C7E8C]">25 Apr 2026</td>
                      <td className="py-3 px-4 font-bold font-mono text-[#44475B] dark:text-white">
                        ₹184.50
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#00B386]">+18.20 (+10.94%)</td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/trade"
                          className="px-3 py-1 rounded-full bg-[#00B386]/10 hover:bg-[#00B386]/20 text-[#00B386] font-bold text-[11px]"
                        >
                          Trade
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 transition">
                      <td className="py-3 px-4 font-bold text-[#44475B] dark:text-white">
                        BANKNIFTY 25APR 55000 PE
                      </td>
                      <td className="py-3 px-4 text-[#7C7E8C]">25 Apr 2026</td>
                      <td className="py-3 px-4 font-bold font-mono text-[#44475B] dark:text-white">
                        ₹245.80
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#EB5B3C]">-24.50 (-9.06%)</td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/trade"
                          className="px-3 py-1 rounded-full bg-[#00B386]/10 hover:bg-[#00B386]/20 text-[#00B386] font-bold text-[11px]"
                        >
                          Trade
                        </Link>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 transition">
                      <td className="py-3 px-4 font-bold text-[#44475B] dark:text-white">
                        DEMO Continuous Auction (Spot)
                      </td>
                      <td className="py-3 px-4 text-[#7C7E8C]">Perpetual MTX</td>
                      <td className="py-3 px-4 font-bold font-mono text-[#44475B] dark:text-white">
                        ₹100.00
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#00B386]">±5% Dynamic Collar</td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to="/trade"
                          className="px-3 py-1 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white font-bold text-[11px]"
                        >
                          Engine
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (~1/3) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Card 1: Positions */}
            <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0] dark:border-white/[0.06] mb-4">
                <h3 className="font-bold text-sm text-[#44475B] dark:text-white">Positions</h3>
                <Link to="/trade" className="text-xs font-bold text-[#00B386] hover:underline">
                  Dashboard
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-neutral-800/50">
                  <span className="text-[11px] text-[#7C7E8C] block mb-1">F&O returns</span>
                  <div className="text-xl font-black text-[#44475B] dark:text-white font-mono">
                    ₹0.00
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-neutral-800/50">
                  <span className="text-[11px] text-[#7C7E8C] block mb-1">Commodity returns</span>
                  <div className="text-xl font-black text-[#44475B] dark:text-white font-mono">
                    ₹0.00
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0F0F0] dark:border-white/[0.06] text-center">
                <Link
                  to="/trade"
                  className="text-xs font-bold text-[#00B386] hover:underline"
                >
                  View Order Fills & Executions →
                </Link>
              </div>
            </div>

            {/* Card 2: Products & Tools */}
            <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-[#44475B] dark:text-white mb-4 pb-2 border-b border-[#F0F0F0] dark:border-white/[0.06]">
                Products & tools
              </h3>

              <div className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06] text-xs">
                <div
                  onClick={() => setActiveTab('Orders')}
                  className="py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-2 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-[#00B386] flex items-center justify-center">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-[#44475B] dark:text-neutral-200">
                      OrderPulse C++ Engine API
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                </div>

                <div className="py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-2 rounded-xl transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
                      <CalendarCheck className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-[#44475B] dark:text-neutral-200">
                      Commodities Expiry Calendar
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
