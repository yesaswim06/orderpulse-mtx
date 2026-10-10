"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Clock,
  Database,
  Flame,
  Play,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import {
  BreakerStatus,
  EngineMetrics,
  Order,
  OrderBookSnapshot,
  Side,
  Trade,
} from "@/lib/types";
import {
  formatRupees,
  formatQuantity,
  SCENARIOS,
  SITE_CONFIG,
} from "@/lib/data";
import {
  fetchBreakerStatus,
  fetchMetrics,
  fetchOrderBook,
  fetchOrders,
  fetchTrades,
  getWsUrl,
  submitOrder,
  cancelOrder,
  triggerScenario,
  resumeTrading,
  resetReferencePrice,
} from "@/lib/api";
import {
  INITIAL_SIMULATED_BOOK,
  INITIAL_SIMULATED_BREAKER,
  INITIAL_SIMULATED_METRICS,
  INITIAL_SIMULATED_TRADES,
} from "@/lib/simulator";

export default function TradingTerminalLive() {
  const [snapshot, setSnapshot] = useState<OrderBookSnapshot>(INITIAL_SIMULATED_BOOK);
  const [breaker, setBreaker] = useState<BreakerStatus>(INITIAL_SIMULATED_BREAKER);
  const [metrics, setMetrics] = useState<EngineMetrics>(INITIAL_SIMULATED_METRICS);
  const [trades, setTrades] = useState<Trade[]>(INITIAL_SIMULATED_TRADES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLiveBackend, setIsLiveBackend] = useState<boolean>(false);

  // Order Entry State
  const [orderSide, setOrderSide] = useState<Side>("BUY");
  const [orderPrice, setOrderPrice] = useState<string>("100.00");
  const [orderQty, setOrderQty] = useState<string>("10");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderNotice, setOrderNotice] = useState<{ text: string; error?: boolean } | null>(null);

  // Operator Action State
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [isResuming, setIsResuming] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  // Sync state from Backend
  const refreshState = useCallback(async () => {
    const [bookRes, breakerRes, metricsRes, tradesRes, ordersRes] = await Promise.all([
      fetchOrderBook(),
      fetchBreakerStatus(),
      fetchMetrics(),
      fetchTrades(25),
      fetchOrders(25),
    ]);

    if (bookRes) {
      setSnapshot(bookRes);
      setIsLiveBackend(true);
    }
    if (breakerRes) setBreaker(breakerRes);
    if (metricsRes) setMetrics(metricsRes);
    if (tradesRes.length > 0) setTrades(tradesRes);
    if (ordersRes.length > 0) setOrders(ordersRes);
  }, []);

  // WebSocket lifecycle
  useEffect(() => {
    let reconnectTimer: any;

    const connect = () => {
      try {
        const ws = new WebSocket(getWsUrl());
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          setIsLiveBackend(true);
          refreshState();
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "SNAPSHOT") {
              if (data.book) setSnapshot(data.book);
              if (data.breaker) setBreaker(data.breaker);
              if (data.metrics) setMetrics(data.metrics);
              if (data.trades) setTrades(data.trades);
              if (data.orders) setOrders(data.orders);
            } else if (data.type === "TICK_UPDATE") {
              if (data.breaker) setBreaker(data.breaker);
              if (data.metrics) setMetrics(data.metrics);
            } else if (data.type === "ORDER_SUBMITTED") {
              if (data.book) setSnapshot(data.book);
              if (data.breaker) setBreaker(data.breaker);
              if (data.metrics) setMetrics(data.metrics);
              if (data.order) setOrders((prev) => [data.order, ...prev.slice(0, 24)]);
              if (data.trades && data.trades.length > 0) {
                setTrades((prev) => [...data.trades.reverse(), ...prev.slice(0, 24)]);
              }
            } else if (data.type === "ORDER_CANCELLED") {
              if (data.book) setSnapshot(data.book);
              if (data.metrics) setMetrics(data.metrics);
              if (data.cancelledOrder) {
                setOrders((prev) =>
                  prev.map((o) =>
                    o.orderId === data.cancelledOrder.orderId ? data.cancelledOrder : o
                  )
                );
              }
            }
          } catch {}
        };

        ws.onclose = () => {
          setIsConnected(false);
          reconnectTimer = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        setIsConnected(false);
      }
    };

    connect();
    refreshState();

    return () => {
      clearTimeout(reconnectTimer);
      if (wsRef.current) wsRef.current.close();
    };
  }, [refreshState]);

  // Submit Order Form
  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderNotice(null);

    const priceNum = parseFloat(orderPrice);
    const qtyNum = parseInt(orderQty, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      setOrderNotice({ text: "Please enter a valid price in rupees (> ₹0.00)", error: true });
      return;
    }

    if (isNaN(qtyNum) || qtyNum <= 0) {
      setOrderNotice({ text: "Please enter a positive integer quantity", error: true });
      return;
    }

    const priceTicks = Math.round(priceNum * 100);

    setIsSubmitting(true);
    const result = await submitOrder({
      participantId: "TRADER-DEMO",
      symbol: "DEMO",
      side: orderSide,
      priceTicks,
      quantity: qtyNum,
    });
    setIsSubmitting(false);

    if (result.success) {
      setOrderNotice({
        text: `Submitted ${orderSide} ${qtyNum} @ ₹${priceNum.toFixed(2)} successfully.`,
      });
      setTimeout(() => setOrderNotice(null), 3500);
    } else {
      setOrderNotice({ text: result.message || "Order rejected by engine.", error: true });
    }
  };

  // Cancel order
  const handleCancel = async (orderId: string) => {
    setCancellingId(orderId);
    await cancelOrder(orderId);
    setCancellingId(null);
  };

  // Trigger Scenario
  const handleScenarioRun = async (scenarioId: string) => {
    setActiveScenario(scenarioId);
    const res = await triggerScenario(scenarioId);
    if (!res.success) {
      alert(res.message || "Failed to trigger scenario");
    }
    setTimeout(() => setActiveScenario(null), 2500);
  };

  // Operator Resume
  const handleOperatorResume = async () => {
    setIsResuming(true);
    const res = await resumeTrading();
    setIsResuming(false);
    if (!res.success) {
      alert(res.message || "Failed to resume trading");
    }
  };

  // Mid Price Calculation
  const midPricePaisa =
    snapshot.bestBidTicks && snapshot.bestAskTicks
      ? (snapshot.bestBidTicks + snapshot.bestAskTicks) / 2
      : breaker.referencePriceTicks;

  const maxBidQty = Math.max(...snapshot.bids.map((b) => b.quantity), 1);
  const maxAskQty = Math.max(...snapshot.asks.map((a) => a.quantity), 1);

  return (
    <div className="w-full flex flex-col gap-5 text-xs text-[#E5E7EB]">
      {/* 1. Header Market Strip */}
      <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center font-bold text-white shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">DEMO / INR</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-emerald-400 border border-emerald-500/20">
                  Continuous
                </span>
              </div>
              <span className="text-[11px] text-[#737373]">Single-Symbol In-Memory Auction</span>
            </div>
          </div>

          <div className="h-7 w-[1px] bg-white/10 hidden sm:block" />

          {/* Pricing Metrics */}
          <div className="flex items-center gap-5 font-mono-numbers">
            <div>
              <span className="text-[10px] text-[#737373] block uppercase tracking-wider">Mid Price</span>
              <span className="text-sm font-bold text-white">{formatRupees(midPricePaisa)}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#737373] block uppercase tracking-wider">Ref Price</span>
              <span className="text-sm font-bold text-sky-400">{formatRupees(breaker.referencePriceTicks)}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#737373] block uppercase tracking-wider">Collar (±5%)</span>
              <span className="text-xs font-semibold text-neutral-300">
                {formatRupees(breaker.lowerBandTicks)} – {formatRupees(breaker.upperBandTicks)}
              </span>
            </div>
          </div>
        </div>

        {/* Engine State Indicator & WebSocket Status */}
        <div className="flex items-center gap-3">
          {breaker.state === "RUNNING" && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>RUNNING</span>
            </div>
          )}

          {breaker.state === "HALTED" && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/40 text-red-300 font-bold text-[11px] animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>HALTED ({breaker.remainingHaltSeconds}s)</span>
            </div>
          )}

          {breaker.state === "READY_TO_RESUME" && (
            <button
              onClick={handleOperatorResume}
              disabled={isResuming}
              className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold text-[11px] cursor-pointer transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>{isResuming ? "Resuming..." : "Operator Resume"}</span>
            </button>
          )}

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] ${
              isConnected
                ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-400"
                : "bg-neutral-900 border-white/10 text-neutral-400"
            }`}
          >
            {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isConnected ? "WS Online" : isLiveBackend ? "Connecting" : "Demo Simulator"}</span>
          </div>
        </div>
      </div>

      {/* 2. Circuit Breaker Alert Banner (when halted) */}
      {breaker.state !== "RUNNING" && (
        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold">Circuit Breaker Tripped: </span>
              <span className="text-amber-100/90">
                {breaker.tripReason || "Candidate fill breached ±5% dynamic collar."}
              </span>
              <span className="text-amber-400/80 ml-2">
                New submissions rejected. Order cancellations allowed.
              </span>
            </div>
          </div>

          {breaker.state === "READY_TO_RESUME" && (
            <button
              onClick={handleOperatorResume}
              disabled={isResuming}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shrink-0 cursor-pointer shadow-md transition"
            >
              Resume Trading Now
            </button>
          )}
        </div>
      )}

      {/* 3. Main Dashboard 3-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (4 cols): Order Entry & Circuit Breaker Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Order Entry Card */}
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex flex-col gap-3.5">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
              <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Limit Order Entry</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-400">DEMO · INR</span>
            </div>

            {/* Buy / Sell Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-[#121212] p-1 rounded-xl border border-white/[0.06]">
              <button
                type="button"
                onClick={() => setOrderSide("BUY")}
                className={`py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                  orderSide === "BUY"
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Buy DEMO
              </button>
              <button
                type="button"
                onClick={() => setOrderSide("SELL")}
                className={`py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                  orderSide === "SELL"
                    ? "bg-red-500 text-white shadow-md shadow-red-500/20"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Sell DEMO
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] text-[#9CA3AF] mb-1 block">Limit Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 font-mono">₹</span>
                  <input
                    type="number"
                    step="0.05"
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#121212] border border-white/10 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#9CA3AF] mb-1 block">Quantity (Units)</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#121212] border border-white/10 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              {orderNotice && (
                <div
                  className={`p-2 rounded-xl text-[11px] font-medium flex items-center gap-1.5 ${
                    orderNotice.error
                      ? "bg-red-950/40 text-red-300 border border-red-500/30"
                      : "bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{orderNotice.text}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting || breaker.state !== "RUNNING"}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    orderSide === "BUY"
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-40"
                      : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 disabled:opacity-40"
                  }`}
                >
                  <span>
                    {isSubmitting
                      ? "Submitting..."
                      : breaker.state !== "RUNNING"
                      ? "Halted"
                      : `Submit ${orderSide} Order`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderPrice("100.00");
                    setOrderQty("10");
                    setOrderNotice(null);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-[#151515] hover:bg-[#1A1A1A] border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Reset form"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

          {/* Interactive Simulation Scenarios Card */}
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex flex-col gap-2.5">
            <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Scenarios</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => handleScenarioRun(sc.id)}
                  disabled={activeScenario === sc.id}
                  className="p-2.5 rounded-xl bg-[#121212] hover:bg-[#181818] border border-white/[0.08] hover:border-white/20 text-left transition cursor-pointer disabled:opacity-60 group"
                >
                  <span className="text-[11px] font-bold text-white group-hover:text-emerald-400 block truncate">
                    {sc.name.split(":")[1] || sc.name}
                  </span>
                  <span className="text-[9px] text-[#737373] block mt-0.5 truncate">
                    {sc.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column (5 cols): Order Book Level-2 Ladder */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex flex-col gap-3 font-mono-numbers">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5 font-sans">
            <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>L2 Order Book</span>
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-neutral-500">Spread:</span>
              <span className="font-bold text-neutral-300">
                {snapshot.spreadTicks !== null
                  ? `${formatRupees(snapshot.spreadTicks)} (${snapshot.spreadTicks}t)`
                  : "—"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[11px]">
            {/* Bids Ladder (Buy side) */}
            <div className="flex flex-col">
              <div className="flex justify-between text-[#737373] pb-1 border-b border-white/[0.05] text-[10px] uppercase font-sans">
                <span>Qty</span>
                <span className="text-right">Bid (₹)</span>
              </div>
              <div className="flex flex-col gap-1 mt-1.5">
                {snapshot.bids.length === 0 ? (
                  <div className="py-8 text-center text-[#737373] text-[10px] font-sans">
                    No active bids resting
                  </div>
                ) : (
                  snapshot.bids.slice(0, 7).map((level, idx) => (
                    <div
                      key={`bid-${level.priceTicks}-${idx}`}
                      className="relative flex justify-between items-center px-1.5 py-1 rounded bg-[#101010] overflow-hidden"
                    >
                      <div
                        className="absolute right-0 top-0 bottom-0 bg-emerald-500/15 pointer-events-none transition-all"
                        style={{ width: `${(level.quantity / maxBidQty) * 100}%` }}
                      />
                      <span className="relative z-10 text-neutral-400">{formatQuantity(level.quantity)}</span>
                      <span className="relative z-10 font-bold text-emerald-400">
                        {formatRupees(level.priceTicks)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Asks Ladder (Sell side) */}
            <div className="flex flex-col">
              <div className="flex justify-between text-[#737373] pb-1 border-b border-white/[0.05] text-[10px] uppercase font-sans">
                <span>Ask (₹)</span>
                <span className="text-right">Qty</span>
              </div>
              <div className="flex flex-col gap-1 mt-1.5">
                {snapshot.asks.length === 0 ? (
                  <div className="py-8 text-center text-[#737373] text-[10px] font-sans">
                    No active asks resting
                  </div>
                ) : (
                  snapshot.asks.slice(0, 7).map((level, idx) => (
                    <div
                      key={`ask-${level.priceTicks}-${idx}`}
                      className="relative flex justify-between items-center px-1.5 py-1 rounded bg-[#101010] overflow-hidden"
                    >
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-red-500/15 pointer-events-none transition-all"
                        style={{ width: `${(level.quantity / maxAskQty) * 100}%` }}
                      />
                      <span className="relative z-10 font-bold text-red-400">
                        {formatRupees(level.priceTicks)}
                      </span>
                      <span className="relative z-10 text-neutral-400">{formatQuantity(level.quantity)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (3 cols): Executed Trades & Live Telemetry */}
        <div className="lg:col-span-3 flex flex-col gap-4 font-mono-numbers">
          {/* Recent Trades Table */}
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex flex-col gap-2.5">
            <span className="font-bold text-white text-xs uppercase tracking-wider flex items-center justify-between font-sans">
              <span>Recent Executions</span>
              <span className="text-[10px] text-neutral-500">FIFO</span>
            </span>

            <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
              {trades.length === 0 ? (
                <div className="py-6 text-center text-[#737373] text-[11px] font-sans">
                  Awaiting matches...
                </div>
              ) : (
                trades.slice(0, 7).map((t, i) => (
                  <div
                    key={`${t.tradeId}-${i}`}
                    className="flex justify-between items-center p-1.5 rounded bg-[#121212] text-[11px]"
                  >
                    <span
                      className={`font-bold ${
                        t.aggressorSide === "BUY" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {formatRupees(t.priceTicks)}
                    </span>
                    <span className="text-neutral-300">{formatQuantity(t.quantity)}</span>
                    <span className="text-[10px] text-neutral-500">
                      {new Date(t.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Microsecond Engine Metrics Bar */}
          <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex flex-col gap-2">
            <span className="font-bold text-white text-xs uppercase tracking-wider font-sans">
              Engine Performance
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-[#121212]">
                <span className="text-[10px] text-neutral-500 block font-sans">p50 Latency</span>
                <span className="font-bold text-emerald-400">{metrics.p50LatencyMicros.toFixed(1)} µs</span>
              </div>
              <div className="p-2 rounded-xl bg-[#121212]">
                <span className="text-[10px] text-neutral-500 block font-sans">Throughput</span>
                <span className="font-bold text-sky-400">{metrics.ordersPerSecond} ops/s</span>
              </div>
              <div className="p-2 rounded-xl bg-[#121212]">
                <span className="text-[10px] text-neutral-500 block font-sans">Orders</span>
                <span className="font-bold text-neutral-200">{metrics.ordersProcessed}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#121212]">
                <span className="text-[10px] text-neutral-500 block font-sans">Trades</span>
                <span className="font-bold text-neutral-200">{metrics.tradesExecuted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Open Orders Table */}
      {orders.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/10 flex flex-col gap-2.5">
          <span className="font-bold text-white text-xs uppercase tracking-wider">
            Active Resting Orders
          </span>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono-numbers">
              <thead>
                <tr className="text-[10px] text-neutral-500 uppercase border-b border-white/[0.06]">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Side</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">Original</th>
                  <th className="pb-2">Remaining</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-[11px]">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.orderId} className="hover:bg-white/[0.02]">
                    <td className="py-2 text-neutral-400 font-mono">{o.orderId}</td>
                    <td className="py-2">
                      <span
                        className={`font-bold ${
                          o.side === "BUY" ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {o.side}
                      </span>
                    </td>
                    <td className="py-2 font-bold text-white">{formatRupees(o.priceTicks)}</td>
                    <td className="py-2 text-neutral-400">{formatQuantity(o.quantity)}</td>
                    <td className="py-2 text-neutral-200">{formatQuantity(o.remainingQuantity)}</td>
                    <td className="py-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.05] text-neutral-300">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      {o.status === "NEW" || o.status === "PARTIALLY_FILLED" ? (
                        <button
                          onClick={() => handleCancel(o.orderId)}
                          disabled={cancellingId === o.orderId}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold cursor-pointer transition"
                        >
                          {cancellingId === o.orderId ? "Cancelling..." : "Cancel"}
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
