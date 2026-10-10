import React from 'react';
import { Activity, ShieldAlert, Wifi, WifiOff, Settings, Zap, Database } from 'lucide-react';
import { BreakerStatus, EngineMetrics } from '../types';

interface HeaderProps {
  breaker: BreakerStatus | null;
  metrics: EngineMetrics | null;
  isConnected: boolean;
  onOpenAdmin: () => void;
  onOpenDatabase: () => void;
  backendTarget: 'railway' | 'local';
  onToggleTarget: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  breaker,
  metrics,
  isConnected,
  onOpenAdmin,
  onOpenDatabase,
  backendTarget,
  onToggleTarget,
}) => {
  const state = breaker?.state || 'RUNNING';

  return (
    <header className="sticky top-0 z-40 bg-[#090d1a]/65 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] px-4 py-3">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Symbol */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-white/20">
            <Zap className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 drop-shadow">
                OrderPulse <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">MTX</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-sm">
                Trading Simulation
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">DEMO</span>
              <span className="text-slate-600">•</span>
              <span>1 Tick = ₹0.01 (1 Paisa)</span>
              <span className="text-slate-600">•</span>
              <span className="text-cyan-400/90 font-medium">Price–Time FIFO Priority</span>
            </div>
          </div>
        </div>

        {/* Engine Breaker Status Pill */}
        <div className="flex items-center gap-2">
          {state === 'RUNNING' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>MATCHING ENGINE: ACTIVE</span>
            </div>
          )}
          {state === 'HALTED' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold backdrop-blur-md animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.3)]">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>TRADING HALTED (VOLATILITY BREAKER)</span>
            </div>
          )}
          {state === 'READY_TO_RESUME' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>READY TO RESUME (ACTION REQUIRED)</span>
            </div>
          )}
        </div>

        {/* System Vitals, Host Switcher, Database Inspector & Operator Button */}
        <div className="flex items-center gap-2 text-xs">
          {/* Target Host Switcher */}
          <button
            onClick={onToggleTarget}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 backdrop-blur-md transition-all cursor-pointer font-semibold shadow-sm hover:border-purple-400/50"
            title="Switch between Railway Cloud and Local Host backend"
          >
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>{backendTarget === 'railway' ? 'Railway Cloud' : 'Local Host'}</span>
          </button>

          {/* WebSocket Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border backdrop-blur-md ${
            isConnected
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-400'
          }`}>
            {isConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isConnected ? 'Live WS' : 'Disconnected'}</span>
          </div>

          {/* Sequence Tracker */}
          <div className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md font-mono-numbers text-slate-300">
            Seq: <span className="text-cyan-400 font-bold">{metrics?.sequenceNumber || 0}</span>
          </div>

          {/* Database Inspector Trigger */}
          <button
            onClick={onOpenDatabase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 backdrop-blur-md transition-all font-semibold cursor-pointer shadow-lg shadow-blue-500/10 hover:border-blue-400/60"
            title="Inspect Live PostgreSQL Tables & WAL Journal"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>DB Inspector</span>
          </button>

          {/* Operator Settings Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] hover:border-cyan-400/50 backdrop-blur-md transition-all cursor-pointer font-medium"
            title="Operator Panel & Settings"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Operator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
