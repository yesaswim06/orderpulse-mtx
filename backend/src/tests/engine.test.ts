import { MatchingEngine } from '../matchingEngine';
import assert from 'node:assert';
import test from 'node:test';

test('Test 1: Best-price priority and FIFO ordering', () => {
  const engine = new MatchingEngine(10000, 5.0, 30);

  // Resting asks at varying prices
  engine.submitOrder('S1', 'R1', 'P1', 'DEMO', 'SELL', 10200, 50); // Rs 102.00
  engine.submitOrder('S2', 'R2', 'P2', 'DEMO', 'SELL', 10100, 50); // Rs 101.00 (better price)
  engine.submitOrder('S3', 'R3', 'P3', 'DEMO', 'SELL', 10100, 50); // Rs 101.00 (same price, later seq)

  // Incoming buy of 60 shares @ Rs 103.00
  const res = engine.submitOrder('B1', 'R4', 'P4', 'DEMO', 'BUY', 10300, 60);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.generatedTrades.length, 2);

  // First fill against S2 (50 @ 101)
  assert.strictEqual(res.generatedTrades[0].makerOrderId, 'S2');
  assert.strictEqual(res.generatedTrades[0].quantity, 50);
  assert.strictEqual(res.generatedTrades[0].priceTicks, 10100);

  // Second fill against S3 (10 @ 101)
  assert.strictEqual(res.generatedTrades[1].makerOrderId, 'S3');
  assert.strictEqual(res.generatedTrades[1].quantity, 10);
  assert.strictEqual(res.generatedTrades[1].priceTicks, 10100);
});

test('Test 2: Resting-order execution price rule', () => {
  const engine = new MatchingEngine(10000, 5.0, 30);

  // Resting sell at Rs 100.00 (10000 ticks)
  engine.submitOrder('S1', 'R1', 'P1', 'DEMO', 'SELL', 10000, 100);

  // Aggressive incoming buy at Rs 104.00 (10400 ticks)
  const res = engine.submitOrder('B1', 'R2', 'P2', 'DEMO', 'BUY', 10400, 50);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.generatedTrades.length, 1);
  // Execution must be at resting order's price (10000 ticks)
  assert.strictEqual(res.generatedTrades[0].priceTicks, 10000);
});

test('Test 3: Partial fills and quantity conservation', () => {
  const engine = new MatchingEngine(10000, 5.0, 30);

  // Resting sell 100 shares @ Rs 100.00
  engine.submitOrder('S1', 'R1', 'P1', 'DEMO', 'SELL', 10000, 100);

  // Buy 40 shares @ Rs 100.00
  const res = engine.submitOrder('B1', 'R2', 'P2', 'DEMO', 'BUY', 10000, 40);
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.order?.status, 'FILLED');
  assert.strictEqual(res.order?.remainingQuantity, 0);

  const snapshot = engine.getBookSnapshot();
  assert.strictEqual(snapshot.asks.length, 1);
  assert.strictEqual(snapshot.asks[0].totalQuantity, 60); // 100 - 40 = 60 conserved
});

test('Test 4: Cancellation before and after partial fill', () => {
  const engine = new MatchingEngine(10000, 5.0, 30);

  engine.submitOrder('S1', 'R1', 'P1', 'DEMO', 'SELL', 10000, 100);
  // Partial fill 30
  engine.submitOrder('B1', 'R2', 'P2', 'DEMO', 'BUY', 10000, 30);

  // Cancel remaining 70
  const cancelRes = engine.cancelOrder('S1');
  assert.strictEqual(cancelRes.success, true);
  assert.strictEqual(cancelRes.cancelledOrder?.status, 'CANCELLED');
  assert.strictEqual(cancelRes.cancelledOrder?.remainingQuantity, 70);

  // Second cancel attempt must fail
  const secondCancel = engine.cancelOrder('S1');
  assert.strictEqual(secondCancel.success, false);
});

test('Test 5: Duplicate requests and idempotency retry vs conflict', () => {
  const engine = new MatchingEngine(10000, 5.0, 30);

  // First submission
  const res1 = engine.submitOrder('ORD1', 'REQ-XYZ', 'P1', 'DEMO', 'BUY', 9900, 50);
  assert.strictEqual(res1.success, true);

  // Retry with same payload -> returns original result
  const res2 = engine.submitOrder('ORD1', 'REQ-XYZ', 'P1', 'DEMO', 'BUY', 9900, 50);
  assert.strictEqual(res2.success, true);
  assert.strictEqual(res2.order?.orderId, res1.order?.orderId);

  // Re-use with different payload -> conflict rejected
  const res3 = engine.submitOrder('ORD2', 'REQ-XYZ', 'P1', 'DEMO', 'BUY', 9950, 100);
  assert.strictEqual(res3.success, false);
  assert.match(res3.errorMessage || '', /Idempotency conflict/);
});

test('Test 6: Invalid parameters and numeric validation', () => {
  const engine = new MatchingEngine(10000, 5.0, 30);

  const r1 = engine.submitOrder('O1', 'R1', 'P1', 'DEMO', 'BUY', 0, 50);
  assert.strictEqual(r1.success, false);

  const r2 = engine.submitOrder('O2', 'R2', 'P2', 'DEMO', 'BUY', 10000, -10);
  assert.strictEqual(r2.success, false);

  const r3 = engine.submitOrder('O3', 'R3', 'P3', 'INVALID_SYM', 'BUY', 10000, 50);
  assert.strictEqual(r3.success, false);
});

test('Test 7: Circuit breaker boundary enforcement and breach trip', () => {
  // Ref: Rs 100.00 (10000 ticks), +/-5% -> [9500, 10500] ticks
  const engine = new MatchingEngine(10000, 5.0, 30);

  // 1. Trade exactly at Rs 105.00 (10500 ticks) - ALLOWED
  engine.submitOrder('S105', 'R1', 'P1', 'DEMO', 'SELL', 10500, 10);
  const r105 = engine.submitOrder('B105', 'R2', 'P2', 'DEMO', 'BUY', 10500, 10);
  assert.strictEqual(r105.success, true);
  assert.strictEqual(r105.breakerTriggered, false);
  assert.strictEqual(r105.generatedTrades.length, 1);
  assert.strictEqual(engine.getBreakerStatus().state, 'RUNNING');

  // 2. Trade exactly at Rs 95.00 (9500 ticks) - ALLOWED
  engine.submitOrder('B95', 'R3', 'P3', 'DEMO', 'BUY', 9500, 10);
  const r95 = engine.submitOrder('S95', 'R4', 'P4', 'DEMO', 'SELL', 9500, 10);
  assert.strictEqual(r95.success, true);
  assert.strictEqual(r95.breakerTriggered, false);
  assert.strictEqual(r95.generatedTrades.length, 1);
  assert.strictEqual(engine.getBreakerStatus().state, 'RUNNING');

  // 3. Candidate trade 1-tick outside boundary: Rs 105.01 (10501 ticks)
  engine.submitOrder('S_SHOCK', 'R5', 'P5', 'DEMO', 'SELL', 10501, 20);
  const r_shock = engine.submitOrder('B_SHOCK', 'R6', 'P6', 'DEMO', 'BUY', 10505, 20);
  // Must trip breaker!
  assert.strictEqual(r_shock.breakerTriggered, true);
  assert.strictEqual(r_shock.generatedTrades.length, 0); // No fill committed
  assert.strictEqual(engine.getBreakerStatus().state, 'HALTED');

  // 4. While halted: order submissions rejected
  const r_blocked = engine.submitOrder('B_NEW', 'R7', 'P7', 'DEMO', 'BUY', 10000, 10);
  assert.strictEqual(r_blocked.success, false);
  assert.match(r_blocked.errorMessage || '', /HALTED/);

  // 5. While halted: cancellations ARE permitted
  const r_cancel = engine.cancelOrder('S_SHOCK');
  assert.strictEqual(r_cancel.success, true);
});
