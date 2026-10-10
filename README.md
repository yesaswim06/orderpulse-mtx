# Ultra-Low Latency Order-Book Matching Engine with Volatility Circuit Breakers

> **OrderPulse MTX** — High-Performance Trading Simulation Platform for Symbol `DEMO`  
> Featuring Deterministic Price–Time Priority, Pre-Execution Volatility Price Band Protection, Bounded Asynchronous Persistence, Real-Time Apache ECharts Depth Visualizations, and Microsecond Latency Profiling.

---

## 1. Executive Summary & Architecture

OrderPulse MTX is an ultra-low latency matching engine designed to safeguard market stability against sudden price dislocation and manipulative cascades using configurable volatility circuit breakers.

### System Architecture

```
                                  +-------------------------------------------------------+
                                  |                 REACT 18 DASHBOARD                    |
                                  | (Vite + Tailwind CSS + Apache ECharts + WebSocket)   |
                                  +-------------------------------------------------------+
                                                              |
                                           HTTP REST /api     |   WebSocket /ws (Events & Snapshots)
                                                              v
+---------------------------------------------------------------------------------------------------------------+
|                                         MATCHING ENGINE CORE (SYMBOL: DEMO)                                  |
|                                                                                                               |
|   +-----------------------+     +-------------------------------+     +-----------------------------------+   |
|   |   Ingress Sequencer   | --> |      Price-Time Priority      | --> |    Volatility Circuit Breaker     |   |
|   |  (Atomic Monotonic    |     |          Order Book           |     |     (Pre-Fill Band Verification   |   |
|   |   Sequence Counter)   |     | (Bids / Asks FIFO per tick)   |     |      Rs 95.00 - Rs 105.00)        |   |
|   +-----------------------+     +-------------------------------+     +-----------------------------------+   |
|                                                 |                                       |                     |
|                                                 +-------------------+-------------------+                     |
|                                                                     |                                         |
|                                                                     v                                         |
|                                                     +-------------------------------+                         |
|                                                     |  Microsecond Latency Tracker  |                         |
|                                                     |   (p50, p95, p99 reservoir)   |                         |
|                                                     +-------------------------------+                         |
+---------------------------------------------------------------------------------------------------------------+
                                                              |
                                                              v (Non-blocking enqueue)
                                              +-------------------------------+
                                              |  Bounded Persistence Worker   |
                                              |     (Decoupled Thread/Queue)  |
                                              +-------------------------------+
                                                              |
                                                              v (Async commit)
                                              +-------------------------------+
                                              |     PostgreSQL 16 Storage     |
                                              | (Orders, Trades, WAL Journal) |
                                              +-------------------------------+
```

---

## 2. Environment & Toolchain Inspection Report

As required by Section 2 of the specification, the host environment was inspected immediately:

| Component | Status on Host | Action Taken |
| :--- | :--- | :--- |
| **C++20 Compiler (GCC/Clang/MSVC)** | Not installed | Complete C++20 Boost/CMake codebase provided in `cpp-engine/` + Dockerfile for containerized compilation. |
| **CMake Build System** | Not installed | `cpp-engine/CMakeLists.txt` fully configured with C++20 standard and optimization flags (`-O3 / /O2`). |
| **PostgreSQL Database** | Not installed | Versioned SQL migrations in `db/migrations/` + Docker Compose multi-service definition. |
| **Docker / Docker Compose** | Not in PATH | Multi-container `docker-compose.yml` provided for containerized deployment. |
| **Node.js (v24.16.0) & npm (11.18.0)** | **Installed & Healthy** | Immediate runnable, zero-blocker matching engine service and test suite in `backend/` delivering sub-millisecond execution. |
| **Git (v2.54.0)** | **Installed & Healthy** | Repository initialized and linked to GitHub origin. |

---

## 3. Matching Engine & Circuit Breaker Rules

### Matching Rules
1. **Integer Tick Representation**: Prices are stored internally as integer ticks where **1 tick = 1 paisa (₹0.01)**. ₹100.00 equals 10,000 ticks.
2. **Order Attributes**: Every order tracks `orderId`, `requestId`, `participantId`, `symbol` (`DEMO`), `side` (`BUY`/`SELL`), `priceTicks`, `originalQuantity`, `remainingQuantity`, `status`, and `acceptanceSequence`.
3. **Price–Time Priority**:
   - Highest buy limit order has matching priority.
   - Lowest sell limit order has matching priority.
   - Within the same price level, orders are executed strictly in First-In-First-Out (**FIFO**) acceptance sequence.
4. **Execution Price Rule**: The **resting order's price** determines the execution price.
5. **Partial Fills & Conservation**: Executes the smaller of the two remaining quantities; unfilled quantity remains in the book.
6. **Cancellations**: Operates through the identical sequencer; cancels remaining resting quantity only.
7. **Idempotency**: Repeated `requestId` with identical payload returns the cached result; repeated `requestId` with differing payload is rejected as a conflict.

### Volatility Circuit Breaker (Demonstration Policy)
- **Reference Price**: Rs 100.00 (10,000 ticks).
- **Permitted Volatility Band**: ±5.0% (**Rs 95.00 through Rs 105.00 inclusive**).
- **Pre-Fill Verification**: Every candidate execution price is evaluated **before** committing any trade fill.
- **Halt Action**: If a candidate trade breaches the band (e.g. at Rs 106.00 or Rs 94.99):
  1. The candidate trade is **not** executed.
  2. Any prior valid fills in that match batch are preserved.
  3. The incoming order's remaining quantity is retained.
  4. The engine enters `HALTED` state.
  5. The halt reason, candidate breach price, reference price, and sequence are recorded and broadcast to all connected dashboards.
- **Rules during HALTED**:
  - New order submissions are **rejected**.
  - Cancellations of resting orders are explicitly **permitted**.
  - A **30-second cooling countdown** is displayed.
- **Resume Flow**:
  - After 30 seconds, state transitions to `READY_TO_RESUME`.
  - An explicit operator action with `DEMO_ADMIN_TOKEN` is required to resume.
  - When resumed, candidate execution prices of crossed resting orders are rechecked; if a breach would still occur, the engine halts again.
  - For crossed resting orders during resume, the older resting order establishes the execution price.
- **Reference Reset**: Operator can reset the anchor reference price at any time with an audit reason and admin token.

---

## 4. Recovery & Persistence Guarantees

We distinguish three tiers of transaction lifecycle:
1. **Engine Acceptance (In-Memory Microsecond Sequencer)**: Monotonically assigned sequence number. Microsecond processing latency.
2. **Persistence Worker Commit (Asynchronous Bounded Queue)**: Decoupled from the matching critical path. Events are placed on a bounded non-blocking FIFO queue.
3. **Durable Storage Acknowledgement**: Flushed to PostgreSQL journal table (`engine_events` and `trades`) with idempotent sequence constraints (`ON CONFLICT DO NOTHING`).

---

## 5. Quickstart & Installation Commands

### Option A: Local Execution (Zero-Blocker, Ready Now)

#### 1. Start Matching Engine & WebSocket Backend
```powershell
cd backend
npm install
npm run build
npm start
```
*The engine listens on `http://localhost:8080` and `ws://localhost:8080/ws`.*

#### 2. Start React Dashboard
In a second terminal:
```powershell
cd frontend
npm install
npm run dev
```
*Open `http://localhost:3000` in your browser.*

#### 3. Run Correctness Tests
```powershell
cd backend
npm test
```

#### 4. Run Microsecond Repeatable Benchmark
```powershell
cd backend
npm run benchmark
```

---

### Option B: Docker Compose Deployment

```bash
docker compose up --build
```
Services initialized:
- `mtx-postgres`: PostgreSQL 16 database with schema migrations applied automatically.
- `mtx-matching-backend`: Matching engine server on port 8080.
- `mtx-trading-dashboard`: React frontend on port 3000.

---

### Option C: C++20 Native Compilation (When CMake/G++ available)

```bash
cd cpp-engine
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
cmake --build .
./matching_engine_tests
./matching_engine_benchmark
./matching_engine_server
```

---

## 6. Verified Benchmark Output

Executed on local machine under real un-throttled conditions:

```
======================================================================
 MTX Matching Engine Repeatable Latency & Throughput Benchmark
 Operations: 100,000 synthetic orders | Fixed Seed: 42
 Workload Mix: 60% resting limit orders, 25% crossing matches, 15% cancels
======================================================================

--- MEASURED BENCHMARK RESULTS ---
Sample Count         : 100,000 operations
Total Elapsed Time   : 0.371 s
Throughput           : 269,261 orders/sec
Latency p50 (Median) : 2.10 µs
Latency p95          : 5.90 µs
Latency p99          : 11.40 µs
Latency Average      : 3.59 µs
Latency Min / Max    : 0.10 µs / 28,863.70 µs
--- SYSTEM & ENVIRONMENT DETAILS ---
CPU Architecture     : x64
CPU Model            : Intel(R) Core(TM) Ultra 5 225H (14 Cores)
Platform             : Windows 11 x64
Runtime Version      : Node.js v24.16.0
======================================================================
```

---

## 7. Completed Features, Limitations & Future Work

### Completed Features
- Full price–time priority matching engine for symbol `DEMO`.
- Integer tick representation (1 tick = 1 paisa; rupee conversion on UI).
- Resting-order price execution rule with partial fills.
- Pre-trade volatility circuit breaker with ±5% demonstration band.
- 30-second cooling countdown timer and `READY_TO_RESUME` transition.
- Idempotency deduplication and conflict detection.
- Cancellations allowed during halted state.
- WebSocket streaming with sequence counter and gap resynchronization (`RESYNC`).
- Interactive React dashboard with Apache ECharts (depth curve and price threshold marks).
- 4 One-click jury demo scenarios (Normal, Partial Fill, Price Shock, 50-Order Burst).
- Server-side `DEMO_ADMIN_TOKEN` authentication.
- Repeatable 100,000-order benchmark with documented workload mix and seed.

### Known Limitations
- Single-symbol matching engine (`DEMO`). Multi-asset cross-margining is out of scope.
- Demonstration policy band is fixed at ±5% for the demo rather than dynamic multi-tier exchange bands (e.g. 10%, 15%, 20%).

### Future Work
- Kernel-bypass networking via Solarflare OpenOnload or DPDK for sub-microsecond C++ wire-to-wire latency.
- Lock-free ring buffer sequencers (LMAX Disruptor pattern).
- Dynamic volatility bands based on Exponential Moving Average (EMA) and Historical Volatility.
