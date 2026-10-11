import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiBase, safeFetchJson } from '../../config/api';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pan, setPan] = useState('ABCDE1234F');
  const [mpin, setMpin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, login } = useAuth();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim()) {
      setError('Full Name and Email are required.');
      return;
    }

    if (!mpin || mpin.length < 4) {
      setError('Please create a 4-digit security PIN or password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${getApiBase()}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          pan: pan.trim().toUpperCase(),
          mpin,
          password: mpin
        })
      });

      const data = await safeFetchJson(res, { success: false, error: 'Server returned empty response' });

      if (res.ok && data?.success && data?.user) {
        login(data.user);
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 800);
      } else {
        setError(data?.error || 'Registration failed. An account with this email may already exist.');
      }
    } catch (e: any) {
      setError(e.message || 'Network error connecting to registration server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] flex flex-col justify-between selection:bg-[#00B386]/20 selection:text-[#00B386]">
      {/* Top Header */}
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
          to="/login"
          className="text-xs font-semibold text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white transition"
        >
          Already have an account? Sign In
        </Link>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#141414] border border-[#E8E8E8] dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm animate-fade-in space-y-6">
          <div className="space-y-1.5 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] text-[11px] font-mono font-semibold border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simulated Demat Account</span>
            </div>
            <h1 className="text-2xl font-black text-[#44475B] dark:text-white tracking-tight">
              Open Trading Account
            </h1>
            <p className="text-xs text-[#7C7E8C] dark:text-neutral-400">
              Instant activation with ₹0.00 wallet balance • Deposit funds anytime
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/20 text-[#00B386] text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Account activated! Opening Dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4 text-xs font-sans">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-neutral-300">
                Full Name (as per PAN)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#00B386] transition"
                  required
                />
              </div>
            </div>

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
                  placeholder="e.g. aarav.sharma@domain.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white focus:outline-none focus:border-[#00B386] transition"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-neutral-300">
                  Simulated PAN
                </label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    maxLength={10}
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-[#00B386] transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-neutral-300">
                  4-Digit PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    maxLength={4}
                    value={mpin}
                    onChange={(e) => setMpin(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 text-slate-900 dark:text-white font-mono tracking-widest text-center focus:outline-none focus:border-[#00B386] transition"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-[11px] text-[#7C7E8C] space-y-1">
              <div className="font-bold text-slate-700 dark:text-neutral-300 flex items-center justify-between">
                <span>Initial Wallet Balance</span>
                <span className="text-[#00B386] font-mono">₹0.00</span>
              </div>
              <div>• Deposit capital anytime via instant UPI, Netbanking, or Debit Card.</div>
              <div>• Real-time C++20 FIFO Continuous Auction Matching engine.</div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <span>{loading ? 'Activating Account...' : 'Open Free Demat Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-[#7C7E8C]">
            <span>Already registered? </span>
            <Link to="/login" className="font-bold text-[#00B386] hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-400 dark:text-neutral-500 border-t border-[#E8E8E8] dark:border-white/10">
        OrderPulse MTX 2026 • Simulated Stock Broking & Exchange Platform
      </footer>
    </div>
  );
};
