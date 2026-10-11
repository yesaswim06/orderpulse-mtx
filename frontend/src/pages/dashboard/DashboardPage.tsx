import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Activity,
  Plus,
  Layers,
  ShoppingBag,
  Clock,
  Sparkles,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Landmark,
  FileText
} from 'lucide-react';
import { IndexTickerStrip } from '../../components/growclone/IndexTickerStrip';
import { SubNav } from '../../components/growclone/SubNav';
import { HoldingsPortfolioView } from '../../components/growclone/HoldingsPortfolioView';
import { StockDetailModal } from '../../components/growclone/StockDetailModal';
import { MOST_BOUGHT_STOCKS, StockItem } from '../../data/growcloneData';
import { useAuth } from '../../context/AuthContext';
import { getApiBase } from '../../config/api';

interface DashboardPageProps {
  walletBalance: number;
  onOpenWallet: () => void;
  onRefreshBalance: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  walletBalance,
  onOpenWallet,
  onRefreshBalance
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Holdings' | 'Positions' | 'Orders'>('Overview');
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Fetch live orders for recent orders feed
    const fetchOrders = async () => {
      try {
        const activeId = user?.userId || 'USER-DEMO-01';
        const res = await fetch(`${getApiBase()}/api/orders?userId=${activeId}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setRecentOrders(data);
        }
      } catch {}
    };
    fetchOrders();
  }, [user]);

  const totalInvestedStock = 39985;
  const totalCurrentStock = 40700;
  const stockPnL = totalCurrentStock - totalInvestedStock;

  const totalMFValue = 348520;
  const totalMFInvested = 290000;
  const mfPnL = totalMFValue - totalMFInvested;

  const totalPortfolioValue = totalCurrentStock + totalMFValue + walletBalance;
  const totalPnL = stockPnL + mfPnL;
  const totalPnLPct = ((totalPnL) / (totalInvestedStock + totalMFInvested)) * 100;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      {/* Live Index Ticker Strip */}
      <IndexTickerStrip />

      {/* Sub-Nav */}
      <SubNav
        type="stocks"
        activeTab="Holdings"
      />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8">
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#F0F0F0] dark:border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#00B386] uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                User Dashboard · MTX Demo
              </span>
              <span className="text-xs text-[#7C7E8C]">Client ID: USER-DEMO-01</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#44475B] dark:text-white tracking-tight">
              Investments & Portfolio Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenWallet}
              className="px-4 py-2.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add Money (UPI)</span>
            </button>
            <Link
              to="/trade"
              className="px-4 py-2.5 rounded-full border border-[#E8E8E8] dark:border-white/10 hover:border-[#00B386] text-xs font-bold text-[#44475B] dark:text-white hover:text-[#00B386] transition flex items-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-[#00B386]" />
              <span>Matching Terminal</span>
            </Link>
          </div>
        </div>

        {/* Master Account Net Worth Banner */}
        <div className="bg-gradient-to-br from-[#00B386]/10 via-[#00B386]/5 to-transparent border border-[#00B386]/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <span className="text-xs font-bold text-[#7C7E8C] uppercase tracking-wider block">
                Total Portfolio Net Worth (Holdings + Cash)
              </span>
              <div className="flex items-baseline gap-4 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#44475B] dark:text-white font-mono">
                  ₹{totalPortfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs sm:text-sm font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-[#00B386] flex items-center gap-1 border border-emerald-500/30">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+₹{totalPnL.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (+{totalPnLPct.toFixed(2)}%)</span>
                </span>
              </div>
              <p className="text-xs text-[#7C7E8C]">
                Calculated in real-time across Continuous Equity, Direct Mutual Funds, and Virtual Wallet cash reserves.
              </p>
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-3 font-mono">
              <div className="bg-white/80 dark:bg-neutral-900/80 p-3.5 rounded-2xl border border-[#E8E8E8] dark:border-white/10 backdrop-blur-sm">
                <span className="text-[11px] font-sans text-[#7C7E8C] block mb-0.5">Available Cash</span>
                <span className="text-base font-bold text-[#44475B] dark:text-white">
                  ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-white/80 dark:bg-neutral-900/80 p-3.5 rounded-2xl border border-[#E8E8E8] dark:border-white/10 backdrop-blur-sm">
                <span className="text-[11px] font-sans text-[#7C7E8C] block mb-0.5">Mutual Funds</span>
                <span className="text-base font-bold text-[#00B386]">
                  ₹{totalMFValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-white/80 dark:bg-neutral-900/80 p-3.5 rounded-2xl border border-[#E8E8E8] dark:border-white/10 backdrop-blur-sm">
                <span className="text-[11px] font-sans text-[#7C7E8C] block mb-0.5">Equity Holdings</span>
                <span className="text-base font-bold text-[#44475B] dark:text-white">
                  ₹{totalCurrentStock.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-white/80 dark:bg-neutral-900/80 p-3.5 rounded-2xl border border-[#E8E8E8] dark:border-white/10 backdrop-blur-sm">
                <span className="text-[11px] font-sans text-[#7C7E8C] block mb-0.5">1-Day Returns</span>
                <span className="text-base font-bold text-[#00B386]">
                  +₹1,940.50
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-[#F0F0F0] dark:border-white/[0.08] pb-3 overflow-x-auto scrollbar-none">
          {(['Overview', 'Holdings', 'Positions', 'Orders'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#00B386] text-white shadow-sm'
                  : 'bg-[#F8F8F8] dark:bg-neutral-800 text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
          <Link
            to="/mutual-funds/dashboard"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F8F8F8] dark:bg-neutral-800 text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Mutual Funds SIPs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab Content 1: Overview */}
        {activeTab === 'Overview' && (
          <div className="space-y-8">
            {/* Quick Trade / Popular Stocks Row */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-[#44475B] dark:text-white">
                  Quick Trade Stocks (Tap to place instant order)
                </h3>
                <Link to="/stocks/user/explore" className="text-xs font-bold text-[#00B386] hover:underline">
                  View all stocks →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {MOST_BOUGHT_STOCKS.slice(0, 6).map((stock) => (
                  <div
                    key={stock.id}
                    onClick={() => setSelectedStock(stock)}
                    className="p-3.5 rounded-2xl bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 hover:border-[#00B386] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] font-bold text-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        {stock.logo || stock.symbol.slice(0, 2)}
                      </div>
                      <span className="font-bold text-xs text-[#44475B] dark:text-white truncate">
                        {stock.symbol}
                      </span>
                    </div>

                    <div className="font-mono">
                      <div className="text-xs font-bold text-[#44475B] dark:text-white">
                        ₹{stock.price.toFixed(2)}
                      </div>
                      <div className={`text-[10px] font-semibold ${stock.changePercent >= 0 ? 'text-[#00B386]' : 'text-[#EB5B3C]'}`}>
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Holdings Portfolio Table */}
            <HoldingsPortfolioView
              walletBalance={walletBalance}
              onOpenWallet={onOpenWallet}
              onSelectStock={(sym) => {
                const stock = MOST_BOUGHT_STOCKS.find(s => s.symbol === sym) || {
                  id: sym.toLowerCase(),
                  symbol: sym,
                  name: `${sym} Equity`,
                  logo: sym.slice(0, 2),
                  price: 100,
                  change: 1.5,
                  changePercent: 1.5,
                  isPositive: true
                };
                setSelectedStock(stock);
              }}
            />
          </div>
        )}

        {/* Tab Content 2: Holdings */}
        {activeTab === 'Holdings' && (
          <HoldingsPortfolioView
            walletBalance={walletBalance}
            onOpenWallet={onOpenWallet}
            onSelectStock={(sym) => {
              const stock = MOST_BOUGHT_STOCKS.find(s => s.symbol === sym) || {
                id: sym.toLowerCase(),
                symbol: sym,
                name: `${sym} Equity`,
                logo: sym.slice(0, 2),
                price: 100,
                change: 1.5,
                changePercent: 1.5,
                isPositive: true
              };
              setSelectedStock(stock);
            }}
          />
        )}

        {/* Tab Content 3: Positions */}
        {activeTab === 'Positions' && (
          <div className="bg-white dark:bg-[#151515] rounded-2xl border border-[#E8E8E8] dark:border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0F0F0] dark:border-white/[0.08]">
              <div>
                <h3 className="font-bold text-base text-[#44475B] dark:text-white">
                  Intraday & F&O Positions (1 Active)
                </h3>
                <span className="text-xs text-[#7C7E8C]">Auto-square off at 3:15 PM</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#00B386] bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                P&L: +₹380.00
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#F8F8F8] dark:bg-neutral-800/50 text-[#7C7E8C] text-[11px] uppercase">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Instrument</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Avg Price</th>
                    <th className="p-3 text-right">LTP</th>
                    <th className="p-3 text-right">P&L</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06]">
                  <tr>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-sans">MIS</span>
                    </td>
                    <td className="p-3 font-bold text-[#44475B] dark:text-white">
                      DEMO (OrderPulse Spot)
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[#00B386]">+50</td>
                    <td className="p-3 text-right font-mono text-[#7C7E8C]">₹99.50</td>
                    <td className="p-3 text-right font-mono font-bold text-[#44475B] dark:text-white">₹100.00</td>
                    <td className="p-3 text-right font-mono font-bold text-[#00B386]">+₹25.00 (+0.50%)</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => navigate('/trade')}
                        className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold border border-rose-200 transition cursor-pointer"
                      >
                        Exit / Square Off
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 4: Orders */}
        {activeTab === 'Orders' && (
          <div className="bg-white dark:bg-[#151515] rounded-2xl border border-[#E8E8E8] dark:border-white/10 p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0F0F0] dark:border-white/[0.08]">
              <div>
                <h3 className="font-bold text-base text-[#44475B] dark:text-white">
                  Order History & Open Book
                </h3>
                <span className="text-xs text-[#7C7E8C]">Direct audit trail from C++ matching sequencer</span>
              </div>
              <Link
                to="/stocks/user/orders"
                className="text-xs font-bold text-[#00B386] hover:underline"
              >
                View full order log →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#F8F8F8] dark:bg-neutral-800/50 text-[#7C7E8C] text-[11px] uppercase">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Instrument</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06]">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((ord: any) => (
                      <tr key={ord.orderId}>
                        <td className="p-3 font-mono text-slate-400">{ord.orderId}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ord.side === 'BUY' ? 'bg-emerald-50 text-[#00B386]' : 'bg-rose-50 text-[#EB5B3C]'}`}>
                            {ord.side}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-[#44475B] dark:text-white">{ord.symbol}</td>
                        <td className="p-3 text-right font-mono">₹{(ord.priceTicks / 100).toFixed(2)}</td>
                        <td className="p-3 text-right font-mono font-bold">{ord.quantity}</td>
                        <td className="p-3 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {ord.status || 'FILLED'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-[#7C7E8C]">
                        No recent orders. Click "Quick Trade Stocks" or "Matching Terminal" to place an order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Stock Detail & Order Placement Modal */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          apiBase=""
          walletBalance={walletBalance}
          onOrderSuccess={() => {
            setSelectedStock(null);
            onRefreshBalance();
          }}
        />
      )}
    </div>
  );
};
