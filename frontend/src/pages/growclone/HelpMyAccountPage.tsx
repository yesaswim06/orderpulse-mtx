import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Fingerprint,
  UserCheck,
  Landmark,
  Shield,
  Users,
  Globe,
  ChevronRight,
  Phone,
  MessageCircle,
  Mail,
  Zap
} from 'lucide-react';
import { MY_ACCOUNT_SUBITEMS } from '../../data/growcloneData';

export const HelpMyAccountPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#44475B] dark:text-white tracking-tight mb-8">
          Customer Support
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (~7 cols): My Account Subpage */}
          <div className="lg:col-span-7 bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-6 shadow-sm">
            {/* Header with Back Arrow */}
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-[#F0F0F0] dark:border-white/[0.06]">
              <button
                onClick={() => navigate('/help')}
                className="p-1.5 rounded-full hover:bg-[#F8F8F8] dark:hover:bg-neutral-800 text-[#44475B] dark:text-white transition cursor-pointer"
                title="Back to FAQs"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-bold text-[#44475B] dark:text-white">
                My Account
              </h2>
            </div>

            {/* List of subtopics */}
            <div className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06]">
              {MY_ACCOUNT_SUBITEMS.map((item) => (
                <div
                  key={item.id}
                  className="py-4 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-3 rounded-xl transition cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-neutral-800 flex items-center justify-center text-[#7C7E8C] group-hover:text-[#00B386] transition">
                      {item.id === 'kyc' && <Fingerprint className="w-5 h-5 text-blue-500" />}
                      {item.id === 'account' && <UserCheck className="w-5 h-5 text-[#00B386]" />}
                      {item.id === 'bank-accounts' && <Landmark className="w-5 h-5 text-amber-500" />}
                      {item.id === 'matching-limits' && <Shield className="w-5 h-5 text-purple-500" />}
                      {item.id === 'demat' && <Users className="w-5 h-5 text-teal-500" />}
                      {item.id === 'nri' && <Globe className="w-5 h-5 text-indigo-500" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#44475B] dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#7C7E8C] mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#7C7E8C] group-hover:text-[#00B386] transition" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN (~5 cols): Contact Us 24x7 (Same as Screen 6) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <h2 className="text-base font-bold text-[#44475B] dark:text-white mb-4">
                Contact us 24x7
              </h2>

              <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-5 shadow-sm divide-y divide-[#F0F0F0] dark:divide-white/[0.06]">
                {/* Call Us */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[#00B386] flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#44475B] dark:text-white">Call us</h4>
                      <p className="text-xs font-mono text-[#7C7E8C]">+91 80 4567 8900</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#00B386] bg-[#00B386]/10 px-2 py-0.5 rounded-full">
                    Toll Free
                  </span>
                </div>

                {/* Chat With Us */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[#00B386] flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#44475B] dark:text-white">Chat with us</h4>
                      <p className="text-xs text-[#7C7E8C]">Get an instant reply</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#00B386] hover:underline cursor-pointer">
                    Start Chat
                  </span>
                </div>

                {/* Email Us */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-[#00B386] flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#44475B] dark:text-white">Email us</h4>
                      <p className="text-xs text-[#7C7E8C]">support@orderpulse.exchange</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#00B386] hover:underline cursor-pointer">
                    Send Mail
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom 3 Links with chevrons */}
            <div className="bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-4 shadow-sm divide-y divide-[#F0F0F0] dark:divide-white/[0.06] text-xs">
              <div className="py-2.5 flex items-center justify-between hover:text-[#00B386] cursor-pointer transition">
                <span className="font-semibold text-[#44475B] dark:text-neutral-200">What's new</span>
                <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
              </div>
              <div className="py-2.5 flex items-center justify-between hover:text-[#00B386] cursor-pointer transition">
                <span className="font-semibold text-[#44475B] dark:text-neutral-200">Feedback</span>
                <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
              </div>
              <div className="py-2.5 flex items-center justify-between hover:text-[#00B386] cursor-pointer transition">
                <span className="font-semibold text-[#44475B] dark:text-neutral-200">Grievance</span>
                <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
