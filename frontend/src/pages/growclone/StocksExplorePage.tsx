import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GrowNavbar } from '../../components/growclone/GrowNavbar';
import { IndexTickerStrip } from '../../components/growclone/IndexTickerStrip';
import { SubNav } from '../../components/growclone/SubNav';
import { EmptyState } from '../../components/growclone/EmptyState';
import { POPULAR_BONDS, MOST_BOUGHT_STOCKS, PRODUCTS_AND_TOOLS } from '../../data/mockStocks';
import {
  FileText,
  ShieldCheck,
  Layers,
  Search,
  Repeat,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface StocksExplorePageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const StocksExplorePage: React.FC<StocksExplorePageProps> = ({
  theme,
  onToggleTheme,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('Explore');
  const navigate = useNavigate();

  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText':
        return <FileText className="w-4 h-4 text-[#00B386]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-amber-500" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-blue-500" />;
      case 'Search':
        return <Search className="w-4 h-4 text-indigo-500" />;
      case 'Repeat':
        return <Repeat className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-teal-500" />;
    }
  };

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
        section="stocks"
        activeItem={activeSubTab}
        onSelectTab={(tab) => {
          setActiveSubTab(tab);
          if (tab === 'Orders') navigate('/trade');
        }}
        theme={theme}
      />

      {/* 4. Main Two-Column Layout */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (~2/3: 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Section 1: Popular Bonds */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                  Popular Bonds
                </h2>
              </div>

              {/* 4 Cards in a row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {POPULAR_BONDS.map((bond) => (
                  <div
                    key={bond.id}
                    className={`p-5 rounded-xl border flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#131824] border-[#222B3D] hover:border-[#33415C]'
                        : 'bg-white border-[#E8E8E8] hover:border-[#D0D0D0]'
                    }`}
                  >
                    <div>
                      {/* Logo square + Rating */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-[#00B386] font-bold text-xs flex items-center justify-center border border-emerald-500/20 font-mono">
                          {bond.logoText}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              bond.ratingColor === 'orange' ? 'bg-[#F5A623]' : 'bg-[#00B386]'
                            }`}
                          />
                          <span className={theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}>
                            {bond.rating}
                          </span>
                        </div>
                      </div>

                      <h3
                        className={`text-xs font-bold leading-tight line-clamp-2 min-h-[32px] ${
                          theme === 'dark' ? 'text-white' : 'text-[#222531]'
                        }`}
                      >
                        {bond.issuer}
                      </h3>
                      <div className={`text-[11px] mt-1 ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                        Maturity: {bond.maturity}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-inherit flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-[#7C7E8C] uppercase font-semibold">Yield</div>
                        <div className="text-sm font-extrabold text-[#00B386] font-mono">
                          {bond.yieldPercent}
                        </div>
                      </div>
                      <span className={`text-[11px] font-medium ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                        {bond.tenure}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <button
                  onClick={() => alert('Viewing all institutional bonds catalog')}
                  className="text-xs font-bold text-[#00B386] hover:underline flex items-center gap-1"
                >
                  <span>See more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Section 2: Most Bought Stocks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                  Most bought stocks
                </h2>
              </div>

              {/* 4 Cards in a row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {MOST_BOUGHT_STOCKS.map((stock) => (
                  <div
                    key={stock.id}
                    onClick={() => navigate('/trade')}
                    className={`p-5 rounded-xl border flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#131824] border-[#222B3D] hover:border-[#33415C]'
                        : 'bg-white border-[#E8E8E8] hover:border-[#D0D0D0]'
                    }`}
                  >
                    <div>
                      <div className={`w-9 h-9 rounded-lg ${stock.logoBg} text-white font-bold text-xs flex items-center justify-center mb-3 shadow-sm`}>
                        {stock.logoText}
                      </div>
                      <h3
                        className={`text-xs font-bold leading-tight truncate ${
                          theme === 'dark' ? 'text-white' : 'text-[#222531]'
                        }`}
                      >
                        {stock.name}
                      </h3>
                      <div className={`text-[10px] font-mono mt-0.5 ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                        {stock.symbol}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-inherit">
                      <div className="text-sm font-extrabold font-mono tabular-nums">
                        {stock.price}
                      </div>
                      <div className="text-[11px] font-semibold text-[#00B386] font-mono tabular-nums flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-3 h-3" />
                        <span>{stock.change} ({stock.changePercent})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <button
                  onClick={() => navigate('/trade')}
                  className="text-xs font-bold text-[#00B386] hover:underline flex items-center gap-1"
                >
                  <span>See more stocks in Trading Terminal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (~1/3: 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Card 1: Your investments empty state */}
            <EmptyState
              title="Your investments"
              subtitle="You haven't invested yet"
              theme={theme}
            />

            {/* Card 2: Products & Tools */}
            <div
              className={`p-5 rounded-2xl border transition-colors ${
                theme === 'dark' ? 'bg-[#131824] border-[#222B3D]' : 'bg-white border-[#E8E8E8]'
              }`}
            >
              <h3
                className={`text-sm font-bold tracking-tight mb-3 ${
                  theme === 'dark' ? 'text-white' : 'text-[#222531]'
                }`}
              >
                Products &amp; Tools
              </h3>

              <div className="divide-y divide-inherit">
                {PRODUCTS_AND_TOOLS.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      if (prod.name === 'ETFs' || prod.name === 'Intraday Screener') {
                        navigate('/trade');
                      }
                    }}
                    className={`py-3 flex items-center justify-between cursor-pointer transition ${
                      theme === 'dark' ? 'hover:bg-[#1A2234] -mx-2 px-2 rounded-lg' : 'hover:bg-[#F8F8F8] -mx-2 px-2 rounded-lg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        {getProductIcon(prod.icon)}
                      </div>
                      <span className="text-xs font-semibold">{prod.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {prod.pill && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#00B386] border border-emerald-200">
                          {prod.pill}
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
      </main>
    </div>
  );
};
