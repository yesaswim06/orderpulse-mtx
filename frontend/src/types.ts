export type Side = 'BUY' | 'SELL';
export type OrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED';
export type BreakerState = 'RUNNING' | 'HALTED' | 'READY_TO_RESUME';

export interface Order {
  orderId: string;
  requestId: string;
  participantId: string;
  symbol: string;
  side: Side;
  priceTicks: number;
  originalQuantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  acceptanceSequence: number;
  timestampNs: number;
}

export interface Trade {
  tradeId: string;
  symbol: string;
  makerOrderId: string;
  takerOrderId: string;
  makerParticipantId: string;
  takerParticipantId: string;
  priceTicks: number;
  quantity: number;
  sequenceId: number;
  timestampNs: number;
}

export interface PriceLevel {
  priceTicks: number;
  totalQuantity: number;
  orderCount: number;
}

export interface OrderBookSnapshot {
  symbol: string;
  sequenceId: number;
  bids: PriceLevel[];
  asks: PriceLevel[];
  bestBidTicks: number | null;
  bestAskTicks: number | null;
  spreadTicks: number | null;
  timestampNs: number;
}

export interface BreakerStatus {
  state: BreakerState;
  referencePriceTicks: number;
  bandPercent: number;
  lowerBandTicks: number;
  upperBandTicks: number;
  minHaltDurationSeconds: number;
  haltStartTimeMs: number;
  remainingHaltSeconds: number;
  lastHaltReason: string;
  lastBreachCandidateTicks: number | null;
  lastBreakerSequence: number;
  settingsLabel: string;
}

export interface EngineMetrics {
  totalOrdersAccepted: number;
  totalOrdersRejected: number;
  totalOrdersCancelled: number;
  totalTradesExecuted: number;
  totalBreakerTrips: number;
  lastProcessingLatencyMicros: number;
  p50LatencyMicros: number;
  p95LatencyMicros: number;
  p99LatencyMicros: number;
  ordersPerSecond: number;
  sequenceNumber: number;
  uptimeSeconds: number;
}
