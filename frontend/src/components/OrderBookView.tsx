import React from 'react';
import { OrderBookSnapshot } from '../types';

interface OrderBookViewProps {
  snapshot: OrderBookSnapshot | null;
}

export const OrderBookView: React.FC<OrderBookViewProps> = ({ snapshot }) => {
  if (!snapshot) {
    return (
      <div className="glass-panel rounded-2xl p-4 flex items-center justify-center h-80 text-slate-500">
        Loading order book...
      </div>
    );
  }

  const bestBidRs = snapshot.bestBidTicks !== null ? (snapshot.bestBidTicks / 100).toFixed(2) : '—';
  const bestAskRs = snapshot.bestAskTicks !== null ? (snapshot.bestAskTicks / 100).toFixed(2) : '—';
  const spreadRs = snapshot.spreadTicks !== null ? (snapshot.spreadTicks / 100).toFixed(2) : '—';
  const spreadTicks = snapshot.spreadTicks !== null ? snapshot.spreadTicks : '—';

  // Find max volume to scale background visualizer bars
  const maxAskQty = Math.max(1, ...snapshot.asks.map(a => a.totalQuantity));
  const maxBidQty = Math.max(1, ...snapshot.bids.map(b => b.totalQuantity));
  const maxOverall = Math.max(maxAskQty, maxBidQty);

  const displayAsks = [...snapshot.asks].slice(0, 10).reverse();
  const displayBids = snapshot.bids.slice(0, 10);

  return (
    <div className="glass-panel p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span>Order Book L2</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">DEMO/INR</span>
        </h2>
        <div className="text-xs text-slate-400 flex items-center gap-3">
          <span>Bid: <strong className="text-emerald-400 font-mono-numbers">₹{bestBidRs}</strong></span>
          <span>Ask: <strong className="text-rose-400 font-mono-numbers">₹{bestAskRs}</strong></span>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 text-[11px] font-semibold text-slate-400 py-2 border-b border-white/[0.06]">
        <span className="text-left">Price (₹)</span>
        <span className="text-right">Qty (Shares)</span>
        <span className="text-right">Orders</span>
      </div>

      <div className="flex-1 flex flex-col justify-between overflow-hidden py-1">
        {/* Asks (Sell Orders) - Red */}
        <div className="flex flex-col justify-end space-y-0.5 min-h-[140px]">
          {displayAsks.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-600">No resting asks</div>
          ) : (
            displayAsks.map((ask) => {
              const depthPct = Math.min(100, Math.round((ask.totalQuantity / maxOverall) * 100));
              return (
                <div
                  key={`ask-${ask.priceTicks}`}
                  className="relative grid grid-cols-3 text-xs py-1 px-1 font-mono-numbers hover:bg-white/[0.04] rounded-lg transition-colors group cursor-default"
                >
                  {/* Background Depth Bar */}
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-rose-500/20 to-transparent group-hover:from-rose-500/30 transition-all rounded-r"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="relative z-10 text-left font-semibold text-rose-400">
                    {(ask.priceTicks / 100).toFixed(2)}
                  </span>
                  <span className="relative z-10 text-right text-slate-200 font-medium">
                    {ask.totalQuantity.toLocaleString()}
                  </span>
                  <span className="relative z-10 text-right text-slate-400">
                    {ask.orderCount}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Spread Separator */}
        <div className="py-2 my-1 px-3 bg-white/[0.03] border-y border-white/[0.08] backdrop-blur-md rounded-lg flex items-center justify-between text-xs font-mono-numbers">
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Spread:</span>
            <span className="font-bold text-slate-100">₹{spreadRs}</span>
            <span className="text-sky-400 text-[11px]">({spreadTicks} ticks)</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            {snapshot.bestBidTicks && snapshot.bestAskTicks ? 'Market Open' : 'Waiting Liquidity'}
          </div>
        </div>

        {/* Bids (Buy Orders) - Green */}
        <div className="flex flex-col space-y-0.5 min-h-[140px]">
          {displayBids.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-600">No resting bids</div>
          ) : (
            displayBids.map((bid) => {
              const depthPct = Math.min(100, Math.round((bid.totalQuantity / maxOverall) * 100));
              return (
                <div
                  key={`bid-${bid.priceTicks}`}
                  className="relative grid grid-cols-3 text-xs py-1 px-1 font-mono-numbers hover:bg-white/[0.04] rounded-lg transition-colors group cursor-default"
                >
                  {/* Background Depth Bar */}
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-emerald-500/20 to-transparent group-hover:from-emerald-500/30 transition-all rounded-r"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="relative z-10 text-left font-semibold text-emerald-400">
                    {(bid.priceTicks / 100).toFixed(2)}
                  </span>
                  <span className="relative z-10 text-right text-slate-200 font-medium">
                    {bid.totalQuantity.toLocaleString()}
                  </span>
                  <span className="relative z-10 text-right text-slate-400">
                    {bid.orderCount}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
