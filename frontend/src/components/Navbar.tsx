import React from 'react';
import {
  Activity,
  ShieldAlert,
  Wifi,
  WifiOff,
  Settings,
  Zap,
  BarChart2,
  Database,
  Layers,
  FileCode2,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { BreakerStatus, EngineMetrics, OrderBookSnapshot } from '../types';

interface NavbarProps {
  currentTab: 'trade' | 'markets' | 'performance' | 'database' | 'docs';
  onSelectTab: (tab: 'trade' | 'markets' | 'performance' | 'database' | 'docs') => void;
  breaker: BreakerStatus | null;
  metrics: EngineMetrics | null;
  snapshot: OrderBookSnapshot | null;
  isConnected: boolean;
  backendTarget: 'railway' | 'local';
  onToggleTarget: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  breaker,
  metrics,
  snapshot,
  isConnected,
  backendTarget,
  onToggleTarget,
  onOpenAdmin,
}) => {
  const state = breaker?.state || 'RUNNING';
  const midPrice = snapshot?.bestBidTicks && snapshot?.bestAskTicks
    ? ((snapshot.bestBidTicks + snapshot.bestAskTicks) / 200).toFixed(2)
    : '100.00';

  return (
    <header className="sticky top-0 z-50 bg-[#080d1a]/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-sm">
      {/* Main Top Nav */}
      <div className="max-w-[1920px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Platform Navigation Tabs */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab('trade')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-950/40 border border-white/10">
              <Zap className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">OrderPulse</span>
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">MTX</span>
              </div>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Trading Simulation</span>
            </div>
          </div>

          {/* Navigation Links (Real platform layout) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
            <button
              onClick={() => onSelectTab('trade')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentTab === 'trade'
                  ? 'bg-white/[0.08] text-white font-semibold border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trade</span>
            </button>

            <button
              onClick={() => onSelectTab('markets')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentTab === 'markets'
                  ? 'bg-white/[0.08] text-white font-semibold border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Markets</span>
            </button>

            <button
              onClick={() => onSelectTab('performance')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentTab === 'performance'
                  ? 'bg-white/[0.08] text-white font-semibold border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Performance</span>
            </button>

            <button
              onClick={() => onSelectTab('database')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentTab === 'database'
                  ? 'bg-white/[0.08] text-white font-semibold border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>PostgreSQL Audit</span>
            </button>

            <button
              onClick={() => onSelectTab('docs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                currentTab === 'docs'
                  ? 'bg-white/[0.08] text-white font-semibold border border-white/10 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>API & Docs</span>
            </button>
          </nav>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Engine Breaker Status Pill */}
          {state === 'RUNNING' && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Engine Active</span>
            </div>
          )}
          {state === 'HALTED' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Halted ({breaker?.remainingHaltSeconds}s)</span>
            </div>
          )}
          {state === 'READY_TO_RESUME' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Ready to Resume</span>
            </div>
          )}

          {/* Backend Host Switcher */}
          <button
            onClick={onToggleTarget}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition-all cursor-pointer text-[11px] font-medium"
            title="Click to toggle backend between Railway Cloud and Local Host"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${backendTarget === 'railway' ? 'bg-purple-400' : 'bg-cyan-400'}`} />
            <span>{backendTarget === 'railway' ? 'Railway Cloud' : 'Local Host'}</span>
          </button>

          {/* WebSocket Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] ${
            isConnected
              ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-950/30 border-rose-500/20 text-rose-400'
          }`}>
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span className="hidden sm:inline">{isConnected ? 'WS Online' : 'Offline'}</span>
          </div>

          {/* Simulated Wallet Balance */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.07] text-slate-300 font-mono-numbers text-[11px]">
            <Wallet className="w-3 h-3 text-slate-400" />
            <span>₹1,000,000</span>
          </div>

          {/* Operator Settings */}
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] transition cursor-pointer"
            title="Operator Panel & Administrative Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-Header Live Market Ticker Strip (Like Real Exchanges) */}
      <div className="bg-[#050811]/90 border-t border-white/[0.05] px-4 py-1.5 text-xs text-slate-400 flex items-center justify-between overflow-x-auto gap-6 scrollbar-none font-mono-numbers">
        <div className="flex items-center gap-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">DEMO / INR</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.05] text-slate-300 border border-white/10 font-sans">Spot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Mid Price:</span>
            <span className="font-bold text-white text-sm">₹{midPrice}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Band (±5%):</span>
            <span className="text-slate-200 text-xs">
              ₹{(breaker?.lowerBandTicks ? breaker.lowerBandTicks / 100 : 95).toFixed(2)} – ₹{(breaker?.upperBandTicks ? breaker.upperBandTicks / 100 : 105).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Anchor Ref:</span>
            <span className="text-sky-400 text-xs font-semibold">
              ₹{(breaker?.referencePriceTicks ? breaker.referencePriceTicks / 100 : 100).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Spread:</span>
            <span className="text-slate-300 text-xs">
              {snapshot && snapshot.spreadTicks !== null ? `₹${(snapshot.spreadTicks / 100).toFixed(2)} (${snapshot.spreadTicks} ticks)` : '—'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 text-[11px]">
          <div>
            <span className="text-slate-500">Latency p50:</span>{' '}
            <span className="text-emerald-400 font-semibold">{metrics?.p50LatencyMicros ? metrics.p50LatencyMicros.toFixed(1) : '2.1'} µs</span>
          </div>
          <div>
            <span className="text-slate-500">Throughput:</span>{' '}
            <span className="text-purple-400 font-semibold">{metrics?.ordersPerSecond || 0} ops/s</span>
          </div>
          <div>
            <span className="text-slate-500">Sequencer:</span>{' '}
            <span className="text-sky-400 font-semibold">#{metrics?.sequenceNumber || 0}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
