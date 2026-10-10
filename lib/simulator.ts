import {
  BreakerStatus,
  EngineMetrics,
  Order,
  OrderBookSnapshot,
  Side,
  Trade,
} from './types';

// Clearly labeled fallback simulation state for offline or client-only environments
export const INITIAL_SIMULATED_BOOK: OrderBookSnapshot = {
  symbol: 'DEMO',
  bids: [
    { priceTicks: 9950, quantity: 45, orderCount: 3 },
    { priceTicks: 9900, quantity: 120, orderCount: 5 },
    { priceTicks: 9850, quantity: 80, orderCount: 2 },
    { priceTicks: 9800, quantity: 200, orderCount: 6 },
    { priceTicks: 9750, quantity: 150, orderCount: 4 },
  ],
  asks: [
    { priceTicks: 10050, quantity: 30, orderCount: 2 },
    { priceTicks: 10100, quantity: 95, orderCount: 4 },
    { priceTicks: 10150, quantity: 110, orderCount: 5 },
    { priceTicks: 10200, quantity: 180, orderCount: 6 },
    { priceTicks: 10250, quantity: 240, orderCount: 7 },
  ],
  bestBidTicks: 9950,
  bestAskTicks: 10050,
  spreadTicks: 100,
  timestamp: Date.now(),
  sequenceId: 1042,
};

export const INITIAL_SIMULATED_BREAKER: BreakerStatus = {
  state: 'RUNNING',
  referencePriceTicks: 10000,
  lowerBandTicks: 9500,
  upperBandTicks: 10500,
  lastCandidatePriceTicks: 10000,
  tripReason: null,
  haltStartTime: null,
  cooldownSeconds: 30,
  remainingHaltSeconds: 0,
  requiresOperatorResume: false,
};

export const INITIAL_SIMULATED_METRICS: EngineMetrics = {
  ordersProcessed: 14890,
  tradesExecuted: 8320,
  p50LatencyMicros: 2.1,
  p95LatencyMicros: 4.8,
  p99LatencyMicros: 9.2,
  meanLatencyMicros: 2.7,
  maxLatencyMicros: 14.5,
  ordersPerSecond: 18500,
  sequenceNumber: 1042,
  activeOrdersCount: 24,
};

export const INITIAL_SIMULATED_TRADES: Trade[] = [
  {
    tradeId: 'TRD-SIM-101',
    buyOrderId: 'ORD-BUY-901',
    sellOrderId: 'ORD-SELL-850',
    symbol: 'DEMO',
    priceTicks: 10000,
    quantity: 25,
    aggressorSide: 'BUY',
    timestamp: Date.now() - 4000,
    sequenceId: 1040,
  },
  {
    tradeId: 'TRD-SIM-102',
    buyOrderId: 'ORD-BUY-899',
    sellOrderId: 'ORD-SELL-851',
    symbol: 'DEMO',
    priceTicks: 9950,
    quantity: 15,
    aggressorSide: 'SELL',
    timestamp: Date.now() - 12000,
    sequenceId: 1039,
  },
  {
    tradeId: 'TRD-SIM-103',
    buyOrderId: 'ORD-BUY-895',
    sellOrderId: 'ORD-SELL-848',
    symbol: 'DEMO',
    priceTicks: 10050,
    quantity: 50,
    aggressorSide: 'BUY',
    timestamp: Date.now() - 25000,
    sequenceId: 1038,
  },
];
