import React from 'react';
import { ShieldAlert, AlertTriangle, PlayCircle, Clock } from 'lucide-react';
import { BreakerStatus } from '../types';

interface CircuitBreakerBannerProps {
  breaker: BreakerStatus | null;
  onResume: () => void;
  onOpenAdmin: () => void;
}

export const CircuitBreakerBanner: React.FC<CircuitBreakerBannerProps> = ({
  breaker,
  onResume,
  onOpenAdmin,
}) => {
  if (!breaker) return null;

  const refPriceRs = (breaker.referencePriceTicks / 100).toFixed(2);
  const lowerBandRs = (breaker.lowerBandTicks / 100).toFixed(2);
  const upperBandRs = (breaker.upperBandTicks / 100).toFixed(2);

  return (
    <div className="w-full">
      {/* HALTED State Glass Banner */}
      {breaker.state === 'HALTED' && (
        <div className="bg-rose-950/40 backdrop-blur-2xl border border-rose-500/50 p-4 rounded-2xl shadow-[0_8px_32px_rgba(244,63,94,0.35)] animate-halt-pulse mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-rose-500/25 border border-rose-400/40 rounded-xl text-rose-300 shrink-0 shadow-lg shadow-rose-950/50">
                <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white tracking-wide uppercase drop-shadow">
                    Volatility Circuit Breaker Triggered (Trading Halted)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/40 font-bold backdrop-blur-md">
                    DEMO POLICY
                  </span>
                </div>
                <p className="text-sm text-rose-200/90 mt-1 font-medium">
                  {breaker.lastHaltReason || 'Candidate execution price breached safe volatility threshold.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-rose-300/80">
                  <span>Ref Price: <strong className="text-white">₹{refPriceRs}</strong></span>
                  <span>•</span>
                  <span>Permitted Band: <strong className="text-white">₹{lowerBandRs} – ₹{upperBandRs}</strong> (±{breaker.bandPercent}%)</span>
                  <span>•</span>
                  <span className="text-rose-200 font-semibold">New orders rejected; cancellations permitted.</span>
                </div>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-3 bg-black/50 backdrop-blur-xl border border-rose-500/40 px-5 py-3 rounded-2xl shrink-0 self-stretch md:self-auto justify-between shadow-inner">
              <div className="flex items-center gap-2 text-rose-400">
                <Clock className="w-5 h-5 animate-spin" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-200">Cooling Timer</span>
              </div>
              <div className="font-mono text-3xl font-black text-rose-400 tracking-wider">
                {String(breaker.remainingHaltSeconds).padStart(2, '0')}s
              </div>
            </div>
          </div>
        </div>
      )}

      {/* READY_TO_RESUME State Glass Banner */}
      {breaker.state === 'READY_TO_RESUME' && (
        <div className="bg-amber-950/40 backdrop-blur-2xl border border-amber-500/50 p-4 rounded-2xl shadow-[0_8px_32px_rgba(245,158,11,0.3)] mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-amber-500/25 border border-amber-400/40 rounded-xl text-amber-300 shrink-0 shadow-lg shadow-amber-950/50">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white tracking-wide uppercase drop-shadow">
                    30s Cooling Duration Elapsed (Ready To Resume)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold backdrop-blur-md">
                    ACTION REQUIRED
                  </span>
                </div>
                <p className="text-sm text-amber-200/90 mt-1 font-medium">
                  Engine has completed minimum cooldown. Volatility candidate prices will be rechecked upon operator resume.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-amber-300/80">
                  <span>Reference: <strong className="text-white">₹{refPriceRs}</strong></span>
                  <span>•</span>
                  <span>Band: <strong className="text-white">₹{lowerBandRs} – ₹{upperBandRs}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onResume}
                className="flex items-center gap-2 px-5 py-3 bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/50 transition-all cursor-pointer text-sm border border-emerald-400/30 backdrop-blur-md hover:scale-[1.02]"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Resume Trading Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RUNNING State Glass Strip */}
      {breaker.state === 'RUNNING' && (
        <div className="glass-panel rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="font-bold text-white tracking-wide">Volatility Price Band Protection:</span>
            <span className="text-slate-300 font-mono-numbers">Permitted [₹{lowerBandRs} – ₹{upperBandRs}] (±{breaker.bandPercent}%)</span>
            <span className="text-white/20">|</span>
            <span>Anchor Ref: <strong className="text-cyan-400 font-mono">₹{refPriceRs}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 italic text-[11px]">Demonstration settings (not official exchange rules)</span>
            <button
              onClick={onOpenAdmin}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              Adjust Reference
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
