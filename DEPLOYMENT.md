# OrderPulse MTX: Complete Deployment Guide

This guide provides step-by-step instructions for deploying the **OrderPulse MTX** Matching Engine across different environments:
1. [Local Machine Deployment (Windows / macOS / Linux)](#1-local-machine-deployment)
2. [Docker Compose Multi-Container Deployment](#2-docker-compose-deployment)
3. [Cloud VPS / VM Deployment (AWS EC2, DigitalOcean, Hetzner, GCP)](#3-cloud-vps-deployment)
4. [Free Cloud PaaS Deployment (Render / Railway + Vercel)](#4-cloud-paas-deployment)
5. [Native C++20 High-Performance Engine Deployment](#5-native-c20-high-performance-deployment)
6. [Environment Variables & Security Configuration](#6-environment-variables--security)

---

## 1. Local Machine Deployment

Ideal for quick evaluation, development, and hackathon judging on your laptop.

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+
- **Git**

### Step-by-Step Commands

#### Step 1: Clone Repository
```bash
git clone https://github.com/yesaswim06/orderpulse-mtx.git
cd orderpulse-mtx
```

#### Step 2: Configure Environment Variables
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux / macOS
cp .env.example .env
```

#### Step 3: Start the Backend Service (Port 8080)
Open a terminal:
```bash
cd backend
npm install
npm run build
npm start
```
*Outputs: Listening on `http://localhost:8080` with WebSocket on `ws://localhost:8080/ws`.*

#### Step 4: Start the Frontend Dashboard (Port 3000)
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
*Open your browser at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is occupied).*

---

## 2. Docker Compose Deployment

Packages PostgreSQL, the Matching Backend, and the React Frontend into isolated, self-healing containers.

### Prerequisites
- **Docker Desktop** (Windows / macOS) or **Docker Engine + Docker Compose** (Linux).

### Step-by-Step Commands

#### Step 1: Build and Launch Services
From the root directory of the repository:
```bash
docker compose up --build -d
```

#### Step 2: Verify Running Containers
```bash
docker compose ps
```
You should see 3 running containers:
- `mtx-postgres`: PostgreSQL 16 on port `5432` with auto-applied migrations.
- `mtx-matching-backend`: Matching engine server on port `8080`.
- `mtx-trading-dashboard`: Nginx serving React + proxying `/api` & `/ws` on port `3000`.

#### Step 3: Access the Application
Open `http://localhost:3000` in any web browser.

#### Step 4: Stop Containers
```bash
docker compose down
```
*(Add `-v` if you also wish to delete persistent PostgreSQL volume data).*

---

## 3. Cloud VPS Deployment (Ubuntu 22.04 / 24.04 LTS)

Recommended for public cloud hosting (AWS EC2, DigitalOcean Droplet, Hetzner Cloud, Google Cloud Compute Engine).

### Step 1: Provision and Connect to Server
SSH into your server:
```bash
ssh ubuntu@your-server-ip
```

### Step 2: Install Docker & Docker Compose
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg git
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
newgrp docker
```

### Step 3: Clone and Launch
```bash
git clone https://github.com/yesaswim06/orderpulse-mtx.git
cd orderpulse-mtx
cp .env.example .env

# Edit .env with your custom admin secret:
nano .env

# Launch with Docker Compose:
docker compose up --build -d
```

### Step 4: Configure Domain Name & SSL with Nginx + Certbot (Optional)
If attaching a custom domain (e.g. `trading.yourdomain.com`):
```bash
sudo apt-get install -y nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/orderpulse`:
```nginx
server {
    server_name trading.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```
Enable the site and enable HTTPS:
```bash
sudo ln -s /etc/nginx/sites-available/orderpulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d trading.yourdomain.com
```

---

## 4. Cloud PaaS Deployment (Render / Railway + Vercel)

If you don't want to manage a Linux server, you can deploy using serverless/PaaS platforms:

### A. Deploy Backend to Render (render.com)
1. Fork or push the repo to your GitHub account.
2. Log in to [Render](https://render.com) and click **New + Web Service**.
3. Connect your repository.
4. Set:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `PORT`: `8080`
   - `DEMO_ADMIN_TOKEN`: `<your-secure-secret-token>`
   - `BREAKER_REFERENCE_PRICE_RUPEES`: `100.00`
   - `BREAKER_BAND_PERCENT`: `5.0`
6. Click **Deploy**. Note your public URL (e.g., `https://orderpulse-mtx.onrender.com`).

### B. Deploy Frontend to Vercel (vercel.com)
1. Log in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select the repository.
3. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy! Your dashboard will be live at `https://<your-project>.vercel.app`.

---

## 5. Native C++20 High-Performance Deployment

To extract maximum CPU performance (sub-microsecond execution):

### Prerequisites
- Linux (Debian 12 / Ubuntu 22.04+)
- GCC 13+ or Clang 16+ supporting `-std=c++20`
- CMake 3.20+
- Boost libraries (`libboost-all-dev`)

### Step-by-Step Commands
```bash
# Install dependencies
sudo apt-get update
sudo apt-get install -y build-essential cmake libboost-all-dev libpq-dev

# Build with native CPU architecture optimizations (-O3 -march=native)
cd cpp-engine
mkdir -p build && cd build
cmake -DCMAKE_BUILD_TYPE=Release ..
cmake --build . --parallel $(nproc)

# Run specification verification tests
./matching_engine_tests

# Run microsecond benchmark
./matching_engine_benchmark

# Run production server
./matching_engine_server
```

---

## 6. Environment Variables & Security

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8080` | Matching engine HTTP & WebSocket listening port. |
| `SYMBOL` | `DEMO` | Trading symbol for the matching engine. |
| `TICK_SIZE_RUPEES` | `0.01` | Integer tick granularity (1 tick = 1 paisa). |
| `BREAKER_REFERENCE_PRICE_RUPEES` | `100.00` | Anchor reference price for volatility band calculation. |
| `BREAKER_BAND_PERCENT` | `5.0` | Maximum allowed price deviation (±5% creates ₹95 - ₹105 band). |
| `BREAKER_HALT_DURATION_SECONDS` | `30` | Minimum mandatory cooling duration before resume is permitted. |
| `DEMO_ADMIN_TOKEN` | `demo-admin-secret-mtx-2026` | **CRITICAL**: Server-side secret required for `resume` and `reference` resets. Never embed in public client bundles. |
| `POSTGRES_HOST` | `postgres` | Host address of PostgreSQL database. |
| `POSTGRES_PORT` | `5432` | Port of PostgreSQL database. |
| `POSTGRES_DB` | `orderpulse_mtx` | Target database name. |

---

## 7. Verification Checklist After Deployment

- [ ] Visit `http://<your-host>:3000` (or `http://localhost:3000`).
- [ ] Confirm **"TRADING SIMULATION"** label and WebSocket status reads **Connected**.
- [ ] Test **1. Normal Match**: Ensure resting order price execution and trades appear.
- [ ] Test **2. Partial Fill**: Verify quantity conservation.
- [ ] Test **3. Price Shock**: Trigger halt at ₹106.00, check 30s countdown, and verify new orders are blocked while cancellations work.
- [ ] Wait for `READY_TO_RESUME` and click **Resume Trading** using the demo admin token.
- [ ] Run benchmark to verify microsecond execution profile.
