import React from 'react';
import { EngineMetrics } from '../types';
import { CheckCircle2, XCircle, RotateCcw, TrendingUp, Gauge, Zap, Clock } from 'lucide-react';

interface MetricsBarProps {
  metrics: EngineMetrics | null;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-4">
      {/* Accepted Orders */}
      <div className="glass-card rounded-2xl p-3 flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium text-slate-300">Accepted</span>
          <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono-numbers text-white mt-2">
          {metrics.totalOrdersAccepted.toLocaleString()}
        </div>
      </div>

      {/* Trades Executed */}
      <div className="glass-card rounded-2xl p-3 flex flex-col justify-between hover:border-sky-500/30 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium text-slate-300">Trades</span>
          <div className="p-1 rounded-lg bg-sky-500/10 text-sky-400">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono-numbers text-sky-400 mt-2">
          {metrics.totalTradesExecuted.toLocaleString()}
        </div>
      </div>

      {/* Cancelled Orders */}
      <div className="glass-card rounded-2xl p-3 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium text-slate-300">Cancelled</span>
          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
            <RotateCcw className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono-numbers text-amber-400 mt-2">
          {metrics.totalOrdersCancelled.toLocaleString()}
        </div>
      </div>

      {/* Rejected Orders */}
      <div className="glass-card rounded-2xl p-3 flex flex-col justify-between hover:border-rose-500/30 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium text-slate-300">Rejected</span>
          <div className="p-1 rounded-lg bg-rose-500/10 text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono-numbers text-rose-400 mt-2">
          {metrics.totalOrdersRejected.toLocaleString()}
        </div>
      </div>

      {/* Throughput */}
      <div className="glass-card rounded-2xl p-3 flex flex-col justify-between hover:border-purple-500/30 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium text-slate-300">Throughput</span>
          <div className="p-1 rounded-lg bg-purple-500/10 text-purple-400">
            <Gauge className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono-numbers text-purple-400 mt-2">
          {metrics.ordersPerSecond.toLocaleString()}<span className="text-xs font-normal text-slate-400 ml-1">ops/s</span>
        </div>
      </div>

      {/* p50 Latency */}
      <div className="glass-card rounded-2xl p-3 flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium text-slate-300">Latency p50</span>
          <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono-numbers text-emerald-400 mt-2">
          {metrics.p50LatencyMicros.toFixed(1)}<span className="text-xs font-normal text-slate-400 ml-0.5">µs</span>
        </div>
      </div>

      {/* p99 Latency */}
      <div className="glass-card rounded-2xl p-3 flex flex-col justify-between hover:border-amber-500/30 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium text-slate-300">Latency p99</span>
          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
            <Zap className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono-numbers text-amber-400 mt-2">
          {metrics.p99LatencyMicros.toFixed(1)}<span className="text-xs font-normal text-slate-400 ml-0.5">µs</span>
        </div>
      </div>

      {/* Breaker Trips */}
      <div className="glass-card rounded-2xl p-3 flex flex-col justify-between hover:border-rose-500/30 transition-all shadow-sm">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span className="font-medium text-slate-300">Halt Events</span>
          <div className="p-1 rounded-lg bg-rose-500/10 text-rose-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="text-xl font-bold font-mono-numbers text-rose-400 mt-2">
          {metrics.totalBreakerTrips}
        </div>
      </div>
    </div>
  );
};
