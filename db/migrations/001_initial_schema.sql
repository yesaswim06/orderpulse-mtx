-- Migration 001: Initial Schema for Ultra-Low Latency Order-Book Matching Engine
-- Idempotent schema definition with strict constraints and auditability

CREATE TABLE IF NOT EXISTS engine_events (
    sequence_id BIGINT PRIMARY KEY,
    event_type VARCHAR(32) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(64) PRIMARY KEY,
    request_id VARCHAR(64) NOT NULL UNIQUE,
    participant_id VARCHAR(64) NOT NULL,
    symbol VARCHAR(16) NOT NULL,
    side VARCHAR(8) NOT NULL CHECK (side IN ('BUY', 'SELL')),
    price_ticks BIGINT NOT NULL CHECK (price_ticks > 0),
    original_quantity BIGINT NOT NULL CHECK (original_quantity > 0),
    remaining_quantity BIGINT NOT NULL CHECK (remaining_quantity >= 0),
    status VARCHAR(32) NOT NULL,
    acceptance_sequence BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_symbol_status ON orders (symbol, status);
CREATE INDEX IF NOT EXISTS idx_orders_participant ON orders (participant_id);
CREATE INDEX IF NOT EXISTS idx_orders_acceptance_seq ON orders (acceptance_sequence);

CREATE TABLE IF NOT EXISTS trades (
    trade_id VARCHAR(64) PRIMARY KEY,
    symbol VARCHAR(16) NOT NULL,
    maker_order_id VARCHAR(64) NOT NULL REFERENCES orders(order_id),
    taker_order_id VARCHAR(64) NOT NULL REFERENCES orders(order_id),
    maker_participant_id VARCHAR(64) NOT NULL,
    taker_participant_id VARCHAR(64) NOT NULL,
    price_ticks BIGINT NOT NULL CHECK (price_ticks > 0),
    quantity BIGINT NOT NULL CHECK (quantity > 0),
    sequence_id BIGINT NOT NULL UNIQUE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trades_symbol_seq ON trades (symbol, sequence_id DESC);

CREATE TABLE IF NOT EXISTS breaker_events (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(32) NOT NULL, -- 'HALT', 'READY_TO_RESUME', 'RESUME', 'REFERENCE_RESET'
    reference_price_ticks BIGINT NOT NULL,
    candidate_price_ticks BIGINT,
    lower_band_ticks BIGINT NOT NULL,
    upper_band_ticks BIGINT NOT NULL,
    halt_duration_seconds INT NOT NULL,
    reason TEXT NOT NULL,
    sequence_id BIGINT NOT NULL,
    operator_token_hash VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_breaker_events_seq ON breaker_events (sequence_id);
