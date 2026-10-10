import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GrowNavbar } from './components/growclone/GrowNavbar';
import { StocksExplorePage } from './pages/growclone/StocksExplorePage';
import { FOExplorePage } from './pages/growclone/FOExplorePage';
import { MFExplorePage } from './pages/growclone/MFExplorePage';
import { BankAutopayPage } from './pages/growclone/BankAutopayPage';
import { HelpPage } from './pages/growclone/HelpPage';
import { HelpMyAccountPage } from './pages/growclone/HelpMyAccountPage';
import { TradingTerminal } from './components/TradingTerminal';
import { SignupPage } from './components/landing/SignupPage';
import { LoginPage } from './components/landing/LoginPage';
import { WalletModal } from './components/WalletModal';

import { LandingPage } from './components/landing/LandingPage';
import { PositionsPage } from './pages/growclone/PositionsPage';
import { OrdersPage } from './pages/growclone/OrdersPage';
import { WatchlistPage } from './pages/growclone/WatchlistPage';
import { ProfilePage } from './pages/growclone/ProfilePage';
import { WalletPage } from './pages/growclone/WalletPage';
import { BondsPage } from './pages/growclone/BondsPage';
import { DashboardPage } from './pages/growclone/DashboardPage';
import { HoldingsPortfolioView } from './components/growclone/HoldingsPortfolioView';

const AppLayout: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('growclone_theme') as 'light' | 'dark') || 'light';
  });
  const [walletBalance, setWalletBalance] = useState<number>(1000000);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('growclone_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Poll or fetch wallet balance
  const fetchWalletBalance = useCallback(async () => {
    try {
      const apiBase = '';
      const res = await fetch(`${apiBase}/api/wallet/balances?userId=USER-DEMO-01`);
      if (res.ok) {
        const data = await res.json();
        if (data.inr !== undefined) setWalletBalance(data.inr);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance]);

  // Hide GrowNavbar on pure landing page and auth routes
  const isMinimalRoute = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0E0E0E] text-[#E5E7EB]' : 'bg-white text-[#44475B]'} font-sans transition-colors`}>
      {!isMinimalRoute && (
        <GrowNavbar
          theme={theme}
          onToggleTheme={toggleTheme}
          walletBalance={walletBalance}
          onOpenWallet={() => setIsWalletOpen(true)}
        />
      )}

      <Routes>
        {/* Marketing Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Stocks Routes */}
        <Route
          path="/stocks/user/explore"
          element={
            <StocksExplorePage
              walletBalance={walletBalance}
              onOpenWallet={() => setIsWalletOpen(true)}
              onRefreshBalance={fetchWalletBalance}
            />
          }
        />
        {/* Dashboard & Holdings Routes */}
        <Route
          path="/dashboard"
          element={
            <DashboardPage
              walletBalance={walletBalance}
              onOpenWallet={() => setIsWalletOpen(true)}
              onRefreshBalance={fetchWalletBalance}
            />
          }
        />
        <Route
          path="/dashboard/stocks"
          element={
            <DashboardPage
              walletBalance={walletBalance}
              onOpenWallet={() => setIsWalletOpen(true)}
              onRefreshBalance={fetchWalletBalance}
            />
          }
        />
        <Route
          path="/stocks/user/holdings"
          element={
            <DashboardPage
              walletBalance={walletBalance}
              onOpenWallet={() => setIsWalletOpen(true)}
              onRefreshBalance={fetchWalletBalance}
            />
          }
        />
        <Route path="/stocks/user/positions" element={<PositionsPage />} />
        <Route path="/stocks/user/orders" element={<OrdersPage />} />
        <Route path="/stocks/user/watchlist" element={<WatchlistPage />} />
        
        {/* Bonds Exploration */}
        <Route path="/bonds" element={<BondsPage />} />
        
        {/* F&O & Mutual Funds */}
        <Route path="/futures-and-options/user/explore" element={<FOExplorePage />} />
        <Route path="/fno" element={<FOExplorePage />} />
        <Route path="/mutual-funds/user/explore" element={<MFExplorePage />} />
        <Route path="/mutual-funds" element={<MFExplorePage />} />
        <Route path="/mutual-funds/dashboard" element={<MFExplorePage />} />
        
        {/* Bank & Autopay */}
        <Route path="/user/bank-autopay" element={<BankAutopayPage />} />
        <Route path="/profile/bank-accounts" element={<BankAutopayPage />} />
        
        {/* Profile & Wallet */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/wallet/transactions" element={<WalletPage />} />
        
        {/* Help & Support */}
        <Route path="/help" element={<HelpPage />} />
        <Route path="/help/my-account" element={<HelpMyAccountPage />} />
        
        {/* MTX OrderPulse C++ Matching Engine Terminal */}
        <Route path="/trade" element={<TradingTerminal />} />
        <Route path="/admin" element={<TradingTerminal />} />
        <Route path="/admin/jury" element={<TradingTerminal />} />
        
        {/* Auth Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Catch-all redirect to Stocks Explore */}
        <Route path="*" element={<Navigate to="/stocks/user/explore" replace />} />
      </Routes>

      {/* Interactive Wallet Modal for Deposit (UPI, Card, Netbanking) & Withdrawal */}
      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        apiBase=""
        currentBalance={walletBalance}
        onBalanceUpdated={fetchWalletBalance}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
