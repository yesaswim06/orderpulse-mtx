import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { CircuitBreakerBanner } from './components/CircuitBreakerBanner';
import { MetricsBar } from './components/MetricsBar';
import { ScenarioControls } from './components/ScenarioControls';
import { OrderForm } from './components/OrderForm';
import { OrderBookView } from './components/OrderBookView';
import { DepthChart } from './components/DepthChart';
import { PriceHistoryChart } from './components/PriceHistoryChart';
import { TradesTable } from './components/TradesTable';
import { OrdersTable } from './components/OrdersTable';
import { AdminModal } from './components/AdminModal';
import {
  BreakerStatus,
  EngineMetrics,
  Order,
  OrderBookSnapshot,
  Side,
  Trade,
} from './types';

export const App: React.FC = () => {
  const [snapshot, setSnapshot] = useState<OrderBookSnapshot | null>(null);
  const [breaker, setBreaker] = useState<BreakerStatus | null>(null);
  const [metrics, setMetrics] = useState<EngineMetrics | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const lastSeqRef = useRef<number>(0);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch full state via REST as fallback or init
  const fetchFullState = useCallback(async () => {
    try {
      const [bookRes, breakerRes, metricsRes, tradesRes, ordersRes] = await Promise.all([
        fetch('/api/book'),
        fetch('/api/breaker'),
        fetch('/api/metrics'),
        fetch('/api/trades?limit=30'),
        fetch('/api/orders?limit=30'),
      ]);

      if (bookRes.ok) setSnapshot(await bookRes.json());
      if (breakerRes.ok) setBreaker(await breakerRes.json());
      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (tradesRes.ok) setTrades(await tradesRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (e) {
      console.error('REST poll error:', e);
    }
  }, []);

  // WebSocket Connection & Real-Time Sync
  useEffect(() => {
    let reconnectTimeout: any;

    const connectWs = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;

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
  }, [fetchFullState]);

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

    const res = await fetch('/api/orders', {
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
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
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
    const res = await fetch('/api/admin/scenario', {
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
    const res = await fetch('/api/admin/resume', {
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
    const res = await fetch('/api/admin/reference', {
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

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        breaker={breaker}
        metrics={metrics}
        isConnected={isConnected}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 py-4 flex flex-col">
        {/* Volatility Circuit Breaker Banner */}
        <CircuitBreakerBanner
          breaker={breaker}
          onResume={() => handleResume('demo-admin-secret-mtx-2026')}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 4 Hackathon Interactive Demo Controls */}
        <ScenarioControls
          onTriggerScenario={handleTriggerScenario}
          disabled={!isConnected}
        />

        {/* Real-Time Metrics & Microsecond Latency Bar */}
        <MetricsBar metrics={metrics} />

        {/* Main Trading Terminal Layout */}
        <div className="grid grid-cols-12 gap-4 flex-1">
          {/* Left Column: Order Form */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <OrderForm breaker={breaker} onSubmitOrder={handleSubmitOrder} />
            <div className="bg-trading-card border border-trading-border rounded-xl p-3.5 text-xs text-slate-400 space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Matching Mechanics
              </h4>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-400">
                <li>Price-Time Priority (FIFO queues)</li>
                <li>Resting order price determines execution</li>
                <li>Candidate trades pre-verified against ±5% band</li>
                <li>Violations trip 30s halt cooldown</li>
              </ul>
            </div>
          </div>

          {/* Center Column: Order Book & Depth Chart */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
            <div className="flex-1">
              <OrderBookView snapshot={snapshot} />
            </div>
            <DepthChart snapshot={snapshot} />
          </div>

          {/* Right Column: Price Timeline Chart & Recent Trades */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <PriceHistoryChart trades={trades} breaker={breaker} />
            <div className="flex-1">
              <TradesTable trades={trades} />
            </div>
          </div>
        </div>

        {/* Bottom Section: Orders Activity & Cancellations */}
        <div className="mt-4">
          <OrdersTable
            orders={orders}
            onCancelOrder={handleCancelOrder}
            cancellingId={cancellingId}
          />
        </div>
      </main>

      {/* Operator Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        breaker={breaker}
        onResume={handleResume}
        onResetReference={handleResetReference}
      />
    </div>
  );
};

export default App;
