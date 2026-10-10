import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GrowNavbar } from './components/growclone/GrowNavbar';

// Modular Folder Pages
import { HomePage } from './pages/home/HomePage';
import { LoginPage } from './pages/login/LoginPage';
import { SignupPage } from './pages/signup/SignupPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { StocksExplorePage } from './pages/stocks/StocksExplorePage';
import { TradingTerminal } from './pages/terminal/TradingTerminal';
import { AboutPage } from './pages/about/AboutPage';
import { ContactPage } from './pages/contact/ContactPage';
import { WalletPage } from './pages/wallet/WalletPage';

// Supplementary Explore & Account Pages
import { FOExplorePage } from './pages/growclone/FOExplorePage';
import { MFExplorePage } from './pages/growclone/MFExplorePage';
import { BankAutopayPage } from './pages/growclone/BankAutopayPage';
import { HelpPage } from './pages/growclone/HelpPage';
import { HelpMyAccountPage } from './pages/growclone/HelpMyAccountPage';
import { PositionsPage } from './pages/growclone/PositionsPage';
import { OrdersPage } from './pages/growclone/OrdersPage';
import { WatchlistPage } from './pages/growclone/WatchlistPage';
import { ProfilePage } from './pages/growclone/ProfilePage';
import { BondsPage } from './pages/growclone/BondsPage';
import { WalletModal } from './components/WalletModal';

const AppLayout: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('growclone_theme') as 'light' | 'dark') || 'light';
  });
  const [walletBalance, setWalletBalance] = useState<number>(1000000);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

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

  // Poll or fetch wallet balance for active user
  const fetchWalletBalance = useCallback(async () => {
    try {
      const activeId = user?.userId || 'USER-DEMO-01';
      const res = await fetch(`/api/wallet/balances?userId=${activeId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.inr !== undefined) setWalletBalance(data.inr);
      }
    } catch {}
  }, [user]);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance]);

  // Hide GrowNavbar on pure home landing page and auth routes
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
        {/* Modular Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Auth Routes in Separate Folders */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

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

        {/* Dashboard & Holdings Routes (Protected: Requires Authenticated User) */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage
                walletBalance={walletBalance}
                onOpenWallet={() => setIsWalletOpen(true)}
                onRefreshBalance={fetchWalletBalance}
              />
            ) : (
              <Navigate to="/login?redirect=/dashboard" replace />
            )
          }
        />
        <Route
          path="/dashboard/stocks"
          element={
            isAuthenticated ? (
              <DashboardPage
                walletBalance={walletBalance}
                onOpenWallet={() => setIsWalletOpen(true)}
                onRefreshBalance={fetchWalletBalance}
              />
            ) : (
              <Navigate to="/login?redirect=/dashboard" replace />
            )
          }
        />
        <Route
          path="/stocks/user/holdings"
          element={
            isAuthenticated ? (
              <DashboardPage
                walletBalance={walletBalance}
                onOpenWallet={() => setIsWalletOpen(true)}
                onRefreshBalance={fetchWalletBalance}
              />
            ) : (
              <Navigate to="/login?redirect=/stocks/user/holdings" replace />
            )
          }
        />
        <Route
          path="/stocks/user/positions"
          element={
            isAuthenticated ? <PositionsPage /> : <Navigate to="/login?redirect=/stocks/user/positions" replace />
          }
        />
        <Route
          path="/stocks/user/orders"
          element={
            isAuthenticated ? <OrdersPage /> : <Navigate to="/login?redirect=/stocks/user/orders" replace />
          }
        />
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
        <Route
          path="/user/bank-autopay"
          element={
            isAuthenticated ? <BankAutopayPage /> : <Navigate to="/login?redirect=/user/bank-autopay" replace />
          }
        />
        <Route
          path="/profile/bank-accounts"
          element={
            isAuthenticated ? <BankAutopayPage /> : <Navigate to="/login?redirect=/profile/bank-accounts" replace />
          }
        />

        {/* Profile & Wallet */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? <ProfilePage /> : <Navigate to="/login?redirect=/profile" replace />
          }
        />
        <Route
          path="/wallet"
          element={
            isAuthenticated ? <WalletPage /> : <Navigate to="/login?redirect=/wallet" replace />
          }
        />
        <Route
          path="/wallet/transactions"
          element={
            isAuthenticated ? <WalletPage /> : <Navigate to="/login?redirect=/wallet" replace />
          }
        />

        {/* About, Contact & Support */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/help/my-account" element={<HelpMyAccountPage />} />

        {/* Institutional Matching Terminal */}
        <Route path="/trade" element={<TradingTerminal />} />
        <Route path="/admin" element={<TradingTerminal />} />
        <Route path="/admin/jury" element={<TradingTerminal />} />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
