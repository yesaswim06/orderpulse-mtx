import React from 'react';
import { TrendingUp, FolderPlus } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "You haven't invested yet",
  description = "Start your investment journey with zero brokerage on mutual funds and low latency stock execution.",
  actionText = "Explore Investments",
  onAction,
}) => {
  return (
    <div className="p-6 text-center flex flex-col items-center justify-center">
      {/* Groww-style clean SVG investment illustration */}
      <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill="#F4FAF7" className="dark:fill-emerald-950/20" />
          <path
            d="M30 65 L45 50 L58 58 L72 35"
            fill="none"
            stroke="#00B386"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="72" cy="35" r="4" fill="#00B386" />
          <rect x="26" y="68" width="48" height="3" rx="1.5" fill="#E8E8E8" className="dark:fill-neutral-700" />
        </svg>
      </div>

      <h4 className="text-sm font-bold text-[#44475B] dark:text-white mb-1">
        {title}
      </h4>
      <p className="text-xs text-[#7C7E8C] max-w-[220px] mb-4 leading-relaxed">
        {description}
      </p>

      {actionText && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
