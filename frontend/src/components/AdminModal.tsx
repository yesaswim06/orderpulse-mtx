import React, { useState } from 'react';
import { X, ShieldCheck, PlayCircle, RefreshCw, KeyRound } from 'lucide-react';
import { BreakerStatus } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  breaker: BreakerStatus | null;
  onResume: (token: string) => Promise<{ success: boolean; message?: string }>;
  onResetReference: (
    newPriceRupees: number,
    reason: string,
    token: string
  ) => Promise<{ success: boolean; message?: string }>;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  breaker,
  onResume,
  onResetReference,
}) => {
  const [token, setToken] = useState<string>('demo-admin-secret-mtx-2026');
  const [newPrice, setNewPrice] = useState<string>('100.00');
  const [reason, setReason] = useState<string>('Operator periodic reference adjustment');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleResume = async () => {
    try {
      setLoading(true);
      setActionMessage(null);
      const res = await onResume(token);
      if (res.success) {
        setActionMessage({ type: 'success', text: 'Trading engine resumed successfully.' });
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Resume failed.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error executing resume.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetRef = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(newPrice);
    if (isNaN(p) || p <= 0) {
      setActionMessage({ type: 'error', text: 'Enter a valid positive reference price.' });
      return;
    }

    try {
      setLoading(true);
      setActionMessage(null);
      const res = await onResetReference(p, reason, token);
      if (res.success) {
        setActionMessage({ type: 'success', text: `Reference price successfully set to ₹${p.toFixed(2)}.` });
      } else {
        setActionMessage({ type: 'error', text: res.message || 'Update failed.' });
      }
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.message || 'Error updating reference.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="bg-[#0b1222]/85 border border-white/15 rounded-3xl w-full max-w-lg shadow-[0_16px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/15 border border-cyan-400/30 rounded-xl text-cyan-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Operator Administration Panel
              </h2>
              <p className="text-[11px] text-slate-400">
                Server-side authorization required for circuit breaker controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Admin Token Field */}
          <div className="bg-black/40 border border-white/10 p-3.5 rounded-2xl space-y-2 backdrop-blur-md">
            <label className="flex items-center gap-2 font-semibold text-slate-200 text-[11px]">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Operator Demo Admin Token</span>
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none"
              placeholder="Enter server DEMO_ADMIN_TOKEN"
            />
            <p className="text-[10px] text-slate-400">
              Validated on backend via HTTP header / body. Default: <code className="text-cyan-400/90 font-mono">demo-admin-secret-mtx-2026</code>
            </p>
          </div>

          {actionMessage && (
            <div className={`p-3 rounded-xl text-xs backdrop-blur-md ${
              actionMessage.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}>
              {actionMessage.text}
            </div>
          )}

          {/* Action 1: Resume Engine */}
          <div className="glass-card rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">1. Resume Trading Engine</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                breaker?.state === 'RUNNING'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : breaker?.state === 'READY_TO_RESUME'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
              }`}>
                {breaker?.state}
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Resumes matching if cooling period has elapsed. Compatible resting orders will be matched deterministically.
            </p>
            <button
              onClick={handleResume}
              disabled={loading || breaker?.state === 'RUNNING'}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-40 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer text-xs border border-emerald-400/30 shadow-lg shadow-emerald-950/50"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Resume Engine Execution</span>
            </button>
          </div>

          {/* Action 2: Reset Reference Price */}
          <form onSubmit={handleResetRef} className="glass-card rounded-2xl p-4 space-y-3">
            <span className="font-bold text-white block">2. Reset Anchor Reference Price</span>
            <p className="text-slate-400 text-[11px]">
              Recalculates the ±5% volatility bands around the new reference price.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] text-slate-300 mb-1 font-medium">New Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-300 mb-1 font-medium">Reason for Audit</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer text-xs border border-cyan-400/30 shadow-lg shadow-cyan-950/50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Update Reference & Recompute Bands</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
