import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Plus,
  RefreshCw,
  Landmark,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { SubNav } from '../../components/growclone/SubNav';
import { EmptyState } from '../../components/growclone/EmptyState';
import {
  POPULAR_FUNDS,
  FUND_COLLECTIONS,
} from '../../data/growcloneData';

interface SimulatedSIP {
  id: string;
  name: string;
  category: string;
  monthlyAmount: number;
  deductionDay: number;
  nextDate: string;
  status: 'ACTIVE' | 'PAUSED';
  totalInvested: number;
  currentValue: number;
  returnsPct: number;
}

const INITIAL_SIPS: SimulatedSIP[] = [
  {
    id: 'sip-1',
    name: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',
    category: 'Flexi Cap Fund',
    monthlyAmount: 5000,
    deductionDay: 5,
    nextDate: '05 Nov 2026',
    status: 'ACTIVE',
    totalInvested: 120000,
    currentValue: 152400,
    returnsPct: 27.0
  },
  {
    id: 'sip-2',
    name: 'Quant Small Cap Fund - Direct Plan - Growth',
    category: 'Small Cap Fund',
    monthlyAmount: 2500,
    deductionDay: 10,
    nextDate: '10 Nov 2026',
    status: 'ACTIVE',
    totalInvested: 90000,
    currentValue: 118620,
    returnsPct: 31.8
  },
  {
    id: 'sip-3',
    name: 'HDFC Mid-Cap Opportunities Fund - Direct Plan',
    category: 'Mid Cap Fund',
    monthlyAmount: 3000,
    deductionDay: 15,
    nextDate: '15 Nov 2026',
    status: 'ACTIVE',
    totalInvested: 80000,
    currentValue: 97500,
    returnsPct: 21.8
  }
];

export const MFExplorePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboardRoute = location.pathname.includes('/dashboard');
  const [activeTab, setActiveTab] = useState(isDashboardRoute ? 'Dashboard' : 'Explore');
  const [sips, setSips] = useState<SimulatedSIP[]>(INITIAL_SIPS);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const totalMFInvested = sips.reduce((acc, s) => acc + s.totalInvested, 0);
  const totalMFValue = sips.reduce((acc, s) => acc + s.currentValue, 0);
  const totalMFReturns = totalMFValue - totalMFInvested;
  const totalMFReturnsPct = (totalMFReturns / totalMFInvested) * 100;

  const handleToggleSip = (sipId: string) => {
    setSips(prev => prev.map(s => {
      if (s.id === sipId) {
        const nextStatus = s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
        setFeedbackMsg(`SIP for ${s.name.split('-')[0]} ${nextStatus === 'PAUSED' ? 'Paused' : 'Resumed'}.`);
        setTimeout(() => setFeedbackMsg(null), 3500);
        return { ...s, status: nextStatus };
      }
      return s;
    }));
  };

  const handleStepUpSip = (sipId: string) => {
    setSips(prev => prev.map(s => {
      if (s.id === sipId) {
        const newAmt = Math.round(s.monthlyAmount * 1.1 / 100) * 100;
        setFeedbackMsg(`Stepped up monthly installment to ₹${newAmt.toLocaleString('en-IN')}`);
        setTimeout(() => setFeedbackMsg(null), 3500);
        return { ...s, monthlyAmount: newAmt };
      }
      return s;
    }));
  };

  const handleInvestMore = (sipId: string) => {
    setSips(prev => prev.map(s => {
      if (s.id === sipId) {
        setFeedbackMsg(`Instant lump-sum investment of ₹5,000 confirmed for ${s.name.split('-')[0]}`);
        setTimeout(() => setFeedbackMsg(null), 3500);
        return {
          ...s,
          totalInvested: s.totalInvested + 5000,
          currentValue: s.currentValue + 5000
        };
      }
      return s;
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      {/* Sub-Nav */}
      <SubNav
        type="mf"
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'Explore') navigate('/mutual-funds/user/explore');
          else if (tab === 'Dashboard') navigate('/mutual-funds/dashboard');
        }}
      />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        {/* Toast / Feedback Notice */}
        {feedbackMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{feedbackMsg}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-white cursor-pointer">✕</button>
          </div>
        )}

        {/* MUTUAL FUNDS DASHBOARD VIEW */}
        {activeTab === 'Dashboard' ? (
          <div className="space-y-8">
            {/* Top Net Worth Banner */}
            <div className="bg-white dark:bg-[#151515] rounded-3xl border border-[#E8E8E8] dark:border-white/10 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#F0F0F0] dark:border-white/[0.08] gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#7C7E8C] uppercase tracking-wider block mb-1">
                    Mutual Funds Portfolio Value
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#44475B] dark:text-white font-mono">
                      ₹{totalMFValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] flex items-center gap-1 border border-emerald-500/20">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+₹{totalMFReturns.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (+{totalMFReturnsPct.toFixed(2)}%)</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('Explore');
                      navigate('/mutual-funds/user/explore');
                    }}
                    className="px-4 py-2.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Start New SIP</span>
                  </button>
                  <Link
                    to="/user/bank-autopay"
                    className="px-4 py-2.5 rounded-full border border-[#E8E8E8] dark:border-white/10 hover:border-[#00B386] text-xs font-bold text-[#44475B] dark:text-white hover:text-[#00B386] transition flex items-center gap-2 cursor-pointer"
                  >
                    <Landmark className="w-4 h-4 text-[#00B386]" />
                    <span>Autopay Mandate</span>
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div>
                  <span className="text-xs text-[#7C7E8C] block mb-1">Total Invested</span>
                  <span className="text-base font-bold text-[#44475B] dark:text-white font-mono">
                    ₹{totalMFInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#7C7E8C] block mb-1">Current Valuation</span>
                  <span className="text-base font-bold text-[#00B386] font-mono">
                    ₹{totalMFValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#7C7E8C] block mb-1">Total Returns</span>
                  <span className="text-base font-bold text-[#00B386] font-mono">
                    +₹{totalMFReturns.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#7C7E8C] block mb-1">1-Day Returns</span>
                  <span className="text-base font-bold text-[#00B386] font-mono">
                    +₹1,240.50 (+0.36%)
                  </span>
                </div>
              </div>
            </div>

            {/* Active SIPs Section */}
            <div className="bg-white dark:bg-[#151515] rounded-3xl border border-[#E8E8E8] dark:border-white/10 p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0F0F0] dark:border-white/[0.08]">
                <div>
                  <h3 className="font-bold text-base text-[#44475B] dark:text-white">
                    Active SIPs ({sips.length})
                  </h3>
                  <span className="text-xs text-[#7C7E8C]">Automated monthly investment debited via bank mandate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#00B386] font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Mandate: Active (HDFC Bank)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sips.map((sip) => (
                  <div
                    key={sip.id}
                    className="p-5 rounded-2xl border border-[#E8E8E8] dark:border-white/10 bg-[#FAFAFA] dark:bg-neutral-900/60 flex flex-col justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-sans">
                          {sip.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sip.status === 'ACTIVE'
                            ? 'bg-emerald-500/15 text-[#00B386] border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        }`}>
                          {sip.status}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-[#44475B] dark:text-white line-clamp-2 mb-3">
                        {sip.name}
                      </h4>

                      <div className="space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between text-[#7C7E8C]">
                          <span>Monthly SIP:</span>
                          <span className="font-bold text-[#44475B] dark:text-white">₹{sip.monthlyAmount.toLocaleString('en-IN')}/mo</span>
                        </div>
                        <div className="flex justify-between text-[#7C7E8C]">
                          <span>Next Date:</span>
                          <span className="font-bold text-[#44475B] dark:text-white">{sip.nextDate}</span>
                        </div>
                        <div className="flex justify-between text-[#7C7E8C]">
                          <span>Current Returns:</span>
                          <span className="font-bold text-[#00B386]">+{sip.returnsPct}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E8E8E8] dark:border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleToggleSip(sip.id)}
                        className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          sip.status === 'ACTIVE'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-[#00B386] dark:bg-emerald-950/40'
                        }`}
                      >
                        {sip.status === 'ACTIVE' ? (
                          <>
                            <PauseCircle className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleStepUpSip(sip.id)}
                        className="flex-1 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[11px] font-bold transition cursor-pointer"
                        title="Increase SIP by +10%"
                      >
                        Step-Up (+10%)
                      </button>

                      <button
                        onClick={() => handleInvestMore(sip.id)}
                        className="py-1.5 px-2.5 rounded-lg bg-[#00B386] hover:bg-[#009e75] text-white text-[11px] font-bold transition cursor-pointer"
                        title="Invest ₹5,000 Lumpsum now"
                      >
                        +₹5k
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* MUTUAL FUNDS EXPLORE VIEW */
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
                    <button
                      key={fund.id}
                      onClick={() => {
                        setActiveTab('Dashboard');
                        navigate('/mutual-funds/dashboard');
                      }}
                      className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 hover:border-[#00B386]/50 transition-all flex flex-col justify-between text-left cursor-pointer group"
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

                      <div className="pt-2 border-t border-[#F0F0F0] dark:border-white/[0.06] flex items-baseline justify-between w-full">
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
                    </button>
                  ))}
                </div>
              </section>

              {/* Section 2: Fund Collections */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#44475B] dark:text-white tracking-tight">
                    Collections
                  </h2>
                  <span className="text-xs text-[#7C7E8C]">Curated for your investment goals</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {FUND_COLLECTIONS.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setActiveTab('Dashboard');
                        navigate('/mutual-funds/dashboard');
                      }}
                      className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:border-[#00B386] hover:shadow-sm transition cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[#00B386] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        {c.icon === 'TrendingUp' && <TrendingUp className="w-5 h-5 text-[#00B386]" />}
                        {c.icon === 'Building2' && <Building2 className="w-5 h-5 text-[#00B386]" />}
                        {c.icon === 'PiggyBank' && <PiggyBank className="w-5 h-5 text-[#00B386]" />}
                        {c.icon === 'Coins' && <Coins className="w-5 h-5 text-[#00B386]" />}
                        {c.icon === 'Building' && <Building className="w-5 h-5 text-[#00B386]" />}
                        {c.icon === 'Home' && <Home className="w-5 h-5 text-[#00B386]" />}
                      </div>
                      <span className="text-xs font-bold text-[#44475B] dark:text-white group-hover:text-[#00B386] transition-colors leading-tight">
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN (~1/3) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Card 1: Your investments */}
              <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-[#F0F0F0] dark:border-white/[0.06] mb-3">
                  <h3 className="font-bold text-sm text-[#44475B] dark:text-white">
                    Your Investments
                  </h3>
                  <button
                    onClick={() => {
                      setActiveTab('Dashboard');
                      navigate('/mutual-funds/dashboard');
                    }}
                    className="text-xs font-bold text-[#00B386] hover:underline cursor-pointer"
                  >
                    View SIPs
                  </button>
                </div>

                <div className="space-y-3 font-mono">
                  <div className="p-3.5 rounded-xl bg-[#F8F8F8] dark:bg-neutral-800/50">
                    <span className="text-[11px] font-sans text-[#7C7E8C] block mb-1">Total Current Valuation</span>
                    <span className="text-xl font-black text-[#44475B] dark:text-white">₹3,48,520.00</span>
                    <span className="text-[11px] font-sans text-[#00B386] font-bold block mt-1">+₹58,520.00 (+20.18%)</span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('Dashboard');
                      navigate('/mutual-funds/dashboard');
                    }}
                    className="w-full py-2 rounded-xl bg-[#00B386] text-white text-xs font-bold hover:bg-[#009e75] transition cursor-pointer"
                  >
                    Open Mutual Funds Dashboard
                  </button>
                </div>
              </div>

              {/* Card 2: Products & Tools */}
              <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-sm text-[#44475B] dark:text-white mb-4 pb-2 border-b border-[#F0F0F0] dark:border-white/[0.06]">
                  Products and Tools
                </h3>

                <div className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06] text-xs">
                  <button
                    onClick={() => {
                      setActiveTab('Dashboard');
                      navigate('/mutual-funds/dashboard');
                    }}
                    className="w-full py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-2 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-[#00B386] flex items-center justify-center">
                        <Flame className="w-4 h-4 text-[#00B386]" />
                      </div>
                      <span className="font-medium text-[#44475B] dark:text-neutral-200">Active SIPs Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </button>

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
                    to="/bonds"
                    className="py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-2 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/30 text-purple-600 flex items-center justify-center">
                        <Scale className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-[#44475B] dark:text-neutral-200">Fixed Income Bonds</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
