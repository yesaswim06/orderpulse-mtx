import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useAuth } from '../../context/AuthContext';
import { getApiBase, safeFetchJson } from '../../config/api';

export const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'PASSWORD' | 'OTP'>('PASSWORD');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, login } = useAuth();

  // If already authenticated, redirect to dashboard or intended route
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const params = new URLSearchParams(location.search);
      navigate(params.get('redirect') || '/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, location.search, navigate]);

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setError(null);
    setOtpSent(true);
    setOtp('1234');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const loginEmail = authMode === 'PASSWORD' ? email.trim() : `${phone.trim()}@sms.orderpulse.exchange`;
    const loginCredential = authMode === 'PASSWORD' ? password : otp;

    if (!loginEmail || !loginCredential) {
      setError('Please provide your registered login credentials.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${getApiBase()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginCredential,
          mpin: loginCredential
        })
      });

      const data = await safeFetchJson(res, { success: false, error: 'Server returned empty response' });

      if (res.ok && data?.success && data?.user) {
        login(data.user);
        setSuccess(true);
        setTimeout(() => {
          const params = new URLSearchParams(location.search);
          navigate(params.get('redirect') || '/dashboard');
        }, 600);
      } else {
        // STRICT: DO NOT log in if credentials do not match!
        setError(data?.error || 'Invalid credentials. Password or PIN does not match your registered account.');
      }
    } catch (e: any) {
      setError(e.message || 'Network error connecting to authentication server');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (userType: 'AARAV' | 'PRIYA' | 'INSTITUTIONAL') => {
    const demoCredentials = {
      AARAV: { email: 'aarav.sharma@mumbai-algo.in', password: 'demo1234' },
      PRIYA: { email: 'priya.patel@gujarat-capital.in', password: 'demo1234' },
      INSTITUTIONAL: { email: 'vikram.singhania@kolkata-prop.in', password: 'demo1234' }
    };

    const cred = demoCredentials[userType];
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${getApiBase()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cred.email, password: cred.password, mpin: '1234' })
      });

      const data = await safeFetchJson(res, { success: false });
      if (res.ok && data?.success && data?.user) {
        login(data.user);
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setError(data?.error || 'Failed to authenticate demo profile');
      }
    } catch (e: any) {
      setError(e.message || 'Network error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] flex flex-col justify-between selection:bg-[#00B386]/20 selection:text-[#00B386]">
      {/* Top Simple Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#E8E8E8] dark:border-white/10 bg-white dark:bg-[#121212]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00B386] via-[#00c997] to-[#10b981] flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-lg font-black text-[#44475B] dark:text-white tracking-tight">
            OrderPulse
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white transition"
        >
          Back to Home
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#141414] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-in space-y-6">
          {/* Title & Badge */}
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] text-[11px] font-mono font-semibold border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simulated Trading Access</span>
            </div>
            <h1 className="text-2xl font-black text-[#44475B] dark:text-white tracking-tight">
              Sign In to OrderPulse
            </h1>
            <p className="text-xs text-[#7C7E8C] dark:text-neutral-400">
              Real-time FIFO order matching with instant wallet settlement
            </p>
          </div>

          {/* Tab: Password vs Mobile OTP */}
          <div className="grid grid-cols-2 p-1 bg-neutral-100 dark:bg-white/5 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('PASSWORD');
                setError(null);
              }}
              className={`py-2 rounded-lg transition cursor-pointer ${
                authMode === 'PASSWORD'
                  ? 'bg-white dark:bg-neutral-800 text-[#44475B] dark:text-white shadow-sm'
                  : 'text-[#7C7E8C] hover:text-black dark:hover:text-white'
              }`}
            >
              Email & Password
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('OTP');
                setError(null);
              }}
              className={`py-2 rounded-lg transition cursor-pointer ${
                authMode === 'OTP'
                  ? 'bg-white dark:bg-neutral-800 text-[#44475B] dark:text-white shadow-sm'
                  : 'text-[#7C7E8C] hover:text-black dark:hover:text-white'
              }`}
            >
              Mobile OTP
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-[#00B386] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Authenticated successfully. Redirecting to Dashboard...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
            {authMode === 'PASSWORD' ? (
              <>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-neutral-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. aarav.sharma@orderpulse.exchange"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#00B386] transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-700 dark:text-neutral-300">
                      Password
                    </label>
                    <span className="text-[11px] text-[#00B386] hover:underline cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#00B386] transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-neutral-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-neutral-300">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <div className="px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 font-mono">
                      +91
                    </div>
                    <div className="relative flex-1">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-[#00B386] transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                {otpSent && (
                  <div className="space-y-1.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-slate-700 dark:text-neutral-300">
                        Enter 6-Digit OTP
                      </label>
                      <span className="text-[11px] text-[#00B386] font-mono">Pre-filled</span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="584291"
                      className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white text-center font-mono tracking-widest text-base focus:outline-none focus:border-[#00B386] transition"
                      required
                    />
                  </div>
                )}

                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 font-semibold text-slate-700 dark:text-neutral-200 transition cursor-pointer"
                  >
                    Send OTP to Mobile
                  </button>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Credentials Info Tip */}
          <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-white/10 text-[11px] text-[#7C7E8C] space-y-1">
            <div className="font-semibold text-slate-700 dark:text-neutral-200 flex items-center justify-between">
              <span>Existing Verified Accounts</span>
              <span className="font-mono text-[#00B386] font-bold">PIN: 1234 • Pass: demo1234</span>
            </div>
            <div className="text-[10px]">
              • Use your registered email & PIN/password, or any verified test profile below.
            </div>
          </div>

          {/* Quick Demo Test Profiles */}
          <div className="pt-2 border-t border-[#F0F0F0] dark:border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#7C7E8C]">
              <span>1-Click Test Profiles</span>
              <Sparkles className="w-3.5 h-3.5 text-[#00B386]" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('AARAV')}
                className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-[#00B386] bg-neutral-50 dark:bg-neutral-900/40 text-left transition cursor-pointer"
              >
                <div className="font-bold text-[11px] text-[#44475B] dark:text-white truncate">
                  Aarav S.
                </div>
                <div className="text-[10px] text-[#7C7E8C]">Pro Trader</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('PRIYA')}
                className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-[#00B386] bg-neutral-50 dark:bg-neutral-900/40 text-left transition cursor-pointer"
              >
                <div className="font-bold text-[11px] text-[#44475B] dark:text-white truncate">
                  Priya P.
                </div>
                <div className="text-[10px] text-[#7C7E8C]">Market Maker</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('INSTITUTIONAL')}
                className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 hover:border-[#00B386] bg-neutral-50 dark:bg-neutral-900/40 text-left transition cursor-pointer"
              >
                <div className="font-bold text-[11px] text-[#44475B] dark:text-white truncate">
                  Vikram S.
                </div>
                <div className="text-[10px] text-[#7C7E8C]">Desk Lead</div>
              </button>
            </div>
          </div>

          {/* Don't have an account */}
          <div className="text-center text-xs text-[#7C7E8C]">
            <span>Don't have an account? </span>
            <Link to="/signup" className="font-bold text-[#00B386] hover:underline">
              Sign up for free
            </Link>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-neutral-500 border-t border-[#E8E8E8] dark:border-white/10">
        OrderPulse MTX 2026 • Simulated Stock Broking & Exchange Platform
      </footer>
    </div>
  );
};
