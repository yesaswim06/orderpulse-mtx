import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, CheckCircle2, Server, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getApiBase } from '../../../config/api';

export const DatabaseAuditBadge: React.FC = () => {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetch(`${getApiBase()}/api/health`)
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white dark:bg-[#141414] border border-[#E8E8E8] dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0F0F0] dark:border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] text-xs font-mono font-bold border border-emerald-500/20">
            <Database className="w-3.5 h-3.5" />
            <span>Dual-Database Persistence Layer</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#44475B] dark:text-white tracking-tight">
            ACID Relational WAL + Document Audit Logs
          </h3>
        </div>

        <Link
          to="/trade"
          className="text-xs font-mono font-bold text-[#00B386] hover:underline flex items-center gap-1"
        >
          <span>Inspect PostgreSQL WAL</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PostgreSQL Relational */}
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Server className="w-4 h-4 text-sky-500" />
              <span>PostgreSQL 16</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 dark:bg-sky-950/40 text-sky-600 border border-sky-500/20">
              ACID WAL
            </span>
          </div>
          <p className="text-[11px] text-[#7C7E8C] font-sans">
            Hot-path order receipts, user balances, executed fills, and limit order queues.
          </p>
          <div className="pt-2 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Status:</span>
            <span className="text-[#00B386] font-bold">Active Engine WAL</span>
          </div>
        </div>

        {/* MongoDB Atlas Document Trail */}
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#00B386]" />
              <span>MongoDB Atlas</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] border border-emerald-500/20">
              {health?.databaseConnectivity?.mongodb?.connected ? 'LIVE CLOUD' : 'ATLAS v7.0'}
            </span>
          </div>
          <p className="text-[11px] text-[#7C7E8C] font-sans">
            Immutable document logging of every matched trade, wallet transaction, and jury event.
          </p>
          <div className="pt-2 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Cluster:</span>
            <span className="text-slate-700 dark:text-neutral-300 font-bold">AWS Mumbai (ap-south-1)</span>
          </div>
        </div>

        {/* Hot-Path Sequencer */}
        <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>C++ Sequencer</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-500/20">
              ZERO-WAIT
            </span>
          </div>
          <p className="text-[11px] text-[#7C7E8C] font-sans">
            In-memory ring buffer guarantees sub-microsecond matching without blocking on disk I/O.
          </p>
          <div className="pt-2 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Sequence ID:</span>
            <span className="text-[#00B386] font-bold font-mono">#{health?.currentSequence || 24}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
