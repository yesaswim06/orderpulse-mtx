import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Bookmark, SlidersHorizontal } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

interface GrowNavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const GrowNavbar: React.FC<GrowNavbarProps> = ({ isDark, onToggleTheme }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Keyboard shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentPath = location.pathname;
  const isStocks = currentPath.startsWith('/stocks');
  const isFnO = currentPath.startsWith('/futures-and-options');
  const isMF = currentPath.startsWith('/mutual-funds');

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#12141E] border-b border-[#E8E8E8] dark:border-[#2E3245] transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-[68px] gap-4">
        {/* Left: Logo & Section Tabs */}
        <div className="flex items-center gap-8">
          <Link to="/stocks/user/explore" className="flex items-center gap-2.5 group">
            {/* Gradient Circle Wave SVG Logo */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00B386] via-[#00D09C] to-[#00916E] flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-none stroke-current stroke-[2.2]">
                <path d="M3 12c3-4 6-4 9 0s6 4 9 0" />
                <path d="M3 17c3-3 6-3 9 0s6 3 9 0" opacity="0.6" />
              </svg>
            </div>
            <span className="text-xl font-black text-[#44475B] dark:text-white tracking-tight">
              Grow<span className="text-[#00B386]">Clone</span>
            </span>
          </Link>

          {/* Section Navigation Tabs */}
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link
              to="/stocks/user/explore"
              className={`py-1 transition font-medium ${
                isStocks
                  ? 'text-[#44475B] dark:text-white font-bold border-b-2 border-transparent'
                  : 'text-[#7C7E8C] dark:text-[#94A3B8] hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              Stocks
            </Link>

            <Link
              to="/futures-and-options/user/explore"
              className={`py-1 transition font-medium ${
                isFnO
                  ? 'text-[#44475B] dark:text-white font-bold border-b-2 border-transparent'
                  : 'text-[#7C7E8C] dark:text-[#94A3B8] hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              F&O
            </Link>

            <Link
              to="/mutual-funds/user/explore"
              className={`py-1 transition font-medium ${
                isMF
                  ? 'text-[#44475B] dark:text-white font-bold border-b-2 border-transparent'
                  : 'text-[#7C7E8C] dark:text-[#94A3B8] hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              Mutual Funds
            </Link>
          </nav>
        </div>

        {/* Center: Search Box */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#7C7E8C] absolute left-3.5 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search GrowClone, stocks, mutual funds..."
              className="w-full pl-10 pr-16 py-2.5 text-xs rounded-full bg-white dark:bg-[#1F222E] border border-[#E8E8E8] dark:border-[#2E3245] text-[#44475B] dark:text-white placeholder-[#7C7E8C] focus:outline-none focus:border-[#00B386] focus:ring-1 focus:ring-[#00B386] transition shadow-xs"
            />
            <span className="absolute right-3.5 text-[10px] font-mono font-medium text-[#7C7E8C] bg-[#F8F8F8] dark:bg-[#2A2E3D] px-1.5 py-0.5 rounded border border-[#E8E8E8] dark:border-[#383C50]">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-3">
          {/* Quick Tools Icon Button */}
          <button
            className="w-9 h-9 rounded-full hover:bg-[#F8F8F8] dark:hover:bg-[#1F222E] flex items-center justify-center text-[#7C7E8C] dark:text-[#94A3B8] transition"
            title="Watchlist & Bookmarks"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Bell Notifications */}
          <button
            className="w-9 h-9 rounded-full hover:bg-[#F8F8F8] dark:hover:bg-[#1F222E] flex items-center justify-center text-[#7C7E8C] dark:text-[#94A3B8] transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00B386]" />
          </button>

          {/* Circular User Avatar (opens Profile Dropdown) */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="w-9 h-9 rounded-full bg-[#00B386] text-white font-bold text-xs flex items-center justify-center shadow-xs hover:ring-2 hover:ring-[#00B386]/30 transition cursor-pointer"
            title="Demo User Profile"
          >
            DU
          </button>
        </div>
      </div>

      {/* Profile Popover Component */}
      <ProfileDropdown
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isDark={isDark}
        onToggleTheme={onToggleTheme}
      />
    </header>
  );
};
