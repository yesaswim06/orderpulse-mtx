import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  MoreVertical,
  HelpCircle,
  Pencil,
  CheckCircle2,
  Building,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { BANK_ACCOUNTS, BankAccount } from '../../data/growcloneData';

export const BankAutopayPage: React.FC = () => {
  const [selectedBankId, setSelectedBankId] = useState<string>(BANK_ACCOUNTS[0].id);
  const [showAddModal, setShowAddModal] = useState(false);
  const [autopaySuccess, setAutopaySuccess] = useState(false);

  const selectedBank =
    BANK_ACCOUNTS.find((b) => b.id === selectedBankId) || BANK_ACCOUNTS[0];

  const handleSetupAutopay = () => {
    setAutopaySuccess(true);
    setTimeout(() => setAutopaySuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#44475B] dark:text-white tracking-tight">
            Bank Account Details
          </h1>
          <p className="text-xs text-[#7C7E8C] mt-1">
            Manage linked savings accounts for trading margin, instant UPI deposits, and automated withdrawals.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT CARD (List of Banks) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06]">
              {BANK_ACCOUNTS.map((bank) => {
                const isSelected = bank.id === selectedBank.id;
                return (
                  <div
                    key={bank.id}
                    onClick={() => setSelectedBankId(bank.id)}
                    className={`p-4 flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#F4FAF7] dark:bg-emerald-950/20 border-l-4 border-[#00B386]'
                        : 'hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Bank logo circle */}
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-neutral-800 border border-[#E8E8E8] dark:border-white/10 flex items-center justify-center font-bold text-xs text-[#44475B] dark:text-neutral-200">
                        {bank.logo}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#44475B] dark:text-white">
                          {bank.bankName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-[#7C7E8C]">
                            {bank.maskedAccount}
                          </span>
                          {bank.isPrimary && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#00B386]/10 text-[#00B386]">
                              Primary
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button className="text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}

              {/* Row 3: Add another bank */}
              <button
                onClick={() => setShowAddModal(true)}
                className="w-full p-4 flex items-center gap-3 text-[#00B386] hover:bg-[#F4FAF7] dark:hover:bg-emerald-950/20 transition cursor-pointer font-semibold text-xs sm:text-sm text-left"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Add another bank</span>
              </button>
            </div>
          </div>

          {/* RIGHT CARD (Details of Selected Bank) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-[#F0F0F0] dark:border-white/[0.06]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-neutral-800 border border-[#E8E8E8] dark:border-white/10 flex items-center justify-center font-extrabold text-base text-[#44475B] dark:text-neutral-200">
                  {selectedBank.logo}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#44475B] dark:text-white">
                    {selectedBank.bankName}
                  </h3>
                  {selectedBank.isPrimary && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00B386]/10 text-[#00B386] text-xs font-semibold mt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Primary bank</span>
                      <HelpCircle className="w-3 h-3 text-[#7C7E8C]" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Key / Value rows */}
            <div className="py-6 space-y-4 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#7C7E8C]">Status</span>
                <span className="font-bold text-[#00B386] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedBank.status}</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#7C7E8C]">Account</span>
                <span className="font-mono font-bold text-[#44475B] dark:text-white">
                  {selectedBank.fullAccount}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#7C7E8C]">IFSC Code</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#44475B] dark:text-white">
                    {selectedBank.ifsc}
                  </span>
                  <button className="text-[#00B386] hover:text-[#009e75]">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#7C7E8C]">Branch Name</span>
                <span className="font-medium text-[#44475B] dark:text-white text-right max-w-[200px] truncate">
                  {selectedBank.branch}
                </span>
              </div>
            </div>

            {/* Success message on Autopay setup */}
            {autopaySuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-[#00B386]/30 text-xs text-[#00B386] font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>e-NACH Mandate initialized with NPCI. Autopay active.</span>
              </div>
            )}

            {/* Divider and Centered Green Solid Button */}
            <div className="pt-6 border-t border-[#F0F0F0] dark:border-white/[0.06] flex justify-center">
              <button
                onClick={handleSetupAutopay}
                className="px-8 py-3.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-[#00B386]/20 cursor-pointer active:scale-95"
              >
                Setup autopay
              </button>
            </div>

            {/* Bottom Bordered Help Box */}
            <div className="mt-8 p-4 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#FAFAFA] dark:bg-neutral-800/40 flex items-center justify-between text-xs">
              <span className="text-[#44475B] dark:text-neutral-300 font-medium">
                Have questions about Bank & Autopay?
              </span>
              <Link
                to="/help"
                className="text-[#00B386] font-bold flex items-center gap-1 hover:underline"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Get help</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Modal: Add Bank Dialog */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#E8E8E8] dark:border-white/10">
              <h3 className="text-base font-bold text-[#44475B] dark:text-white mb-2">
                Link New Bank Account
              </h3>
              <p className="text-xs text-[#7C7E8C] mb-4">
                We will verify your bank via penny drop ₹1 deposit through NPCI IMPS.
              </p>
              <div className="space-y-3 mb-5">
                <div>
                  <label className="text-xs font-semibold text-[#44475B] dark:text-neutral-300 mb-1 block">
                    Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 9-18 digit account number"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 outline-none focus:border-[#00B386]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#44475B] dark:text-neutral-300 mb-1 block">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001234"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 outline-none focus:border-[#00B386]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-[#E8E8E8] dark:border-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold"
                >
                  Verify Bank
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
