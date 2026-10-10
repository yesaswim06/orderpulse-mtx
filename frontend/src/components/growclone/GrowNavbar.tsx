import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Activity
} from 'lucide-react';

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

  const isStocks = location.pathname.startsWith('/stocks') || location.pathname === '/';
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
              placeholder="Search OrderPulse (e.g. Tata, Nifty, DEMO)..."
              className="w-full pl-9 pr-14 py-2 text-xs rounded-full bg-[#F8F8F8] dark:bg-neutral-800 border border-[#E8E8E8] dark:border-white/10 text-[#44475B] dark:text-white focus:bg-white dark:focus:bg-neutral-900 focus:border-[#00B386] focus:outline-none transition"
            />
            <span className="absolute right-3 text-[10px] font-mono text-[#7C7E8C] bg-white dark:bg-neutral-700 px-1.5 py-0.5 rounded border border-[#E8E8E8] dark:border-white/10 pointer-events-none">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Right: Wallet Balance, Notifications & Profile Avatar */}
        <div className="flex items-center gap-3">
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
              DU
            </button>

            {/* SCREEN 4: Profile Dropdown Popover */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-[340px] sm:w-[380px] bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#E8E8E8] dark:border-white/10 z-50 overflow-hidden animate-fade-in text-[#44475B] dark:text-[#E5E7EB]">
                {/* Header */}
                <div className="p-4 border-b border-[#E8E8E8] dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00B386]/15 text-[#00B386] font-extrabold flex items-center justify-center text-sm">
                      DU
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#44475B] dark:text-white leading-tight">
                        Demo User
                      </h4>
                      <p className="text-xs text-[#7C7E8C]">demo.user@example.com</p>
                    </div>
                  </div>
                  <button className="text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white p-1 rounded-lg">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>

                {/* Rows */}
                <div className="py-2 text-xs">
                  {/* Row 1: Balance */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenWallet();
                    }}
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
                        <span className="text-[11px] text-[#7C7E8C]">Stocks, F&O balance</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#00B386] flex items-center">
                      Deposit <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </button>

                  {/* Row 2: All Orders */}
                  <Link
                    to="/trade"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-neutral-800 text-[#7C7E8C] flex items-center justify-center">
                        <ListOrdered className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">All Orders & Terminal</span>
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

                  {/* Row 5: Reports */}
                  <Link
                    to="/trade"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/60 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-neutral-800 text-[#7C7E8C] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm">Reports & Audit Logs</span>
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
                    onClick={() => setIsProfileOpen(false)}
                    className="text-[#7C7E8C] hover:text-[#EB5B3C] font-semibold border-b border-dotted border-current transition cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
