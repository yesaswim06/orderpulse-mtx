import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StocksExplorePage } from './pages/growclone/StocksExplorePage';
import { FnOExplorePage } from './pages/growclone/FnOExplorePage';
import { MutualFundsExplorePage } from './pages/growclone/MutualFundsExplorePage';
import { BankAutopayPage } from './pages/growclone/BankAutopayPage';
import { HelpPage } from './pages/growclone/HelpPage';
import { HelpMyAccountPage } from './pages/growclone/HelpMyAccountPage';
import { TradingTerminal } from './components/TradingTerminal';
import { SignupPage } from './components/landing/SignupPage';
import { LoginPage } from './components/landing/LoginPage';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('growclone_theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    }
    localStorage.setItem('growclone_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to Stocks Explore per specification */}
        <Route path="/" element={<Navigate to="/stocks/user/explore" replace />} />

        {/* Screen 1: Stocks > Explore */}
        <Route
          path="/stocks/user/explore"
          element={<StocksExplorePage theme={theme} onToggleTheme={toggleTheme} />}
        />

        {/* Screen 2: F&O > Explore */}
        <Route
          path="/futures-and-options/user/explore"
          element={<FnOExplorePage theme={theme} onToggleTheme={toggleTheme} />}
        />

        {/* Screen 3: Mutual Funds > Explore */}
        <Route
          path="/mutual-funds/user/explore"
          element={<MutualFundsExplorePage theme={theme} onToggleTheme={toggleTheme} />}
        />

        {/* Screen 5: Bank Account Details */}
        <Route
          path="/user/bank-autopay"
          element={<BankAutopayPage theme={theme} onToggleTheme={toggleTheme} />}
        />

        {/* Screen 6: Customer Support */}
        <Route
          path="/help"
          element={<HelpPage theme={theme} onToggleTheme={toggleTheme} />}
        />

        {/* Screen 7: Customer Support > My Account */}
        <Route
          path="/help/my-account"
          element={<HelpMyAccountPage theme={theme} onToggleTheme={toggleTheme} />}
        />

        {/* Institutional MTX C++20 OrderPulse Matching Engine Terminal */}
        <Route path="/trade" element={<TradingTerminal />} />

        {/* Auth Pages */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/stocks/user/explore" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
