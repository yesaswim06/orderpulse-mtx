import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GrowNavbar } from '../../components/growclone/GrowNavbar';
import { MY_ACCOUNT_TOPICS } from '../../data/mockHelp';
import {
  ArrowLeft,
  ChevronRight,
  Phone,
  MessageSquare,
  Mail,
  Fingerprint,
  UserCheck,
  Landmark,
  Layers,
  Users,
  Globe2,
} from 'lucide-react';

interface HelpMyAccountPageProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const HelpMyAccountPage: React.FC<HelpMyAccountPageProps> = ({
  theme,
  onToggleTheme,
}) => {
  const navigate = useNavigate();

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Fingerprint':
        return <Fingerprint className="w-5 h-5 text-[#00B386]" />;
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-blue-500" />;
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-purple-500" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-amber-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-indigo-500" />;
      default:
        return <Globe2 className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
        theme === 'dark' ? 'bg-[#0B0E14] text-[#E5E7EB]' : 'bg-white text-[#44475B]'
      }`}
    >
      {/* 1. Global Navbar */}
      <GrowNavbar theme={theme} onToggleTheme={onToggleTheme} />

      {/* 2. Main Content */}
      <main className="max-w-[1280px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 flex-1">
        <div className="mb-8">
          <h1 className={`text-2xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
            Customer Support
          </h1>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
            My Account verification, credentials, and regulatory settings
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Back Arrow + My Account Details (7 cols) */}
          <div
            className={`lg:col-span-7 rounded-2xl border p-5 sm:p-6 transition-colors ${
              theme === 'dark' ? 'bg-[#131824] border-[#222B3D]' : 'bg-white border-[#E8E8E8]'
            }`}
          >
            {/* Back Button Header */}
            <div className="flex items-center gap-3 mb-5 border-b border-inherit pb-4">
              <button
                onClick={() => navigate('/help')}
                className={`p-2 rounded-lg border transition ${
                  theme === 'dark'
                    ? 'border-[#222B3D] text-[#8B93A7] hover:text-white hover:bg-[#1A2234]'
                    : 'border-[#E8E8E8] text-[#7C7E8C] hover:text-[#222531] hover:bg-[#F8F8F8]'
                }`}
                title="Return to Customer Support categories"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className={`text-base font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                My Account
              </h2>
            </div>

            {/* List of My Account Topics */}
            <div className="divide-y divide-inherit">
              {MY_ACCOUNT_TOPICS.map((topic) => (
                <div
                  key={topic.id}
                  onClick={() => alert(`Viewing instructions for ${topic.title}`)}
                  className={`py-4 flex items-center justify-between cursor-pointer transition ${
                    theme === 'dark' ? 'hover:bg-[#1A2234] -mx-2 px-2 rounded-lg' : 'hover:bg-[#F8F8F8] -mx-2 px-2 rounded-lg'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center shrink-0">
                      {getTopicIcon(topic.icon)}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                        {topic.title}
                      </div>
                      <div className={`text-[11px] mt-0.5 ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'}`}>
                        {topic.subtitle}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Contact us 24x7 (5 cols, identical to Screen 6) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <h2 className={`text-base font-bold tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                Contact us 24x7
              </h2>

              <div
                className={`rounded-2xl border p-5 divide-y divide-inherit transition-colors ${
                  theme === 'dark' ? 'bg-[#131824] border-[#222B3D]' : 'bg-white border-[#E8E8E8]'
                }`}
              >
                {/* Call us */}
                <div className="py-3.5 flex items-center gap-4 first:pt-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-[#00B386] flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                      Call us
                    </div>
                    <div className="text-xs font-semibold text-[#00B386] font-mono mt-0.5">
                      +91 00000 00000
                    </div>
                  </div>
                </div>

                {/* Chat with us */}
                <div className="py-3.5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-[#00B386] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                      Chat with us
                    </div>
                    <div className={`text-xs ${theme === 'dark' ? 'text-[#8B93A7]' : 'text-[#7C7E8C]'} mt-0.5`}>
                      Get an instant reply
                    </div>
                  </div>
                </div>

                {/* Email us */}
                <div className="py-3.5 flex items-center gap-4 last:pb-1">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-[#00B386] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${theme === 'dark' ? 'text-white' : 'text-[#222531]'}`}>
                      Email us
                    </div>
                    <div className="text-xs font-semibold text-[#00B386] mt-0.5">
                      support@example.com
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Links below card */}
            <div
              className={`p-4 rounded-xl border divide-y divide-inherit text-xs ${
                theme === 'dark' ? 'bg-[#131824] border-[#222B3D]' : 'bg-white border-[#E8E8E8]'
              }`}
            >
              {["What's new", 'Feedback', 'Grievance'].map((link) => (
                <div
                  key={link}
                  onClick={() => alert(`${link} portal`)}
                  className="py-2.5 flex items-center justify-between cursor-pointer hover:text-[#00B386] transition"
                >
                  <span className="font-medium">{link}</span>
                  <ChevronRight className="w-4 h-4 text-[#7C7E8C]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
