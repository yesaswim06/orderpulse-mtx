import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StocksExplore } from './pages/growclone/StocksExplore';
import { FnOExplore } from './pages/growclone/FnOExplore';
import { MutualFundsExplore } from './pages/growclone/MutualFundsExplore';
import { BankAutopay } from './pages/growclone/BankAutopay';
import { HelpCenter } from './pages/growclone/HelpCenter';
import { HelpMyAccount } from './pages/growclone/HelpMyAccount';
import { TradingTerminal } from './components/TradingTerminal';
import { LandingPage } from './components/landing/LandingPage';

export const App: React.FC = () => {
  // Light theme by default, with working dark-mode toggle
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('growclone_theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('growclone_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('growclone_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Screen 1: Stocks > Explore */}
        <Route
          path="/stocks/user/explore"
          element={<StocksExplore isDark={isDark} onToggleTheme={toggleTheme} />}
        />

        {/* Screen 2: F&O > Explore */}
        <Route
          path="/futures-and-options/user/explore"
          element={<FnOExplore isDark={isDark} onToggleTheme={toggleTheme} />}
        />

        {/* Screen 3: Mutual Funds > Explore */}
        <Route
          path="/mutual-funds/user/explore"
          element={<MutualFundsExplore isDark={isDark} onToggleTheme={toggleTheme} />}
        />

        {/* Screen 5: Bank Account Details */}
        <Route
          path="/user/bank-autopay"
          element={<BankAutopay isDark={isDark} onToggleTheme={toggleTheme} />}
        />

        {/* Screen 6: Customer Support */}
        <Route
          path="/help"
          element={<HelpCenter isDark={isDark} onToggleTheme={toggleTheme} />}
        />

        {/* Screen 7: Customer Support > My Account */}
        <Route
          path="/help/my-account"
          element={<HelpMyAccount isDark={isDark} onToggleTheme={toggleTheme} />}
        />

        {/* Institutional OrderPulse Matching Terminal (preserved) */}
        <Route path="/trade" element={<TradingTerminal />} />
        <Route path="/landing" element={<LandingPage />} />

        {/* Default route redirect to /stocks/user/explore */}
        <Route path="/" element={<Navigate to="/stocks/user/explore" replace />} />
        <Route path="*" element={<Navigate to="/stocks/user/explore" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
