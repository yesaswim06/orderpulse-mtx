import { ScenarioDefinition } from './types';

export const SITE_CONFIG = {
  name: "OrderPulse",
  hackathon: "MTX Hackathon 2026",
  title: "OrderPulse — Ultra-Low Latency Order-Book Matching Engine with Volatility Circuit Breakers",
  tagline: "Precision Matching. Real-Time Trading. Intelligent Protection.",
  eyebrow: "MTX HACKATHON 2026 · FINTECH ENGINEERING",
  headlineFirst: "Precision Matching.",
  headlineSecond: "Intelligent Protection.",
  description:
    "A real-time trading simulation combining price-time order matching, volatility circuit breakers, and transparent performance monitoring in one interactive platform.",
  symbol: "DEMO",
  currency: "INR",
  currencySymbol: "₹",
  defaultReferencePriceRupees: 100.0,
  defaultLowerBandRupees: 95.0,
  defaultUpperBandRupees: 105.0,
  cooldownSeconds: 30,
};

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Live Demo", href: "#terminal-demo" },
  { label: "Architecture", href: "#architecture" },
  { label: "Performance", href: "#performance" },
  { label: "FAQ", href: "#faq" },
];

export const CAPABILITY_BADGES = [
  {
    title: "Price-Time Priority",
    subtitle: "Deterministic FIFO Queues",
    highlight: "O(1) Cancel",
  },
  {
    title: "Volatility Protection",
    subtitle: "±5% Pre-Execution Collar",
    highlight: "30s Cooldown",
  },
  {
    title: "Measured Performance",
    subtitle: "Sub-Microsecond Matching",
    highlight: "2.1 µs p50",
  },
];

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: "NORMAL_TRADING",
    name: "Scenario A: Normal Trading",
    badge: "PASS",
    description: "Submit balanced limit orders within the ±5% collar (₹98.00–₹102.00).",
    expectedResult: "Instant deterministic matching, trade history update, and resting book depth refresh.",
  },
  {
    id: "PARTIAL_FILL",
    name: "Scenario B: Partial Fill",
    badge: "FIFO",
    description: "Submit a BUY order for 150 units against resting asks totalling 60 units.",
    expectedResult: "Executes 60 units across available asks; remaining 90 units rest on the bid ladder.",
  },
  {
    id: "PRICE_SHOCK",
    name: "Scenario C: Price Shock",
    badge: "CIRCUIT BREAKER",
    description: "Submit an aggressive order at ₹108.00 (breaching the ₹105.00 upper collar).",
    expectedResult: "Candidate trade rejected pre-fill; engine halts for 30s; cancels permitted; operator resume required.",
  },
  {
    id: "ORDER_BURST",
    name: "Scenario D: Order Burst",
    badge: "THROUGHPUT",
    description: "Stream a controlled sequence of 50 orders to test queueing and latency percentiles.",
    expectedResult: "Microsecond timestamping, zero dropped packets, real-time throughput metrics recorded.",
  },
];

export const FEATURE_CARDS = [
  {
    id: "deterministic-matching",
    title: "Deterministic Order Matching",
    subtitle: "Price-Time Priority (FIFO)",
    description:
      "Match orders strictly by best price first, then arrival sequence at the same price. Supports full fills, partial fills, and preserves resting queue priority.",
    highlights: ["C++20 In-Memory Engine", "Lock-Free Ring Buffers", "Zero Allocation Hot-Path"],
  },
  {
    id: "circuit-breaker",
    title: "Safety Before Execution",
    subtitle: "Pre-Commit Volatility Check",
    description:
      "Every candidate trade is inspected against the ±5% collar before fills commit. Off-band executions trip an immediate 30s halt, preserving all prior valid fills.",
    highlights: ["±5% Static Reference Band", "Pre-Trade Fill Interception", "Manual Operator Resume"],
  },
  {
    id: "real-time-visibility",
    title: "Every Event. Clearly Tracked.",
    subtitle: "Full Auditability & Telemetry",
    description:
      "Observe order submissions, cancellations, executions, circuit breaker events, and sequence numbers over a persistent WebSocket feed with gap resynchronization.",
    highlights: ["Live Sequencer Counter", "Atomic WAL Persistence", "Resilient WebSocket Feed"],
  },
  {
    id: "performance-transparency",
    title: "Measure, Don't Guess",
    subtitle: "Empirical Microsecond Latency",
    description:
      "Benchmark in-memory processing latency separately from network and database I/O. Displays live p50, p95, and p99 percentiles from repeatable test runs.",
    highlights: ["Hardware Timestamping", "Sub-Microsecond p50", "Transparent Test Suites"],
  },
];

export const ENGINEERING_PRINCIPLES = [
  {
    title: "Deterministic Matching",
    description:
      "Orders with identical prices execute in strict arrival order (FIFO). Resting orders dictate execution price, eliminating front-running ambiguity.",
    tag: "Integrity",
  },
  {
    title: "Safety-Aware Execution",
    description:
      "Candidate fills are evaluated before ledger mutation. A breach triggers an immediate halt, ensuring aberrant market orders cannot corrupt state.",
    tag: "Risk Control",
  },
  {
    title: "Observable State",
    description:
      "The state of the order book, the circuit breaker status, and every trade execution are broadcast live and archived with verifiable sequence IDs.",
    tag: "Transparency",
  },
  {
    title: "Measurable Performance",
    description:
      "Engine latency is measured on the internal matching loop using high-resolution hardware clocks, avoiding conflation with network ping.",
    tag: "Precision",
  },
];

export const TRANSPARENCY_COMPARISON = [
  {
    aspect: "Matching Architecture",
    traditional: "Proprietary black-box matching with opaque internal priority.",
    orderPulse: "Open, inspectable C++20 price-time matching with strict FIFO queues.",
  },
  {
    aspect: "Volatility Safeguards",
    traditional: "Post-facto circuit breaker triggers after price slippage occurs.",
    orderPulse: "Pre-commit execution check: halts before an out-of-bounds trade fills.",
  },
  {
    aspect: "Latency Reporting",
    traditional: "Marketing claims or blended round-trip network numbers.",
    orderPulse: "Explicit internal engine matching latency (p50/p95/p99) measured separately.",
  },
  {
    aspect: "Audit & Persistence",
    traditional: "Delayed batch reconciliation logs obscured behind broker APIs.",
    orderPulse: "Real-time dual persistence (Railway MySQL ledger + MongoDB Atlas audit trail).",
  },
];

export const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "How does price-time priority work?",
    answer:
      "Orders are ranked first by price (highest bid or lowest ask). If multiple orders share the same limit price, they are executed in the exact chronological sequence they arrived (First-In, First-Out). Resting orders establish the execution price for incoming crossing orders.",
  },
  {
    id: "faq-2",
    question: "What happens when an execution crosses the price band?",
    answer:
      "OrderPulse performs a pre-commit check on candidate fills. If a crossing trade would execute outside the allowed ±5% collar (below ₹95.00 or above ₹105.00 for the ₹100.00 reference price), the trade is rejected, trading is halted immediately, and a 30-second cooldown timer begins. Any valid fills prior to the breach are safely preserved.",
  },
  {
    id: "faq-3",
    question: "Can orders be cancelled during a trading halt?",
    answer:
      "Yes. While new order submissions are rejected during a circuit breaker halt, traders retain the right to cancel resting orders to manage their market exposure and avoid unintended fills upon market reopening.",
  },
  {
    id: "faq-4",
    question: "How is latency measured?",
    answer:
      "Engine latency is measured strictly on the in-memory matching loop using high-resolution monotonic timestamps recorded when an order enters the engine and when the match result is produced. This is isolated from HTTP request overhead, database serialization, and browser rendering.",
  },
  {
    id: "faq-5",
    question: "Does OrderPulse connect to a real exchange?",
    answer:
      "No. OrderPulse is an educational and engineering simulation prototype built for the MTX Hackathon 2026. It operates on a simulated symbol (DEMO) and does not place or clear real orders on national stock exchanges.",
  },
  {
    id: "faq-6",
    question: "Is the circuit-breaker configuration an official exchange rule?",
    answer:
      "No. The ±5% collar, 30-second cooldown, and manual operator resume are demonstration simulation parameters chosen specifically for interactive hackathon jury testing, not official SEBI or exchange regulations.",
  },
];

// Helper formatters
export function formatRupees(paisa: number): string {
  return `₹${(paisa / 100).toFixed(2)}`;
}

export function formatQuantity(qty: number): string {
  return qty.toLocaleString("en-IN");
}
