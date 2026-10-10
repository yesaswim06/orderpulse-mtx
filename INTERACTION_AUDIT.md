# OrderPulse — Interaction Audit

**Event:** MTX Hackathon 2026  
**Auditor:** OrderPulse Autonomous Systems Architecture Team  
**Standard Status Values:**
- `VERIFIED WORKING`
- `IMPLEMENTED BUT UNTESTED`
- `PARTIALLY WORKING`
- `NOT IMPLEMENTED`
- `BLOCKED`

---

## 1. UI Interaction Inventory

| Interaction Target | Location / Component | Trigger | Expected Action | Handlers / Backend Target | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Theme Toggle (Sun/Moon)** | `GrowNavbar.tsx` | Click | Toggles light and dark CSS theme tokens and updates `localStorage`. | `onToggleTheme()` in `AppLayout` | `VERIFIED WORKING` |
| **Wallet Balance Pill** | `GrowNavbar.tsx` | Click | Opens `WalletModal` for deposits and balance overview. | `onOpenWallet()` -> `setIsWalletOpen(true)` | `VERIFIED WORKING` |
| **Profile Popover Anchor** | `GrowNavbar.tsx` | Click | Opens Indian demo trader profile menu with balance, orders, support links. | `setIsProfileOpen(!isProfileOpen)` | `VERIFIED WORKING` |
| **Global Search Bar** | `GrowNavbar.tsx` | Input & Ctrl+K | Searches stocks, bonds, indices, and redirects to relevant instruments. | `onChange` + `keydown` listener | `VERIFIED WORKING` |
| **Navigation Links (Stocks, F&O, MF)** | `GrowNavbar.tsx` | Click | Client-side navigation across Groww-inspired market pages. | React Router `<Link to="...">` | `VERIFIED WORKING` |
| **Terminal Shortcut Button** | `GrowNavbar.tsx` & `SubNav.tsx` | Click | Opens institutional C++ matching terminal (`/trade`). | `<Link to="/trade">` | `VERIFIED WORKING` |
| **Stock Card Click** | `StocksExplorePage.tsx` | Click | Opens interactive `StockDetailModal` with full order controls. | `setSelectedStock(stock)` | `VERIFIED WORKING` |
| **Quick Quantity Steppers** | `StockDetailModal.tsx` | Click | Increments order quantity by +10, +25, +50, +100 units. | `setQuantity(q => q + step)` | `VERIFIED WORKING` |
| **Buy / Sell Toggle** | `StockDetailModal.tsx` | Click | Toggles transaction side between BUY (green) and SELL (red). | `setSide('BUY' \| 'SELL')` | `VERIFIED WORKING` |
| **Place Order Button** | `StockDetailModal.tsx` | Click | Validates cash margin, posts order to backend matching engine, updates balances. | `POST /api/orders` + `deductTradeFunds()` | `VERIFIED WORKING` |
| **Deposit / Withdraw Funds** | `WalletModal.tsx` | Click | Submits virtual deposit via UPI, Cards, or Netbanking, updating wallet balance. | `POST /api/wallet/deposit` | `VERIFIED WORKING` |
| **Portfolio Tab Filter** | `HoldingsPortfolioView.tsx` | Click | Filters holdings table by "All", "In Profit", or "In Loss". | `setFilter('all' \| 'profit' \| 'loss')` | `VERIFIED WORKING` |
| **Holdings "Trade" Shortcut** | `HoldingsPortfolioView.tsx` | Click | Pre-fills and opens `StockDetailModal` for the selected holding. | `onSelectStock(item.symbol)` | `VERIFIED WORKING` |
| **Jury Scenario Presets** | `ScenarioControls.tsx` | Click | Triggers pre-configured test scenarios (Spread cross, Circuit breach, Stress test). | `POST /api/orders` batch execution | `VERIFIED WORKING` |
| **Circuit Breaker Resume** | `CircuitBreakerBanner.tsx` | Click | Sends manual operator resume command after cooldown expires. | `POST /api/circuit-breaker/resume` | `VERIFIED WORKING` |
| **Terminal Order Form** | `OrderForm.tsx` | Click | Submits limit order with custom price and quantity directly to book. | `POST /api/orders` | `VERIFIED WORKING` |
| **Order Cancellation (X)** | `OrdersTable.tsx` | Click | Immediately cancels live open order from book in $O(1)$ time. | `POST /api/orders/:id/cancel` | `VERIFIED WORKING` |
| **SQL Query Console Execution** | `DatabaseView.tsx` | Click | Executes parameterized read-only queries against PostgreSQL ledger. | `POST /api/jury/query` | `VERIFIED WORKING` |
| **Copy PostgreSQL DDL** | `DatabaseView.tsx` | Click | Copies complete production SQL schema to user's clipboard. | `navigator.clipboard.writeText()` | `VERIFIED WORKING` |
| **SIP Calculator Slider** | `MFExplorePage.tsx` | Slide | Dynamically recalculates estimated returns for mutual fund SIP investments. | `setMonthlyInvestment(value)` | `VERIFIED WORKING` |
| **FAQ Accordion Items** | `HelpPage.tsx` | Click | Expands and collapses answer drawer for customer support queries. | `toggleItem(id)` | `VERIFIED WORKING` |

---

## 2. Summary
- **Total Audited Clickable Interactions:** 21
- **Verified Working:** 21 (100%)
- **Dummy / No-Op Handlers (`onClick={() => {}}`):** 0
- **Dead Links (`href="#"`):** 0
