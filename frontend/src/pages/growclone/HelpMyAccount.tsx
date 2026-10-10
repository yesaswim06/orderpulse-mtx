import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Fingerprint,
  UserCheck,
  Building2,
  FileSpreadsheet,
  Users,
  Globe2,
  ChevronRight,
  Phone,
  MessageCircle,
  Mail,
  Sparkles,
  MessageSquare,
  FileWarning,
} from 'lucide-react';
import { GrowNavbar } from '../../components/growclone/GrowNavbar';
import { MY_ACCOUNT_SUBCATEGORIES } from '../../data/mockData';

interface HelpMyAccountProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export const HelpMyAccount: React.FC<HelpMyAccountProps> = ({
  isDark,
  onToggleTheme,
}) => {
  const navigate = useNavigate();

  const getSubcategoryIcon = (name: string) => {
    switch (name) {
      case 'Fingerprint':
        return <Fingerprint className="w-5 h-5 text-[#00B386]" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-sky-500" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-indigo-500" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-amber-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-500" />;
      case 'Globe2':
        return <Globe2 className="w-5 h-5 text-teal-500" />;
      default:
        return <Building2 className="w-5 h-5 text-[#00B386]" />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#12141E] text-[#44475B] dark:text-[#E2E8F0] font-sans transition-colors">
      {/* 1. Global Navbar */}
      <GrowNavbar isDark={isDark} onToggleTheme={onToggleTheme} />

      {/* Main Container */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-10">
        <h1 className="text-2xl font-bold text-[#44475B] dark:text-white mb-8">
          Customer Support
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: My Account Card with Back Arrow (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1F222E] rounded-xl border border-[#E8E8E8] dark:border-[#2E3245] p-6 shadow-xs">
            {/* Header with Back Arrow */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E8E8E8] dark:border-[#2E3245]">
              <button
                onClick={() => navigate('/help')}
                className="p-2 -ml-2 rounded-full hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] text-[#44475B] dark:text-white transition cursor-pointer"
                title="Back to FAQs"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-[#44475B] dark:text-white">
                My Account
              </h2>
            </div>

            {/* Subcategories list */}
            <div className="divide-y divide-[#E8E8E8] dark:divide-[#2E3245]">
              {MY_ACCOUNT_SUBCATEGORIES.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] px-2 -mx-2 rounded-lg cursor-pointer transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F8F8F8] dark:bg-[#181A24] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {getSubcategoryIcon(item.iconName)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#44475B] dark:text-white group-hover:text-[#00B386] transition">
                        {item.title}
                      </div>
                      <div className="text-xs text-[#7C7E8C] dark:text-[#94A3B8] mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#7C7E8C] group-hover:text-[#00B386] transition" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Contact us 24x7 (5 cols, exact same as Screen 6) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white dark:bg-[#1F222E] rounded-xl border border-[#E8E8E8] dark:border-[#2E3245] p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#44475B] dark:text-white mb-5">
                Contact us 24x7
              </h3>

              <div className="space-y-4">
                {/* Call us */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] transition cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#7C7E8C] dark:text-[#94A3B8]">
                      Call us
                    </div>
                    <div className="text-sm font-bold text-[#44475B] dark:text-white font-mono">
                      +91 00000 00000
                    </div>
                  </div>
                </div>

                {/* Chat with us */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] transition cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#7C7E8C] dark:text-[#94A3B8]">
                      Chat with us
                    </div>
                    <div className="text-sm font-bold text-[#44475B] dark:text-white">
                      Get an instant reply
                    </div>
                  </div>
                </div>

                {/* Email us */}
                <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#F8F8F8] dark:hover:bg-[#2A2E3D] transition cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-[#7C7E8C] dark:text-[#94A3B8]">
                      Email us
                    </div>
                    <div className="text-sm font-bold text-[#44475B] dark:text-white">
                      support@example.com
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links below Contact Card */}
            <div className="bg-white dark:bg-[#1F222E] rounded-xl border border-[#E8E8E8] dark:border-[#2E3245] p-4 divide-y divide-[#E8E8E8] dark:divide-[#2E3245] shadow-xs">
              <div className="py-2.5 flex items-center justify-between text-xs font-semibold text-[#44475B] dark:text-white hover:text-[#00B386] cursor-pointer transition">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00B386]" />
                  <span>What's new</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7C7E8C]" />
              </div>

              <div className="py-2.5 flex items-center justify-between text-xs font-semibold text-[#44475B] dark:text-white hover:text-[#00B386] cursor-pointer transition">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#00B386]" />
                  <span>Feedback</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7C7E8C]" />
              </div>

              <div className="py-2.5 flex items-center justify-between text-xs font-semibold text-[#44475B] dark:text-white hover:text-[#00B386] cursor-pointer transition">
                <div className="flex items-center gap-2">
                  <FileWarning className="w-4 h-4 text-[#EB5B3C]" />
                  <span>Grievance</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7C7E8C]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
