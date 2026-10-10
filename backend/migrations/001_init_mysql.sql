-- =========================================================================
-- OrderPulse MTX: Railway MySQL Production Schema Migration
-- ACID Transactional Ledger for Users, Balances, Orders, Trades & Volatility
-- =========================================================================

CREATE DATABASE IF NOT EXISTS orderpulse_mtx;
USE orderpulse_mtx;

-- 1. Users Table (Distinctly marked demo accounts)
CREATE TABLE IF NOT EXISTS users (
  user_id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(128) NOT NULL,
  role VARCHAR(32) DEFAULT 'TRADER',
  kyc_status VARCHAR(32) DEFAULT 'VERIFIED',
  is_demo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Balances Table (Atomic Double-Entry Accounts)
CREATE TABLE IF NOT EXISTS balances (
  account_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  currency VARCHAR(16) NOT NULL,
  available DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
  locked DECIMAL(18, 4) NOT NULL DEFAULT 0.0000,
  is_demo TINYINT(1) DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_curr (user_id, currency)
) ENGINE=InnoDB;

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  order_id VARCHAR(64) PRIMARY KEY,
  request_id VARCHAR(64) NOT NULL,
  participant_id VARCHAR(64) NOT NULL,
  symbol VARCHAR(16) NOT NULL,
  side ENUM('BUY', 'SELL') NOT NULL,
  price_ticks BIGINT NOT NULL,
  price_rupees DECIMAL(12, 2) NOT NULL,
  original_quantity BIGINT NOT NULL,
  remaining_quantity BIGINT NOT NULL,
  status VARCHAR(32) NOT NULL,
  acceptance_sequence BIGINT NOT NULL,
  matching_latency_micros DECIMAL(10, 3) DEFAULT 0.000,
  is_demo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_symbol_status (symbol, status),
  INDEX idx_seq (acceptance_sequence)
) ENGINE=InnoDB;

-- 4. Trades Table
CREATE TABLE IF NOT EXISTS trades (
  trade_id VARCHAR(64) PRIMARY KEY,
  symbol VARCHAR(16) NOT NULL,
  maker_order_id VARCHAR(64) NOT NULL,
  taker_order_id VARCHAR(64) NOT NULL,
  maker_participant_id VARCHAR(64) NOT NULL,
  taker_participant_id VARCHAR(64) NOT NULL,
  price_ticks BIGINT NOT NULL,
  price_rupees DECIMAL(12, 2) NOT NULL,
  quantity BIGINT NOT NULL,
  sequence_id BIGINT NOT NULL,
  matching_latency_micros DECIMAL(10, 3) DEFAULT 0.000,
  is_demo TINYINT(1) DEFAULT 1,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_exec_seq (sequence_id)
) ENGINE=InnoDB;

-- 5. Circuit Breaker Events
CREATE TABLE IF NOT EXISTS circuit_breaker_events (
  event_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(16) NOT NULL,
  event_type VARCHAR(32) NOT NULL,
  reference_price_ticks BIGINT NOT NULL,
  candidate_price_ticks BIGINT NOT NULL,
  lower_band_ticks BIGINT NOT NULL,
  upper_band_ticks BIGINT NOT NULL,
  duration_seconds INT NOT NULL DEFAULT 30,
  reason VARCHAR(255),
  sequence_id BIGINT NOT NULL,
  is_demo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. Order Book Depth Snapshots
CREATE TABLE IF NOT EXISTS order_book_snapshots (
  snapshot_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(16) NOT NULL,
  sequence_id BIGINT NOT NULL,
  best_bid_ticks BIGINT,
  best_ask_ticks BIGINT,
  spread_ticks BIGINT,
  bids_json JSON NOT NULL,
  asks_json JSON NOT NULL,
  is_demo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. Wallet Transactions (UPI, Cards, Netbanking, Bank Withdrawal)
CREATE TABLE IF NOT EXISTS wallet_transactions (
  txn_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  type ENUM('DEPOSIT', 'WITHDRAWAL') NOT NULL,
  method VARCHAR(32) NOT NULL,
  currency VARCHAR(16) NOT NULL DEFAULT 'INR',
  amount DECIMAL(18, 2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED',
  details JSON,
  is_demo TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed Demo Accounts distinctly marked as DEMO
INSERT IGNORE INTO users (user_id, name, email, role, kyc_status, is_demo)
VALUES 
  ('USER-DEMO-01', 'Institutional Prop Desk (DEMO)', 'prop@orderpulse.exchange', 'TRADER', 'VERIFIED', 1),
  ('USER-DEMO-02', 'HFT Market Maker Alpha (DEMO)', 'hft@orderpulse.exchange', 'MARKET_MAKER', 'VERIFIED', 1);

INSERT IGNORE INTO balances (account_id, user_id, currency, available, locked, is_demo)
VALUES 
  ('ACC-INR-01', 'USER-DEMO-01', 'INR', 1000000.00, 0.00, 1),
  ('ACC-DEMO-01', 'USER-DEMO-01', 'DEMO', 5000, 0, 1);
