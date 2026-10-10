import React, { useState, useEffect } from 'react';
import { Database, X, RefreshCw, CheckCircle2, AlertCircle, Terminal, Shield } from 'lucide-react';

interface DatabaseInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseInspectorModal: React.FC<DatabaseInspectorModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'trades' | 'breaker' | 'sql'>('orders');
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionUriInput, setConnectionUriInput] = useState<string>('');
  const [connectMessage, setConnectMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/database/records');
      if (res.ok) {
        const data = await res.json();
        setDbData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen]);

  const handleConnectRemoteDb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectionUriInput.trim()) return;

    try {
      setIsConnecting(true);
      setConnectMessage(null);
      const res = await fetch('/api/database/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectionUri: connectionUriInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setConnectMessage({ type: 'success', text: data.message });
        fetchRecords();
      } else {
        setConnectMessage({ type: 'error', text: data.message });
      }
    } catch (err: any) {
      setConnectMessage({ type: 'error', text: err.message || 'Failed to connect to database' });
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  const orders = dbData?.tables?.orders || [];
  const trades = dbData?.tables?.trades || [];
  const breakerEvents = dbData?.tables?.breaker_events || [];
  const sqlJournal = dbData?.sqlJournal || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="bg-[#0b1222]/85 border border-white/15 rounded-3xl w-full max-w-5xl h-[88vh] shadow-[0_20px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/15 border border-blue-400/30 rounded-2xl text-blue-300">
              <Database className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white tracking-wide uppercase">
                  PostgreSQL Persistence & WAL Journal Inspector
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold backdrop-blur-md">
                  AUDIT GRADE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Inspect live database rows, schema integrity, and idempotent SQL write transactions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecords}
              disabled={loading}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition cursor-pointer border border-white/10"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition cursor-pointer border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Database Status & Connect Bar */}
        <div className="px-5 py-3 bg-black/40 border-b border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border backdrop-blur-md ${
              dbData?.source?.includes('Live')
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{dbData?.source || 'PostgreSQL WAL Engine'}</span>
            </div>
            <span className="font-mono text-slate-300 truncate max-w-xs sm:max-w-md">
              {dbData?.uri}
            </span>
          </div>

          {/* Connect Live Cloud Database Form */}
          <form onSubmit={handleConnectRemoteDb} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Paste Cloud PostgreSQL URL (Supabase/Neon/Render)..."
              value={connectionUriInput}
              onChange={(e) => setConnectionUriInput(e.target.value)}
              className="glass-input rounded-xl px-3 py-1.5 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none w-64 md:w-80"
            />
            <button
              type="submit"
              disabled={isConnecting || !connectionUriInput.trim()}
              className="px-4 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold rounded-xl transition text-xs shrink-0 cursor-pointer border border-cyan-400/30 shadow-md shadow-cyan-950/40"
            >
              {isConnecting ? 'Connecting...' : 'Connect Live'}
            </button>
          </form>
        </div>

        {connectMessage && (
          <div className={`px-5 py-2 text-xs flex items-center gap-2 border-b backdrop-blur-md ${
            connectMessage.type === 'success'
              ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40'
              : 'bg-rose-950/50 text-rose-300 border-rose-800/40'
          }`}>
            {connectMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{connectMessage.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-white/10 px-5 bg-white/[0.01] gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 font-bold text-xs transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Table: orders</span>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-[10px] text-cyan-300 font-mono">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('trades')}
            className={`py-3 px-3.5 font-bold text-xs transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'trades'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Table: trades</span>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-[10px] text-cyan-300 font-mono">
              {trades.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('breaker')}
            className={`py-3 px-3.5 font-bold text-xs transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'breaker'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Table: breaker_events</span>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-[10px] text-cyan-300 font-mono">
              {breakerEvents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 px-3.5 font-bold text-xs transition cursor-pointer border-b-2 flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Raw SQL Journal (WAL)</span>
            <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-[10px] text-emerald-300 font-mono">
              {sqlJournal.length}
            </span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 overflow-auto p-5">
          {/* ORDERS TABLE */}
          {activeTab === 'orders' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-numbers">
                <thead className="text-[11px] font-semibold text-slate-400 border-b border-white/10 sticky top-0 bg-[#0c1322]/90 backdrop-blur-md">
                  <tr>
                    <th className="py-2.5 px-2">order_id</th>
                    <th className="py-2.5 px-2">request_id</th>
                    <th className="py-2.5 px-2">participant</th>
                    <th className="py-2.5 px-2">side</th>
                    <th className="py-2.5 px-2">price_ticks</th>
                    <th className="py-2.5 px-2">price_rupees</th>
                    <th className="py-2.5 px-2 text-right">orig_qty</th>
                    <th className="py-2.5 px-2 text-right">rem_qty</th>
                    <th className="py-2.5 px-2">status</th>
                    <th className="py-2.5 px-2">seq</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-500 font-sans">
                        No rows in orders table yet
                      </td>
                    </tr>
                  ) : (
                    orders.map((o: any) => (
                      <tr key={o.order_id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-2 px-2 font-medium text-slate-200">{o.order_id}</td>
                        <td className="py-2 px-2 text-slate-400 text-[11px] truncate max-w-[120px]">{o.request_id}</td>
                        <td className="py-2 px-2 text-slate-300">{o.participant_id}</td>
                        <td className={`py-2 px-2 font-bold ${o.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {o.side}
                        </td>
                        <td className="py-2 px-2 text-slate-300">{o.price_ticks}</td>
                        <td className="py-2 px-2 font-semibold text-cyan-400">₹{(o.price_ticks / 100).toFixed(2)}</td>
                        <td className="py-2 px-2 text-right text-slate-400">{o.original_quantity}</td>
                        <td className="py-2 px-2 text-right text-white font-bold">{o.remaining_quantity}</td>
                        <td className="py-2 px-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            o.status === 'FILLED'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : o.status === 'PARTIALLY_FILLED'
                              ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                              : o.status === 'CANCELLED'
                              ? 'bg-slate-700/30 text-slate-400 border-white/5'
                              : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-slate-400">{o.acceptance_sequence}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TRADES TABLE */}
          {activeTab === 'trades' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-numbers">
                <thead className="text-[11px] font-semibold text-slate-400 border-b border-white/10 sticky top-0 bg-[#0c1322]/90 backdrop-blur-md">
                  <tr>
                    <th className="py-2.5 px-2">trade_id</th>
                    <th className="py-2.5 px-2">price_rupees</th>
                    <th className="py-2.5 px-2">price_ticks</th>
                    <th className="py-2.5 px-2 text-right">quantity</th>
                    <th className="py-2.5 px-2">maker_order</th>
                    <th className="py-2.5 px-2">taker_order</th>
                    <th className="py-2.5 px-2">sequence_id</th>
                    <th className="py-2.5 px-2 text-right">executed_at</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {trades.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                        No rows in trades table yet
                      </td>
                    </tr>
                  ) : (
                    trades.map((t: any) => (
                      <tr key={t.trade_id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-2 px-2 font-medium text-slate-200">{t.trade_id}</td>
                        <td className="py-2 px-2 font-bold text-cyan-400">₹{(t.price_ticks / 100).toFixed(2)}</td>
                        <td className="py-2 px-2 text-slate-400">{t.price_ticks}</td>
                        <td className="py-2 px-2 text-right text-white font-bold">{t.quantity}</td>
                        <td className="py-2 px-2 text-slate-300 text-[11px]">{t.maker_order_id}</td>
                        <td className="py-2 px-2 text-slate-300 text-[11px]">{t.taker_order_id}</td>
                        <td className="py-2 px-2 text-purple-400 font-semibold">{t.sequence_id}</td>
                        <td className="py-2 px-2 text-right text-slate-400 text-[11px]">
                          {new Date(t.executed_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* BREAKER EVENTS TABLE */}
          {activeTab === 'breaker' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-numbers">
                <thead className="text-[11px] font-semibold text-slate-400 border-b border-white/10 sticky top-0 bg-[#0c1322]/90 backdrop-blur-md">
                  <tr>
                    <th className="py-2.5 px-2">id</th>
                    <th className="py-2.5 px-2">event_type</th>
                    <th className="py-2.5 px-2">reference_rupees</th>
                    <th className="py-2.5 px-2">candidate_rupees</th>
                    <th className="py-2.5 px-2">seq</th>
                    <th className="py-2.5 px-2">halt_reason</th>
                    <th className="py-2.5 px-2 text-right">created_at</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {breakerEvents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                        No circuit breaker events recorded
                      </td>
                    </tr>
                  ) : (
                    breakerEvents.map((b: any, idx: number) => (
                      <tr key={idx} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-2 px-2 text-slate-400">{b.id || idx + 1}</td>
                        <td className="py-2 px-2">
                          <span className="font-bold text-rose-400 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40">
                            {b.event_type}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-slate-200">₹{(b.reference_price_ticks / 100).toFixed(2)}</td>
                        <td className="py-2 px-2 font-bold text-rose-300">
                          {b.candidate_price_ticks ? `₹${(b.candidate_price_ticks / 100).toFixed(2)}` : '—'}
                        </td>
                        <td className="py-2 px-2 text-purple-400">{b.sequence_id}</td>
                        <td className="py-2 px-2 text-slate-300 text-[11px] max-w-sm truncate">{b.reason}</td>
                        <td className="py-2 px-2 text-right text-slate-400 text-[11px]">
                          {new Date(b.created_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* SQL JOURNAL (WAL) */}
          {activeTab === 'sql' && (
            <div className="space-y-3 font-mono text-xs">
              {sqlJournal.length === 0 ? (
                <div className="text-center py-8 text-slate-500 font-sans">No SQL statements recorded yet</div>
              ) : (
                sqlJournal.map((entry: any, idx: number) => (
                  <div key={idx} className="bg-black/50 border border-white/10 rounded-2xl p-4 text-slate-300 space-y-2 backdrop-blur-md">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/[0.08] pb-1.5">
                      <span className="text-cyan-400 font-bold">Sequence: #{entry.sequenceId}</span>
                      <span>{entry.time}</span>
                    </div>
                    <pre className="text-emerald-400 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                      {entry.query}
                    </pre>
                    {entry.params && entry.params.length > 0 && (
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-white/[0.04]">
                        <span className="text-slate-500">Parameters: </span>
                        {JSON.stringify(entry.params)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>PostgreSQL Durability: Engine Ingress &rarr; Bounded Worker Commit &rarr; WAL Persistence</span>
          </div>
          <div className="text-cyan-400 font-medium">
            Supabase / Neon.tech / Railway PostgreSQL supported
          </div>
        </div>
      </div>
    </div>
  );
};
