import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart2, ShoppingCart } from 'lucide-react';

interface SubNavProps {
  section: 'stocks' | 'fno' | 'mf';
  activeItem?: string;
  onSelectTab?: (tab: string) => void;
  theme?: 'light' | 'dark';
}

export const SubNav: React.FC<SubNavProps> = ({
  section,
  activeItem = 'Explore',
  onSelectTab,
  theme = 'light',
}) => {
  const navigate = useNavigate();

  const getTabs = () => {
    switch (section) {
      case 'stocks':
        return ['Explore', 'Holdings', 'Positions', 'Orders', 'Watchlist'];
      case 'fno':
        return ['Explore', 'Positions', 'Orders'];
      case 'mf':
        return ['Explore', 'Dashboard', 'SIPs', 'Watchlist'];
    }
  };

  const tabs = getTabs();

  return (
    <div
      className={`w-full border-b transition-colors ${
        theme === 'dark' ? 'bg-[#0F131D] border-[#1F2637]' : 'bg-white border-[#E8E8E8]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
        {/* Sub-nav Tabs with 2px green underline */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = tab.toLowerCase() === activeItem.toLowerCase();
            return (
              <button
                key={tab}
                onClick={() => onSelectTab && onSelectTab(tab)}
                className={`py-3.5 text-[14px] font-semibold transition relative cursor-pointer shrink-0 ${
                  isActive
                    ? theme === 'dark'
                      ? 'text-white'
                      : 'text-[#222531]'
                    : theme === 'dark'
                    ? 'text-[#8B93A7] hover:text-white'
                    : 'text-[#7C7E8C] hover:text-[#44475B]'
                }`}
              >
                <span>{tab}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00B386] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right CTA: Terminal button or Cart */}
        <div className="shrink-0 py-2">
          {section === 'mf' ? (
            <button
              onClick={() => alert('Mutual Funds Cart is empty.')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer ${
                theme === 'dark'
                  ? 'border-[#2A3348] text-[#8B93A7] hover:text-white hover:bg-[#1A2234]'
                  : 'border-[#E8E8E8] text-[#44475B] hover:bg-[#F8F8F8]'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#00B386]" />
              <span>Cart</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/trade')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#00B386]/10 border-[#00B386]/30 text-[#00B386] hover:bg-[#00B386]/20'
                  : 'bg-emerald-50 border-emerald-200 text-[#00B386] hover:bg-emerald-100'
              }`}
              title="Open Ultra-Low Latency OrderPulse Engine Terminal"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Terminal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
