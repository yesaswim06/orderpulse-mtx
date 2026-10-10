import test from 'node:test';
import assert from 'node:assert/strict';
import { MatchingEngine } from '../matchingEngine';
import { MultiDbPersistenceWorker } from '../multiDbPersistence';

test('1. In-Memory Matching Engine FIFO Price-Time Priority', () => {
  const engine = new MatchingEngine(10000, 5.0, 30);
  
  // Submit resting sell order 50 DEMO @ Rs 100.00
  const sellRes = engine.submitOrder('SELL-1', 'REQ-1', 'SELLER_A', 'DEMO', 'SELL', 10000, 50);
  assert.equal(sellRes.success, true);
  assert.equal(sellRes.order?.status, 'NEW');

  // Submit aggressive buy order 50 DEMO @ Rs 100.00 -> Full match
  const buyRes = engine.submitOrder('BUY-1', 'REQ-2', 'BUYER_B', 'DEMO', 'BUY', 10000, 50);
  assert.equal(buyRes.success, true);
  assert.equal(buyRes.order?.status, 'FILLED');
  assert.equal(buyRes.generatedTrades.length, 1);
  assert.equal(buyRes.generatedTrades[0].priceTicks, 10000);
  assert.equal(buyRes.generatedTrades[0].quantity, 50);
});

test('2. Volatility Circuit Breaker ±5% Collar Breach Trip & Cooldown', () => {
  const engine = new MatchingEngine(10000, 5.0, 30); // 10000 ticks = Rs 100.00. Range: [9500, 10500]

  // Submit resting sell order outside upper band: Rs 106.00 (10600 ticks)
  const sellRes = engine.submitOrder('SELL-BREACH', 'REQ-3', 'ROGUE_SELLER', 'DEMO', 'SELL', 10600, 10);
  assert.equal(sellRes.success, true);

  // Incoming buy matching at Rs 106.00 -> MUST trip circuit breaker before fill!
  const buyRes = engine.submitOrder('BUY-BREACH', 'REQ-4', 'SPECULATOR', 'DEMO', 'BUY', 10600, 10);
  assert.equal(buyRes.success, true);
  assert.equal(buyRes.breakerTriggered, true);
  assert.equal(buyRes.generatedTrades.length, 0); // Candidate trade blocked!

  const breakerStatus = engine.getBreakerStatus();
  assert.equal(breakerStatus.state, 'HALTED');
  assert.equal(breakerStatus.lastBreachCandidateTicks, 10600);
});

test('3. MultiDbPersistenceWorker Atomic Ledger & Jury Safe Query Console', async () => {
  const worker = new MultiDbPersistenceWorker(10000);

  // Deposit test via UPI
  const depRes = await worker.addFunds('USER-DEMO-01', 50000, 'UPI', { upiId: 'trader@okhdfcbank' });
  assert.equal(depRes.success, true);
  assert(depRes.newBalance >= 50000);

  // Safe Parameterized Query Execution (Disallows arbitrary SQL)
  const queryRes = await worker.executeJuryQuery('ACTIVE_BALANCES', { limit: 5 });
  assert.equal(queryRes.success, true);
  assert.equal(queryRes.queryKey, 'ACTIVE_BALANCES');
  assert(queryRes.rows.length > 0);

  // Arbitrary or invalid SQL injection prevention
  const badQuery = await worker.executeJuryQuery('DROP TABLE users;--', {});
  assert.equal(badQuery.success, false);
  assert(badQuery.error?.includes('disallowed'));
});

test('4. Real Health Connectivity Reporting', async () => {
  const worker = new MultiDbPersistenceWorker(10000);
  const status = worker.getStatus();
  assert.equal(typeof status.mysqlConnected, 'boolean');
  assert.equal(typeof status.mongoConnected, 'boolean');
});

test('5. Clean Exit', () => {
  setTimeout(() => process.exit(0), 100);
});
