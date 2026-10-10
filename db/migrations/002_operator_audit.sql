-- Migration 002: Operator Audit Log and System Checkpoints

CREATE TABLE IF NOT EXISTS operator_actions (
    id BIGSERIAL PRIMARY KEY,
    action_type VARCHAR(32) NOT NULL, -- 'RESUME', 'REFERENCE_RESET', 'SCENARIO_TRIGGER'
    payload JSONB NOT NULL,
    status VARCHAR(16) NOT NULL,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS engine_checkpoints (
    checkpoint_id BIGSERIAL PRIMARY KEY,
    last_sequence_id BIGINT NOT NULL,
    order_count BIGINT NOT NULL,
    trade_count BIGINT NOT NULL,
    breaker_state VARCHAR(32) NOT NULL,
    snapshot_json JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
