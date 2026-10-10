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
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiBase = isLocal ? '' : 'https://orderpulse-mtx.up.railway.app';
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

  // Hide GrowNavbar on raw /trade terminal if terminal has its own institutional header,
  // or show it for consistent navigation
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0E0E0E] text-[#E5E7EB]' : 'bg-white text-[#44475B]'} font-sans transition-colors`}>
      {!isAuthRoute && (
        <GrowNavbar
          theme={theme}
          onToggleTheme={toggleTheme}
          walletBalance={walletBalance}
          onOpenWallet={() => setIsWalletOpen(true)}
        />
      )}

      <Routes>
        {/* Redirect / to /stocks/user/explore */}
        <Route path="/" element={<Navigate to="/stocks/user/explore" replace />} />
        
        {/* SCREEN 1: Stocks Explore */}
        <Route path="/stocks/user/explore" element={<StocksExplorePage />} />
        
        {/* SCREEN 2: F&O Explore */}
        <Route path="/futures-and-options/user/explore" element={<FOExplorePage />} />
        
        {/* SCREEN 3: Mutual Funds Explore */}
        <Route path="/mutual-funds/user/explore" element={<MFExplorePage />} />
        
        {/* SCREEN 5: Bank Account Details & Autopay */}
        <Route path="/user/bank-autopay" element={<BankAutopayPage />} />
        
        {/* SCREEN 6: Customer Support FAQs */}
        <Route path="/help" element={<HelpPage />} />
        
        {/* SCREEN 7: Customer Support > My Account */}
        <Route path="/help/my-account" element={<HelpMyAccountPage />} />
        
        {/* MTX OrderPulse C++ Matching Engine Terminal */}
        <Route path="/trade" element={<TradingTerminal />} />
        
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
        apiBase={window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? '' : 'https://orderpulse-mtx.up.railway.app'}
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
