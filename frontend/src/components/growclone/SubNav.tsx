import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart2, ShoppingCart, Activity } from 'lucide-react';

interface SubNavProps {
  type: 'stocks' | 'fo' | 'mf';
  activeTab: string;
  onSelectTab?: (tab: string) => void;
}

export const SubNav: React.FC<SubNavProps> = ({ type, activeTab, onSelectTab }) => {
  const navigate = useNavigate();
  let tabs: { name: string; route: string }[] = [];

  if (type === 'stocks') {
    tabs = [
      { name: 'Explore', route: '/stocks/user/explore' },
      { name: 'Holdings', route: '/stocks/user/holdings' },
      { name: 'Positions', route: '/stocks/user/positions' },
      { name: 'Orders', route: '/stocks/user/orders' },
      { name: 'Watchlist', route: '/stocks/user/watchlist' },
    ];
  } else if (type === 'fo') {
    tabs = [
      { name: 'Explore', route: '/futures-and-options/user/explore' },
      { name: 'Positions', route: '/stocks/user/positions' },
      { name: 'Orders', route: '/stocks/user/orders' },
    ];
  } else if (type === 'mf') {
    tabs = [
      { name: 'Explore', route: '/mutual-funds/user/explore' },
      { name: 'Dashboard', route: '/mutual-funds/dashboard' },
      { name: 'SIPs', route: '/mutual-funds/user/explore' },
      { name: 'Watchlist', route: '/stocks/user/watchlist' },
    ];
  }

  const handleTabClick = (t: { name: string; route: string }) => {
    if (onSelectTab) {
      onSelectTab(t.name);
    }
    navigate(t.route);
  };

  return (
    <div className="w-full bg-white dark:bg-[#121212] border-b border-[#E8E8E8] dark:border-white/10 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Sub-nav Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab.toLowerCase() === tab.name.toLowerCase();
            return (
              <button
                key={tab.name}
                onClick={() => handleTabClick(tab)}
                className={`py-3.5 text-xs sm:text-sm font-semibold relative transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#00B386] font-bold'
                    : 'text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white'
                }`}
              >
                <span>{tab.name}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00B386] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Far Right Action Button */}
        <div className="shrink-0 py-2">
          {type === 'mf' ? (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8E8E8] dark:border-white/10 hover:bg-[#F8F8F8] dark:hover:bg-neutral-800 text-xs font-semibold text-[#44475B] dark:text-neutral-200 transition"
              title="Cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cart</span>
            </button>
          ) : (
            <Link
              to="/trade"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00B386]/10 hover:bg-[#00B386]/20 border border-[#00B386]/30 text-xs font-bold text-[#00B386] transition cursor-pointer"
              title="Open OrderPulse C++20 Matching Terminal"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
