import React, { useState } from 'react';
import { X, ShieldCheck, PlayCircle, RefreshCw, KeyRound, AlertTriangle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-trading-card border border-trading-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-trading-border bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
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
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Admin Token Field */}
          <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-1.5">
            <label className="flex items-center gap-1.5 font-semibold text-slate-300 text-[11px]">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Operator Demo Admin Token</span>
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
              placeholder="Enter server DEMO_ADMIN_TOKEN"
            />
            <p className="text-[10px] text-slate-500">
              Validated on backend via HTTP header / body. Default: <code className="text-slate-400">demo-admin-secret-mtx-2026</code>
            </p>
          </div>

          {actionMessage && (
            <div className={`p-2.5 rounded-lg text-xs ${
              actionMessage.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}>
              {actionMessage.text}
            </div>
          )}

          {/* Action 1: Resume Engine */}
          <div className="border border-slate-800 rounded-xl p-3 bg-slate-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">1. Resume Trading Engine</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                breaker?.state === 'RUNNING'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : breaker?.state === 'READY_TO_RESUME'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-rose-500/20 text-rose-400'
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
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer text-xs"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Resume Engine Execution</span>
            </button>
          </div>

          {/* Action 2: Reset Reference Price */}
          <form onSubmit={handleResetRef} className="border border-slate-800 rounded-xl p-3 bg-slate-900/40 space-y-2.5">
            <span className="font-bold text-slate-200 block">2. Reset Anchor Reference Price</span>
            <p className="text-slate-400 text-[11px]">
              Recalculates the ±5% volatility bands around the new reference price.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">New Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Reason for Audit</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition cursor-pointer text-xs"
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
