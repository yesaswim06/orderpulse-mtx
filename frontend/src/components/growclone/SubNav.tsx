import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart2, ShoppingCart } from 'lucide-react';

interface SubNavProps {
  items: { label: string; href?: string; active?: boolean }[];
  actionType?: 'terminal' | 'cart';
  onActionClick?: () => void;
}

export const SubNav: React.FC<SubNavProps> = ({
  items,
  actionType = 'terminal',
  onActionClick,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#12141E] border-b border-[#E8E8E8] dark:border-[#2E3245] transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none">
          {items.map((item) => (
            <button
              key={item.label}
              className={`py-3.5 text-sm font-semibold transition relative whitespace-nowrap cursor-pointer ${
                item.active
                  ? 'text-[#00B386]'
                  : 'text-[#7C7E8C] dark:text-[#94A3B8] hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {/* 2px green underline on the active item */}
              {item.active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00B386] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Action Button at far right */}
        {actionType === 'terminal' && (
          <Link
            to="/trade"
            className="hidden sm:inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#44475B] dark:text-[#E2E8F0] hover:bg-[#F8F8F8] dark:hover:bg-[#1F222E] border border-[#E8E8E8] dark:border-[#2E3245] transition shadow-2xs"
            title="Launch Full Order-Book Trading Terminal"
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#00B386]" />
            <span>Terminal</span>
          </Link>
        )}

        {actionType === 'cart' && (
          <button
            onClick={onActionClick}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#44475B] dark:text-[#E2E8F0] hover:bg-[#F8F8F8] dark:hover:bg-[#1F222E] border border-[#E8E8E8] dark:border-[#2E3245] transition shadow-2xs cursor-pointer"
            title="Mutual Funds Investment Cart"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#00B386]" />
            <span>Cart (0)</span>
          </button>
        )}
      </div>
    </div>
  );
};
