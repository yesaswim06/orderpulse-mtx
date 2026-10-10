import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrowNavbar } from '../../components/growclone/GrowNavbar';
import { IndexTickerStrip } from '../../components/growclone/IndexTickerStrip';
import { SubNav } from '../../components/growclone/SubNav';
import { CandleMini } from '../../components/growclone/CandleMini';
import { TOP_TRADED_FNO, FNO_PRODUCTS } from '../../data/mockFnO';
import {
  ExternalLink,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Code,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface FnOExplorePageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const FnOExplorePage: React.FC<FnOExplorePageProps> = ({
  theme,
  onToggleTheme,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('Explore');
  const [fnoCategory, setFnoCategory] = useState<'Equity' | 'Commodities'>('Equity');
  const [stockFilter, setStockFilter] = useState('All');
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
        theme === 'dark' ? 'bg-[#0B0E14] text-[#E5E7EB]' : 'bg-white text-[#44475B]'
      }`}
    >
      {/* 1. Global Navbar */}
      <GrowNavbar theme={theme} onToggleTheme={onToggleTheme} />

      {/* 2. Index Ticker Strip */}
      <IndexTickerStrip theme={theme} />

      {/* 3. Section Sub-Nav */}
      <SubNav
        section="fno"
        activeItem={activeSubTab}
        onSelectTab={(tab) => {
          setActiveSubTab(tab);
          if (tab === 'Positions' || tab === 'Orders') navigate('/trade');
        }}
        theme={theme}
      />

      {/* 4. Main Two-Column Layout */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (~2/3: 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Top Traded Heading & Toggle Chips */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-4">
                  <h2 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                    Top traded
                  </h2>
                  {/* Category Pills */}
                  <div className={`p-1 rounded-full border flex items-center gap-1 text-xs font-semibold ${
                    theme === 'dark' ? 'bg-[#151B27] border-[#222B3D]' : 'bg-[#F4F4F4] border-[#E8E8E8]'
                  }`}>
                    <button
                      onClick={() => setFnoCategory('Equity')}
                      className={`px-3 py-1 rounded-full transition cursor-pointer ${
                        fnoCategory === 'Equity'
                          ? theme === 'dark' ? 'bg-[#252E42] text-white shadow-sm' : 'bg-white text-[#222531] shadow-sm'
                          : theme === 'dark' ? 'text-[#8B93A7] hover:text-white' : 'text-[#7C7E8C] hover:text-[#44475B]'
                      }`}
                    >
                      Equity
                    </button>
                    <button
                      onClick={() => setFnoCategory('Commodities')}
                      className={`px-3 py-1 rounded-full transition cursor-pointer ${
                        fnoCategory === 'Commodities'
                          ? theme === 'dark' ? 'bg-[#252E42] text-white shadow-sm' : 'bg-white text-[#222531] shadow-sm'
                          : theme === 'dark' ? 'text-[#8B93A7] hover:text-white' : 'text-[#7C7E8C] hover:text-[#44475B]'
                      }`}
                    >
                      Commodities
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/trade')}
                  className="text-xs font-bold text-[#00B386] hover:underline flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>See more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3x2 Grid of F&O Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {TOP_TRADED_FNO.map((contract) => (
                  <div
                    key={contract.id}
                    onClick={() => navigate('/trade')}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer relative ${
                      theme === 'dark'
                        ? 'bg-[#131824] border-[#222B3D] hover:border-[#33415C]'
                        : 'bg-white border-[#E8E8E8] hover:border-[#D0D0D0]'
                    }`}
                  >
                    <div>
                      {/* Name */}
                      <h3 className={`text-sm font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                        {contract.name}
                      </h3>
                      {/* Price & Change */}
                      <div className="mt-2">
                        <div className="text-base font-extrabold font-mono tabular-nums">
                          {contract.price}
                        </div>
                        <div
                          className={`text-[11px] font-semibold font-mono tabular-nums flex items-center gap-1 mt-0.5 ${
                            contract.isPositive ? 'text-[#00B386]' : 'text-[#EB5B3C]'
                          }`}
                        >
                          {contract.isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>
                            {contract.change} ({contract.changePercent})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Candlestick visualization & Link icon */}
                    <div className="mt-4 pt-2 flex items-end justify-between">
                      <CandleMini candles={contract.candles} width={130} height={42} />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/trade');
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition border ${
                          theme === 'dark'
                            ? 'bg-[#1A2234] border-[#2A354C] text-[#8B93A7] hover:text-white'
                            : 'bg-[#F8F8F8] border-[#E8E8E8] text-[#7C7E8C] hover:text-[#222531]'
                        }`}
                        title="View Live Order Book & Depth in Terminal"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: F&O Stocks Heading & Filter Chips */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                  F&amp;O Stocks
                </h2>
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
                {['All', 'Nifty 50', 'Bank Nifty', 'Top Gainers', 'Top Losers', 'Open Interest Spikes'].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setStockFilter(chip)}
                    className={`px-3.5 py-1.5 rounded-full font-semibold border transition cursor-pointer shrink-0 ${
                      stockFilter === chip
                        ? 'bg-[#00B386] text-white border-[#00B386]'
                        : theme === 'dark'
                        ? 'bg-[#131824] border-[#222B3D] text-[#8B93A7] hover:text-white'
                        : 'bg-white border-[#E8E8E8] text-[#7C7E8C] hover:text-[#222531]'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <div
                onClick={() => navigate('/trade')}
                className={`mt-4 p-5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  theme === 'dark' ? 'bg-[#131824] border-[#222B3D] hover:bg-[#1A2234]' : 'bg-[#FAFAFA] border-[#E8E8E8] hover:bg-[#F2F2F2]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#00B386] flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">C++20 In-Memory Option Derivatives</h4>
                    <p className={`text-xs ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                      Simulate high-frequency crossing orders with sub-microsecond price-time priority.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#00B386]">
                  <span>Launch Live Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (~1/3: 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Positions Card */}
            <div
              className={`p-5 rounded-2xl border transition-colors ${
                theme === 'dark' ? 'bg-[#131824] border-[#222B3D]' : 'bg-white border-[#E8E8E8]'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                  Positions
                </h3>
                <button
                  onClick={() => navigate('/trade')}
                  className="text-xs font-bold text-[#00B386] hover:underline"
                >
                  Dashboard
                </button>
              </div>

              <div className="space-y-4 font-mono-numbers">
                <div>
                  <div className={`text-[11px] font-sans ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                    F&amp;O returns
                  </div>
                  <div className="text-xl font-extrabold text-[#00B386] mt-0.5">
                    ₹0.00
                  </div>
                </div>
                <div className="pt-3 border-t border-inherit">
                  <div className={`text-[11px] font-sans ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                    Commodity returns
                  </div>
                  <div className="text-xl font-extrabold text-[#00B386] mt-0.5">
                    ₹0.00
                  </div>
                </div>
              </div>
            </div>

            {/* Products & Tools */}
            <div
              className={`p-5 rounded-2xl border transition-colors ${
                theme === 'dark' ? 'bg-[#131824] border-[#222B3D]' : 'bg-white border-[#E8E8E8]'
              }`}
            >
              <h3 className={`text-sm font-bold tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                Products &amp; tools
              </h3>

              <div className="divide-y divide-inherit">
                {FNO_PRODUCTS.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => navigate('/trade')}
                    className={`py-3 flex items-center justify-between cursor-pointer transition ${
                      theme === 'dark' ? 'hover:bg-[#1A2234] -mx-2 px-2 rounded-lg' : 'hover:bg-[#F8F8F8] -mx-2 px-2 rounded-lg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        {prod.icon === 'Code' ? (
                          <Code className="w-4 h-4 text-[#00B386]" />
                        ) : prod.icon === 'Calendar' ? (
                          <Calendar className="w-4 h-4 text-amber-500" />
                        ) : (
                          <Layers className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-semibold">{prod.name}</div>
                        <div className={`text-[10px] ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                          {prod.desc}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
