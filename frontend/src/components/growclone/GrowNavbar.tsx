import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  BarChart2,
  ChevronRight,
  Wallet,
  FileText,
  Landmark,
  Headphones,
  FileSpreadsheet,
  Settings,
  Sun,
  Moon,
  X,
  TrendingUp,
} from 'lucide-react';

interface GrowNavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  walletBalance?: number;
}

export const GrowNavbar: React.FC<GrowNavbarProps> = ({
  theme,
  onToggleTheme,
  walletBalance = 1000000,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeTab = location.pathname.startsWith('/futures-and-options')
    ? 'fno'
    : location.pathname.startsWith('/mutual-funds')
    ? 'mf'
    : 'stocks';

  const quickSearchResults = [
    { name: 'NIFTY 50', type: 'Index', path: '/futures-and-options/user/explore' },
    { name: 'Tata Steel', type: 'Stock', path: '/stocks/user/explore' },
    { name: 'SBI Gold Direct Plan', type: 'Mutual Fund', path: '/mutual-funds/user/explore' },
    { name: 'Akara Capital 14.00% Bond', type: 'Bond', path: '/stocks/user/explore' },
    { name: 'OrderPulse Low-Latency Terminal', type: 'MTX Engine', path: '/trade' },
    { name: 'Bank Accounts & Autopay', type: 'Settings', path: '/user/bank-autopay' },
    { name: '24x7 Customer Support', type: 'Help', path: '/help' },
  ].filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-150 ${
        theme === 'dark' ? 'bg-[#0F131D] border-[#1F2637]' : 'bg-white border-[#E8E8E8]'
      }`}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4">
          {/* Left: Gradient Circle Logo + Tabs */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link to="/stocks/user/explore" className="flex items-center gap-2.5 group shrink-0">
              {/* Gradient Circle Wave SVG Logo */}
              <svg className="w-8 h-8 drop-shadow-sm group-hover:scale-105 transition-transform" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="url(#grow_grad)" />
                <path
                  d="M10 24C13 18 17 18 20 22C23 26 27 26 30 18"
                  stroke="white"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="30" cy="18" r="2.5" fill="#F5A623" />
                <defs>
                  <linearGradient id="grow_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00D09C" />
                    <stop offset="1" stopColor="#008A66" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="flex flex-col">
                <span className={`text-[17px] font-extrabold tracking-tight ${
                  theme === 'dark' ? 'text-white' : 'text-[#44475B]'
                }`}>
                  GrowClone
                </span>
              </div>
            </Link>

            {/* Navigation Primary Tabs */}
            <nav className="flex items-center gap-1 sm:gap-4 text-[14px]">
              <Link
                to="/stocks/user/explore"
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === 'stocks'
                    ? theme === 'dark' ? 'text-white font-bold' : 'text-[#222531] font-bold'
                    : theme === 'dark' ? 'text-[#8B93A7] hover:text-white' : 'text-[#7C7E8C] hover:text-[#44475B]'
                }`}
              >
                Stocks
              </Link>
              <Link
                to="/futures-and-options/user/explore"
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === 'fno'
                    ? theme === 'dark' ? 'text-white font-bold' : 'text-[#222531] font-bold'
                    : theme === 'dark' ? 'text-[#8B93A7] hover:text-white' : 'text-[#7C7E8C] hover:text-[#44475B]'
                }`}
              >
                F&amp;O
              </Link>
              <Link
                to="/mutual-funds/user/explore"
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  activeTab === 'mf'
                    ? theme === 'dark' ? 'text-white font-bold' : 'text-[#222531] font-bold'
                    : theme === 'dark' ? 'text-[#8B93A7] hover:text-white' : 'text-[#7C7E8C] hover:text-[#44475B]'
                }`}
              >
                Mutual Funds
              </Link>
            </nav>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`w-full h-10 px-3.5 rounded-full border text-left flex items-center justify-between text-xs transition shadow-sm ${
                theme === 'dark'
                  ? 'bg-[#171C28] border-[#2A3348] text-[#8B93A7] hover:border-[#3D4966]'
                  : 'bg-white border-[#E8E8E8] text-[#7C7E8C] hover:border-[#C4C4C4]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#7C7E8C]" />
                <span>Search GrowClone, stocks, F&amp;O, funds...</span>
              </div>
              <span className={`px-1.5 py-0.5 text-[10px] rounded font-mono border ${
                theme === 'dark' ? 'bg-[#222A3C] border-[#313C54] text-[#A6AFC2]' : 'bg-[#F4F4F4] border-[#E0E0E0] text-[#7C7E8C]'
              }`}>
                Ctrl+K
              </span>
            </button>
          </div>

          {/* Right Action Icons & Avatar */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Terminal Link */}
            <Link
              to="/trade"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00B386]/10 hover:bg-[#00B386]/20 border border-[#00B386]/30 text-[#00B386] text-xs font-bold transition"
              title="Launch Low-Latency Matching Engine Terminal"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">MTX Terminal</span>
            </Link>

            {/* Notification Bell */}
            <button
              className={`p-2 rounded-full transition ${
                theme === 'dark' ? 'text-[#8B93A7] hover:bg-[#1A2030]' : 'text-[#7C7E8C] hover:bg-[#F4F4F4]'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Profile Avatar & Popover Trigger */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-sm cursor-pointer hover:ring-2 hover:ring-[#00B386]/40 transition"
                title="Profile & Account Settings"
              >
                DU
              </button>

              {/* SCREEN 4: Profile Dropdown Popover */}
              {isProfileOpen && (
                <div
                  className={`absolute right-0 mt-2.5 w-[380px] sm:w-[420px] rounded-2xl shadow-2xl border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 ${
                    theme === 'dark'
                      ? 'bg-[#131824] border-[#252E42] text-white shadow-black/80'
                      : 'bg-white border-[#E8E8E8] text-[#44475B] shadow-slate-300/60'
                  }`}
                >
                  {/* Popover Header */}
                  <div className="p-4 sm:p-5 flex items-center justify-between border-b border-inherit">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-bold text-sm flex items-center justify-center">
                        DU
                      </div>
                      <div>
                        <h4 className="text-sm font-bold tracking-tight">Demo User</h4>
                        <p className={`text-xs ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                          demo.user@example.com
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/user/bank-autopay')}
                      className={`p-1.5 rounded-lg transition ${
                        theme === 'dark' ? 'hover:bg-[#1C2333] text-[#8B93A7]' : 'hover:bg-[#F4F4F4] text-[#7C7E8C]'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Popover Rows */}
                  <div className="py-1 text-xs">
                    {/* Wallet Balance Row */}
                    <div
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/stocks/user/explore');
                      }}
                      className={`px-5 py-3.5 flex items-center justify-between cursor-pointer transition ${
                        theme === 'dark' ? 'hover:bg-[#1A2130]' : 'hover:bg-[#F8F8F8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Wallet className="w-4 h-4 text-[#00B386]" />
                        <div>
                          <div className="text-sm font-bold font-mono">
                            ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                          <div className={`text-[11px] ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                            Stocks, F&amp;O balance
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                    </div>

                    {/* All Orders */}
                    <div
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/trade');
                      }}
                      className={`px-5 py-3 flex items-center justify-between cursor-pointer transition ${
                        theme === 'dark' ? 'hover:bg-[#1A2130]' : 'hover:bg-[#F8F8F8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-[#7C7E8C]" />
                        <span className="font-medium text-xs">All Orders</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                    </div>

                    {/* Bank Details */}
                    <div
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/user/bank-autopay');
                      }}
                      className={`px-5 py-3 flex items-center justify-between cursor-pointer transition ${
                        theme === 'dark' ? 'hover:bg-[#1A2130]' : 'hover:bg-[#F8F8F8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Landmark className="w-4 h-4 text-[#7C7E8C]" />
                        <span className="font-medium text-xs">Bank Details</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                    </div>

                    {/* 24x7 Customer Support */}
                    <div
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/help');
                      }}
                      className={`px-5 py-3 flex items-center justify-between cursor-pointer transition ${
                        theme === 'dark' ? 'hover:bg-[#1A2130]' : 'hover:bg-[#F8F8F8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Headphones className="w-4 h-4 text-[#7C7E8C]" />
                        <span className="font-medium text-xs">24 x 7 Customer Support</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                    </div>

                    {/* Reports */}
                    <div
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/trade');
                      }}
                      className={`px-5 py-3 flex items-center justify-between cursor-pointer transition ${
                        theme === 'dark' ? 'hover:bg-[#1A2130]' : 'hover:bg-[#F8F8F8]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-4 h-4 text-[#7C7E8C]" />
                        <span className="font-medium text-xs">Reports &amp; Statements</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                    </div>
                  </div>

                  {/* Popover Footer Bar */}
                  <div
                    className={`px-5 py-3 flex items-center justify-between border-t border-inherit ${
                      theme === 'dark' ? 'bg-[#0E121B]' : 'bg-[#F8F8F8]'
                    }`}
                  >
                    {/* Theme Toggle */}
                    <button
                      onClick={onToggleTheme}
                      className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                        theme === 'dark' ? 'text-amber-400 hover:bg-[#1C2333]' : 'text-[#44475B] hover:bg-[#EAEAEA]'
                      }`}
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="w-4 h-4 text-amber-400" />
                          <span>Light mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-4 h-4 text-indigo-500" />
                          <span>Dark mode</span>
                        </>
                      )}
                    </button>

                    {/* Log Out */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/login');
                      }}
                      className="text-xs text-[#7C7E8C] hover:text-[#EB5B3C] border-b border-dashed border-[#7C7E8C] hover:border-[#EB5B3C] transition cursor-pointer"
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

      {/* Ctrl+K Search Modal Palette */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div
            className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in-95 duration-150 ${
              theme === 'dark' ? 'bg-[#131824] border-[#252E42] text-white' : 'bg-white border-[#E8E8E8] text-[#44475B]'
            }`}
          >
            <div className="p-3.5 border-b border-inherit flex items-center gap-3">
              <Search className="w-5 h-5 text-[#00B386]" />
              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                placeholder="Search stocks, F&O, bonds, mutual funds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm placeholder:text-[#7C7E8C]"
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-[#7C7E8C]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              <div className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 text-[#7C7E8C]">
                Search Suggestions
              </div>
              {quickSearchResults.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#7C7E8C]">No results found</div>
              ) : (
                quickSearchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setIsSearchOpen(false);
                      navigate(res.path);
                    }}
                    className={`px-3 py-2.5 rounded-xl flex items-center justify-between cursor-pointer text-xs transition ${
                      theme === 'dark' ? 'hover:bg-[#1C2333]' : 'hover:bg-[#F8F8F8]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-[#00B386]" />
                      <span className="font-semibold">{res.name}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      theme === 'dark' ? 'bg-[#222A3C] text-[#8B93A7]' : 'bg-[#F0F0F0] text-[#7C7E8C]'
                    }`}>
                      {res.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
