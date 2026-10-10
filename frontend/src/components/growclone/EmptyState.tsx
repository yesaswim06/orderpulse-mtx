import React from 'react';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  theme?: 'light' | 'dark';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Your investments',
  subtitle = "You haven't invested yet",
  theme = 'light',
}) => {
  return (
    <div
      className={`p-6 rounded-2xl border flex flex-col items-center text-center transition-colors ${
        theme === 'dark' ? 'bg-[#131824] border-[#222B3D]' : 'bg-white border-[#E8E8E8]'
      }`}
    >
      <h3
        className={`w-full text-left text-sm font-bold tracking-tight mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-[#44475B]'
        }`}
      >
        {title}
      </h3>

      {/* Clean SVG Empty State Illustration */}
      <div className="w-24 h-24 my-3 flex items-center justify-center">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <circle cx="50" cy="50" r="42" fill={theme === 'dark' ? '#1D2536' : '#F4F7F6'} />
          <path
            d="M32 60L44 48L54 56L68 38"
            stroke="#00B386"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="68" cy="38" r="4" fill="#00B386" />
          <rect
            x="28"
            y="66"
            width="44"
            height="4"
            rx="2"
            fill={theme === 'dark' ? '#333F56' : '#D1D7DC'}
          />
          <circle cx="50" cy="50" r="46" stroke="#00B386" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        </svg>
      </div>

      <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
        {subtitle}
      </p>
    </div>
  );
};
