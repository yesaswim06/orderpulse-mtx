import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  User,
  TrendingUp,
  BarChart2,
  Coins,
  CreditCard,
  PieChart,
  DollarSign,
  Lock,
  Globe,
  ChevronRight,
  Phone,
  MessageCircle,
  Mail,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SUPPORT_CATEGORIES } from '../../data/growcloneData';

export const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#44475B] dark:text-white tracking-tight mb-8">
          Customer Support
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN (~7 cols): FAQs Card */}
          <div className="lg:col-span-7 bg-white dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-[#44475B] dark:text-white mb-4 pb-3 border-b border-[#F0F0F0] dark:border-white/[0.06]">
              FAQs
            </h2>

            <div className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06]">
              {SUPPORT_CATEGORIES.map((cat) => {
                const handleClick = () => {
                  if (cat.hasSubpage) {
                    navigate('/help/my-account');
                  }
                };

                return (
                  <div
                    key={cat.id}
                    onClick={handleClick}
                    className="py-3.5 flex items-center justify-between hover:bg-[#F8F8F8] dark:hover:bg-neutral-800/40 px-2 rounded-xl transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-neutral-800 flex items-center justify-center text-[#7C7E8C]">
                        {cat.id === 'most-asked' && <HelpCircle className="w-4 h-4 text-[#00B386]" />}
                        {cat.id === 'my-account' && <User className="w-4 h-4 text-blue-500" />}
                        {cat.id === 'stocks' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                        {cat.id === 'fo' && <BarChart2 className="w-4 h-4 text-purple-500" />}
                        {cat.id === 'matching-engine' && <Zap className="w-4 h-4 text-amber-500" />}
                        {cat.id === 'payments' && <CreditCard className="w-4 h-4 text-[#F5A623]" />}
                        {cat.id === 'mutual-funds' && <PieChart className="w-4 h-4 text-pink-500" />}
                        {cat.id === 'loans' && <DollarSign className="w-4 h-4 text-indigo-500" />}
                        {cat.id === 'fds' && <Lock className="w-4 h-4 text-teal-500" />}
                        {cat.id === 'us-stocks' && <Globe className="w-4 h-4 text-cyan-500" />}
                      </div>
                      <span className="font-semibold text-xs sm:text-sm text-[#44475B] dark:text-neutral-200">
                        {cat.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {cat.hasSubpage && (
                        <span className="text-[10px] text-[#7C7E8C] bg-[#F4F4F4] dark:bg-neutral-800 px-2 py-0.5 rounded-full font-medium">
                          6 topics
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN (~5 cols): Contact Us 24x7 */}
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
