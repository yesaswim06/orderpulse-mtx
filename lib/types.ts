export type Side = 'BUY' | 'SELL';

export type OrderStatus =
  | 'NEW'
  | 'PARTIALLY_FILLED'
  | 'FILLED'
  | 'CANCELLED'
  | 'REJECTED';

export type BreakerState = 'RUNNING' | 'HALTED' | 'READY_TO_RESUME';

export interface Order {
  orderId: string;
  requestId: string;
  participantId: string;
  symbol: string;
  side: Side;
  priceTicks: number; // in integer paisa
  quantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  createdAt: number;
  sequenceId: number;
}

export interface Trade {
  tradeId: string;
  buyOrderId: string;
  sellOrderId: string;
  symbol: string;
  priceTicks: number; // in integer paisa
  quantity: number;
  aggressorSide: Side;
  timestamp: number;
  sequenceId: number;
}

export interface OrderBookLevel {
  priceTicks: number;
  quantity: number;
  orderCount: number;
}

export interface OrderBookSnapshot {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  bestBidTicks: number | null;
  bestAskTicks: number | null;
  spreadTicks: number | null;
  timestamp: number;
  sequenceId: number;
}

export interface BreakerStatus {
  state: BreakerState;
  referencePriceTicks: number;
  lowerBandTicks: number;
  upperBandTicks: number;
  lastCandidatePriceTicks: number | null;
  tripReason: string | null;
  haltStartTime: number | null;
  cooldownSeconds: number;
  remainingHaltSeconds: number;
  requiresOperatorResume: boolean;
}

export interface EngineMetrics {
  ordersProcessed: number;
  tradesExecuted: number;
  p50LatencyMicros: number;
  p95LatencyMicros: number;
  p99LatencyMicros: number;
  meanLatencyMicros: number;
  maxLatencyMicros: number;
  ordersPerSecond: number;
  sequenceNumber: number;
  activeOrdersCount: number;
}

export interface ScenarioDefinition {
  id: 'NORMAL_TRADING' | 'PARTIAL_FILL' | 'PRICE_SHOCK' | 'ORDER_BURST';
  name: string;
  badge: string;
  description: string;
  expectedResult: string;
}

export interface AuditEvent {
  id: string;
  timestamp: number;
  type: 'ORDER' | 'TRADE' | 'CIRCUIT_BREAKER_HALT' | 'OPERATOR_RESUME' | 'REFERENCE_RESET' | 'CANCEL';
  message: string;
  severity: 'info' | 'warning' | 'alert';
}
