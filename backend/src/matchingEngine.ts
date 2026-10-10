import {
  CancelOrderResult,
  EngineMetrics,
  Order,
  OrderBookSnapshot,
  OrderStatus,
  PriceLevel,
  Side,
  SubmitOrderResult,
  Trade,
} from './types';
import { OrderBook } from './orderBook';
import { CircuitBreaker } from './circuitBreaker';

interface IdempotencyRecord {
  payload: {
    orderId: string;
    participantId: string;
    symbol: string;
    side: Side;
    priceTicks: number;
    quantity: number;
  };
  result: SubmitOrderResult;
}

export class MatchingEngine {
  private book: OrderBook;
  private breaker: CircuitBreaker;
  private sequenceCounter: number = 0;
  private tradeCounter: number = 0;
  private startTimeMs: number = Date.now();

  private idempotencyMap: Map<string, IdempotencyRecord> = new Map();
  private orderHistory: Map<string, Order> = new Map();
  private trades: Trade[] = [];

  private totalOrdersAccepted: number = 0;
  private totalOrdersRejected: number = 0;
  private totalOrdersCancelled: number = 0;
  private totalTradesExecuted: number = 0;
  private totalBreakerTrips: number = 0;

  private lastLatencyMicros: number = 0;
  private latencyReservoir: number[] = [];

  constructor(
    initialReferenceTicks = 10000,
    bandPercent = 5.0,
    minHaltDurationSeconds = 30
  ) {
    this.book = new OrderBook('DEMO');
    this.breaker = new CircuitBreaker(initialReferenceTicks, bandPercent, minHaltDurationSeconds);
  }

  public submitOrder(
    orderId: string,
    requestId: string,
    participantId: string,
    symbol: string,
    side: Side,
    priceTicks: number,
    quantity: number
  ): SubmitOrderResult {
    const tStart = performance.now();

    // 1. Validation
    if (symbol !== 'DEMO') {
      this.totalOrdersRejected++;
      return {
        success: false,
        errorMessage: `Unsupported symbol: '${symbol}'. Only 'DEMO' is supported.`,
        generatedTrades: [],
        breakerTriggered: false,
        sequenceId: this.sequenceCounter,
      };
    }

    if (!['BUY', 'SELL'].includes(side)) {
      this.totalOrdersRejected++;
      return {
        success: false,
        errorMessage: `Invalid side: '${side}'. Must be 'BUY' or 'SELL'.`,
        generatedTrades: [],
        breakerTriggered: false,
        sequenceId: this.sequenceCounter,
      };
    }

    if (priceTicks <= 0 || !Number.isInteger(priceTicks)) {
      this.totalOrdersRejected++;
      return {
        success: false,
        errorMessage: 'Price ticks must be a strictly positive integer (> 0).',
        generatedTrades: [],
        breakerTriggered: false,
        sequenceId: this.sequenceCounter,
      };
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      this.totalOrdersRejected++;
      return {
        success: false,
        errorMessage: 'Quantity must be a strictly positive integer (> 0).',
        generatedTrades: [],
        breakerTriggered: false,
        sequenceId: this.sequenceCounter,
      };
    }

    const MAX_LIMIT = 1_000_000_000_000;
    if (priceTicks > MAX_LIMIT || quantity > MAX_LIMIT) {
      this.totalOrdersRejected++;
      return {
        success: false,
        errorMessage: 'Numeric overflow guard: price or quantity exceeds maximum permitted limits.',
        generatedTrades: [],
        breakerTriggered: false,
        sequenceId: this.sequenceCounter,
      };
    }

    // 2. Idempotency checking
    const payload = {
      orderId: orderId || '',
      participantId: participantId || 'DEFAULT_TRADER',
      symbol,
      side,
      priceTicks,
      quantity,
    };

    if (this.idempotencyMap.has(requestId)) {
      const existing = this.idempotencyMap.get(requestId)!;
      const isIdentical =
        existing.payload.side === payload.side &&
        existing.payload.priceTicks === payload.priceTicks &&
        existing.payload.quantity === payload.quantity &&
        existing.payload.symbol === payload.symbol &&
        existing.payload.participantId === payload.participantId;

      if (isIdentical) {
        // Retry -> return original result
        return existing.result;
      } else {
        // Conflict -> reject
        this.totalOrdersRejected++;
        return {
          success: false,
          errorMessage: `Idempotency conflict: requestId '${requestId}' was previously used with a different order payload.`,
          generatedTrades: [],
          breakerTriggered: false,
          sequenceId: this.sequenceCounter,
        };
      }
    }

    // 3. Volatility circuit breaker check
    if (!this.breaker.canAcceptNewOrders()) {
      this.totalOrdersRejected++;
      return {
        success: false,
        errorMessage: 'Trading is currently HALTED by volatility circuit breaker. Order submission rejected.',
        generatedTrades: [],
        breakerTriggered: false,
        sequenceId: this.sequenceCounter,
      };
    }

    // 4. Sequencer
    const seq = ++this.sequenceCounter;

    // 5. Build order object
    const finalOrderId = orderId || `ORD-${seq}`;
    const order: Order = {
      orderId: finalOrderId,
      requestId,
      participantId: participantId || 'DEFAULT_TRADER',
      symbol,
      side,
      priceTicks,
      originalQuantity: quantity,
      remainingQuantity: quantity,
      status: 'NEW',
      acceptanceSequence: seq,
      timestampNs: Date.now() * 1_000_000,
    };

    // 6. Matching against resting book
    let haltedDuringMatch = false;
    const generatedTrades: Trade[] = [];

    if (side === 'BUY') {
      const asks = this.book.getAsksMap();
      while (order.remainingQuantity > 0 && asks.size > 0) {
        // Lowest ask has priority
        let bestAskPrice = Infinity;
        for (const p of asks.keys()) {
          if (p < bestAskPrice) bestAskPrice = p;
        }

        // Buy limit must be >= sell limit
        if (order.priceTicks < bestAskPrice) break;

        // Candidate execution price is the resting order's price
        const check = this.breaker.validateExecutionPrice(bestAskPrice, seq);
        if (!check.valid) {
          // Breaker tripped! Do NOT execute this candidate trade!
          haltedDuringMatch = true;
          this.totalBreakerTrips++;
          break;
        }

        const queue = asks.get(bestAskPrice)!;
        const restingOrder = queue[0];
        const matchQty = Math.min(order.remainingQuantity, restingOrder.remainingQuantity);

        const trade: Trade = {
          tradeId: `TRD-${++this.tradeCounter}`,
          symbol,
          makerOrderId: restingOrder.orderId,
          takerOrderId: order.orderId,
          makerParticipantId: restingOrder.participantId,
          takerParticipantId: order.participantId,
          priceTicks: bestAskPrice, // RESTING ORDER PRICE
          quantity: matchQty,
          sequenceId: ++this.sequenceCounter,
          timestampNs: Date.now() * 1_000_000,
        };

        generatedTrades.push(trade);
        this.trades.push(trade);

        order.remainingQuantity -= matchQty;
        restingOrder.remainingQuantity -= matchQty;

        if (restingOrder.remainingQuantity === 0) {
          restingOrder.status = 'FILLED';
          queue.shift();
          this.book.removeOrder(restingOrder.orderId);
        } else {
          restingOrder.status = 'PARTIALLY_FILLED';
        }

        if (queue.length === 0) {
          asks.delete(bestAskPrice);
        }
      }
    } else {
      // SELL
      const bids = this.book.getBidsMap();
      while (order.remainingQuantity > 0 && bids.size > 0) {
        // Highest bid has priority
        let bestBidPrice = -Infinity;
        for (const p of bids.keys()) {
          if (p > bestBidPrice) bestBidPrice = p;
        }

        // Sell limit must be <= buy limit
        if (order.priceTicks > bestBidPrice) break;

        // Candidate execution price is the resting order's price
        const check = this.breaker.validateExecutionPrice(bestBidPrice, seq);
        if (!check.valid) {
          // Breaker tripped! Do NOT execute this candidate trade!
          haltedDuringMatch = true;
          this.totalBreakerTrips++;
          break;
        }

        const queue = bids.get(bestBidPrice)!;
        const restingOrder = queue[0];
        const matchQty = Math.min(order.remainingQuantity, restingOrder.remainingQuantity);

        const trade: Trade = {
          tradeId: `TRD-${++this.tradeCounter}`,
          symbol,
          makerOrderId: restingOrder.orderId,
          takerOrderId: order.orderId,
          makerParticipantId: restingOrder.participantId,
          takerParticipantId: order.participantId,
          priceTicks: bestBidPrice, // RESTING ORDER PRICE
          quantity: matchQty,
          sequenceId: ++this.sequenceCounter,
          timestampNs: Date.now() * 1_000_000,
        };

        generatedTrades.push(trade);
        this.trades.push(trade);

        order.remainingQuantity -= matchQty;
        restingOrder.remainingQuantity -= matchQty;

        if (restingOrder.remainingQuantity === 0) {
          restingOrder.status = 'FILLED';
          queue.shift();
          this.book.removeOrder(restingOrder.orderId);
        } else {
          restingOrder.status = 'PARTIALLY_FILLED';
        }

        if (queue.length === 0) {
          bids.delete(bestBidPrice);
        }
      }
    }

    // Determine final order status
    if (order.remainingQuantity === 0) {
      order.status = 'FILLED';
    } else if (order.remainingQuantity < order.originalQuantity) {
      order.status = 'PARTIALLY_FILLED';
      if (!haltedDuringMatch) {
        this.book.addOrder(order);
      }
    } else {
      order.status = 'NEW';
      if (!haltedDuringMatch) {
        this.book.addOrder(order);
      }
    }

    this.orderHistory.set(order.orderId, order);
    this.totalOrdersAccepted++;
    this.totalTradesExecuted += generatedTrades.length;

    const result: SubmitOrderResult = {
      success: true,
      order,
      generatedTrades,
      breakerTriggered: haltedDuringMatch,
      sequenceId: this.sequenceCounter,
    };

    // Store idempotency record
    this.idempotencyMap.set(requestId, { payload, result });

    // Latency
    const elapsedMicros = (performance.now() - tStart) * 1000;
    this.recordLatency(elapsedMicros);

    return result;
  }

  public cancelOrder(orderId: string, participantId?: string): CancelOrderResult {
    const tStart = performance.now();
    const seq = ++this.sequenceCounter;

    const resting = this.book.findOrder(orderId);
    if (!resting) {
      const historical = this.orderHistory.get(orderId);
      if (historical) {
        return {
          success: false,
          errorMessage: `Order cannot be cancelled: order is already ${historical.status}.`,
          sequenceId: seq,
        };
      }
      return {
        success: false,
        errorMessage: `Order not found with orderId: ${orderId}`,
        sequenceId: seq,
      };
    }

    if (resting.remainingQuantity <= 0) {
      return {
        success: false,
        errorMessage: 'Order has no remaining quantity to cancel.',
        sequenceId: seq,
      };
    }

    if (participantId && resting.participantId !== participantId) {
      return {
        success: false,
        errorMessage: 'Unauthorized: participant ID mismatch.',
        sequenceId: seq,
      };
    }

    this.book.removeOrder(orderId);
    resting.status = 'CANCELLED';
    this.totalOrdersCancelled++;

    const result: CancelOrderResult = {
      success: true,
      cancelledOrder: resting,
      sequenceId: seq,
    };

    const elapsedMicros = (performance.now() - tStart) * 1000;
    this.recordLatency(elapsedMicros);

    return result;
  }

  public matchCrossedRestingOrders(): Trade[] {
    const trades: Trade[] = [];
    const bids = this.book.getBidsMap();
    const asks = this.book.getAsksMap();

    while (bids.size > 0 && asks.size > 0) {
      let bestBidPrice = -Infinity;
      for (const p of bids.keys()) {
        if (p > bestBidPrice) bestBidPrice = p;
      }

      let bestAskPrice = Infinity;
      for (const p of asks.keys()) {
        if (p < bestAskPrice) bestAskPrice = p;
      }

      if (bestBidPrice < bestAskPrice) break; // Not crossed

      const bidQueue = bids.get(bestBidPrice)!;
      const askQueue = asks.get(bestAskPrice)!;
      if (bidQueue.length === 0 || askQueue.length === 0) break;

      const topBid = bidQueue[0];
      const topAsk = askQueue[0];

      // Execution price rule: older resting order determines execution price
      const execPrice = topBid.acceptanceSequence < topAsk.acceptanceSequence
        ? topBid.priceTicks
        : topAsk.priceTicks;

      const check = this.breaker.validateExecutionPrice(execPrice, ++this.sequenceCounter);
      if (!check.valid) {
        this.totalBreakerTrips++;
        break;
      }

      const matchQty = Math.min(topBid.remainingQuantity, topAsk.remainingQuantity);
      const trade: Trade = {
        tradeId: `TRD-${++this.tradeCounter}`,
        symbol: 'DEMO',
        makerOrderId: topAsk.acceptanceSequence < topBid.acceptanceSequence ? topAsk.orderId : topBid.orderId,
        takerOrderId: topAsk.acceptanceSequence < topBid.acceptanceSequence ? topBid.orderId : topAsk.orderId,
        makerParticipantId: topAsk.acceptanceSequence < topBid.acceptanceSequence ? topAsk.participantId : topBid.participantId,
        takerParticipantId: topAsk.acceptanceSequence < topBid.acceptanceSequence ? topBid.participantId : topAsk.participantId,
        priceTicks: execPrice,
        quantity: matchQty,
        sequenceId: ++this.sequenceCounter,
        timestampNs: Date.now() * 1_000_000,
      };

      trades.push(trade);
      this.trades.push(trade);

      topBid.remainingQuantity -= matchQty;
      topAsk.remainingQuantity -= matchQty;

      if (topBid.remainingQuantity === 0) {
        topBid.status = 'FILLED';
        bidQueue.shift();
        this.book.removeOrder(topBid.orderId);
      } else {
        topBid.status = 'PARTIALLY_FILLED';
      }

      if (topAsk.remainingQuantity === 0) {
        topAsk.status = 'FILLED';
        askQueue.shift();
        this.book.removeOrder(topAsk.orderId);
      } else {
        topAsk.status = 'PARTIALLY_FILLED';
      }

      if (bidQueue.length === 0) bids.delete(bestBidPrice);
      if (askQueue.length === 0) asks.delete(bestAskPrice);
    }

    this.totalTradesExecuted += trades.length;
    return trades;
  }

  public resume(
    operatorToken: string,
    expectedToken: string,
    force: boolean = false
  ): { success: boolean; error?: string; resumedTrades?: Trade[] } {
    const seq = ++this.sequenceCounter;
    const res = this.breaker.resume(seq, operatorToken, expectedToken, force);
    if (!res.success) {
      return res;
    }

    const resumedTrades = this.matchCrossedRestingOrders();
    return { success: true, resumedTrades };
  }

  public resetReferencePrice(
    newReferenceTicks: number,
    reason: string,
    operatorToken: string,
    expectedToken: string
  ): { success: boolean; error?: string } {
    const seq = ++this.sequenceCounter;
    return this.breaker.resetReferencePrice(newReferenceTicks, reason, seq, operatorToken, expectedToken);
  }

  public getBookSnapshot(): OrderBookSnapshot {
    return this.book.getSnapshot(this.sequenceCounter);
  }

  public getBreakerStatus() {
    return this.breaker.getStatus();
  }

  public getRecentTrades(limit = 50): Trade[] {
    return this.trades.slice(-limit).reverse();
  }

  public getOrders(limit = 100): Order[] {
    const list = Array.from(this.orderHistory.values());
    return list.slice(-limit).reverse();
  }

  public getMetrics(): EngineMetrics {
    const uptimeSec = Math.max(1, (Date.now() - this.startTimeMs) / 1000);
    let p50 = 0, p95 = 0, p99 = 0;

    if (this.latencyReservoir.length > 0) {
      const sorted = [...this.latencyReservoir].sort((a, b) => a - b);
      p50 = sorted[Math.floor(sorted.length * 0.50)];
      p95 = sorted[Math.floor(sorted.length * 0.95)];
      p99 = sorted[Math.floor(sorted.length * 0.99)];
    }

    return {
      totalOrdersAccepted: this.totalOrdersAccepted,
      totalOrdersRejected: this.totalOrdersRejected,
      totalOrdersCancelled: this.totalOrdersCancelled,
      totalTradesExecuted: this.totalTradesExecuted,
      totalBreakerTrips: this.totalBreakerTrips,
      lastProcessingLatencyMicros: this.lastLatencyMicros,
      p50LatencyMicros: p50,
      p95LatencyMicros: p95,
      p99LatencyMicros: p99,
      ordersPerSecond: Math.round((this.totalOrdersAccepted / uptimeSec) * 10) / 10,
      sequenceNumber: this.sequenceCounter,
      uptimeSeconds: Math.floor(uptimeSec),
    };
  }

  public currentSequence(): number {
    return this.sequenceCounter;
  }

  private recordLatency(micros: number): void {
    this.lastLatencyMicros = Math.round(micros * 10) / 10;
    if (this.latencyReservoir.length < 10000) {
      this.latencyReservoir.push(micros);
    } else {
      this.latencyReservoir[Math.floor(Math.random() * 10000)] = micros;
    }
  }

  public clear(): void {
    this.book.clear();
    this.orderHistory.clear();
    this.idempotencyMap.clear();
    this.trades = [];
    this.latencyReservoir = [];
    this.totalOrdersAccepted = 0;
    this.totalOrdersRejected = 0;
    this.totalOrdersCancelled = 0;
    this.totalTradesExecuted = 0;
    this.totalBreakerTrips = 0;
    this.sequenceCounter = 0;
    this.tradeCounter = 0;
  }
}
