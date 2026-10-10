import React from 'react';
import { OrderBookSnapshot } from '../types';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface OrderBookViewProps {
  snapshot: OrderBookSnapshot | null;
}

export const OrderBookView: React.FC<OrderBookViewProps> = ({ snapshot }) => {
  if (!snapshot) {
    return (
      <div className="bg-trading-card border border-trading-border rounded-xl p-4 flex items-center justify-center h-80 text-slate-500">
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

  // Asks are traditionally displayed in reverse order (highest on top down to lowest best ask)
  const displayAsks = [...snapshot.asks].slice(0, 10).reverse();
  const displayBids = snapshot.bids.slice(0, 10);

  return (
    <div className="bg-trading-card border border-trading-border rounded-xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-trading-border">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>Order Book</span>
          <span className="text-[11px] font-mono font-normal text-cyan-400">DEMO/INR</span>
        </h2>
        <div className="text-xs text-slate-400 flex items-center gap-3">
          <span>Best Bid: <strong className="text-emerald-400 font-mono-numbers">₹{bestBidRs}</strong></span>
          <span>Best Ask: <strong className="text-rose-400 font-mono-numbers">₹{bestAskRs}</strong></span>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 text-[11px] font-semibold text-slate-400 py-2 border-b border-slate-800">
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
                  className="relative grid grid-cols-3 text-xs py-1 px-1 font-mono-numbers hover:bg-slate-800/50 rounded transition-colors group cursor-default"
                >
                  {/* Background Depth Bar */}
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-rose-500/15 group-hover:bg-rose-500/25 transition-all rounded-r"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="relative z-10 text-left font-medium text-rose-400">
                    {(ask.priceTicks / 100).toFixed(2)}
                  </span>
                  <span className="relative z-10 text-right text-slate-200">
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
        <div className="py-2.5 my-1 px-3 bg-slate-900/80 border-y border-slate-800 flex items-center justify-between text-xs font-mono-numbers">
          <div className="flex items-center gap-1 text-slate-300">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider">Spread:</span>
            <span className="font-bold text-white">₹{spreadRs}</span>
            <span className="text-slate-400 text-[11px]">({spreadTicks} ticks)</span>
          </div>
          <div className="text-[11px] text-slate-400">
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
                  className="relative grid grid-cols-3 text-xs py-1 px-1 font-mono-numbers hover:bg-slate-800/50 rounded transition-colors group cursor-default"
                >
                  {/* Background Depth Bar */}
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-emerald-500/15 group-hover:bg-emerald-500/25 transition-all rounded-r"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="relative z-10 text-left font-medium text-emerald-400">
                    {(bid.priceTicks / 100).toFixed(2)}
                  </span>
                  <span className="relative z-10 text-right text-slate-200">
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
