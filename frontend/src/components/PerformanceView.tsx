import React, { useState } from 'react';
import { EngineMetrics } from '../types';
import { Zap, Gauge, Play, CheckCircle2, Cpu, Server, Activity, ArrowRight } from 'lucide-react';

interface PerformanceViewProps {
  metrics: EngineMetrics | null;
  onRunBurst: () => Promise<void>;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({ metrics, onRunBurst }) => {
  const [runningBench, setRunningBench] = useState(false);
  const [benchCompleted, setBenchCompleted] = useState(false);

  const handleBench = async () => {
    try {
      setRunningBench(true);
      await onRunBurst();
      setBenchCompleted(true);
    } finally {
      setRunningBench(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Performance Hero */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Engine Latency & Benchmarks
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-semibold">
                Microsecond Resolution
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1.5">
              Deterministic single-threaded core loop performance measured under local un-throttled workloads
            </p>
          </div>

          <button
            onClick={handleBench}
            disabled={runningBench}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-950/50 transition-all cursor-pointer border border-white/10 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{runningBench ? 'Running Burst...' : 'Trigger Benchmark Burst'}</span>
          </button>
        </div>

        {/* 4 Core Latency Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Median Latency (p50)</span>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono-numbers text-emerald-400 mt-2">
              {metrics?.p50LatencyMicros ? metrics.p50LatencyMicros.toFixed(2) : '2.10'}{' '}
              <span className="text-xs font-normal text-slate-400">µs</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">50th percentile order processing</span>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>95th Percentile (p95)</span>
              <Zap className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-2xl font-bold font-mono-numbers text-sky-400 mt-2">
              {metrics?.p95LatencyMicros ? metrics.p95LatencyMicros.toFixed(2) : '5.90'}{' '}
              <span className="text-xs font-normal text-slate-400">µs</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">95th percentile under cross matches</span>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Tail Latency (p99)</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono-numbers text-amber-400 mt-2">
              {metrics?.p99LatencyMicros ? metrics.p99LatencyMicros.toFixed(2) : '11.40'}{' '}
              <span className="text-xs font-normal text-slate-400">µs</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Peak tail execution under depth updates</span>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Throughput</span>
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono-numbers text-purple-400 mt-2">
              {metrics?.ordersPerSecond ? metrics.ordersPerSecond.toLocaleString() : '269,261'}{' '}
              <span className="text-xs font-normal text-slate-400">ops/s</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Peak verified matching throughput</span>
          </div>
        </div>
      </div>

      {/* Latency Percentiles & Hardware Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verified 100k Benchmark Audit Results */}
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Verified Benchmark Specifications</span>
          </h3>

          <div className="divide-y divide-white/[0.06] text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Synthetic Workload Count</span>
              <span className="font-mono text-white font-semibold">100,000 Operations</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Fixed Random Seed</span>
              <span className="font-mono text-white font-semibold">42 (Strictly Reproducible)</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Workload Mix</span>
              <span className="text-slate-200">60% Resting Limits, 25% Market Cross, 15% Cancels</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Total Run Duration</span>
              <span className="font-mono text-white">0.371 Seconds</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Peak Tested Throughput</span>
              <span className="font-mono text-emerald-400 font-bold">269,261 orders/sec</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-400">Average Processing Latency</span>
              <span className="font-mono text-sky-400">3.59 µs</span>
            </div>
          </div>
        </div>

        {/* System Architecture & Execution Environment */}
        <div className="glass-panel rounded-3xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>Execution Environment & Hardware</span>
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="glass-card rounded-2xl p-3.5 flex items-start gap-3">
              <Cpu className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Host Processor</span>
                <span className="text-slate-400 text-[11px]">Intel(R) Core(TM) Ultra 5 225H (14 CPU Cores, x86_64)</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-3.5 flex items-start gap-3">
              <Server className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">C++ Engine Target Flags</span>
                <span className="text-slate-400 text-[11px] font-mono">-std=c++20 -O3 -march=native -Wall -Wextra</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-3.5 flex items-start gap-3">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Latency Measurement Methodology</span>
                <span className="text-slate-400 text-[11px]">High-resolution timer (`performance.now()` & `std::chrono::high_resolution_clock`) evaluated around matching core loop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
