# OrderPulse — Backend API Contract & Specification

**Event:** MTX Hackathon 2026  
**System:** OrderPulse Ultra-Low Latency Order-Book Matching Engine with Volatility Circuit Breakers  
**Protocols:** REST (HTTP/1.1 JSON) + WebSocket (`/ws`)  
**Persistent Stores:** Railway PostgreSQL 16 (Authoritative ACID Ledger) + MongoDB Atlas (Audit Projections)  

---

## 1. Authentication Endpoints

### 1.1 POST `/api/auth/signup`
- **Request Body:**
  ```json
  {
    "name": "Aarav Sharma",
    "email": "aarav.sharma@orderpulse.exchange",
    "password": "SecurePassword123!"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "user": {
      "userId": "USER-DEMO-01",
      "name": "Aarav Sharma",
      "email": "aarav.sharma@orderpulse.exchange",
      "role": "TRADER"
    },
    "token": "jwt-bearer-demo-token"
  }
  ```

### 1.2 POST `/api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "trader@orderpulse.exchange",
    "password": "demo123456"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "user": {
      "userId": "USER-DEMO-01",
      "name": "Institutional Prop Desk",
      "email": "trader@orderpulse.exchange",
      "role": "TRADER"
    }
  }
  ```

---

## 2. Market Data & Order Book

### 2.1 GET `/api/book`
- **Description:** Returns the live Level-2 order book depth and sequence ID.
- **Response (200 OK):**
  ```json
  {
    "symbol": "DEMO",
    "sequenceId": 4821,
    "bids": [{ "priceTicks": 9950, "totalQuantity": 250, "orderCount": 3 }],
    "asks": [{ "priceTicks": 10050, "totalQuantity": 150, "orderCount": 2 }],
    "bestBidTicks": 9950,
    "bestAskTicks": 10050,
    "spreadTicks": 100,
    "timestampNs": 1791650000000000
  }
  ```

### 2.2 GET `/api/trades`
- **Description:** Returns recent executed trades.
- **Response (200 OK):** Array of `Trade` records.

---

## 3. Order Management & Execution

### 3.1 POST `/api/orders`
- **Description:** Submits a limit order into the deterministic FIFO matching engine. Automatically validates margin against available cash and reserves/deducts funds upon fill.
- **Request Body:**
  ```json
  {
    "userId": "USER-DEMO-01",
    "symbol": "DEMO",
    "side": "BUY",
    "price": 100.00,
    "quantity": 10
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "order": {
      "orderId": "ORD-1791650123-01",
      "symbol": "DEMO",
      "side": "BUY",
      "priceTicks": 10000,
      "originalQuantity": 10,
      "remainingQuantity": 0,
      "status": "FILLED"
    },
    "matchLatencyMicros": 2.1,
    "updatedBalance": 999000
  }
  ```

### 3.2 POST `/api/orders/:id/cancel`
- **Description:** Cancels a resting limit order in $O(1)$ time and releases reserved margin.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "orderId": "ORD-1791650123-01",
    "status": "CANCELLED"
  }
  ```

---

## 4. Wallet & Banking

### 4.1 GET `/api/wallet/balances`
- **Query Params:** `?userId=USER-DEMO-01`
- **Response (200 OK):**
  ```json
  {
    "userId": "USER-DEMO-01",
    "inr": 1000000,
    "lockedInr": 0,
    "currency": "INR"
  }
  ```

### 4.2 POST `/api/wallet/deposit`
- **Request Body:**
  ```json
  {
    "userId": "USER-DEMO-01",
    "amount": 50000,
    "method": "UPI"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "balance": 1050000,
    "txnId": "TXN-UPI-98124"
  }
  ```

---

## 5. Volatility Circuit Breakers

### 5.1 GET `/api/breaker/status`
- **Response (200 OK):**
  ```json
  {
    "state": "RUNNING",
    "referencePriceTicks": 10000,
    "bandPercent": 5.0,
    "lowerBandTicks": 9500,
    "upperBandTicks": 10500,
    "minHaltDurationSeconds": 30,
    "remainingHaltSeconds": 0
  }
  ```

### 5.2 POST `/api/circuit-breaker/resume`
- **Description:** Explicit operator action to resume trading after 30-second volatility cooldown.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "state": "RUNNING",
    "message": "Market resumed by operator."
  }
  ```

---

## 6. Jury & Monitoring Console

### 6.1 POST `/api/jury/query`
- **Description:** Runs parameterized, allowlisted read-only SQL queries directly against Railway PostgreSQL 16.
- **Request Body:**
  ```json
  {
    "queryKey": "RECENT_TRADES",
    "limit": 10
  }
  ```
- **Response (200 OK):** Query execution result set with column headers and rows.

### 6.2 GET `/api/health`
- **Response (200 OK):**
  ```json
  {
    "status": "HEALTHY",
    "postgres": true,
    "mongo": true,
    "engine": "RUNNING",
    "uptimeSeconds": 1420
  }
  ```
