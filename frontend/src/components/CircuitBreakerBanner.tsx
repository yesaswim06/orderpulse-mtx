import React from 'react';
import { ShieldAlert, AlertTriangle, PlayCircle, RefreshCw, Clock } from 'lucide-react';
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
      {/* HALTED State Banner */}
      {breaker.state === 'HALTED' && (
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 border-y md:border border-rose-500/50 p-4 md:rounded-xl shadow-2xl shadow-rose-900/30 animate-halt-pulse mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-500/20 rounded-lg text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-wide uppercase">
                    Volatility Circuit Breaker Triggered (Trading Halted)
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-900/60 text-rose-200 border border-rose-600/40">
                    DEMO POLICY
                  </span>
                </div>
                <p className="text-sm text-rose-200/90 mt-1">
                  {breaker.lastHaltReason || 'Candidate execution price breached safe volatility threshold.'}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-rose-300/80">
                  <span>Ref Price: <strong>₹{refPriceRs}</strong></span>
                  <span>•</span>
                  <span>Permitted Band: <strong>₹{lowerBandRs} – ₹{upperBandRs}</strong> (±{breaker.bandPercent}%)</span>
                  <span>•</span>
                  <span className="text-rose-100 font-medium">New orders rejected; cancellations permitted.</span>
                </div>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-3 bg-black/40 border border-rose-500/30 px-4 py-2.5 rounded-xl shrink-0 self-stretch md:self-auto justify-between">
              <div className="flex items-center gap-2 text-rose-400">
                <Clock className="w-5 h-5 animate-spin" />
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">Cooling Timer</span>
              </div>
              <div className="font-mono text-2xl font-black text-rose-400">
                {String(breaker.remainingHaltSeconds).padStart(2, '0')}s
              </div>
            </div>
          </div>
        </div>
      )}

      {/* READY_TO_RESUME State Banner */}
      {breaker.state === 'READY_TO_RESUME' && (
        <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-yellow-950 border-y md:border border-amber-500/50 p-4 md:rounded-xl shadow-2xl shadow-amber-900/30 mb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-500/20 rounded-lg text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-wide uppercase">
                    30s Cooling Duration Elapsed (Ready To Resume)
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-600/40">
                    ACTION REQUIRED
                  </span>
                </div>
                <p className="text-sm text-amber-200/90 mt-1">
                  Engine has completed minimum cooldown. Volatility candidate prices will be rechecked upon operator resume.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-amber-300/80">
                  <span>Reference: <strong>₹{refPriceRs}</strong></span>
                  <span>•</span>
                  <span>Band: <strong>₹{lowerBandRs} – ₹{upperBandRs}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onResume}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg shadow-emerald-900/40 transition-all cursor-pointer text-sm"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Resume Trading Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RUNNING State Summary Strip */}
      {breaker.state === 'RUNNING' && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-lg px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-semibold text-slate-300">Volatility Price Band Protection:</span>
            <span>Permitted Range [₹{lowerBandRs} – ₹{upperBandRs}] (±{breaker.bandPercent}%)</span>
            <span className="text-slate-500">|</span>
            <span>Anchor Reference: <strong className="text-cyan-400 font-mono">₹{refPriceRs}</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 italic">Demonstration settings (not official exchange rules)</span>
            <button
              onClick={onOpenAdmin}
              className="text-cyan-400 hover:text-cyan-300 font-medium underline transition-colors cursor-pointer"
            >
              Adjust Reference
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
