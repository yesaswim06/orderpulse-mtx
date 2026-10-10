import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Flame,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';

export const CircuitBreakerVisualizer: React.FC = () => {
  const [breakerStatus, setBreakerStatus] = useState<'RUNNING' | 'HALTED'>('RUNNING');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tripReason, setTripReason] = useState<string | null>(null);

  // Poll breaker status from backend
  const fetchBreaker = async () => {
    try {
      const res = await fetch('/api/breaker');
      if (res.ok) {
        const data = await res.json();
        setBreakerStatus(data.state || 'RUNNING');
        if (data.cooldownRemainingSeconds !== undefined) {
          setCooldownSeconds(data.cooldownRemainingSeconds);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchBreaker();
    const interval = setInterval(fetchBreaker, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerShock = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: 'price_shock' })
      });
      if (res.ok) {
        setBreakerStatus('HALTED');
        setCooldownSeconds(30);
        setTripReason('Candidate execution breached ±5% collar: ₹106.00 > ₹105.00 upper band');
      }
    } catch {}
    setLoading(false);
  };

  const handleResume = async () => {
    setLoading(true);
    try {
      await fetch('/api/admin/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminToken: 'demo-admin-secret-mtx-2026', force: true })
      });
      setBreakerStatus('RUNNING');
      setCooldownSeconds(0);
      setTripReason(null);
    } catch {}
    setLoading(false);
  };

  return (
    <div id="circuit-breaker" className="scroll-mt-24 bg-white dark:bg-[#141414] border border-[#E8E8E8] dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-[#F0F0F0] dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 text-xs font-mono font-bold border border-rose-500/20 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Autonomous Volatility Protection</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#44475B] dark:text-white tracking-tight">
            Dynamic ±5.0% Price Collar Engine
          </h3>
          <p className="text-xs sm:text-sm text-[#7C7E8C] dark:text-neutral-400 mt-1 max-w-xl">
            Candidate fills outside the safe corridor are rejected before execution. Any breach triggers an autonomous 30-second circuit breaker cooldown to protect market participants.
          </p>
        </div>

        {/* Current State Pill */}
        <div className={`px-4 py-2 rounded-2xl border font-mono text-xs font-bold flex items-center gap-2 ${
          breakerStatus === 'HALTED'
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 animate-pulse'
            : 'bg-emerald-500/10 border-emerald-500/30 text-[#00B386]'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${breakerStatus === 'HALTED' ? 'bg-rose-500' : 'bg-[#00B386]'}`} />
          <span>STATUS: {breakerStatus} {cooldownSeconds > 0 ? `(${cooldownSeconds}s cooling)` : ''}</span>
        </div>
      </div>

      {/* Visual Collar Band Diagram */}
      <div className="py-8">
        <div className="relative max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="text-rose-500 font-bold">Lower Collar: ₹95.00 (-5%)</span>
            <span className="text-[#00B386] font-bold">Anchor Ref: ₹100.00</span>
            <span className="text-rose-500 font-bold">Upper Collar: ₹105.00 (+5%)</span>
          </div>

          {/* Bar Diagram */}
          <div className="h-6 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 relative overflow-hidden flex items-center p-1 border border-neutral-200 dark:border-white/10">
            {/* Safe Zone in Green */}
            <div className="h-full w-full rounded-full bg-emerald-500/20 border border-emerald-500/40 relative flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-[#00B386]">
                SAFE EXECUTION CORRIDOR [₹95.00 — ₹105.00]
              </span>
            </div>
          </div>

          <div className="text-center text-[11px] text-[#7C7E8C]">
            Reference Price is dynamically re-anchored on every compliant continuous auction match.
          </div>
        </div>
      </div>

      {/* Interactive Trigger & Explanation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F0F0F0] dark:border-white/10">
        <div className="text-xs text-[#7C7E8C]">
          {tripReason ? (
            <span className="text-rose-500 font-mono font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              {tripReason}
            </span>
          ) : (
            <span>Test the circuit breaker by injecting a +6% rogue price spike.</span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {breakerStatus === 'HALTED' ? (
            <button
              onClick={handleResume}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Operator Manual Resume</span>
            </button>
          ) : (
            <button
              onClick={handleTriggerShock}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-mono font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-105"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Test Price Shock (+6% @ ₹106.00)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
