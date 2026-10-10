import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MoreVertical,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  Pencil,
  Building,
} from 'lucide-react';
import { GrowNavbar } from '../../components/growclone/GrowNavbar';
import { BANK_ACCOUNTS, BankAccount } from '../../data/mockData';

interface BankAutopayProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const BankAutopay: React.FC<BankAutopayProps> = ({
  isDark,
  onToggleTheme,
}) => {
  const [selectedBank, setSelectedBank] = useState<BankAccount>(BANK_ACCOUNTS[0]);
  const [autopaySuccess, setAutopaySuccess] = useState(false);

  const handleSetupAutopay = () => {
    setAutopaySuccess(true);
    setTimeout(() => setAutopaySuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#12141E] text-[#44475B] dark:text-[#E2E8F0] font-sans transition-colors">
      {/* 1. Global Navbar with NO sub-nav */}
      <GrowNavbar isDark={isDark} onToggleTheme={onToggleTheme} />

      {/* Main Container */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-10">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-[#44475B] dark:text-white mb-8">
          Bank Account Details
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT Card: Banks List (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1F222E] rounded-xl border border-[#E8E8E8] dark:border-[#2E3245] overflow-hidden shadow-xs">
            <div className="divide-y divide-[#E8E8E8] dark:divide-[#2E3245]">
              {BANK_ACCOUNTS.map((bank) => {
                const isSelected = selectedBank.id === bank.id;
                return (
                  <div
                    key={bank.id}
                    onClick={() => setSelectedBank(bank)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#F8F8F8] dark:bg-[#2A2E3D]'
                        : 'hover:bg-[#FAFAFA] dark:hover:bg-[#242838]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-full ${bank.logoColor} text-white font-bold flex items-center justify-center text-xs shadow-xs`}
                      >
                        {bank.bankName.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#44475B] dark:text-white">
                          {bank.bankName}
                        </div>
                        <div className="text-xs text-[#7C7E8C] dark:text-[#94A3B8] font-mono">
                          {bank.maskedAccount}
                        </div>
                      </div>
                    </div>

                    <button
                      className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-[#7C7E8C] transition"
                      title="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Row 3: Add another bank */}
              <button className="w-full p-4.5 flex items-center gap-3 text-[#00B386] hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] transition text-sm font-semibold cursor-pointer text-left">
                <PlusCircle className="w-5 h-5 text-[#00B386]" />
                <span>Add another bank</span>
              </button>
            </div>
          </div>

          {/* RIGHT Card: Bank Details (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#1F222E] rounded-xl border border-[#E8E8E8] dark:border-[#2E3245] p-7 shadow-xs">
              {/* Header with bank logo circle */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-full ${selectedBank.logoColor} text-white font-extrabold flex items-center justify-center text-base shadow-sm`}
                >
                  {selectedBank.bankName.slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#44475B] dark:text-white">
                    {selectedBank.bankName}
                  </h2>
                  {selectedBank.isPrimary && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00B386] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/20 mt-1">
                      <span>Primary bank</span>
                      <HelpCircle className="w-3.5 h-3.5 text-[#00B386]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Key / Value Rows */}
              <div className="space-y-4 py-4 border-t border-[#E8E8E8] dark:border-[#2E3245] text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#7C7E8C] dark:text-[#94A3B8]">Status</span>
                  <span className="font-semibold text-[#00B386] flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-[#00B386]" />
                    <span>{selectedBank.status}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#7C7E8C] dark:text-[#94A3B8]">Account</span>
                  <span className="font-mono font-bold text-[#44475B] dark:text-white">
                    {selectedBank.fullAccount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#7C7E8C] dark:text-[#94A3B8]">IFSC Code</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#44475B] dark:text-white">
                      {selectedBank.ifscCode}
                    </span>
                    <button
                      className="p-1 rounded text-[#00B386] hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                      title="Edit IFSC"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#7C7E8C] dark:text-[#94A3B8]">Branch Name</span>
                  <span className="font-semibold text-[#44475B] dark:text-white">
                    {selectedBank.branchName}
                  </span>
                </div>
              </div>

              {/* Divider & Setup Autopay Button */}
              <div className="pt-6 border-t border-[#E8E8E8] dark:border-[#2E3245] flex flex-col items-center">
                {autopaySuccess && (
                  <div className="mb-3 text-xs font-semibold text-[#00B386] bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#00B386]" />
                    <span>Autopay mandate initiated successfully!</span>
                  </div>
                )}
                <button
                  onClick={handleSetupAutopay}
                  className="py-3.5 px-8 rounded-full bg-[#00B386] hover:bg-[#009E76] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98"
                >
                  Setup autopay
                </button>
              </div>
            </div>

            {/* Bottom bordered box: Have questions about Bank & Autopay? */}
            <div className="bg-white dark:bg-[#1F222E] rounded-xl border border-[#E8E8E8] dark:border-[#2E3245] p-4.5 flex items-center justify-between shadow-2xs">
              <span className="text-xs font-semibold text-[#44475B] dark:text-white">
                Have questions about Bank & Autopay?
              </span>
              <Link
                to="/help"
                className="text-xs font-bold text-[#00B386] hover:underline flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-[#00B386]" />
                <span>Get help</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
