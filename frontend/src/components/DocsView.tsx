import React, { useState } from 'react';
import { BookOpen, Code2, Server, Play, ShieldAlert, Cpu, Database, Check, Copy } from 'lucide-react';

interface DocsViewProps {
  apiBase: string;
}

export const DocsView: React.FC<DocsViewProps> = ({ apiBase }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/orders',
      title: 'Submit Limit Order',
      description: 'Submits a buy or sell limit order into the matching engine. Prices are integer cents (e.g. 10000 = ₹100.00). Evaluates pre-fill circuit breaker checks before execution.',
      curl: `curl -X POST ${apiBase}/api/orders \\
  -H "Content-Type: application/json" \\
  -d '{
    "side": "BUY",
    "price": 10000,
    "quantity": 100,
    "clientId": "algo_fund_1"
  }'`,
      response: `{
  "success": true,
  "orderId": "ord_88291a03",
  "status": "FILLED",
  "fills": [
    {
      "tradeId": "trd_55a91b",
      "price": 10000,
      "quantity": 100,
      "matchLatencyMicros": 2.15
    }
  ],
  "remainingQty": 0
}`
    },
    {
      method: 'DELETE',
      path: '/api/orders/:orderId/cancel',
      title: 'Cancel Order',
      description: 'Cancels an existing resting limit order from the book in O(1) time via hash-map lookup. Always permitted even during circuit breaker pauses.',
      curl: `curl -X DELETE ${apiBase}/api/orders/ord_88291a03/cancel`,
      response: `{
  "success": true,
  "orderId": "ord_88291a03",
  "status": "CANCELED"
}`
    },
    {
      method: 'GET',
      path: '/api/book',
      title: 'Get L2 Depth Order Book',
      description: 'Returns aggregated bids and asks with price, quantity, order count, and percentage depth.',
      curl: `curl -s ${apiBase}/api/book?symbol=DEMO&depth=20`,
      response: `{
  "symbol": "DEMO",
  "bids": [
    { "price": 9995, "quantity": 1500, "count": 4 },
    { "price": 9990, "quantity": 3200, "count": 7 }
  ],
  "asks": [
    { "price": 10005, "quantity": 1200, "count": 3 },
    { "price": 10010, "quantity": 2800, "count": 6 }
  ],
  "timestamp": 1728559200000
}`
    },
    {
      method: 'GET',
      path: '/api/breaker',
      title: 'Get Volatility Circuit Breaker Status',
      description: 'Returns current trading status (ACTIVE vs PAUSED), permitted ±5% price band, anchor reference price, and remaining pause countdown seconds.',
      curl: `curl -s ${apiBase}/api/breaker`,
      response: `{
  "status": "ACTIVE",
  "refPrice": 10000,
  "bandPct": 5.0,
  "lowerBand": 9500,
  "upperBand": 10500,
  "isPaused": false,
  "pauseRemainingSeconds": 0
}`
    },
    {
      method: 'POST',
      path: '/api/admin/resume',
      title: 'Operator Manual Resume',
      description: 'Authorized operator endpoint to unpause the engine immediately before the 30s cooling timer elapses.',
      curl: `curl -X POST ${apiBase}/api/admin/resume \\
  -H "Authorization: Bearer demo-admin-secret-mtx-2026"`,
      response: `{
  "success": true,
  "message": "Engine resumed by operator override",
  "status": "ACTIVE"
}`
    },
    {
      method: 'GET',
      path: '/api/database/status',
      title: 'PostgreSQL Database Health & Stats',
      description: 'Returns connection pool status, active PostgreSQL provider, and row counts across persistent tables.',
      curl: `curl -s ${apiBase}/api/database/status`,
      response: `{
  "connected": true,
  "provider": "PostgreSQL v16.2",
  "database": "orderpulse_mtx",
  "tables": {
    "orders": 1420,
    "trades": 680,
    "breaker_events": 14,
    "engine_events": 2100
  }
}`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-slate-100">API Documentation & Jury Technical Guide</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Complete technical specification of the OrderPulse MTX matching engine. Includes REST endpoints, WebSocket streaming protocols, circuit breaker specifications, and C++ memory layout details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="glass-badge-green font-mono text-[11px]">
            API v1.0.0
          </span>
          <span className="px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[11px] font-mono">
            WebSocket: /ws
          </span>
        </div>
      </div>

      {/* Jury Quick Demonstration Script */}
      <div className="glass-panel p-6 space-y-4 border-sky-500/30">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Jury 3-Minute Live Demo Script
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">1</span>
              Normal Trading & Depth
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Show order book bids/asks around ₹100.00. Enable "Synthetic Flow (5/s)" in the Trade tab to see real-time price discovery, WebSocket order book ladder updates, and execution ticks.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">2</span>
              Circuit Breaker Breach & Halt
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Click the "Test Breach (+₹106)" button on the order pad. The engine rejects execution before fill, trips a 30s cooling pause, and enters PAUSED status. Cancels remain active.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px]">3</span>
              Live Database & WAL Inspection
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Navigate to the "Database" tab to view transaction rows inside PostgreSQL (<code className="text-emerald-400">orders</code>, <code className="text-emerald-400">trades</code>, <code className="text-emerald-400">breaker_events</code>). Then click "Performance" to trigger a microsecond benchmark.
            </p>
          </div>
        </div>
      </div>

      {/* REST Endpoints List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Code2 className="w-4 h-4 text-slate-400" />
          Interactive REST Endpoints
        </h3>

        <div className="space-y-4">
          {endpoints.map((ep, idx) => (
            <div key={idx} className="glass-panel p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                    ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    ep.method === 'GET' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-200">{ep.path}</span>
                  <span className="text-slate-400 text-xs">— {ep.title}</span>
                </div>
                <button
                  onClick={() => copyCode(ep.curl, idx)}
                  className="glass-button text-[11px] flex items-center gap-1.5 py-1 px-2.5"
                >
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy cURL'}</span>
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {ep.description}
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-2">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">Example Request (cURL)</div>
                  <pre className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    {ep.curl}
                  </pre>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">JSON Response Schema</div>
                  <pre className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-emerald-300/90 overflow-x-auto">
                    {ep.response}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WebSocket Protocol Spec */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          Real-Time WebSocket Protocol (<code className="text-emerald-400 font-mono">/ws</code>)
        </h3>
        <p className="text-xs text-slate-400">
          The WebSocket stream broadcasts three message types with zero serialization delay:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-black/30 border border-white/5 space-y-2">
            <span className="text-emerald-400 font-bold">1. BOOK_UPDATE</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Broadcast on every new resting order or fill. Transmits top-20 bid/ask levels.
            </p>
            <pre className="text-[10px] text-slate-300 bg-black/30 p-2 rounded">
{`{
  "type": "BOOK_UPDATE",
  "symbol": "DEMO",
  "bids": [[9995, 100]],
  "asks": [[10005, 50]]
}`}
            </pre>
          </div>

          <div className="p-3.5 rounded-lg bg-black/30 border border-white/5 space-y-2">
            <span className="text-sky-400 font-bold">2. TRADE_EXECUTION</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Broadcast instantly when a fill occurs with microsecond match latency.
            </p>
            <pre className="text-[10px] text-slate-300 bg-black/30 p-2 rounded">
{`{
  "type": "TRADE",
  "tradeId": "t_102",
  "price": 10000,
  "qty": 25,
  "latencyMicros": 2.1
}`}
            </pre>
          </div>

          <div className="p-3.5 rounded-lg bg-black/30 border border-white/5 space-y-2">
            <span className="text-rose-400 font-bold">3. BREAKER_HALT</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Broadcast whenever price breaches the ±5% collar. Instructs UI to pause.
            </p>
            <pre className="text-[10px] text-slate-300 bg-black/30 p-2 rounded">
{`{
  "type": "CIRCUIT_BREAKER",
  "status": "PAUSED",
  "breachPrice": 10600,
  "pauseSeconds": 30
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
