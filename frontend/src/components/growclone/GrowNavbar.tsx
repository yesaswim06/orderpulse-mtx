import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Wallet,
  Settings,
  ListOrdered,
  Landmark,
  Headphones,
  FileText,
  LogOut,
  ChevronRight,
  TrendingUp,
  Activity,
  Info,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface GrowNavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  walletBalance: number;
  onOpenWallet: () => void;
}

export const GrowNavbar: React.FC<GrowNavbarProps> = ({
  theme,
  onToggleTheme,
  walletBalance,
  onOpenWallet,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Ctrl+K keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/stocks/user/holdings');
  const isStocks = (location.pathname.startsWith('/stocks') && !location.pathname.startsWith('/stocks/user/holdings')) || location.pathname === '/';
  const isFO = location.pathname.startsWith('/futures-and-options');
  const isMF = location.pathname.startsWith('/mutual-funds');
  const isTerminal = location.pathname.startsWith('/trade');

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#121212] border-b border-[#E8E8E8] dark:border-white/10 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo + Tabs */}
        <div className="flex items-center gap-8">
          <Link to="/stocks/user/explore" className="flex items-center gap-2.5 group">
            {/* Gradient circle-wave logo in SVG */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00B386] via-[#00c997] to-[#10b981] flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-none stroke-current stroke-2">
                <path d="M3 12c3-4 6-4 9 0s6 4 9 0" />
                <path d="M3 7c3-3 6-3 9 0s6 3 9 0" opacity="0.6" />
                <path d="M3 17c3-3 6-3 9 0s6 3 9 0" opacity="0.6" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-[#44475B] dark:text-white tracking-tight leading-tight">
                OrderPulse
              </span>
              <span className="text-[10px] font-bold text-[#00B386] tracking-wider uppercase">
                GrowClone · MTX
              </span>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link
              to="/dashboard"
              className={`transition-colors py-1 ${
                isDashboard
                  ? 'text-[#44475B] dark:text-white font-bold border-b-2 border-[#00B386]'
                  : 'text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/stocks/user/explore"
              className={`transition-colors py-1 ${
                isStocks
                  ? 'text-[#44475B] dark:text-white font-bold border-b-2 border-[#00B386]'
                  : 'text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              Stocks
            </Link>
            <Link
              to="/futures-and-options/user/explore"
              className={`transition-colors py-1 ${
                isFO
                  ? 'text-[#44475B] dark:text-white font-bold border-b-2 border-[#00B386]'
                  : 'text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              F&O
            </Link>
            <Link
              to="/mutual-funds/user/explore"
              className={`transition-colors py-1 ${
                isMF
                  ? 'text-[#44475B] dark:text-white font-bold border-b-2 border-[#00B386]'
                  : 'text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              Mutual Funds
            </Link>
            <Link
              to="/trade"
              className={`transition-colors py-1 flex items-center gap-1.5 ${
                isTerminal
                  ? 'text-[#00B386] font-bold border-b-2 border-[#00B386]'
                  : 'text-[#7C7E8C] dark:text-neutral-400 hover:text-[#00B386]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#00B386]" />
              <span>Matching Terminal</span>
            </Link>
          </nav>
        </div>

        {/* Center: Search Box */}
        <div className="flex-1 max-w-md hidden sm:block relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#7C7E8C] absolute left-3.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const query = searchQuery.trim().toLowerCase();
                  if (query) {
                    setSearchQuery('');
                    if (query.includes('demo') || query.includes('order')) {
                      window.location.href = '/trade';
                    } else if (query.includes('bond')) {
                      window.location.href = '/bonds';
                    } else if (query.includes('fund') || query.includes('mf')) {
                      window.location.href = '/mutual-funds/user/explore';
                    } else if (query.includes('option') || query.includes('nifty') || query.includes('fno')) {
                      window.location.href = '/futures-and-options/user/explore';
                    } else {
                      window.location.href = '/stocks/user/explore';
                    }
                  }
                }
              }}
              placeholder="Search OrderPulse (e.g. Tata, Nifty, DEMO, Bonds)..."
              className="w-full pl-9 pr-14 py-2 text-xs rounded-full bg-[#F8F8F8] dark:bg-neutral-800 border border-[#E8E8E8] dark:border-white/10 text-[#44475B] dark:text-white focus:bg-white dark:focus:bg-neutral-900 focus:border-[#00B386] focus:outline-none transition"
            />
            <span className="absolute right-3 text-[10px] font-mono text-[#7C7E8C] bg-white dark:bg-neutral-700 px-1.5 py-0.5 rounded border border-[#E8E8E8] dark:border-white/10 pointer-events-none">
              Ctrl+K
            </span>
          </div>

          {/* Live Search Results Dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-11 bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#E8E8E8] dark:border-white/10 z-50 overflow-hidden divide-y divide-slate-100 dark:divide-white/5 text-xs animate-fade-in">
              <Link
                to="/trade"
                onClick={() => setSearchQuery('')}
                className="p-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] font-bold text-[10px]">
                    EQUITY
                  </span>
                  <div>
                    <span className="font-bold text-[#44475B] dark:text-white">DEMO</span>
                    <span className="text-[#7C7E8C] ml-2 font-normal">OrderPulse Continuous Auction</span>
                  </div>
                </div>
                <span className="text-[#00B386] font-bold font-mono">₹100.00</span>
              </Link>
              <Link
                to="/bonds"
                onClick={() => setSearchQuery('')}
                className="p-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 font-bold text-[10px]">
                    BOND
                  </span>
                  <div>
                    <span className="font-bold text-[#44475B] dark:text-white">Akara Capital Advisors</span>
                    <span className="text-[#7C7E8C] ml-2 font-normal">14.00% Yield</span>
                  </div>
                </div>
                <span className="text-[#00B386] font-bold font-mono">14.00%</span>
              </Link>
              <Link
                to="/futures-and-options/user/explore"
                onClick={() => setSearchQuery('')}
                className="p-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-bold text-[10px]">
                    F&O
                  </span>
                  <div>
                    <span className="font-bold text-[#44475B] dark:text-white">NIFTY 24,800 CE</span>
                    <span className="text-[#7C7E8C] ml-2 font-normal">Weekly Index Option</span>
                  </div>
                </div>
                <span className="text-[#00B386] font-bold font-mono">₹156.40</span>
              </Link>
            </div>
          )}
        </div>

        {/* Right: Wallet Balance, Notifications & Profile Avatar OR Log in / Sign up */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-full text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white transition"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#00B386]" />}
              </button>
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-[#44475B] dark:text-white hover:text-[#00B386] transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold shadow-sm transition"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <>
              {/* Quick Wallet Balance Pill */}
              <button
                onClick={onOpenWallet}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00B386]/10 hover:bg-[#00B386]/20 text-[#00B386] text-xs font-bold font-mono transition cursor-pointer"
                title="Deposit or Withdraw Funds (UPI, Netbanking, Cards)"
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>₹{(walletBalance / 1).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </button>

              {/* Bell Icon */}
              <button
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white hover:bg-[#F8F8F8] dark:hover:bg-neutral-800 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* Profile Dropdown Anchor */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-sm cursor-pointer hover:ring-2 hover:ring-[#00B386]/40 transition"
                  title="Profile menu"
                >
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'DU'}
                </button>

                {/* SCREEN 4: Profile Dropdown Popover */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-12 w-[340px] sm:w-[380px] bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#E8E8E8] dark:border-white/10 z-50 overflow-hidden animate-fade-in text-[#44475B] dark:text-[#E5E7EB]">
                    {/* Header */}
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="p-4 border-b border-[#E8E8E8] dark:border-white/10 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-800/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#00B386]/15 text-[#00B386] font-extrabold flex items-center justify-center text-sm">
                          {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'DU'}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#44475B] dark:text-white leading-tight">
                            {user?.name || 'Aarav Sharma'}
                          </h4>
                          <p className="text-xs text-[#7C7E8C]">{user?.email || 'aarav.sharma@orderpulse.exchange'}</p>
                        </div>
                      </div>
                      <div className="text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white p-1 rounded-lg">
                        <Settings className="w-4 h-4" />
                      </div>
                    </Link>

                {/* Rows */}
                <div className="py-2 text-xs">
                  {/* Row 0: Portfolio Dashboard */}
                  <Link
                    to="/dashboard"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] flex items-center justify-center">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-sm">Portfolio Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </Link>

                  {/* Row 1: Balance */}
                  <Link
                    to="/wallet"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/60 transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] flex items-center justify-center">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#44475B] dark:text-white font-mono">
                          ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                        <span className="text-[11px] text-[#7C7E8C]">Stocks, F&O wallet balance</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#00B386] flex items-center">
                      Deposit <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>

                  {/* Row 2: All Orders */}
                  <Link
                    to="/stocks/user/orders"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-neutral-800 text-[#7C7E8C] flex items-center justify-center">
                        <ListOrdered className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">All Orders History</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </Link>

                  {/* Row 3: Bank Details */}
                  <Link
                    to="/user/bank-autopay"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-neutral-800 text-[#7C7E8C] flex items-center justify-center">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">Bank Details & Autopay</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </Link>

                  {/* Row 4: Customer Support */}
                  <Link
                    to="/help"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-neutral-800 text-[#7C7E8C] flex items-center justify-center">
                        <Headphones className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">24 x 7 Customer Support</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </Link>

                  {/* Row 5: Reports & Terminal */}
                  <Link
                    to="/trade"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-neutral-800 text-[#7C7E8C] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">Matching Terminal & Audit</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </Link>

                  {/* Row 6: About Us */}
                  <Link
                    to="/about"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-neutral-800 text-[#7C7E8C] flex items-center justify-center">
                        <Info className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">About OrderPulse</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </Link>

                  {/* Row 7: Contact Us */}
                  <Link
                    to="/contact"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-neutral-800 text-[#7C7E8C] flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">Contact Us & FAQ</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                  </Link>
                </div>

                {/* Footer Bar */}
                <div className="p-3.5 bg-[#F8F8F8] dark:bg-neutral-900 border-t border-[#E8E8E8] dark:border-white/10 flex items-center justify-between text-xs">
                  {/* Theme Toggle Button */}
                  <button
                    onClick={onToggleTheme}
                    className="flex items-center gap-2 text-[#44475B] dark:text-neutral-300 hover:text-[#00B386] font-medium transition cursor-pointer"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-4 h-4 text-amber-400" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-4 h-4 text-[#00B386]" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>

                  {/* Log Out */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="text-[#7C7E8C] hover:text-[#EB5B3C] font-semibold border-b border-dotted border-current transition cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      </div>
    </header>
  );
};
