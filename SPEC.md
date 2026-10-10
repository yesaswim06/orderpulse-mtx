# ORDERPULSE | MTX HACKATHON 2026
## Autonomous Frontend + Backend Builder Specification

---

### 1. PROJECT IDENTITY

- **Project Name:** OrderPulse
- **Hackathon:** MTX Hackathon 2026
- **Project Title:** Ultra-Low Latency Order-Book Matching Engine with Volatility Circuit Breakers
- **Tagline:** Precision Matching. Real-Time Trading. Intelligent Protection.
- **Core Purpose:** Demonstrate how a high-throughput matching engine executes orders efficiently while applying configurable volatility safeguards.

#### Key Capabilities Demonstrated
- Buy and sell limit orders.
- Deterministic price-time priority (FIFO).
- Partial fills and remaining quantities.
- Order cancellation with $O(1)$ removal.
- Live bids and asks order book depth.
- Recent trades and order status lifecycle.
- Configurable volatility circuit breaker with pre-execution candidate check.
- Trading halt, 30-second cooldown timer, and operator-controlled manual resume.
- Explicit reference-price resets with audited events.
- Actual microsecond latency and throughput measurements.
- Real-time event log and trade audit history.
- Dual database persistence (Railway MySQL for transactional ledger + MongoDB Atlas for audit logs).

#### Market Instrument & Units
- **Trading Symbol:** `DEMO`
- **Internal Monetary Units:** Integer paisa (1 INR = 100 paisa)
- **Display Format:** Indian Rupees (₹) formatted to 2 decimal places (e.g. `₹100.00`)

#### Circuit-Breaker Parameters (Simulation Demo)
- **Reference Price:** ₹100.00 (10,000 paisa)
- **Lower Limit Band:** ₹95.00 (9,500 paisa) [−5%]
- **Upper Limit Band:** ₹105.00 (10,500 paisa) [+5%]
- **Boundaries:** Inclusive ($9,500 \le \text{price} \le 10,500$)
- **Halt Cooldown:** 30 seconds
- **Resume Policy:** Explicit operator resume required after cooldown expires (never auto-resume)

---

### 2. WORKFLOW & MILESTONE CHECKLIST

1. **Milestone 1:** Workspace inspection, project setup, and design tokens (Aceternity dark palette, typography, CSS vars).
2. **Milestone 2:** Global layout, typography, sticky floating navbar, and responsive mobile menu.
3. **Milestone 3:** Centered hero section, technical badges, and interactive trading-terminal preview.
4. **Milestone 4:** Live order-book dashboard, depth ladder, spread calculator, and market statistics.
5. **Milestone 5:** Matching-engine integration, order-entry form with idempotency keys and validation.
6. **Milestone 6:** Volatility circuit breaker panel, collar visualization, halt banner, and operator controls.
7. **Milestone 7:** Recent trades, order history, and audit timeline with live WebSocket feeds.
8. **Milestone 8:** Performance metrics bar, microsecond benchmarks, and 4 interactive market simulation scenarios.
9. **Milestone 9:** System architecture interactive flow, 4-card feature bento grid, engineering principles, transparency comparison, and FAQ accordion.
10. **Milestone 10:** Testing, responsive polish (390px, 430px, 768px, 1280px), accessibility, and final documentation.

---

### 3. TECH STACK & ARCHITECTURE

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion (`framer-motion`), Lucide React icons (`lucide-react`), ECharts / SVG depth charts.
- **Backend Matching Engine:** Node.js/TypeScript Engine (`backend/src/`) + C++20 engine reference (`cpp-engine/`) featuring lock-free ring-buffer principles, sub-microsecond FIFO matching, and atomic transactions.
- **Communication Protocol:** REST APIs + Bi-directional WebSocket (`/ws`) with sequence numbering and gap resynchronization.
- **Persistence Layer:** Railway MySQL for transactional user balances and order state; MongoDB Atlas for append-only audit event logging.
- **Authoritative Source of Truth:** Backend matching engine holds the in-memory book state; frontend reflects server state without client-side state divergence.

---

### 4. VISUAL DESIGN SYSTEM (ACETERNITY DARK AESTHETIC)

#### Color Tokens
- **Page Background:** `#050505`
- **Main Surfaces:** `#0A0A0A`
- **Card Surfaces:** `#101010`
- **Secondary Surfaces:** `#151515`
- **Borders:** Translucent white at 6%–12% opacity (`rgba(255, 255, 255, 0.08)`)
- **Main Text:** `#E5E7EB`
- **Secondary Text:** `#9CA3AF`
- **Muted Text:** `#737373`
- **Buy Accent:** `#10B981` (Emerald green)
- **Sell Accent:** `#F87171` (Coral red)
- **Circuit Breaker Warning:** `#F59E0B` (Amber)
- **Neutral Technical Info:** `#60A5FA` (Sky blue)

#### Visual Treatment
- Near-black backgrounds with subtle radial spotlights (`bg-gradient-to-b from-white/[0.05] to-transparent`).
- Rounded cards with 18–24px corner radii (`rounded-2xl`, `rounded-3xl`).
- Restrained 1px borders with faint top-edge inner highlights (`inset 0 1px 0 rgba(255,255,255,0.1)`).
- Monospaced typography for prices, quantities, sequence numbers, and latency (`font-mono`).
- Inter / Geist sans typography for UI prose.
- Strict rejection of generic neon or gambling-like styling.

---

### 5. FLOATING NAVBAR SPECIFICATION

- Sticky frosted-glass bar pinned near top (`top-4 mx-4 md:mx-auto max-w-7xl`).
- OrderPulse circular logo mark + MTX Hackathon 2026 badge.
- Navigation links:
  - Features
  - Live Demo
  - Architecture
  - Performance
  - FAQ
- Action CTA: Primary pill button "Open Trading Terminal" routing to `/terminal` or terminal section.
- Mobile drawer: Accessible hamburger menu with keyboard navigation, ARIA attributes, and backdrop blur.

---

### 6. HERO SECTION SPECIFICATION

- **Eyebrow:** "MTX HACKATHON 2026 · FINTECH ENGINEERING"
- **Headline:** "Precision Matching."
- **Second Line:** "Intelligent Protection."
- **Supporting Copy:** "A real-time trading simulation combining price-time order matching, volatility circuit breakers, and transparent performance monitoring in one interactive platform."
- **Primary CTA:** "Open Live Demo" (scrolls to terminal preview or links to `/terminal`)
- **Secondary CTA:** "Explore Architecture" (scrolls to `#architecture`)
- **3 Capability Badges:**
  - `Price-Time Priority` (Deterministic FIFO)
  - `Volatility Protection` (±5% Pre-execution Collar)
  - `Measured Performance` (2.1 µs In-Memory Latency)
- Entrance: Framer Motion staggered word reveal and soft radial glow.

---

### 7. LIVE TRADING TERMINAL PREVIEW & DEDICATED TERMINAL

#### A. Market Header
- Symbol: `DEMO`
- Reference Price: `₹100.00`
- Last Traded Price with micro-tick indicator
- Market State: `RUNNING` / `HALTED` / `READY_TO_RESUME`
- WebSocket Connection Status (Online / Reconnecting / Offline)
- Sequencer index & latency

#### B. Order Book (Bids & Asks Ladder)
- Dual side columns: Green depth for Bids, Red depth for Asks.
- Real depth visualization bars showing volume concentration.
- Top-of-book metrics: Best Bid, Best Ask, Spread in ₹ and ticks.
- Empty state indicator when book is empty.

#### C. Order Entry Form
- Fields: Symbol (`DEMO`), Side (`BUY` / `SELL`), Type (`LIMIT`), Limit Price (₹), Quantity.
- Auto-generated unique Request ID / Idempotency Key.
- Validation: Positive numbers, integer paisa conversion.
- Actions: Submit Buy Order, Submit Sell Order, Reset Form.

#### D. Volatility Circuit Breaker Panel
- Reference Price anchor (`₹100.00`).
- Lower limit band (`₹95.00`) and upper limit band (`₹105.00`).
- Candidate price pre-check visualization.
- Halt state countdown display (30s cooldown).
- Operator Resume modal / button (requires confirmation token).
- Reference Price reset form with auditable reason log.

#### E. Recent Executions & Open Orders
- Trades Table: Trade ID, execution price, filled quantity, timestamp, aggressor side.
- Open Orders Table: Order ID, side, price, original qty, remaining qty, status, Cancel action.

#### F. 4 Market Simulation Scenarios
1. **Scenario A (Normal Trading):** Interleaved buys/sells inside ₹98–₹102 band, confirming clean matching and trades.
2. **Scenario B (Partial Fill):** Large buy hitting smaller resting asks, illustrating residual resting quantity.
3. **Scenario C (Price Shock):** Aggressive order crossing the ±5% collar (e.g. ₹108.00), triggering instant halt, preserving prior fills, and starting 30s cooldown.
4. **Scenario D (Order Burst):** Rapid sequence of 50 orders measuring burst throughput and latency percentiles.

---

### 8. SYSTEM ARCHITECTURE & EXPLANATION

Visual animated pipeline diagram:
```
React Trading Dashboard (Next.js / Vite)
       ↕ [REST APIs / JSON-RPC]
Express HTTP & WebSocket Hub (Node.js)
       ↕ [Sub-Microsecond Zero-Copy Buffers]
C++20 / In-Memory Matching Engine & FIFO Queues
       ↕ [Candidate Fill Pre-Commit Check]
Volatility Circuit Breaker (±5% Dynamic Collar)
       ↕ [Async Zero-Wait Event Emitter]
Dual Persistence: Railway MySQL (Ledger) + MongoDB Atlas (Audit Log)
```
- Explanations covering matching-loop isolation, backend authority, and verifiable auditability.

---

### 9. FEATURE BENTO GRID

1. **Card A: Deterministic Order Matching**
   - Price-time priority, FIFO queueing, $O(1)$ cancellations.
2. **Card B: Safety Before Execution**
   - Pre-commit candidate validation; reject breaching trades before fill; 30s cooling pause.
3. **Card C: Every Event. Clearly Tracked.**
   - Real-time event log, live sequence counter, atomic WAL persistence.
4. **Card D: Measure, Don't Guess**
   - Actual measured latency percentiles (p50, p95, p99) and benchmark methodology.

---

### 10. BENCHMARK & PERFORMANCE MEASUREMENTS

- Interactive Benchmark trigger.
- Clear separation of:
  1. Engine processing latency ($2.1\,\mu\text{s}$ median in-memory).
  2. Backend HTTP/WS dispatch latency.
  3. Browser rendering latency.
- Real-time percentile reporting ($p50$, $p95$, $p99$).

---

### 11. ENGINEERING PRINCIPLES & TRANSPARENCY

- **Principles:** Deterministic Matching, Safety-Aware Execution, Observable State, Measurable Performance.
- **Transparency Matrix:** Detailed comparison between typical opaque institutional infrastructure and OrderPulse’s transparent educational sandbox.
- **FAQ Accordion:** 6 single-expand items addressing price-time priority, circuit-breaker boundary checks, cancel-during-halt rules, latency measurement, exchange simulation scope, and demo parameters.

---

### 12. FINAL CTA & FOOTER

- **Final CTA:** "See Every Trade. Understand Every Decision." with links to live terminal and architecture.
- **Footer:** Brand mark, MTX Hackathon 2026 label, navigation links, GitHub repo, disclaimer that OrderPulse is an educational simulation.

---

### 13. ACCEPTANCE CRITERIA

- Zero build errors.
- Clean mobile (390px, 430px), tablet (768px), and desktop (1280px) responsiveness.
- All scenario buttons and order actions functional.
- Circuit breaker trips accurately on candidate breach, halts trading, allows cancellations, and permits operator resume after cooldown.
- Tests passing and documented.
