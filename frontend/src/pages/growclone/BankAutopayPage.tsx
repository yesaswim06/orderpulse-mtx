import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GrowNavbar } from '../../components/growclone/GrowNavbar';
import { MOCK_BANKS, BankAccount } from '../../data/mockBanks';
import {
  MoreVertical,
  PlusCircle,
  HelpCircle,
  Pencil,
  CheckCircle2,
  Building,
} from 'lucide-react';

interface BankAutopayPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const BankAutopayPage: React.FC<BankAutopayPageProps> = ({
  theme,
  onToggleTheme,
}) => {
  const [selectedBankId, setSelectedBankId] = useState<string>('bank-1');
  const navigate = useNavigate();

  const selectedBank = MOCK_BANKS.find((b) => b.id === selectedBankId) || MOCK_BANKS[0];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
        theme === 'dark' ? 'bg-[#0B0E14] text-[#E5E7EB]' : 'bg-white text-[#44475B]'
      }`}
    >
      {/* 1. Global Navbar (no sub-nav on this page per spec) */}
      <GrowNavbar theme={theme} onToggleTheme={onToggleTheme} />

      {/* 2. Main Content */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 flex-1">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
            Bank Account Details
          </h1>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
            Manage verified bank accounts and recurring SIP autopay mandates
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT Card: Bank List (5 cols) */}
          <div
            className={`lg:col-span-5 rounded-2xl border p-4 transition-colors ${
              theme === 'dark' ? 'bg-[#131824] border-[#222B3D]' : 'bg-white border-[#E8E8E8]'
            }`}
          >
            <div className="space-y-2">
              {MOCK_BANKS.map((bank) => {
                const isSelected = bank.id === selectedBankId;
                return (
                  <div
                    key={bank.id}
                    onClick={() => setSelectedBankId(bank.id)}
                    className={`p-3.5 rounded-xl flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? theme === 'dark'
                          ? 'bg-[#1D2536] border border-[#2F3C56]'
                          : 'bg-[#F4F4F4] border border-[#E0E0E0]'
                        : theme === 'dark'
                        ? 'hover:bg-[#1A2234] border border-transparent'
                        : 'hover:bg-[#F9F9F9] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${bank.logoBg} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {bank.logoText}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                          {bank.bankName}
                        </div>
                        <div className={`text-[11px] font-mono mt-0.5 ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                          {bank.maskedAccount}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Settings for ${bank.bankName}`);
                      }}
                      className="p-1 rounded text-[#7C7E8C] hover:text-[#222531] dark:hover:text-white"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Add Another Bank */}
              <button
                onClick={() => alert('Add bank verification flow via Penny Drop & UPI')}
                className={`w-full p-3.5 rounded-xl border border-dashed border-[#00B386]/40 flex items-center gap-2.5 text-xs font-bold text-[#00B386] hover:bg-[#00B386]/5 transition cursor-pointer mt-3`}
              >
                <PlusCircle className="w-4 h-4 text-[#00B386]" />
                <span>Add another bank</span>
              </button>
            </div>
          </div>

          {/* RIGHT Card: Bank Details (7 cols) */}
          <div
            className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 transition-colors ${
              theme === 'dark' ? 'bg-[#131824] border-[#222B3D]' : 'bg-white border-[#E8E8E8]'
            }`}
          >
            {/* Header: Large Logo + Bank Name + Primary Badge */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-full ${selectedBank.logoBg} text-white font-extrabold text-sm flex items-center justify-center shadow-md`}>
                {selectedBank.logoText}
              </div>
              <div>
                <h3 className={`text-lg font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                  {selectedBank.bankName}
                </h3>
                {selectedBank.isPrimary && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#00B386] mt-0.5">
                    <span>Primary bank</span>
                    <HelpCircle className="w-3.5 h-3.5 text-[#00B386]" />
                  </div>
                )}
              </div>
            </div>

            {/* Key / Value Rows */}
            <div className="divide-y divide-inherit text-xs">
              <div className="py-3.5 flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}>Status</span>
                <span className="font-bold text-[#00B386] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{selectedBank.status}</span>
                </span>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}>Account</span>
                <span className="font-mono font-bold tracking-wide">
                  {selectedBank.fullAccount}
                </span>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}>IFSC Code</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold">{selectedBank.ifsc}</span>
                  <button
                    onClick={() => alert('Edit IFSC Code')}
                    className="p-1 text-[#00B386] hover:text-[#008A66]"
                    title="Edit IFSC Code"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <span className={theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}>Branch Name</span>
                <span className="font-semibold">{selectedBank.branchName}</span>
              </div>
            </div>

            {/* Setup Autopay Button */}
            <div className="mt-8 pt-6 border-t border-inherit flex justify-center">
              <button
                onClick={() => alert(`Setting up e-NACH Autopay for ${selectedBank.bankName}`)}
                className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#00B386] hover:bg-[#009E76] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#00B386]/25 transition active:scale-95 cursor-pointer"
              >
                Setup autopay
              </button>
            </div>

            {/* Bottom Help Box */}
            <div
              className={`mt-8 p-4 rounded-xl border flex items-center justify-between text-xs transition ${
                theme === 'dark' ? 'bg-[#0E121C] border-[#1E2536]' : 'bg-[#FAFAFA] border-[#E8E8E8]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-[#7C7E8C]" />
                <span className="font-medium">Have questions about Bank &amp; Autopay?</span>
              </div>
              <button
                onClick={() => navigate('/help')}
                className="font-bold text-[#00B386] hover:underline flex items-center gap-1"
              >
                <span>Get help</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
