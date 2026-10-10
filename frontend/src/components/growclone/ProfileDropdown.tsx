import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ListOrdered,
  Building2,
  Headphones,
  FileText,
  Settings,
  Sun,
  Moon,
  ChevronRight,
  LogOut,
} from 'lucide-react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="absolute top-16 right-4 sm:right-12 md:right-36 w-[92vw] max-w-[420px] bg-white dark:bg-[#1F222E] rounded-xl shadow-2xl border border-[#E8E8E8] dark:border-[#2E3245] overflow-hidden text-[#44475B] dark:text-[#E2E8F0] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#E8E8E8] dark:border-[#2E3245] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#00B386] text-white font-bold flex items-center justify-center text-base shadow-sm">
              DU
            </div>
            <div>
              <div className="font-semibold text-base text-[#44475B] dark:text-white">
                Demo User
              </div>
              <div className="text-xs text-[#7C7E8C] dark:text-[#94A3B8]">
                demo.user@example.com
              </div>
            </div>
          </div>
          <button
            className="p-2 rounded-full hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] text-[#7C7E8C] transition"
            title="Account Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Row */}
        <div className="p-4 border-b border-[#E8E8E8] dark:border-[#2E3245] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] transition flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-[#44475B] dark:text-white font-mono">
                ₹0.00
              </div>
              <div className="text-xs text-[#7C7E8C] dark:text-[#94A3B8]">
                Stocks, F&O balance
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
        </div>

        {/* Menu Rows */}
        <div className="py-1">
          <Link
            to="/stocks/user/explore"
            onClick={onClose}
            className="px-4 py-3 hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] transition flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <ListOrdered className="w-5 h-5 text-[#7C7E8C]" />
              <span className="text-sm font-medium">All Orders</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
          </Link>

          <Link
            to="/user/bank-autopay"
            onClick={onClose}
            className="px-4 py-3 hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] transition flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <Building2 className="w-5 h-5 text-[#7C7E8C]" />
              <span className="text-sm font-medium">Bank Details</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
          </Link>

          <Link
            to="/help"
            onClick={onClose}
            className="px-4 py-3 hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] transition flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <Headphones className="w-5 h-5 text-[#7C7E8C]" />
              <span className="text-sm font-medium">24 x 7 Customer Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
          </Link>

          <div
            onClick={onClose}
            className="px-4 py-3 hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] transition flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <FileText className="w-5 h-5 text-[#7C7E8C]" />
              <span className="text-sm font-medium">Reports</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-3.5 bg-[#F8F8F8] dark:bg-[#181A24] border-t border-[#E8E8E8] dark:border-[#2E3245] flex items-center justify-between text-xs">
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 text-[#44475B] dark:text-[#E2E8F0] font-medium hover:text-[#00B386] transition cursor-pointer"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-slate-500" />
                <span>Dark mode</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="text-[#7C7E8C] hover:text-[#EB5B3C] font-medium border-b border-dotted border-[#7C7E8C] pb-0.5 transition cursor-pointer flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
