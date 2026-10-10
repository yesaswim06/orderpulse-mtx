import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CircuitBreakerBanner } from './CircuitBreakerBanner';
import { MetricsBar } from './MetricsBar';
import { ScenarioControls } from './ScenarioControls';
import { OrderForm } from './OrderForm';
import { OrderBookView } from './OrderBookView';
import { DepthChart } from './DepthChart';
import { TradesTable } from './TradesTable';
import { OrdersTable } from './OrdersTable';
import { AdminModal } from './AdminModal';
import { Navbar } from './Navbar';
import { MarketsView } from './MarketsView';
import { PerformanceView } from './PerformanceView';
import { DatabaseView } from './DatabaseView';
import { DocsView } from './DocsView';
import { WalletModal } from './WalletModal';
import {
  BreakerStatus,
  EngineMetrics,
  Order,
  OrderBookSnapshot,
  Side,
  Trade,
} from '../types';

export const TradingTerminal: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'trade' | 'markets' | 'performance' | 'database' | 'docs'>('trade');
  const [snapshot, setSnapshot] = useState<OrderBookSnapshot | null>(null);
  const [breaker, setBreaker] = useState<BreakerStatus | null>(null);
  const [metrics, setMetrics] = useState<EngineMetrics | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number>(1000000);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [backendTarget, setBackendTarget] = useState<'railway' | 'local'>(
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'local' : 'railway'
  );

  const lastSeqRef = useRef<number>(0);
  const wsRef = useRef<WebSocket | null>(null);

  const apiBase = backendTarget === 'railway' ? 'https://orderpulse-mtx.up.railway.app' : '';

  const fetchWalletBalance = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/wallet/balances?userId=USER-DEMO-01`);
      if (res.ok) {
        const data = await res.json();
        if (data.inr !== undefined) setWalletBalance(data.inr);
      }
    } catch {}
  }, [apiBase]);

  // Fetch full state via REST as fallback or init
  const fetchFullState = useCallback(async () => {
    try {
      const [bookRes, breakerRes, metricsRes, tradesRes, ordersRes] = await Promise.all([
        fetch(`${apiBase}/api/book`),
        fetch(`${apiBase}/api/breaker`),
        fetch(`${apiBase}/api/metrics`),
        fetch(`${apiBase}/api/trades?limit=30`),
        fetch(`${apiBase}/api/orders?limit=30`),
      ]);

      if (bookRes.ok) setSnapshot(await bookRes.json());
      if (breakerRes.ok) setBreaker(await breakerRes.json());
      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (tradesRes.ok) setTrades(await tradesRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (e) {
      console.error('REST poll error:', e);
    }
  }, [apiBase]);

  // WebSocket Connection & Real-Time Sync
  useEffect(() => {
    let reconnectTimeout: any;

    const connectWs = () => {
      let wsUrl = '';
      if (backendTarget === 'railway') {
        wsUrl = 'wss://orderpulse-mtx.up.railway.app/ws';
      } else {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        wsUrl = `${protocol}//${window.location.host}/ws`;
      }

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'SNAPSHOT') {
            setSnapshot(data.book);
            setBreaker(data.breaker);
            setMetrics(data.metrics);
            if (data.trades) setTrades(data.trades);
            if (data.orders) setOrders(data.orders);
            lastSeqRef.current = data.sequenceId || 0;
            return;
          }

          // Sequence gap detection
          if (data.sequenceId && data.sequenceId > lastSeqRef.current + 1 && lastSeqRef.current > 0) {
            // Sequence gap detected: request resync from server
            ws.send(JSON.stringify({ action: 'RESYNC', lastSequence: lastSeqRef.current }));
          }
          if (data.sequenceId) {
            lastSeqRef.current = Math.max(lastSeqRef.current, data.sequenceId);
          }

          if (data.type === 'TICK_UPDATE') {
            setBreaker(data.breaker);
            setMetrics(data.metrics);
          } else if (data.type === 'ORDER_SUBMITTED') {
            if (data.book) setSnapshot(data.book);
            if (data.breaker) setBreaker(data.breaker);
            if (data.metrics) setMetrics(data.metrics);
            if (data.order) {
              setOrders(prev => [data.order, ...prev.slice(0, 49)]);
            }
            if (data.trades && data.trades.length > 0) {
              setTrades(prev => [...data.trades.reverse(), ...prev.slice(0, 49)]);
            }
          } else if (data.type === 'ORDER_CANCELLED') {
            if (data.book) setSnapshot(data.book);
            if (data.metrics) setMetrics(data.metrics);
            if (data.cancelledOrder) {
              setOrders(prev =>
                prev.map(o => (o.orderId === data.cancelledOrder.orderId ? data.cancelledOrder : o))
              );
            }
          }
        } catch (err) {
          console.error('Error handling WS event:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        reconnectTimeout = setTimeout(connectWs, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connectWs();
    fetchFullState();

    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current) wsRef.current.close();
    };
  }, [backendTarget, fetchFullState]);

  // Submit Order Action
  const handleSubmitOrder = async (order: {
    participantId: string;
    symbol: string;
    side: Side;
    priceTicks: number;
    quantity: number;
  }): Promise<{ success: boolean; message?: string }> => {
    const requestId = `REQ-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const res = await fetch(`${apiBase}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        requestId,
        participantId: order.participantId,
        symbol: order.symbol,
        side: order.side,
        priceTicks: order.priceTicks,
        quantity: order.quantity,
      }),
    });

    const body = await res.json();
    if (!res.ok || !body.success) {
      return { success: false, message: body.errorMessage || body.error || 'Failed to submit' };
    }

    return { success: true };
  };

  // Cancel Order Action
  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingId(orderId);
      const res = await fetch(`${apiBase}/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.errorMessage || 'Failed to cancel order');
      }
    } catch (e: any) {
      alert(e.message || 'Error cancelling order');
    } finally {
      setCancellingId(null);
    }
  };

  // Scenario Trigger
  const handleTriggerScenario = async (scenario: string) => {
    const res = await fetch(`${apiBase}/api/admin/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error || 'Scenario error');
    }
  };

  // Admin Resume Action
  const handleResume = async (token: string) => {
    const res = await fetch(`${apiBase}/api/admin/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({ adminToken: token }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.error || data.message || 'Failed to resume' };
    }
    return { success: true };
  };

  // Admin Reset Reference
  const handleResetReference = async (
    newPriceRupees: number,
    reason: string,
    token: string
  ) => {
    const res = await fetch(`${apiBase}/api/admin/reference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': token,
      },
      body: JSON.stringify({
        referencePriceRupees: newPriceRupees,
        reason,
        adminToken: token,
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, message: data.error || data.message || 'Failed to update reference' };
    }
    return { success: true };
  };

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('mtx_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
    localStorage.setItem('mtx_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#060913] text-slate-100' : 'bg-[#f1f5f9] text-slate-900'} flex flex-col font-sans selection:bg-sky-500/30 selection:text-white transition-colors duration-200`}>
      {/* Premier Frosted Glass Exchange Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        breaker={breaker}
        metrics={metrics}
        snapshot={snapshot}
        isConnected={isConnected}
        backendTarget={backendTarget}
        onToggleTarget={() => setBackendTarget(prev => prev === 'railway' ? 'local' : 'railway')}
        onOpenAdmin={() => setIsAdminOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        walletBalance={walletBalance}
        onOpenWallet={() => setIsWalletOpen(true)}
      />

      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 py-4 flex flex-col">
        {/* Volatility Circuit Breaker Alert Banner (shown across all tabs if tripped) */}
        <CircuitBreakerBanner
          breaker={breaker}
          onResume={() => handleResume('demo-admin-secret-mtx-2026')}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Tab 1: Live Trading Terminal */}
        {currentTab === 'trade' && (
          <div className="flex flex-col gap-4">
            {/* 4 Hackathon Interactive Demo Controls */}
            <ScenarioControls
              onTriggerScenario={handleTriggerScenario}
              disabled={!isConnected}
            />

            {/* Real-Time Metrics & Microsecond Latency Bar */}
            <MetricsBar metrics={metrics} />

            {/* Main Trading Terminal Layout: Professional Institutional Exchange Grid */}
            <div className="grid grid-cols-12 gap-4 flex-1">
              {/* Left Column (3 cols): Order Entry Pad & Contract Summary */}
              <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
                <OrderForm breaker={breaker} onSubmitOrder={handleSubmitOrder} />
                <div className="glass-panel p-4 text-xs text-slate-400 space-y-2">
                  <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center justify-between">
                    <span>Matching Mechanics</span>
                    <span className="text-[10px] text-sky-400 font-mono">C++20 FIFO</span>
                  </h4>
                  <ul className="space-y-1.5 text-[11px] list-disc list-inside text-slate-400">
                    <li>Price-Time Priority (FIFO queues)</li>
                    <li>Resting order price determines execution</li>
                    <li>Candidate trades pre-verified against ±5% band</li>
                    <li>Violations trip 30s halt cooldown</li>
                  </ul>
                </div>
              </div>

              {/* Center Column (5 cols): Institutional Level 2 Order Book Ladder */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
                <div className="flex-1">
                  <OrderBookView snapshot={snapshot} />
                </div>
              </div>

              {/* Right Column (4 cols): Market Depth Visualizer & Real-Time Executions */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                <DepthChart snapshot={snapshot} />
                <div className="flex-1">
                  <TradesTable trades={trades} />
                </div>
              </div>
            </div>

            {/* Bottom Section: Orders Activity & Cancellations */}
            <div className="mt-1">
              <OrdersTable
                orders={orders}
                onCancelOrder={handleCancelOrder}
                cancellingId={cancellingId}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Markets & Instrument Specifications */}
        {currentTab === 'markets' && (
          <MarketsView breaker={breaker} snapshot={snapshot} />
        )}

        {/* Tab 3: Microsecond Latency Performance & Benchmarks */}
        {currentTab === 'performance' && (
          <PerformanceView
            metrics={metrics}
            onRunBurst={async () => {
              await handleTriggerScenario('BURST_VOLUME');
            }}
          />
        )}

        {/* Tab 4: Live PostgreSQL Database Explorer & WAL Journal */}
        {currentTab === 'database' && (
          <DatabaseView apiBase={apiBase} />
        )}

        {/* Tab 5: Interactive API Docs & Jury Demonstration Walkthrough */}
        {currentTab === 'docs' && (
          <DocsView apiBase={apiBase} />
        )}
      </main>

      {/* Operator Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        breaker={breaker}
        onResume={handleResume}
        onResetReference={handleResetReference}
      />

      {/* Wallet Deposit / Withdraw Modal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        apiBase={apiBase}
        currentBalance={walletBalance}
        onBalanceUpdated={fetchWalletBalance}
      />
    </div>
  );
};

export default TradingTerminal;
