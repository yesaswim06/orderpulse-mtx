import React, { useState } from 'react';
import {
  User,
  Shield,
  CreditCard,
  Key,
  Bell,
  Mail,
  Smartphone,
  CheckCircle,
  FileText,
  Activity,
  LogOut
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('orderpulse_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return {
      userId: 'USER-DEMO-01',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@orderpulse.exchange',
      role: 'TRADER',
      isDemo: true
    };
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-[#141414] p-6 sm:p-8 rounded-3xl border border-[#E8E8E8] dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-bold text-[#44475B] dark:text-white">
                {user.name}
              </h1>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] border border-emerald-200 dark:border-emerald-800">
                VERIFIED KYC • TIER 1
              </span>
            </div>
            <p className="text-xs text-[#7C7E8C] mt-1 font-mono">
              Account ID: {user.userId} • {user.email}
            </p>
          </div>
          <Link
            to="/trade"
            className="px-5 py-2.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Terminal</span>
          </Link>
        </div>

        {/* Account Details Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section 1: Security & Identity */}
          <div className="bg-white dark:bg-[#141414] p-6 rounded-3xl border border-[#E8E8E8] dark:border-white/10 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#44475B] dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00B386]" />
              <span>Security & Verification</span>
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-neutral-800/50">
                <div>
                  <div className="font-semibold text-[#44475B] dark:text-white">PAN Verification</div>
                  <div className="text-[#7C7E8C] font-mono">ABCDE1234F</div>
                </div>
                <span className="text-[#00B386] font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-neutral-800/50">
                <div>
                  <div className="font-semibold text-[#44475B] dark:text-white">Aadhaar eKYC</div>
                  <div className="text-[#7C7E8C] font-mono">XXXX-XXXX-9821</div>
                </div>
                <span className="text-[#00B386] font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-neutral-800/50">
                <div>
                  <div className="font-semibold text-[#44475B] dark:text-white">Two-Factor Authentication</div>
                  <div className="text-[#7C7E8C]">TOTP & SMS OTP Enabled</div>
                </div>
                <span className="text-[#00B386] font-bold">Active</span>
              </div>
            </div>
          </div>

          {/* Section 2: Banking & Trading Preferences */}
          <div className="bg-white dark:bg-[#141414] p-6 rounded-3xl border border-[#E8E8E8] dark:border-white/10 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#44475B] dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#00B386]" />
              <span>Banking & Settlement</span>
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-800/50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#44475B] dark:text-white">Primary Bank</span>
                  <span className="text-[#00B386] font-bold">HDFC Bank Ltd</span>
                </div>
                <div className="text-[#7C7E8C] mt-1 font-mono">
                  A/C: ************4821 • IFSC: HDFC0000060
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-800/50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#44475B] dark:text-white">UPI Virtual ID</span>
                  <span className="text-slate-600 dark:text-neutral-300 font-mono">aarav@okaxis</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-neutral-800/50 flex items-center justify-between">
                <span className="font-semibold text-[#44475B] dark:text-white">Trading Segment</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] font-bold">
                  Equity, F&O Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav Row */}
        <div className="flex items-center justify-between pt-4">
          <Link
            to="/user/bank-autopay"
            className="text-xs font-semibold text-[#00B386] hover:underline"
          >
            Manage Bank Autopay Mandates →
          </Link>
          <Link
            to="/help"
            className="text-xs font-semibold text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white"
          >
            Need Help? Contact 24x7 Support
          </Link>
        </div>
      </div>
    </div>
  );
};
