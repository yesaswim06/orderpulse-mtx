import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ListOrdered,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Activity
} from 'lucide-react';
import { IndexTickerStrip } from '../../components/growclone/IndexTickerStrip';
import { SubNav } from '../../components/growclone/SubNav';
import { Order } from '../../types';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const apiBase = '';
      const res = await fetch(`${apiBase}/api/orders?userId=USER-DEMO-01`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch {
      // Fallback to sample orders if backend is unreachable
      setOrders([
        {
          orderId: 'ORD-DEMO-101',
          requestId: 'REQ-101',
          participantId: 'USER-DEMO-01',
          symbol: 'DEMO',
          side: 'BUY',
          priceTicks: 9950,
          originalQuantity: 100,
          remainingQuantity: 0,
          status: 'FILLED',
          acceptanceSequence: 1,
          timestampNs: (Date.now() - 3600000) * 1000000
        },
        {
          orderId: 'ORD-DEMO-102',
          requestId: 'REQ-102',
          participantId: 'USER-DEMO-01',
          symbol: 'DEMO',
          side: 'SELL',
          priceTicks: 10100,
          originalQuantity: 50,
          remainingQuantity: 30,
          status: 'PARTIALLY_FILLED',
          acceptanceSequence: 2,
          timestampNs: (Date.now() - 1800000) * 1000000
        },
        {
          orderId: 'ORD-DEMO-103',
          requestId: 'REQ-103',
          participantId: 'USER-DEMO-01',
          symbol: 'DEMO',
          side: 'BUY',
          priceTicks: 9900,
          originalQuantity: 25,
          remainingQuantity: 25,
          status: 'NEW',
          acceptanceSequence: 3,
          timestampNs: (Date.now() - 600000) * 1000000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (filterStatus === 'ALL') return true;
    return o.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      <IndexTickerStrip />
      <SubNav type="stocks" activeTab="Orders" onSelectTab={() => {}} />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#44475B] dark:text-white">
              Order History & Execution Book
            </h1>
            <p className="text-xs text-[#7C7E8C] mt-1">
              Deterministic FIFO order lifecycle, partial fills, cancellations, and PostgreSQL transaction commits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="p-2 rounded-xl border border-[#E8E8E8] dark:border-white/10 hover:bg-slate-50 dark:hover:bg-neutral-800 transition text-[#7C7E8C] cursor-pointer"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/trade"
              className="px-4 py-2 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Matching Terminal</span>
            </Link>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {['ALL', 'FILLED', 'PARTIAL', 'PENDING', 'CANCELLED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterStatus === st
                  ? 'bg-[#00B386] text-white'
                  : 'bg-slate-100 dark:bg-neutral-800 text-[#7C7E8C] hover:bg-slate-200 dark:hover:bg-neutral-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-[#141414] rounded-2xl border border-[#E8E8E8] dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] dark:bg-[#181A1B] text-[#7C7E8C] font-semibold border-b border-[#E8E8E8] dark:border-white/10">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                  <th className="py-3.5 px-3">Symbol</th>
                  <th className="py-3.5 px-3">Side</th>
                  <th className="py-3.5 px-3 text-right">Limit Price</th>
                  <th className="py-3.5 px-3 text-right">Filled / Total</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-3 text-right">Time</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E8E8] dark:divide-white/5 font-mono">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-[#7C7E8C] font-sans">
                      No orders matching selected status filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => {
                    const isBuy = ord.side === 'BUY';
                    const priceInr = (ord.priceTicks / 100).toFixed(2);
                    const filled = ord.originalQuantity - ord.remainingQuantity;
                    const dateMs = ord.timestampNs ? ord.timestampNs / 1000000 : Date.now();
                    const isCancellable = ord.status === 'NEW' || ord.status === 'PARTIALLY_FILLED';

                    return (
                      <tr key={ord.orderId} className="hover:bg-[#F9FAFB] dark:hover:bg-neutral-800/40 transition">
                        <td className="py-4 px-4 sm:px-6 font-bold text-[#44475B] dark:text-white">
                          {ord.orderId}
                        </td>
                        <td className="py-4 px-3 font-sans font-bold">
                          {ord.symbol}
                        </td>
                        <td className="py-4 px-3 font-sans">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isBuy
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386]'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-[#EB5B3C]'
                            }`}
                          >
                            {ord.side}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right font-bold text-[#44475B] dark:text-white">
                          ₹{priceInr}
                        </td>
                        <td className="py-4 px-3 text-right text-[#7C7E8C]">
                          <span className="font-bold text-[#44475B] dark:text-white">{filled}</span> / {ord.originalQuantity}
                        </td>
                        <td className="py-4 px-4 text-center font-sans">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === 'FILLED'
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386]'
                                : ord.status === 'PARTIALLY_FILLED'
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-500'
                                : ord.status === 'NEW'
                                ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-500'
                                : 'bg-neutral-100 dark:bg-neutral-800 text-[#7C7E8C]'
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right text-[#7C7E8C] text-[11px] font-sans">
                          {new Date(dateMs).toLocaleTimeString()}
                        </td>
                        <td className="py-4 px-4 sm:px-6 text-center font-sans">
                          {isCancellable ? (
                            <button
                              onClick={async () => {
                                try {
                                  const apiBase = '';
                                  const res = await fetch(`${apiBase}/api/orders/${ord.orderId}/cancel`, { method: 'POST' });
                                  if (res.ok) {
                                    setOrders(prev => prev.map(o => o.orderId === ord.orderId ? { ...o, status: 'CANCELLED' } : o));
                                  }
                                } catch {}
                              }}
                              className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold transition border border-rose-200 cursor-pointer"
                              title="Cancel Resting Order"
                            >
                              Cancel
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#7C7E8C]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
