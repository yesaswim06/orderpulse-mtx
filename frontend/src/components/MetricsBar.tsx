import React from 'react';
import { EngineMetrics } from '../types';
import { CheckCircle2, XCircle, RotateCcw, TrendingUp, Gauge, Zap, Clock } from 'lucide-react';

interface MetricsBarProps {
  metrics: EngineMetrics | null;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-4">
      {/* Accepted Orders */}
      <div className="bg-trading-card border border-trading-border/80 rounded-xl p-2.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span>Accepted</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-lg font-bold font-mono-numbers text-white mt-1">
          {metrics.totalOrdersAccepted.toLocaleString()}
        </div>
      </div>

      {/* Trades Executed */}
      <div className="bg-trading-card border border-trading-border/80 rounded-xl p-2.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span>Trades</span>
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="text-lg font-bold font-mono-numbers text-cyan-400 mt-1">
          {metrics.totalTradesExecuted.toLocaleString()}
        </div>
      </div>

      {/* Cancelled Orders */}
      <div className="bg-trading-card border border-trading-border/80 rounded-xl p-2.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span>Cancelled</span>
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="text-lg font-bold font-mono-numbers text-amber-400 mt-1">
          {metrics.totalOrdersCancelled.toLocaleString()}
        </div>
      </div>

      {/* Rejected Orders */}
      <div className="bg-trading-card border border-trading-border/80 rounded-xl p-2.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span>Rejected</span>
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <div className="text-lg font-bold font-mono-numbers text-rose-400 mt-1">
          {metrics.totalOrdersRejected.toLocaleString()}
        </div>
      </div>

      {/* Throughput */}
      <div className="bg-trading-card border border-trading-border/80 rounded-xl p-2.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span>Throughput</span>
          <Gauge className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <div className="text-lg font-bold font-mono-numbers text-purple-400 mt-1">
          {metrics.ordersPerSecond.toLocaleString()}<span className="text-xs font-normal text-slate-400 ml-1">ops/s</span>
        </div>
      </div>

      {/* p50 Latency */}
      <div className="bg-trading-card border border-trading-border/80 rounded-xl p-2.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span>Latency p50</span>
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-lg font-bold font-mono-numbers text-emerald-400 mt-1">
          {metrics.p50LatencyMicros.toFixed(1)}<span className="text-xs font-normal text-slate-400 ml-0.5">µs</span>
        </div>
      </div>

      {/* p99 Latency */}
      <div className="bg-trading-card border border-trading-border/80 rounded-xl p-2.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span>Latency p99</span>
          <Zap className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="text-lg font-bold font-mono-numbers text-amber-400 mt-1">
          {metrics.p99LatencyMicros.toFixed(1)}<span className="text-xs font-normal text-slate-400 ml-0.5">µs</span>
        </div>
      </div>

      {/* Breaker Trips */}
      <div className="bg-trading-card border border-trading-border/80 rounded-xl p-2.5 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs">
          <span>Halt Events</span>
          <Clock className="w-3.5 h-3.5 text-rose-400" />
        </div>
        <div className="text-lg font-bold font-mono-numbers text-rose-400 mt-1">
          {metrics.totalBreakerTrips}
        </div>
      </div>
    </div>
  );
};
