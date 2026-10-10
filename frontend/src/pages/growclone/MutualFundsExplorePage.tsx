import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrowNavbar } from '../../components/growclone/GrowNavbar';
import { SubNav } from '../../components/growclone/SubNav';
import { EmptyState } from '../../components/growclone/EmptyState';
import {
  POPULAR_FUNDS,
  FUND_COLLECTIONS,
  FUNDS_BY_GROWCLONE,
  MF_PRODUCTS,
} from '../../data/mockMutualFunds';
import {
  TrendingUp,
  Coins,
  Sparkles,
  Building2,
  BarChart2,
  Rocket,
  ChevronRight,
  Radio,
  Download,
  FileSpreadsheet,
  GitCompare,
} from 'lucide-react';

interface MutualFundsExplorePageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const MutualFundsExplorePage: React.FC<MutualFundsExplorePageProps> = ({
  theme,
  onToggleTheme,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('Explore');
  const navigate = useNavigate();

  const getCollectionIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'Coins':
        return <Coins className="w-5 h-5 text-blue-500" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-indigo-500" />;
      case 'BarChart2':
        return <BarChart2 className="w-5 h-5 text-teal-500" />;
      default:
        return <Rocket className="w-5 h-5 text-rose-500" />;
    }
  };

  const getMfIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
        return <Radio className="w-4 h-4 text-emerald-500" />;
      case 'Download':
        return <Download className="w-4 h-4 text-blue-500" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-4 h-4 text-purple-500" />;
      default:
        return <GitCompare className="w-4 h-4 text-amber-500" />;
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

      {/* 2. Section Sub-Nav (no ticker on MF per spec) */}
      <SubNav
        section="mf"
        activeItem={activeSubTab}
        onSelectTab={(tab) => {
          setActiveSubTab(tab);
          if (tab === 'Dashboard') navigate('/trade');
        }}
        theme={theme}
      />

      {/* 3. Main Two-Column Layout */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (~2/3: 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Section 1: Popular Funds */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                  Popular Funds
                </h2>
              </div>

              {/* 4 Cards in a row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {POPULAR_FUNDS.map((fund) => (
                  <div
                    key={fund.id}
                    className={`p-5 rounded-xl border flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#131824] border-[#222B3D] hover:border-[#33415C]'
                        : 'bg-white border-[#E8E8E8] hover:border-[#D0D0D0]'
                    }`}
                  >
                    <div>
                      <div className={`w-9 h-9 rounded-lg ${fund.logoBg} text-white font-bold text-xs flex items-center justify-center mb-3 shadow-sm`}>
                        {fund.logoText}
                      </div>
                      <h3 className={`text-xs font-bold leading-tight line-clamp-2 min-h-[32px] ${
                        theme === 'dark' ? 'text-white' : 'text-[#222531]'
                      }`}>
                        {fund.name}
                      </h3>
                      <div className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                        {fund.category}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-inherit flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-[#7C7E8C] uppercase font-semibold">3Y Return</div>
                        <div className="text-sm font-extrabold text-[#00B386] font-mono tabular-nums">
                          {fund.returns3Y}
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                        3Y
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <button
                  onClick={() => alert('Exploring full mutual fund catalogue')}
                  className="text-xs font-bold text-[#00B386] hover:underline flex items-center gap-1"
                >
                  <span>All Mutual Funds</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Section 2: Collections */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                  Collections
                </h2>
              </div>

              {/* 6 Rounded Square Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
                {FUND_COLLECTIONS.map((col) => (
                  <div
                    key={col.id}
                    className={`p-4 rounded-xl border flex flex-col items-center text-center justify-center transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer aspect-square ${
                      theme === 'dark'
                        ? 'bg-[#131824] border-[#222B3D] hover:border-[#33415C]'
                        : 'bg-white border-[#E8E8E8] hover:border-[#D0D0D0]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2.5 ${col.color}`}>
                      {getCollectionIcon(col.icon)}
                    </div>
                    <span className={`text-xs font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                      {col.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Funds by GrowClone */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                  Funds by GrowClone
                </h2>
              </div>

              {/* Row of 4 cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {FUNDS_BY_GROWCLONE.map((gfund) => (
                  <div
                    key={gfund.id}
                    className={`p-5 rounded-xl border flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#131824] border-[#222B3D] hover:border-[#33415C]'
                        : 'bg-white border-[#E8E8E8] hover:border-[#D0D0D0]'
                    }`}
                  >
                    <div>
                      <div className={`w-9 h-9 rounded-lg ${gfund.logoBg} text-white font-bold text-xs flex items-center justify-center mb-3 shadow-sm`}>
                        {gfund.logoText}
                      </div>
                      <h3 className={`text-xs font-bold leading-tight line-clamp-2 min-h-[32px] ${
                        theme === 'dark' ? 'text-white' : 'text-[#222531]'
                      }`}>
                        {gfund.name}
                      </h3>
                      <div className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                        {gfund.category}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-inherit flex items-end justify-between">
                      <div>
                        <div className="text-[10px] text-[#7C7E8C] uppercase font-semibold">3Y Return</div>
                        <div className="text-sm font-extrabold text-[#00B386] font-mono tabular-nums">
                          {gfund.returns3Y}
                        </div>
                      </div>
                      <span className={`text-[11px] font-bold ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                        Direct
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (~1/3: 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Card 1: Your investments empty state */}
            <EmptyState
              title="Your Investments"
              subtitle="You haven't invested yet"
              theme={theme}
            />

            {/* Card 2: Products & Tools */}
            <div
              className={`p-5 rounded-2xl border transition-colors ${
                theme === 'dark' ? 'bg-[#131824] border-[#222B3D]' : 'bg-white border-[#E8E8E8]'
              }`}
            >
              <h3 className={`text-sm font-bold tracking-tight mb-3 ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                Products and Tools
              </h3>

              <div className="divide-y divide-inherit">
                {MF_PRODUCTS.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => alert(`Opening ${prod.name}`)}
                    className={`py-3 flex items-center justify-between cursor-pointer transition ${
                      theme === 'dark' ? 'hover:bg-[#1A2234] -mx-2 px-2 rounded-lg' : 'hover:bg-[#F8F8F8] -mx-2 px-2 rounded-lg'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        {getMfIcon(prod.icon)}
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
