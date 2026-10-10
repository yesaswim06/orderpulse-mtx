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
  StockItem
} from '../../data/growcloneData';
import { StockDetailModal } from '../../components/growclone/StockDetailModal';
import { HoldingsPortfolioView } from '../../components/growclone/HoldingsPortfolioView';

interface StocksExplorePageProps {
  walletBalance?: number;
  onOpenWallet?: () => void;
  onRefreshBalance?: () => void;
}

export const StocksExplorePage: React.FC<StocksExplorePageProps> = ({
  walletBalance = 1000000,
  onOpenWallet = () => {},
  onRefreshBalance = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('Explore');
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const navigate = useNavigate();

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const apiBase = isLocal ? '' : 'https://orderpulse-mtx.up.railway.app';

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
        {activeTab === 'Holdings' ? (
          <HoldingsPortfolioView
            walletBalance={walletBalance}
            onOpenWallet={onOpenWallet}
            onSelectStock={(sym) => {
              const match = MOST_BOUGHT_STOCKS.find(s => s.symbol === sym) || {
                id: `stock-${sym}`,
                symbol: sym,
                name: `${sym} Equity Share`,
                logo: sym.slice(0, 2),
                price: 100.00,
                change: 1.50,
                changePercent: 1.52,
                isPositive: true
              };
              setSelectedStock(match);
            }}
          />
        ) : activeTab === 'Positions' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-[#44475B] dark:text-white">Active Positions (MIS & CNC)</h2>
              <Link to="/stocks/user/positions" className="text-xs font-bold text-[#00B386] hover:underline">
                Full Positions Screen →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8E8E8] dark:border-white/10 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#44475B] dark:text-white">DEMO • Intraday (MIS)</div>
                  <div className="text-xs text-[#7C7E8C]">50 Qty @ ₹99.50 avg • LTP ₹100.00</div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-[#00B386]">+₹25.00 (+0.50%)</div>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] px-2 py-0.5 rounded font-bold">PROFIT</span>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-white dark:bg-[#141414] border border-[#E8E8E8] dark:border-white/10 shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#44475B] dark:text-white">TATASTEEL • Intraday (MIS)</div>
                  <div className="text-xs text-[#7C7E8C]">100 Qty @ ₹174.20 avg • LTP ₹173.80</div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-[#00B386]">+₹40.00 (+0.23%)</div>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] px-2 py-0.5 rounded font-bold">PROFIT</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'Orders' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-[#44475B] dark:text-white">Recent Execution Orders</h2>
              <Link to="/stocks/user/orders" className="text-xs font-bold text-[#00B386] hover:underline">
                Full Orders Book →
              </Link>
            </div>
            <div className="p-6 bg-white dark:bg-[#141414] rounded-2xl border border-[#E8E8E8] dark:border-white/10">
              <div className="flex items-center justify-between py-3 border-b border-[#E8E8E8] dark:border-white/10 text-xs">
                <div>
                  <span className="font-bold text-[#44475B] dark:text-white mr-2">DEMO</span>
                  <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] px-2 py-0.5 rounded">BUY</span>
                </div>
                <div className="font-mono text-[#44475B] dark:text-white">100 Qty @ ₹99.50</div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">FILLED</span>
              </div>
              <div className="flex items-center justify-between py-3 text-xs">
                <div>
                  <span className="font-bold text-[#44475B] dark:text-white mr-2">DEMO</span>
                  <span className="text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-[#EB5B3C] px-2 py-0.5 rounded">SELL</span>
                </div>
                <div className="font-mono text-[#44475B] dark:text-white">50 Qty @ ₹101.00</div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">PARTIAL (20/50)</span>
              </div>
            </div>
          </div>
        ) : activeTab === 'Watchlist' ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-[#44475B] dark:text-white">Saved Instruments</h2>
              <Link to="/stocks/user/watchlist" className="text-xs font-bold text-[#00B386] hover:underline">
                Manage Watchlist →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {MOST_BOUGHT_STOCKS.slice(0, 3).map((st) => (
                <div key={st.id} className="p-4 bg-white dark:bg-[#141414] rounded-2xl border border-[#E8E8E8] dark:border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#44475B] dark:text-white">{st.symbol}</div>
                    <div className="text-xs text-[#7C7E8C]">₹{st.price.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => setSelectedStock(st)}
                    className="px-3 py-1 rounded-full bg-[#00B386] text-white text-xs font-bold cursor-pointer hover:bg-[#009e75]"
                  >
                    Trade
                  </button>
                </div>
              ))}
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
                      onClick={() => navigate('/bonds')}
                      className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 hover:border-[#00B386]/50 transition-all group cursor-pointer"
                    >
                      {/* Logo square */}
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-neutral-800 border border-[#E8E8E8] dark:border-white/10 flex items-center justify-center font-bold text-xs text-[#44475B] dark:text-neutral-200 mb-3 group-hover:scale-105 transition-transform">
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
                  <Link to="/bonds" className="text-xs font-bold text-[#00B386] hover:text-[#009e75] inline-flex items-center gap-1 cursor-pointer">
                    <span>See more bonds & calculate yields</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
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
                      onClick={() => setSelectedStock(stock)}
                      className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 hover:shadow-lg hover:border-[#00B386]/40 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-[#00B386] font-bold text-xs flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                          {stock.logo}
                        </div>
                        <h3 className="font-bold text-xs text-[#44475B] dark:text-white line-clamp-1 mb-0.5 group-hover:text-[#00B386] transition-colors">
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
                        <div className="text-[11px] font-semibold text-[#00B386] flex items-center justify-between mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-[#00B386] opacity-0 group-hover:opacity-100 transition-opacity">
                            Trade
                          </span>
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
                      onClick={() => {
                        if (item.id === 'terminal') navigate('/trade');
                        else if (item.id === 'bonds') navigate('/bonds');
                        else if (item.id === 'ipo') navigate('/stocks/user/explore');
                        else if (item.id === 'etfs') navigate('/mutual-funds/user/explore');
                        else if (item.id === 'screener') navigate('/trade');
                      }}
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

      {/* Stock Buy / Sell Order Modal */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          apiBase={apiBase}
          walletBalance={walletBalance}
          onOrderSuccess={() => {
            onRefreshBalance();
          }}
        />
      )}
    </div>
  );
};
