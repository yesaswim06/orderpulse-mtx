import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Coins,
  Building2,
  Building,
  Home,
  PiggyBank,
  ChevronRight,
  Flame,
  FileCheck,
  Scale,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SubNav } from '../../components/growclone/SubNav';
import { EmptyState } from '../../components/growclone/EmptyState';
import {
  POPULAR_FUNDS,
  FUND_COLLECTIONS,
} from '../../data/growcloneData';

export const MFExplorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Explore');

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      {/* Sub-Nav */}
      <SubNav
        type="mf"
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (~2/3) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* Section 1: Popular Funds */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#44475B] dark:text-white tracking-tight">
                  Popular Funds
                </h2>
                <span className="text-xs text-[#7C7E8C]">Highest 3-year performance</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {POPULAR_FUNDS.map((fund) => (
                  <Link
                    key={fund.id}
                    to="/mutual-funds/dashboard"
                    className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 hover:border-[#00B386]/50 transition-all flex flex-col justify-between cursor-pointer group"
                    title={`View ${fund.name} performance dashboard`}
                  >
                    <div>
                      {/* Fund logo */}
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 font-bold text-xs flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        {fund.logo}
                      </div>
                      <h3 className="font-bold text-xs text-[#44475B] dark:text-white line-clamp-2 mb-1 leading-snug group-hover:text-[#00B386] transition-colors">
                        {fund.name}
                      </h3>
                      <span className="text-[10px] text-[#7C7E8C] block mb-3">{fund.category}</span>
                    </div>

                    <div className="pt-2 border-t border-[#F0F0F0] dark:border-white/[0.06] flex items-baseline justify-between">
                      <div>
                        <span className="text-base font-extrabold text-[#00B386] font-mono">
                          {fund.returns3Y}
                        </span>
                        <span className="text-[10px] text-[#7C7E8C] block">Annualized</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#7C7E8C] bg-[#F8F8F8] dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                        3Y
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-3">
                <button className="text-xs font-bold text-[#00B386] hover:text-[#009e75] flex items-center gap-1 cursor-pointer">
                  <span>All Mutual Funds</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>

            {/* Section 2: Collections */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#44475B] dark:text-white tracking-tight">
                  Collections
                </h2>
                <span className="text-xs text-[#7C7E8C]">Curated for your investment goals</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
                {FUND_COLLECTIONS.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-md hover:border-[#00B386]/40 transition-all cursor-pointer group"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl ${c.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}
                    >
                      {c.id === 'high-return' && <TrendingUp className="w-6 h-6" />}
                      {c.id === 'sip-100' && <PiggyBank className="w-6 h-6" />}
                      {c.id === 'gold-silver' && <Coins className="w-6 h-6" />}
                      {c.id === 'large-cap' && <Building2 className="w-6 h-6" />}
                      {c.id === 'mid-cap' && <Building className="w-6 h-6" />}
                      {c.id === 'small-cap' && <Home className="w-6 h-6" />}
                    </div>
                    <span className="font-bold text-xs text-[#44475B] dark:text-white leading-tight">
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Funds by OrderPulse */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[#44475B] dark:text-white tracking-tight">
                  Funds by OrderPulse
                </h2>
                <span className="text-xs text-[#7C7E8C]">Index & algorithmic portfolios</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'OrderPulse Nifty 50 Index Fund', returns: '+18.40%', logo: 'OP50' },
                  { name: 'OrderPulse Nifty Next 50 ETF', returns: '+21.20%', logo: 'OPNN' },
                  { name: 'OrderPulse Ultra Short Duration', returns: '+7.85%', logo: 'OPUS' },
                  { name: 'OrderPulse Silver ETF FoF', returns: '+28.90%', logo: 'OPSV' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[#00B386] font-extrabold text-xs flex items-center justify-center mb-3">
                        {item.logo}
                      </div>
                      <h4 className="font-bold text-xs text-[#44475B] dark:text-white line-clamp-2 mb-2">
                        {item.name}
                      </h4>
                    </div>
                    <div className="pt-2 border-t border-[#F0F0F0] dark:border-white/[0.06] flex items-baseline justify-between">
                      <span className="text-sm font-extrabold text-[#00B386] font-mono">
                        {item.returns}
                      </span>
                      <span className="text-[10px] text-[#7C7E8C]">1Y Return</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (~1/3) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Card 1: Your investments empty-state */}
            <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0] dark:border-white/[0.06] mb-3">
                <h3 className="font-bold text-sm text-[#44475B] dark:text-white">
                  Your Investments
                </h3>
                <Link to="/stocks/user/holdings" className="text-xs font-bold text-[#00B386] hover:underline cursor-pointer">
                  Holdings
                </Link>
              </div>

              <EmptyState
                title="No active SIPs found"
                description="Start automated investing in top-performing index and equity funds with zero commission."
                actionText="Explore Portfolio"
                onAction={() => window.location.href = '/stocks/user/holdings'}
              />
            </div>

            {/* Card 2: Products & Tools */}
            <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-sm text-[#44475B] dark:text-white mb-4 pb-2 border-b border-[#F0F0F0] dark:border-white/[0.06]">
                Products and Tools
              </h3>

              <div className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06] text-xs">
                <Link
                  to="/mutual-funds/dashboard"
                  className="py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-2 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-[#00B386] flex items-center justify-center">
                      <Flame className="w-4 h-4 text-[#00B386]" />
                    </div>
                    <span className="font-medium text-[#44475B] dark:text-neutral-200">NFO Live</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00B386]/10 text-[#00B386] border border-[#00B386]/20">
                      8 open
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </div>
                </Link>

                <Link
                  to="/trade"
                  className="py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-2 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-[#44475B] dark:text-neutral-200">Continuous Engine</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                </Link>

                <Link
                  to="/stocks/user/orders"
                  className="py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-2 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-[#44475B] dark:text-neutral-200">Audit Reports</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                </Link>

                <Link
                  to="/bonds"
                  className="py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-2 rounded-xl transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-[#44475B] dark:text-neutral-200">Compare with Bonds</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
