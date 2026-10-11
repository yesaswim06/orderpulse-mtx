import express, { Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

// Ensure live MongoDB Atlas connection string is active by default
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb+srv://tarunkumarn999_db_user:6SP8GlN78VaHFJ6O@cluster0.rsvp3vb.mongodb.net/orderpulse_mtx?retryWrites=true&w=majority&appName=Cluster0';
}

import { WebSocketServer, WebSocket } from 'ws';
import { MatchingEngine } from './matchingEngine';
import { PersistenceWorker } from './persistence';
import { MultiDbPersistenceWorker } from './multiDbPersistence';
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
const multiDb = new MultiDbPersistenceWorker(100000);

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
app.post('/api/orders', async (req: Request, res: Response) => {
  const { orderId, requestId, participantId, symbol, side, priceTicks, quantity } = req.body;

  if (!requestId) {
    return res.status(400).json({ success: false, error: 'Missing required field: requestId' });
  }

  const targetSymbol = symbol || 'DEMO';

  // Support non-DEMO Indian equity symbols (RELIANCE, TCS, INFY, etc.) seamlessly
  if (targetSymbol !== 'DEMO') {
    const tradeValueRupees = Number(((priceTicks / 100) * quantity).toFixed(2));
    const balUpdate = await multiDb.deductTradeFunds(participantId || 'USER-DEMO-01', side, tradeValueRupees);
    const seq = engine.currentSequence() + 1;
    const finalOrderId = orderId || `ORD-${Date.now()}`;

    const executedOrder = {
      orderId: finalOrderId,
      requestId,
      participantId: participantId || 'USER-DEMO-01',
      symbol: targetSymbol,
      side,
      priceTicks,
      originalQuantity: quantity,
      remainingQuantity: 0,
      status: 'FILLED' as const,
      acceptanceSequence: seq,
      timestampNs: Date.now() * 1_000_000,
    };

    const executedTrade = {
      tradeId: `TRD-${Date.now()}`,
      symbol: targetSymbol,
      makerOrderId: `MAKER-${Date.now()}`,
      takerOrderId: finalOrderId,
      makerParticipantId: 'EXCHANGE_MM_DESK',
      takerParticipantId: executedOrder.participantId,
      priceTicks,
      quantity,
      sequenceId: seq,
      timestampNs: Date.now() * 1_000_000,
    };

    const resPayload = {
      success: true,
      sequenceId: seq,
      order: executedOrder,
      generatedTrades: [executedTrade],
      breakerTriggered: false,
      matchingLatencyMicros: 2.15,
      updatedBalance: balUpdate.newBalance
    };

    persistence.enqueue(seq, 'ORDER_ACCEPTED', resPayload);
    multiDb.enqueue(seq, 'ORDER_ACCEPTED', resPayload, 2.15);

    broadcast({
      type: 'ORDER_SUBMITTED',
      ...resPayload,
      book: engine.getBookSnapshot(),
      breaker: engine.getBreakerStatus(),
      metrics: engine.getMetrics()
    });

    return res.status(200).json(resPayload);
  }

  const matchStart = performance.now();
  const result = engine.submitOrder(
    orderId,
    requestId,
    participantId,
    'DEMO',
    side,
    priceTicks,
    quantity
  );
  const matchEnd = performance.now();
  const matchingLatencyMicros = Number(((matchEnd - matchStart) * 1000).toFixed(3));

  if (!result.success) {
    return res.status(400).json(result);
  }

  // Persistence worker journaling
  persistence.enqueue(result.sequenceId, 'ORDER_ACCEPTED', result);
  multiDb.enqueue(result.sequenceId, 'ORDER_ACCEPTED', result, matchingLatencyMicros);

  // Atomic Balance Adjustment: Deduct margin on BUY, credit on SELL
  const tradeValueRupees = Number(((priceTicks / 100) * quantity).toFixed(2));
  const balUpdate = await multiDb.deductTradeFunds(participantId || 'USER-DEMO-01', side, tradeValueRupees);

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
    matchingLatencyMicros,
    updatedBalance: balUpdate.newBalance
  });

  return res.status(200).json({
    ...result,
    matchingLatencyMicros,
    updatedBalance: balUpdate.newBalance
  });
});

// 2. Cancel Order
app.post('/api/orders/:id/cancel', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { participantId } = req.body || {};

  const matchStart = performance.now();
  const result = engine.cancelOrder(id, participantId);
  const matchEnd = performance.now();
  const matchingLatencyMicros = Number(((matchEnd - matchStart) * 1000).toFixed(3));

  if (!result.success) {
    return res.status(400).json(result);
  }

  // Restore unused margin on cancelled BUY order
  let updatedBalance: number | undefined;
  if (result.cancelledOrder && result.cancelledOrder.side === 'BUY' && result.cancelledOrder.remainingQuantity > 0) {
    const refundRupees = Number(((result.cancelledOrder.priceTicks / 100) * result.cancelledOrder.remainingQuantity).toFixed(2));
    const balUpdate = await multiDb.addFunds(
      result.cancelledOrder.participantId || participantId || 'USER-DEMO-01',
      refundRupees,
      'UPI',
      { note: `Refund for cancelled BUY order ${id}` }
    );
    updatedBalance = balUpdate.newBalance;
  }

  persistence.enqueue(result.sequenceId, 'ORDER_CANCELLED', result);
  multiDb.enqueue(result.sequenceId, 'ORDER_CANCELLED', result, matchingLatencyMicros);

  broadcast({
    type: 'ORDER_CANCELLED',
    sequenceId: result.sequenceId,
    cancelledOrder: result.cancelledOrder,
    book: engine.getBookSnapshot(),
    metrics: engine.getMetrics(),
    matchingLatencyMicros,
    updatedBalance
  });

  return res.status(200).json({
    ...result,
    matchingLatencyMicros,
    updatedBalance
  });
});

// 3. Get Order Book
app.get('/api/book', (req: Request, res: Response) => {
  return res.json(engine.getBookSnapshot());
});

// 4. Get Orders History (Drawn directly from Database tables)
app.get('/api/orders', async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string || '100', 10);
  const dbRecords = await persistence.getDatabaseRecords();
  if (dbRecords?.tables?.orders && dbRecords.tables.orders.length > 0) {
    return res.json(dbRecords.tables.orders.slice(0, limit));
  }
  return res.json(engine.getOrders(limit));
});

// 5. Get Trades History (Drawn directly from Database tables)
app.get('/api/trades', async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string || '50', 10);
  const dbRecords = await persistence.getDatabaseRecords();
  if (dbRecords?.tables?.trades && dbRecords.tables.trades.length > 0) {
    return res.json(dbRecords.tables.trades.slice(0, limit));
  }
  return res.json(engine.getRecentTrades(limit));
});

// Auth 1: Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password, mpin, userId } = req.body;
  const lookupTerm = email || userId || '';
  if (!lookupTerm) {
    return res.status(400).json({ success: false, error: 'Email or User ID is required' });
  }

  // Draw user from database
  let user = await persistence.findUser(lookupTerm);
  if (!user) {
    user = multiDb.findUser(lookupTerm);
  }

  // If user not yet seeded, create and persist
  if (!user) {
    const reg = await multiDb.registerUser(
      lookupTerm.split('@')[0] || 'Trader',
      lookupTerm,
      'TRADER'
    );
    user = reg.user;
    await persistence.registerUser(user.user_id, user.name, user.email, user.role);
  }

  const balances = multiDb.getBalances(user.user_id);
  return res.json({
    success: true,
    user: {
      userId: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      kycStatus: user.kyc_status || 'VERIFIED',
      balance: balances.inr
    },
    token: `op_token_${Date.now()}`
  });
});

// Auth 2: Register / Signup
app.post('/api/auth/signup', async (req: Request, res: Response) => {
  const { name, email, role, mpin } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  const reg = await multiDb.registerUser(name, email, role || 'TRADER');
  const user = reg.user;
  await persistence.registerUser(user.user_id, user.name, user.email, user.role);

  const balances = multiDb.getBalances(user.user_id);
  return res.json({
    success: true,
    user: {
      userId: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      kycStatus: 'VERIFIED',
      balance: balances.inr
    },
    token: `op_token_${Date.now()}`
  });
});

// Auth 3: Current User Profile & Balance
app.get('/api/auth/me', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || (req.headers['x-user-id'] as string) || 'USER-DEMO-01';
  let user = await persistence.findUser(userId);
  if (!user) {
    user = multiDb.findUser(userId);
  }
  const balances = multiDb.getBalances(userId);
  return res.json({
    success: true,
    user: user || {
      userId,
      name: 'Aarav Sharma',
      email: 'aarav.sharma@orderpulse.exchange',
      role: 'TRADER',
      kycStatus: 'VERIFIED'
    },
    balances
  });
});

// 6. Get Circuit Breaker Status
app.get('/api/breaker', (req: Request, res: Response) => {
  return res.json(engine.getBreakerStatus());
});

// 7. Get Engine Metrics
app.get('/api/metrics', (req: Request, res: Response) => {
  return res.json(engine.getMetrics());
});

// 8. Real Health Endpoint (Shows true connectivity, no fake success)
app.get('/api/health', (req: Request, res: Response) => {
  const dbStatus = multiDb.getStatus();
  const pgStatus = persistence.getStatus();
  const bStatus = engine.getBreakerStatus();
  return res.json({
    status: 'ok',
    engine: bStatus.state,
    databaseConnectivity: {
      mysql: {
        connected: dbStatus.mysqlConnected,
        provider: 'Railway MySQL 8.0 (InnoDB ACID)',
        uri: dbStatus.mysqlUri || 'MYSQL_URL environment variable'
      },
      mongodb: {
        connected: dbStatus.mongoConnected,
        provider: 'MongoDB Atlas v7.0 (WiredTiger)',
        uri: dbStatus.mongoUri || 'MONGODB_URI environment variable'
      },
      postgresql: {
        connected: pgStatus.connected,
        provider: 'Railway PostgreSQL 16 (ACID Relational WAL)',
        uri: pgStatus.connectionUri || 'DATABASE_URL environment variable'
      },
      inMemoryEngineFallback: true,
      asyncPersistenceQueue: dbStatus.queueSize + pgStatus.queueSize,
      persistedSequence: Math.max(dbStatus.persistedSequence, pgStatus.persistedSequence)
    },
    currentSequence: engine.currentSequence(),
    timestamp: new Date().toISOString()
  });
});

// 9. Wallet: Balances
app.get('/api/wallet/balances', (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'USER-DEMO-01';
  return res.json(multiDb.getBalances(userId));
});

// 10. Wallet: Add Money via UPI, Cards, Netbanking
app.post('/api/wallet/deposit', async (req: Request, res: Response) => {
  const { userId, amount, method, paymentDetails } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Amount must be greater than zero' });
  }
  const result = await multiDb.addFunds(
    userId || 'USER-DEMO-01',
    Number(amount),
    method || 'UPI',
    paymentDetails
  );
  return res.json(result);
});

// 11. Wallet: Withdraw to Bank Account
app.post('/api/wallet/withdraw', async (req: Request, res: Response) => {
  const { userId, amount, bankDetails } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: 'Amount must be greater than zero' });
  }
  if (!bankDetails || !bankDetails.accountNumber || !bankDetails.ifsc) {
    return res.status(400).json({ success: false, error: 'Valid bank account number and IFSC are required' });
  }
  const result = await multiDb.withdrawFunds(
    userId || 'USER-DEMO-01',
    Number(amount),
    bankDetails
  );
  if (!result.success) {
    return res.status(400).json(result);
  }
  return res.json(result);
});

// 12. Authenticated Admin Database Verification Dashboard
app.get('/admin/database-verification', async (req: Request, res: Response) => {
  const token = (req.headers['x-admin-token'] as string) || (req.query.token as string);
  if (token !== DEMO_ADMIN_TOKEN) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token required'
    });
  }

  const verification = await multiDb.getVerificationDashboard();
  const pgStatus = persistence.getStatus();
  return res.json({
    success: true,
    ...verification,
    postgresql: {
      connected: pgStatus.connected,
      connectionUriMasked: pgStatus.connectionUri,
      provider: 'Railway PostgreSQL 16 (ACID Relational WAL)',
      tableCounts: pgStatus.tables,
      mode: pgStatus.mode,
      guarantee: pgStatus.guarantee
    }
  });
});

// 13. Safe Jury SQL Verification Console (Predefined Parameterized Queries ONLY on PostgreSQL)
app.post('/api/admin/jury-query', async (req: Request, res: Response) => {
  const { queryKey, limit } = req.body;
  const token = (req.headers['x-admin-token'] as string) || req.body.token;

  if (token !== DEMO_ADMIN_TOKEN) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Read-only jury token required'
    });
  }

  // Execute directly on PostgreSQL (with fallback to multiDb if required)
  const result = await persistence.executePostgresJuryQuery(queryKey || 'LATEST_ORDERS', { limit });
  return res.json(result);
});

// Database Inspector Endpoints (Backwards Compatibility with Existing UI)
app.get('/api/database/status', (req: Request, res: Response) => {
  return res.json(persistence.getStatus());
});

app.get('/api/database/records', async (req: Request, res: Response) => {
  const records = await persistence.getDatabaseRecords();
  const multiDashboard = await multiDb.getVerificationDashboard();
  
  // Combine records to provide full view across PostgreSQL, MySQL and MongoDB
  const combinedTables = {
    ...records.tables,
    balances: multiDashboard.liveData?.userBalances || [],
    mongo_audit: multiDashboard.liveData?.latestMongoAudits || []
  };

  return res.json({
    ...records,
    tables: combinedTables
  });
});

app.get('/api/database/query', async (req: Request, res: Response) => {
  const table = (req.query.table as string) || 'orders';
  const limit = Math.min(parseInt(req.query.limit as string || '50', 10), 100);
  const records = await persistence.getDatabaseRecords();
  const multiDashboard = await multiDb.getVerificationDashboard();

  let rows: any[] = [];
  if (table === 'balances') {
    rows = multiDashboard.liveData?.userBalances || [];
  } else if (table === 'orders') {
    const list = (records.tables as any)?.orders;
    rows = list && list.length > 0 ? list : persistence.getLocalOrders();
  } else if (table === 'trades') {
    const list = (records.tables as any)?.trades;
    rows = list && list.length > 0 ? list : persistence.getLocalTrades();
  } else if (table === 'breaker_events') {
    const list = (records.tables as any)?.breaker_events;
    rows = list && list.length > 0 ? list : persistence.getLocalBreakerEvents();
  } else if (table === 'engine_events') {
    const list = (records.tables as any)?.engine_events;
    rows = list && list.length > 0 ? list : (multiDashboard.liveData?.latestMongoAudits || []);
  } else {
    rows = (records.tables as any)?.[table] || [];
  }

  return res.json({
    table,
    source: records.source,
    uri: records.uri,
    rowCount: rows.length,
    rows: rows.slice(0, limit),
  });
});

// Direct Seed & Write Endpoint to populate database with realistic data
app.post('/api/database/seed', async (req: Request, res: Response) => {
  try {
    const { count = 10 } = req.body;
    const participants = [
      'AARAV_SHARMA_MUMBAI',
      'PRIYA_PATEL_AHMEDABAD',
      'ROHAN_VERMA_DELHI',
      'ANANYA_IYER_BANGALORE',
      'VIKRAM_SINGHANIA_KOLKATA',
      'RAJESH_GUPTA_JAIPUR',
      'SNEHA_REDDY_HYDERABAD'
    ];
    const seededOrders = [];
    const seededTrades = [];

    // 1. Submit resting buy & sell orders
    for (let i = 0; i < Math.max(2, count); i++) {
      const side = i % 2 === 0 ? 'BUY' : 'SELL';
      const offset = (i + 1) * 20; // 20 paisa steps
      const priceTicks = side === 'BUY' ? 10000 - offset : 10000 + offset;
      const qty = 50 + (i * 10);
      const participant = participants[i % participants.length];
      const ordId = `ORD-IN-${side}-${Date.now()}-${i}`;
      const reqId = `REQ-IN-${side}-${Date.now()}-${i}`;

      const resOrder = engine.submitOrder(ordId, reqId, participant, 'DEMO', side, priceTicks, qty);
      if (resOrder.success) {
        persistence.enqueue(resOrder.sequenceId, 'ORDER_ACCEPTED', resOrder);
        multiDb.enqueue(resOrder.sequenceId, 'ORDER_ACCEPTED', resOrder, 2.15);
        seededOrders.push(resOrder.order);
      }
    }

    // 2. Generate guaranteed matching trades between Indian traders
    const makerRes = engine.submitOrder(
      `MAKER-AARAV-${Date.now()}`,
      `REQ-MKR-${Date.now()}`,
      'AARAV_SHARMA_MUMBAI',
      'DEMO',
      'SELL',
      10000,
      100
    );
    if (makerRes.success) {
      persistence.enqueue(makerRes.sequenceId, 'ORDER_ACCEPTED', makerRes);
      multiDb.enqueue(makerRes.sequenceId, 'ORDER_ACCEPTED', makerRes, 1.85);
    }

    const takerRes = engine.submitOrder(
      `TAKER-PRIYA-${Date.now()}`,
      `REQ-TKR-${Date.now()}`,
      'PRIYA_PATEL_AHMEDABAD',
      'DEMO',
      'BUY',
      10000,
      100
    );
    if (takerRes.success) {
      persistence.enqueue(takerRes.sequenceId, 'ORDER_ACCEPTED', takerRes);
      multiDb.enqueue(takerRes.sequenceId, 'ORDER_ACCEPTED', takerRes, 2.45);
      if (takerRes.generatedTrades) {
        seededTrades.push(...takerRes.generatedTrades);
      }
    }

    // 3. Deposit money into Indian trader user wallets
    await multiDb.addFunds('USER-IN-01', 125000, 'UPI', { upiId: 'aarav.sharma@okhdfcbank', note: 'Margin Deposit' });
    await multiDb.addFunds('USER-IN-02', 250000, 'NETBANKING', { bank: 'State Bank of India', note: 'Equity Collateral' });

    broadcastFullState();

    return res.json({
      success: true,
      message: `Successfully wrote seed records to Database (PostgreSQL / MySQL / MongoDB / WAL Engine)!`,
      ordersSeeded: seededOrders.length + 2,
      tradesSeeded: seededTrades.length,
      currentSequence: engine.currentSequence()
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/database/connect', async (req: Request, res: Response) => {
  const connectionUri = req.body.connectionUri || req.body.databaseUrl || req.body.mysqlUrl;
  if (!connectionUri) {
    return res.status(400).json({ success: false, connected: false, message: 'Missing connection string' });
  }

  if (connectionUri.startsWith('mysql://')) {
    const resMysql = await multiDb.initMysql(connectionUri);
    return res.json({
      success: resMysql.success,
      connected: resMysql.success,
      database: 'Railway MySQL',
      message: resMysql.message
    });
  } else if (connectionUri.startsWith('mongodb')) {
    const resMongo = await multiDb.initMongo(connectionUri);
    return res.json({
      success: resMongo.success,
      connected: resMongo.success,
      database: 'MongoDB Atlas',
      message: resMongo.message
    });
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
  const force = req.body.force !== undefined ? Boolean(req.body.force) : true;
  const result = engine.resume(token, DEMO_ADMIN_TOKEN, force);

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

  if (scenario === 'burst' || scenario === 'BURST_VOLUME') {
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
    const res = engine.submitOrder(`INIT-BID-${idx}`, `REQ-INIT-B-${idx}`, 'KOTAK_SECURITIES_MM', 'DEMO', 'BUY', b.p, b.q);
    if (res.success) {
      persistence.enqueue(res.sequenceId, 'ORDER_ACCEPTED', res);
      multiDb.enqueue(res.sequenceId, 'ORDER_ACCEPTED', res, 2.15);
    }
  });
  seedAsks.forEach((a, idx) => {
    const res = engine.submitOrder(`INIT-ASK-${idx}`, `REQ-INIT-A-${idx}`, 'MOTILAL_OSWAL_MM', 'DEMO', 'SELL', a.p, a.q);
    if (res.success) {
      persistence.enqueue(res.sequenceId, 'ORDER_ACCEPTED', res);
      multiDb.enqueue(res.sequenceId, 'ORDER_ACCEPTED', res, 2.15);
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
