export type Side = 'BUY' | 'SELL';
export type OrderStatus = 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED';
export type BreakerState = 'RUNNING' | 'HALTED' | 'READY_TO_RESUME';

export interface Order {
  orderId: string;
  requestId: string;
  participantId: string;
  symbol: string;
  side: Side;
  priceTicks: number; // 1 tick = 1 paisa (100 ticks = Rs 1.00)
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
  referencePriceTicks: number; // default 10000 = Rs 100.00
  bandPercent: number;          // default 5.0%
  lowerBandTicks: number;       // default 9500 = Rs 95.00
  upperBandTicks: number;       // default 10500 = Rs 105.00
  minHaltDurationSeconds: number; // 30s
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

export interface SubmitOrderResult {
  success: boolean;
  errorMessage?: string;
  order?: Order;
  generatedTrades: Trade[];
  breakerTriggered: boolean;
  sequenceId: number;
}

export interface CancelOrderResult {
  success: boolean;
  errorMessage?: string;
  cancelledOrder?: Order;
  sequenceId: number;
}

export function ticksToRupees(ticks: number): number {
  return ticks / 100;
}

export function rupeesToTicks(rupees: number): number {
  return Math.round(rupees * 100);
}
