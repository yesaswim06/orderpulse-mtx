import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { MatchingEngine } from './matchingEngine';
import { PersistenceWorker } from './persistence';
import { ticksToRupees, rupeesToTicks } from './types';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json());

const PORT = parseInt(process.env.PORT || '8080', 10);
const DEMO_ADMIN_TOKEN = process.env.DEMO_ADMIN_TOKEN || 'demo-admin-secret-mtx-2026';
const REF_PRICE_RUPEES = parseFloat(process.env.BREAKER_REFERENCE_PRICE_RUPEES || '100.00');
const REF_PRICE_TICKS = rupeesToTicks(REF_PRICE_RUPEES);

const engine = new MatchingEngine(REF_PRICE_TICKS, 5.0, 30);
const persistence = new PersistenceWorker(100000);

// Connected WebSocket clients
const clients = new Set<WebSocket>();

function broadcast(event: any) {
  const data = JSON.stringify(event);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

function broadcastFullState() {
  const snapshot = {
    type: 'SNAPSHOT',
    sequenceId: engine.currentSequence(),
    book: engine.getBookSnapshot(),
    breaker: engine.getBreakerStatus(),
    trades: engine.getRecentTrades(30),
    orders: engine.getOrders(30),
    metrics: engine.getMetrics(),
    timestampNs: Date.now() * 1_000_000,
  };
  broadcast(snapshot);
}

// WebSocket Connection Handler
wss.on('connection', (ws: WebSocket) => {
  clients.add(ws);

  // Send initial consistent snapshot
  const initialSnapshot = {
    type: 'SNAPSHOT',
    sequenceId: engine.currentSequence(),
    book: engine.getBookSnapshot(),
    breaker: engine.getBreakerStatus(),
    trades: engine.getRecentTrades(30),
    orders: engine.getOrders(30),
    metrics: engine.getMetrics(),
    timestampNs: Date.now() * 1_000_000,
  };
  ws.send(JSON.stringify(initialSnapshot));

  ws.on('message', (message: string) => {
    try {
      const parsed = JSON.parse(message.toString());
      if (parsed.action === 'RESYNC') {
        // Client detected a sequence gap, sending fresh snapshot
        ws.send(JSON.stringify({
          type: 'SNAPSHOT',
          sequenceId: engine.currentSequence(),
          book: engine.getBookSnapshot(),
          breaker: engine.getBreakerStatus(),
          trades: engine.getRecentTrades(30),
          orders: engine.getOrders(30),
          metrics: engine.getMetrics(),
          resynced: true,
          timestampNs: Date.now() * 1_000_000,
        }));
      }
    } catch (e) {
      // ignore malformed messages
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Periodic broadcast of metrics & breaker countdown
setInterval(() => {
  if (clients.size > 0) {
    const breaker = engine.getBreakerStatus();
    const metrics = engine.getMetrics();
    broadcast({
      type: 'TICK_UPDATE',
      sequenceId: engine.currentSequence(),
      breaker,
      metrics,
    });
  }
}, 1000);

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Submit Order
app.post('/api/orders', (req: Request, res: Response) => {
  const { orderId, requestId, participantId, symbol, side, priceTicks, quantity } = req.body;

  if (!requestId) {
    return res.status(400).json({ success: false, error: 'Missing required field: requestId' });
  }

  const result = engine.submitOrder(
    orderId,
    requestId,
    participantId,
    symbol || 'DEMO',
    side,
    priceTicks,
    quantity
  );

  if (!result.success) {
    return res.status(400).json(result);
  }

  // Persistence worker journaling
  persistence.enqueue(result.sequenceId, 'ORDER_ACCEPTED', result);

  // Broadcast updates over WebSocket
  broadcast({
    type: 'ORDER_SUBMITTED',
    sequenceId: result.sequenceId,
    order: result.order,
    trades: result.generatedTrades,
    breakerTriggered: result.breakerTriggered,
    book: engine.getBookSnapshot(),
    breaker: engine.getBreakerStatus(),
    metrics: engine.getMetrics(),
  });

  return res.status(200).json(result);
});

// 2. Cancel Order
app.post('/api/orders/:id/cancel', (req: Request, res: Response) => {
  const { id } = req.params;
  const { participantId } = req.body || {};

  const result = engine.cancelOrder(id, participantId);
  if (!result.success) {
    return res.status(400).json(result);
  }

  persistence.enqueue(result.sequenceId, 'ORDER_CANCELLED', result);

  broadcast({
    type: 'ORDER_CANCELLED',
    sequenceId: result.sequenceId,
    cancelledOrder: result.cancelledOrder,
    book: engine.getBookSnapshot(),
    metrics: engine.getMetrics(),
  });

  return res.status(200).json(result);
});

// 3. Get Order Book
app.get('/api/book', (req: Request, res: Response) => {
  return res.json(engine.getBookSnapshot());
});

// 4. Get Orders History
app.get('/api/orders', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string || '100', 10);
  return res.json(engine.getOrders(limit));
});

// 5. Get Trades History
app.get('/api/trades', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string || '50', 10);
  return res.json(engine.getRecentTrades(limit));
});

// 6. Get Circuit Breaker Status
app.get('/api/breaker', (req: Request, res: Response) => {
  return res.json(engine.getBreakerStatus());
});

// 7. Get Engine Metrics
app.get('/api/metrics', (req: Request, res: Response) => {
  return res.json(engine.getMetrics());
});

// 8. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  const pStatus = persistence.getStatus();
  const bStatus = engine.getBreakerStatus();
  return res.json({
    status: 'ok',
    engine: bStatus.state,
    persistence: pStatus.healthy ? 'healthy' : 'degraded',
    postgresConnected: pStatus.connectedToPostgres,
    postgresUri: pStatus.connectionUri,
    persistenceQueueSize: pStatus.queueSize,
    persistedSequence: pStatus.persistedSequence,
    currentSequence: engine.currentSequence(),
    guarantees: pStatus.guarantee,
  });
});

// Database Inspector Endpoints (Essential for Jury Demo)
app.get('/api/database/status', (req: Request, res: Response) => {
  return res.json(persistence.getStatus());
});

app.get('/api/database/records', async (req: Request, res: Response) => {
  const records = await persistence.getDatabaseRecords();
  return res.json(records);
});

app.get('/api/database/query', async (req: Request, res: Response) => {
  const table = (req.query.table as string) || 'orders';
  const limit = Math.min(parseInt(req.query.limit as string || '50', 10), 100);
  const records = await persistence.getDatabaseRecords();
  const rows = (records.tables as any)?.[table] || [];
  return res.json({
    table,
    source: records.source,
    uri: records.uri,
    rowCount: rows.length,
    rows: rows.slice(0, limit),
  });
});

app.post('/api/database/connect', async (req: Request, res: Response) => {
  const connectionUri = req.body.connectionUri || req.body.databaseUrl;
  if (!connectionUri) {
    return res.status(400).json({ success: false, connected: false, message: 'Missing connectionUri or databaseUrl' });
  }
  const result = await persistence.initPostgres(connectionUri);
  return res.json({
    success: result.success,
    connected: result.success,
    database: persistence.getStatus().connectionUri,
    message: result.message,
  });
});

// 9. Admin Resume Trading
app.post('/api/admin/resume', (req: Request, res: Response) => {
  const token = req.headers['x-admin-token'] as string || req.body.adminToken;
  const result = engine.resume(token, DEMO_ADMIN_TOKEN);

  if (!result.success) {
    return res.status(403).json(result);
  }

  broadcastFullState();
  return res.json({ success: true, message: 'Trading resumed successfully', resumedTrades: result.resumedTrades });
});

// 10. Admin Reference Price Reset
app.post('/api/admin/reference', (req: Request, res: Response) => {
  const token = req.headers['x-admin-token'] as string || req.body.adminToken;
  const { referencePriceTicks, referencePriceRupees, reason } = req.body;

  const ticks = referencePriceTicks || (referencePriceRupees ? rupeesToTicks(referencePriceRupees) : 0);
  const result = engine.resetReferencePrice(ticks, reason || 'Operator manual reset', token, DEMO_ADMIN_TOKEN);

  if (!result.success) {
    return res.status(403).json(result);
  }

  broadcastFullState();
  return res.json({ success: true, message: 'Reference price updated', breaker: engine.getBreakerStatus() });
});

// 11. Scenarios for Interactive Demo
app.post('/api/admin/scenario', (req: Request, res: Response) => {
  const { scenario } = req.body;

  if (scenario === 'reset') {
    engine.clear();
    broadcastFullState();
    return res.json({ success: true, message: 'Engine state reset' });
  }

  if (scenario === 'normal') {
    // 1. Resting sell @ Rs 100.00
    const sellRes = engine.submitOrder(
      `SELL-${Date.now()}`,
      `REQ-SCENARIO-S-${Date.now()}`,
      'ALGO_DESK',
      'DEMO',
      'SELL',
      10000,
      50
    );
    if (sellRes.success) persistence.enqueue(sellRes.sequenceId, 'ORDER_ACCEPTED', sellRes);

    // 2. Incoming buy @ Rs 100.00
    const buyRes = engine.submitOrder(
      `BUY-${Date.now()}`,
      `REQ-SCENARIO-B-${Date.now()}`,
      'RETAIL_FLOW',
      'DEMO',
      'BUY',
      10000,
      50
    );
    if (buyRes.success) persistence.enqueue(buyRes.sequenceId, 'ORDER_ACCEPTED', buyRes);

    broadcastFullState();
    return res.json({ success: true, scenario: 'normal', sellRes, buyRes });
  }

  if (scenario === 'partial_fill') {
    // Resting sell 100 shares @ Rs 100.00
    const sellRes = engine.submitOrder(
      `SELL-PARTIAL-${Date.now()}`,
      `REQ-PARTIAL-S-${Date.now()}`,
      'INSTITUTIONAL_MAKER',
      'DEMO',
      'SELL',
      10000,
      100
    );
    if (sellRes.success) persistence.enqueue(sellRes.sequenceId, 'ORDER_ACCEPTED', sellRes);

    // Incoming buy 40 shares @ Rs 100.00 -> partial fill (60 resting left)
    const buyRes = engine.submitOrder(
      `BUY-PARTIAL-${Date.now()}`,
      `REQ-PARTIAL-B-${Date.now()}`,
      'QUICK_TAKER',
      'DEMO',
      'BUY',
      10000,
      40
    );
    if (buyRes.success) persistence.enqueue(buyRes.sequenceId, 'ORDER_ACCEPTED', buyRes);

    broadcastFullState();
    return res.json({ success: true, scenario: 'partial_fill', sellRes, buyRes });
  }

  if (scenario === 'price_shock') {
    // Remove any resting asks lower than 10600 so candidate execution happens at 10600 ticks
    const currentBook = engine.getBookSnapshot();
    for (const ask of currentBook.asks) {
      if (ask.priceTicks < 10600) {
        // Find and cancel lower resting orders
        const orders = engine.getOrders(200);
        for (const ord of orders) {
          if (ord.side === 'SELL' && ord.priceTicks < 10600 && ord.remainingQuantity > 0) {
            engine.cancelOrder(ord.orderId);
          }
        }
      }
    }

    // Place resting sell at Rs 106.00 (Breaches Rs 105.00 upper band)
    const shockSell = engine.submitOrder(
      `SELL-SHOCK-${Date.now()}`,
      `REQ-SHOCK-S-${Date.now()}`,
      'ROGUE_TRADER',
      'DEMO',
      'SELL',
      10600,
      75
    );
    // Incoming aggressive buy @ Rs 106.00 -> candidate execution at Rs 106.00 breaches band!
    const shockBuy = engine.submitOrder(
      `BUY-SHOCK-${Date.now()}`,
      `REQ-SHOCK-B-${Date.now()}`,
      'SPECULATOR',
      'DEMO',
      'BUY',
      10600,
      75
    );
    broadcastFullState();
    return res.json({
      success: true,
      scenario: 'price_shock',
      shockSell,
      shockBuy,
      breaker: engine.getBreakerStatus(),
    });
  }

  if (scenario === 'burst') {
    // Send a burst of 50 orders
    const participants = ['HFT_ALPHA', 'MARKET_MAKER_1', 'RETAIL_1', 'ARBITRAGEUR', 'PENSION_FUND'];
    const results = [];
    for (let i = 0; i < 50; i++) {
      const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
      // Prices between 98.00 and 102.00 (9800 to 10200 ticks)
      const priceOffset = Math.floor(Math.random() * 400) - 200;
      const priceTicks = 10000 + priceOffset;
      const qty = Math.floor(Math.random() * 50) + 10;
      const pId = participants[i % participants.length];

      const r = engine.submitOrder(
        `BURST-${i}-${Date.now()}`,
        `REQ-BURST-${i}-${Date.now()}`,
        pId,
        'DEMO',
        side,
        priceTicks,
        qty
      );
      results.push(r);
    }
    broadcastFullState();
    return res.json({
      success: true,
      scenario: 'burst',
      ordersProcessed: results.length,
      metrics: engine.getMetrics(),
    });
  }

  return res.status(400).json({ success: false, error: 'Unknown scenario' });
});

// Seed an initial healthy order book on start so dashboard has realistic resting depth
function seedInitialBook() {
  const seedBids = [
    { p: 9980, q: 250 }, { p: 9975, q: 300 }, { p: 9950, q: 500 },
    { p: 9920, q: 450 }, { p: 9900, q: 600 }, { p: 9850, q: 800 }
  ];
  const seedAsks = [
    { p: 10020, q: 200 }, { p: 10025, q: 350 }, { p: 10050, q: 400 },
    { p: 10080, q: 550 }, { p: 10100, q: 700 }, { p: 10150, q: 900 }
  ];

  seedBids.forEach((b, idx) => {
    const res = engine.submitOrder(`INIT-BID-${idx}`, `REQ-INIT-B-${idx}`, 'SEED_MM_BID', 'DEMO', 'BUY', b.p, b.q);
    if (res.success) {
      persistence.enqueue(res.sequenceId, 'ORDER_ACCEPTED', res);
    }
  });
  seedAsks.forEach((a, idx) => {
    const res = engine.submitOrder(`INIT-ASK-${idx}`, `REQ-INIT-A-${idx}`, 'SEED_MM_ASK', 'DEMO', 'SELL', a.p, a.q);
    if (res.success) {
      persistence.enqueue(res.sequenceId, 'ORDER_ACCEPTED', res);
    }
  });
}

seedInitialBook();

server.listen(PORT, () => {
  console.log(`======================================================================`);
  console.log(`  MTX Ultra-Low Latency Order-Book Matching Engine (Node/TS Server)`);
  console.log(`  Trading Simulation Service Running on Port ${PORT}`);
  console.log(`  WebSocket Feed Live on ws://localhost:${PORT}/ws`);
  console.log(`  Admin Secret Token: ${DEMO_ADMIN_TOKEN}`);
  console.log(`======================================================================`);
});
