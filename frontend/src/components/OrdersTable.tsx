import React from 'react';
import { Order } from '../types';
import { X } from 'lucide-react';

interface OrdersTableProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => Promise<void>;
  cancellingId: string | null;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onCancelOrder,
  cancellingId,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-4 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Order Activity & Resting Cancellations
        </h3>
        <span className="text-xs text-cyan-400 font-mono font-semibold">
          {orders.length} Orders
        </span>
      </div>

      <div className="overflow-x-auto flex-1 max-h-[300px]">
        <table className="w-full text-left text-xs font-mono-numbers">
          <thead className="text-[11px] font-semibold text-slate-400 border-b border-white/[0.08] sticky top-0 bg-[#0c1322]/80 backdrop-blur-md">
            <tr>
              <th className="py-2.5 px-2">Order ID</th>
              <th className="py-2.5 px-2">Side</th>
              <th className="py-2.5 px-2">Price (₹)</th>
              <th className="py-2.5 px-2 text-right">Orig Qty</th>
              <th className="py-2.5 px-2 text-right">Remaining</th>
              <th className="py-2.5 px-2">Status</th>
              <th className="py-2.5 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                  No orders entered yet
                </td>
              </tr>
            ) : (
              orders.slice(0, 30).map((o) => {
                const canCancel =
                  o.remainingQuantity > 0 &&
                  (o.status === 'NEW' || o.status === 'PARTIALLY_FILLED');

                return (
                  <tr key={o.orderId} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-2 px-2 text-slate-300 font-medium">
                      {o.orderId}
                    </td>
                    <td className="py-2 px-2 font-bold">
                      <span className={o.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
                        {o.side}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-slate-200">
                      ₹{(o.priceTicks / 100).toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-right text-slate-400">
                      {o.originalQuantity}
                    </td>
                    <td className="py-2 px-2 text-right font-bold text-white">
                      {o.remainingQuantity}
                    </td>
                    <td className="py-2 px-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${
                        o.status === 'FILLED'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : o.status === 'PARTIALLY_FILLED'
                          ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                          : o.status === 'CANCELLED'
                          ? 'bg-slate-700/30 text-slate-400 border-white/5'
                          : o.status === 'REJECTED'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      {canCancel ? (
                        <button
                          onClick={() => onCancelOrder(o.orderId)}
                          disabled={cancellingId === o.orderId}
                          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-rose-200 text-[10px] font-semibold transition cursor-pointer disabled:opacity-50 inline-flex items-center gap-1 backdrop-blur-md hover:scale-[1.05]"
                          title="Cancel resting quantity"
                        >
                          <X className="w-3 h-3" />
                          <span>{cancellingId === o.orderId ? '...' : 'Cancel'}</span>
                        </button>
                      ) : (
                        <span className="text-slate-600 text-[10px]">—</span>
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
  );
};
