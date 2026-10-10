import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, TrendingUp, TrendingDown } from 'lucide-react';
import { TICKER_DATA } from '../../data/growcloneData';

export const IndexTickerStrip: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-[#121212] border-b border-[#E8E8E8] dark:border-white/10 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-2 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-6 sm:gap-8 shrink-0 font-mono text-xs">
          {TICKER_DATA.map((item) => (
            <Link
              key={item.name}
              to={item.name.includes('DEMO') ? '/trade' : '/futures-and-options/user/explore'}
              className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
              title={`View ${item.name} charts and contracts`}
            >
              <span className="font-semibold text-[#44475B] dark:text-[#E5E7EB] font-sans">
                {item.name}
              </span>
              <span className="font-bold text-[#44475B] dark:text-white">
                {item.price}
              </span>
              <span
                className={`text-[11px] font-medium flex items-center gap-0.5 ${
                  item.isUp ? 'text-[#00B386]' : 'text-[#EB5B3C]'
                }`}
              >
                {item.isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{item.change}</span>
                <span className="opacity-90">({item.percent})</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Globe icon button linking to terminal */}
        <Link
          to="/trade"
          className="shrink-0 p-1.5 rounded-full hover:bg-[#F8F8F8] dark:hover:bg-neutral-800 text-[#7C7E8C] transition"
          title="Global Markets & Matching Terminal"
        >
          <Globe className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
