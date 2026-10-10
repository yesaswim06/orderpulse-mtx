import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Sparkles,
  Zap
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [email, setEmail] = useState('aarav.sharma@orderpulse.exchange');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setError(null);
    setOtpSent(true);
    setOtp('584291');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authMode === 'PASSWORD' && (!email.trim() || !password)) {
      setError('Please provide your registered email and password.');
      return;
    }
    if (authMode === 'OTP' && (!phone.trim() || !otp.trim())) {
      setError('Please enter mobile number and 6-digit OTP.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      const user = {
        userId: 'USER-DEMO-01',
        name: authMode === 'PASSWORD' ? 'Aarav Sharma' : 'Mobile Verified Trader',
        email: authMode === 'PASSWORD' ? email : `${phone}@sms.orderpulse.exchange`,
        phone: '+91 ' + phone,
        role: 'PRO_TRADER',
        isDemo: true
      };
      localStorage.setItem('orderpulse_user', JSON.stringify(user));
      window.dispatchEvent(new Event('orderpulse_auth_change'));

      setTimeout(() => {
        navigate('/stocks/user/explore');
      }, 700);
    }, 500);
  };

  const handleQuickDemoLogin = (userType: 'AARAV' | 'PRIYA' | 'INSTITUTIONAL') => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      const demoUsers = {
        AARAV: { userId: 'USER-DEMO-01', name: 'Aarav Sharma', email: 'aarav.sharma@orderpulse.exchange', role: 'PRO_TRADER' },
        PRIYA: { userId: 'USER-IN-02', name: 'Priya Patel', email: 'priya.patel@gujarat-capital.in', role: 'MARKET_MAKER' },
        INSTITUTIONAL: { userId: 'USER-IN-05', name: 'Vikramaditya Singhania', email: 'vikram.singhania@kolkata-prop.in', role: 'INSTITUTIONAL_DESK' },
      };
      localStorage.setItem('orderpulse_user', JSON.stringify(demoUsers[userType]));
      window.dispatchEvent(new Event('orderpulse_auth_change'));

      setTimeout(() => {
        navigate('/stocks/user/explore');
      }, 600);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#00B386] via-[#00c997] to-[#10b981] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-none stroke-current stroke-2">
              <path d="M3 12c3-4 6-4 9 0s6 4 9 0" />
              <path d="M3 7c3-3 6-3 9 0s6 3 9 0" opacity="0.6" />
              <path d="M3 17c3-3 6-3 9 0s6 3 9 0" opacity="0.6" />
            </svg>
          </div>
          <span className="text-2xl font-black text-[#44475B] dark:text-white tracking-tight">OrderPulse</span>
        </Link>
        <h2 className="text-xl font-bold text-[#44475B] dark:text-white">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-[#7C7E8C]">
          Trade Indian stocks, mutual funds, and live matching simulation
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#151515] py-8 px-6 sm:px-8 rounded-3xl border border-[#E8E8E8] dark:border-white/10 shadow-sm space-y-5 animate-fade-in">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 text-xs text-[#EB5B3C] font-mono">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs text-[#00B386] font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Authentication verified. Loading dashboard...</span>
            </div>
          )}

          {/* Auth Mode Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F8F8F8] dark:bg-neutral-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setAuthMode('PASSWORD'); setError(null); }}
              className={`py-2 rounded-lg transition cursor-pointer ${
                authMode === 'PASSWORD'
                  ? 'bg-white dark:bg-neutral-700 text-[#44475B] dark:text-white shadow-xs'
                  : 'text-[#7C7E8C]'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('OTP'); setError(null); }}
              className={`py-2 rounded-lg transition cursor-pointer ${
                authMode === 'OTP'
                  ? 'bg-white dark:bg-neutral-700 text-[#44475B] dark:text-white shadow-xs'
                  : 'text-[#7C7E8C]'
              }`}
            >
              Mobile OTP
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
            {authMode === 'PASSWORD' ? (
              <>
                <div>
                  <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7C7E8C] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trader@orderpulse.exchange"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#7C7E8C] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                    Mobile Number (+91)
                  </label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-xs font-mono font-bold text-[#7C7E8C] flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386] font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] font-bold text-[11px] border border-emerald-500/20 hover:bg-emerald-100 transition cursor-pointer"
                    >
                      {otpSent ? 'Resend' : 'Get OTP'}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div className="animate-fade-in space-y-1">
                    <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                      Enter 6-Digit OTP (Simulated: 584291)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="584291"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#00B386] bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none font-mono text-center tracking-widest font-bold text-sm"
                    />
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to OrderPulse'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Profiles */}
          <div className="pt-4 border-t border-[#F0F0F0] dark:border-white/[0.08] space-y-2">
            <span className="text-[11px] font-mono text-[#7C7E8C] block text-center">
              Quick 1-Click Demo Profiles (Jury / Test):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('AARAV')}
                className="py-1.5 px-2 rounded-lg border border-[#E8E8E8] dark:border-white/10 text-[10px] font-bold hover:border-[#00B386] hover:text-[#00B386] transition cursor-pointer"
              >
                Aarav (Trader)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('PRIYA')}
                className="py-1.5 px-2 rounded-lg border border-[#E8E8E8] dark:border-white/10 text-[10px] font-bold hover:border-[#00B386] hover:text-[#00B386] transition cursor-pointer"
              >
                Priya (Maker)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('INSTITUTIONAL')}
                className="py-1.5 px-2 rounded-lg border border-[#E8E8E8] dark:border-white/10 text-[10px] font-bold hover:border-[#00B386] hover:text-[#00B386] transition cursor-pointer"
              >
                Vikram (Desk)
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-[#7C7E8C]">
              Don't have an account yet?{' '}
              <Link to="/signup" className="font-bold text-[#00B386] hover:underline">
                Register here
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
