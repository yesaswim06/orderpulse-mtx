import React from 'react';
import { BreakerStatus, OrderBookSnapshot } from '../types';
import { ShieldCheck, Info, Clock, ArrowUpRight, Scale, CheckCircle2 } from 'lucide-react';

interface MarketsViewProps {
  breaker: BreakerStatus | null;
  snapshot: OrderBookSnapshot | null;
}

export const MarketsView: React.FC<MarketsViewProps> = ({ breaker, snapshot }) => {
  const refPrice = breaker ? breaker.referencePriceTicks / 100 : 100;
  const lowerBand = breaker ? breaker.lowerBandTicks / 100 : 95;
  const upperBand = breaker ? breaker.upperBandTicks / 100 : 105;

  const totalBidQty = snapshot?.bids.reduce((sum, b) => sum + b.totalQuantity, 0) || 0;
  const totalAskQty = snapshot?.asks.reduce((sum, a) => sum + a.totalQuantity, 0) || 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Symbol Hero Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">DEMO / INR</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                Continuous Auction Spot
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1.5">
              Simulated equity security with microsecond matching engine & volatility circuit breakers
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400">Anchor Reference</span>
              <div className="text-2xl font-bold font-mono-numbers text-sky-400">₹{refPrice.toFixed(2)}</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-right">
              <span className="text-xs text-slate-400">Status</span>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{breaker?.state || 'RUNNING'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Key Volatility Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="glass-card rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Valid Price Band (±5%)</span>
            <div className="text-lg font-bold font-mono-numbers text-white mt-1">
              ₹{lowerBand.toFixed(2)} – ₹{upperBand.toFixed(2)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Candidate trades outside band are blocked</span>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Mandatory Halt Duration</span>
            <div className="text-lg font-bold font-mono-numbers text-amber-400 mt-1">
              30 Seconds
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Cooling period before operator resume</span>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Resting Bid Liquidity</span>
            <div className="text-lg font-bold font-mono-numbers text-emerald-400 mt-1">
              {totalBidQty.toLocaleString()} shares
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">{snapshot?.bids.length || 0} active price levels</span>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <span className="text-xs text-slate-400 font-medium">Resting Ask Liquidity</span>
            <div className="text-lg font-bold font-mono-numbers text-rose-400 mt-1">
              {totalAskQty.toLocaleString()} shares
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">{snapshot?.asks.length || 0} active price levels</span>
          </div>
        </div>
      </div>

      {/* Contract Specifications & Circuit Breaker Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Specifications Table */}
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <Scale className="w-4 h-4 text-sky-400" />
            <span>Market Specifications</span>
          </h3>

          <div className="divide-y divide-white/[0.06] text-xs">
            <div className="py-3 flex justify-between">
              <span className="text-slate-400">Symbol</span>
              <span className="font-mono text-white font-semibold">DEMO</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-slate-400">Settlement Currency</span>
              <span className="font-mono text-white">INR (₹)</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-slate-400">Tick Granularity</span>
              <span className="font-mono text-white font-semibold">₹0.01 (1 Paisa = 1 Tick)</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-slate-400">Lot Size (Minimum Order)</span>
              <span className="font-mono text-white">1 Share</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-slate-400">Matching Algorithm</span>
              <span className="text-white">Strict Price–Time Priority (FIFO)</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-slate-400">Execution Price Policy</span>
              <span className="text-white">Resting Order Price Rule</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-slate-400">Partial Fill Support</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full Quantity Conservation
              </span>
            </div>
          </div>
        </div>

        {/* Volatility Circuit Breaker Demonstration Policy */}
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Volatility Circuit Breaker Rules</span>
          </h3>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="glass-card rounded-2xl p-4">
              <h4 className="font-semibold text-white mb-1">Pre-Execution Volatility Check</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Every candidate trade execution price is checked strictly before committing the fill. If the execution price would exceed the ±5% dynamic band, the fill is cancelled, earlier valid matches are preserved, and the engine enters HALTED state.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <h4 className="font-semibold text-white mb-1">State Machine Lifecycle</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono mt-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  RUNNING
                </div>
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
                  HALTED (30s)
                </div>
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  READY_TO_RESUME
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <h4 className="font-semibold text-white mb-1">Cancellations During Halt</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                While trading is halted, incoming new submissions are rejected, but cancellation of resting orders is explicitly permitted to allow market makers to adjust liquidity risk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
