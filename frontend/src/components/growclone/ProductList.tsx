import React from 'react';
import {
  TrendingUp,
  Shield,
  PieChart,
  Search,
  Repeat,
  Activity,
  Code2,
  CalendarCheck,
  Flame,
  Upload,
  FileText,
  GitCompare,
  ChevronRight,
} from 'lucide-react';
import { ProductTool } from '../../data/mockData';

interface ProductListProps {
  title?: string;
  items: ProductTool[];
}

export const ProductList: React.FC<ProductListProps> = ({
  title = "Products & Tools",
  items,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-[#00B386]" />;
      case 'Shield':
        return <Shield className="w-4 h-4 text-amber-500" />;
      case 'PieChart':
        return <PieChart className="w-4 h-4 text-blue-500" />;
      case 'Search':
        return <Search className="w-4 h-4 text-purple-500" />;
      case 'Repeat':
        return <Repeat className="w-4 h-4 text-teal-500" />;
      case 'Activity':
        return <Activity className="w-4 h-4 text-rose-500" />;
      case 'Code2':
        return <Code2 className="w-4 h-4 text-[#00B386]" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-4 h-4 text-sky-500" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-amber-500" />;
      case 'Upload':
        return <Upload className="w-4 h-4 text-indigo-500" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'GitCompare':
        return <GitCompare className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-[#00B386]" />;
    }
  };

  return (
    <div className="bg-white dark:bg-[#1F222E] rounded-xl border border-[#E8E8E8] dark:border-[#2E3245] p-5 transition-all">
      <h3 className="text-sm font-bold text-[#44475B] dark:text-white mb-3">
        {title}
      </h3>
      <div className="divide-y divide-[#E8E8E8] dark:divide-[#2E3245]">
        {items.map((item) => (
          <div
            key={item.id}
            className="py-3 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] px-2 -mx-2 rounded-lg cursor-pointer transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#F8F8F8] dark:bg-[#181A24] flex items-center justify-center">
                {getIcon(item.iconName)}
              </div>
              <span className="text-xs font-semibold text-[#44475B] dark:text-[#E2E8F0]">
                {item.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {item.pill && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] border border-emerald-500/20">
                  {item.pill}
                </span>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-[#7C7E8C]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
