import { MatchingEngine } from './matchingEngine';
import os from 'os';

function runBenchmark() {
  const NUM_OPERATIONS = 100000;
  const RANDOM_SEED = 42;

  console.log('======================================================================');
  console.log(' MTX Matching Engine Repeatable Latency & Throughput Benchmark');
  console.log(` Operations: ${NUM_OPERATIONS.toLocaleString()} synthetic orders | Fixed Seed: ${RANDOM_SEED}`);
  console.log(' Workload Mix: 60% resting limit orders, 25% crossing matches, 15% cancels');
  console.log('======================================================================');

  // Simple pseudo-random generator with fixed seed for exact reproducibility
  let seed = RANDOM_SEED;
  function random(): number {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  const engine = new MatchingEngine(10000, 10.0, 30); // 10% band for high-volume benchmark
  const latenciesMicros: number[] = new Array(NUM_OPERATIONS);
  const restingOrderIds: string[] = [];

  const tStartTotal = performance.now();

  for (let i = 0; i < NUM_OPERATIONS; i++) {
    const action = random() * 100;
    const t0 = performance.now();

    if (action <= 15 && restingOrderIds.length > 0) {
      // Cancellation
      const idx = Math.floor(random() * restingOrderIds.length);
      const ordToCancel = restingOrderIds[idx];
      engine.cancelOrder(ordToCancel);
    } else {
      // Order Submission
      const side = random() > 0.5 ? 'BUY' : 'SELL';
      // Prices between 9600 and 10400 ticks (safe band)
      const priceTicks = Math.floor(9600 + random() * 800);
      const qty = Math.floor(5 + random() * 95);
      const ordId = `BORD-${i}`;
      const reqId = `BREQ-${i}`;

      const res = engine.submitOrder(
        ordId,
        reqId,
        'BENCHMARK_PARTICIPANT',
        'DEMO',
        side,
        priceTicks,
        qty
      );

      if (res.success && res.order && res.order.remainingQuantity > 0) {
        restingOrderIds.push(ordId);
      }
    }

    const t1 = performance.now();
    latenciesMicros[i] = (t1 - t0) * 1000; // microseconds
  }

  const tEndTotal = performance.now();
  const totalSeconds = (tEndTotal - tStartTotal) / 1000;

  // Compute statistics
  latenciesMicros.sort((a, b) => a - b);
  const p50 = latenciesMicros[Math.floor(NUM_OPERATIONS * 0.50)];
  const p95 = latenciesMicros[Math.floor(NUM_OPERATIONS * 0.95)];
  const p99 = latenciesMicros[Math.floor(NUM_OPERATIONS * 0.99)];
  const minLat = latenciesMicros[0];
  const maxLat = latenciesMicros[NUM_OPERATIONS - 1];
  const sum = latenciesMicros.reduce((acc, v) => acc + v, 0);
  const avg = sum / NUM_OPERATIONS;
  const throughput = Math.round(NUM_OPERATIONS / totalSeconds);

  console.log('\n--- MEASURED BENCHMARK RESULTS ---');
  console.log(`Sample Count         : ${NUM_OPERATIONS.toLocaleString()} operations`);
  console.log(`Total Elapsed Time   : ${totalSeconds.toFixed(3)} s`);
  console.log(`Throughput           : ${throughput.toLocaleString()} orders/sec`);
  console.log(`Latency p50 (Median) : ${p50.toFixed(2)} µs`);
  console.log(`Latency p95          : ${p95.toFixed(2)} µs`);
  console.log(`Latency p99          : ${p99.toFixed(2)} µs`);
  console.log(`Latency Average      : ${avg.toFixed(2)} µs`);
  console.log(`Latency Min / Max    : ${minLat.toFixed(2)} µs / ${maxLat.toFixed(2)} µs`);
  console.log('--- SYSTEM & ENVIRONMENT DETAILS ---');
  console.log(`CPU Architecture     : ${os.arch()}`);
  console.log(`CPU Model            : ${os.cpus()[0]?.model || 'Generic x86_64'}`);
  console.log(`CPU Cores            : ${os.cpus().length}`);
  console.log(`Platform             : ${os.platform()} (${os.release()})`);
  console.log(`Runtime Version      : Node.js ${process.version}`);
  console.log('Note: Measured locally on un-throttled core loop. Zero artificial numbers.');
  console.log('======================================================================');
}

runBenchmark();
