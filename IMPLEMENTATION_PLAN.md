# OrderPulse — Implementation Plan

**Event:** MTX Hackathon 2026  
**Project:** OrderPulse — Ultra-Low Latency Order-Book Matching Engine with Volatility Circuit Breakers  
**Website Architecture:** Groww-Inspired Consumer Platform + Institutional Trading Terminal  

---

## 1. Executive Summary & Architecture Strategy

OrderPulse synthesizes two complementary paradigms:
1. **The Institutional Core**: A deterministic, lock-free/in-memory FIFO limit order book matching engine with pre-trade volatility circuit breakers ($\pm 5\%$ price collars), sub-microsecond latency accounting, and an authoritative PostgreSQL 16 transactional ledger.
2. **The Consumer Brokerage**: A Groww-inspired web experience with intuitive stock discovery, interactive holdings and portfolio tracking, instant buy/sell modal execution against the matching engine, UPI/netbanking wallet simulation, and educational F&O / Mutual Fund exploration.

---

## 2. Milestone Breakdown & Delivery Sequence

### Milestone M1: Dual-Database Schema & Authoritative Ledger
- **Status:** `VERIFIED WORKING`
- **Scope:**
  - PostgreSQL 16 on Railway (`orders`, `trades`, `breaker_events`, `engine_events`, `users`, `balances`).
  - MongoDB Atlas for append-only audit event projections (`engine_audit_log`, `wallet_audit_log`).
  - Multi-database persistence worker with WAL fallback and jury query execution engine.

### Milestone M2: Ultra-Low Latency FIFO Matching Engine
- **Status:** `VERIFIED WORKING`
- **Scope:**
  - Microsecond price-time priority matching ($O(1)$ limit order execution).
  - Partial fills, multi-price level depth replenishment, order cancellations.
  - Native performance metrics bar recording throughput and match latency.

### Milestone M3: Volatility Circuit Breaker Safeguard
- **Status:** `VERIFIED WORKING`
- **Scope:**
  - Pre-execution candidate price check against dynamic $\pm 5\%$ reference price collars.
  - Automated trading halt on breach, 30-second cooldown timer, explicit operator manual resume.
  - Audited reset events persisted across PostgreSQL and MongoDB Atlas.

### Milestone M4: Wallet Margin & Balance Deduction Engine
- **Status:** `VERIFIED WORKING`
- **Scope:**
  - Dynamic cash deduction upon order execution (BUY deducts required INR margin; SELL credits realized trade proceeds).
  - Virtual deposit & withdrawal modal supporting UPI, Cards, and Netbanking.
  - Real-time balance synchronization via WebSocket and REST APIs.

### Milestone M5: Groww-Inspired Consumer Experience
- **Status:** `VERIFIED WORKING`
- **Scope:**
  - Clean light/dark navigation bar with quick wallet pill, profile drawer, and search bar.
  - Explore page with indices ticker strip, popular bonds, top gainers/losers, and products.
  - Instant stock detail modal with CNC/MIS selector, custom quantity stepper, and live matching engine latency readout.

### Milestone M6: Portfolio & Live Holdings Management
- **Status:** `VERIFIED WORKING`
- **Scope:**
  - Real-time portfolio valuation, total invested capital, 1-day returns, and overall P&L.
  - Holdings table with "All", "In Profit", and "In Loss" filtering.
  - Direct 1-click "Trade" trigger launching the matching modal or institutional terminal.

### Milestone M7: Institutional Matching Terminal
- **Status:** `VERIFIED WORKING`
- **Scope:**
  - Real-time Level-2 order book depth ladder with cumulative volume bars.
  - Interactive depth chart, trade tape, live orders table, and scenario controls.
  - Direct jury demo controls (Normal trading, Limit cross, Circuit breach, High-volume stress).

### Milestone M8: Educational Products & Supplementary Modules
- **Status:** `VERIFIED WORKING`
- **Scope:**
  - Futures & Options (F&O) exploration with options chain simulator and contract cards.
  - Mutual Funds (MF) SIP calculator, category tabs, and fund discovery.
  - Bank Account details, UPI Autopay mandate simulator, and 24x7 Help Center.

---

## 3. Technology Stack & Verification Matrix

| Layer | Technology | Primary Role | Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript | Groww UI + Trading Terminal UI | `VERIFIED WORKING` |
| **Styling** | Tailwind CSS, Lucide Icons | Clean financial design system & tokens | `VERIFIED WORKING` |
| **Charts** | ECharts + Canvas / SVG | Depth ladder, price sparklines & mini-candles | `VERIFIED WORKING` |
| **Backend** | Node.js 20+, Express, TypeScript | REST APIs & WebSocket server (`ws`) | `VERIFIED WORKING` |
| **Matching Engine** | In-Memory FIFO / C++20 | Price-time priority matching engine | `VERIFIED WORKING` |
| **Primary Database** | PostgreSQL 16 (Railway) | Authoritative transactional store | `VERIFIED WORKING` |
| **Audit Database** | MongoDB Atlas | Asynchronous audit & event log | `VERIFIED WORKING` |
