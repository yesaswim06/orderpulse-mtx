import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  CreditCard,
  KeyRound
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [password, setPassword] = useState('');
  const [mpin, setMpin] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      const newUser = {
        userId: `USER-IN-${Math.floor(1000 + Math.random() * 9000)}`,
        name: fullName.trim(),
        email: email.trim(),
        mobile: '+91 ' + mobile.trim(),
        pan: panNumber.toUpperCase().trim(),
        mpin,
        role: 'PRO_TRADER',
        isDemo: true,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem('orderpulse_user', JSON.stringify(newUser));
      window.dispatchEvent(new Event('orderpulse_auth_change'));

      setTimeout(() => {
        navigate('/stocks/user/explore');
      }, 800);
    }, 600);
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
          Create Trading & Demat Account
        </h2>
        <p className="text-xs text-[#7C7E8C]">
          Instant KYC verification with ₹10,00,000 simulated trading margin
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
              <span>Demat Account provisioned! Opening trading floor...</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                Full Name (as per PAN Card) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#7C7E8C] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7C7E8C] absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav.sharma@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                  Mobile (+91)
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                  PAN Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386] font-mono uppercase"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full px-3 pr-8 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-[#7C7E8C]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                  4-Digit MPIN *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value)}
                  placeholder="1234"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386] font-mono text-center tracking-widest"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00B386] shrink-0" />
              <span className="text-[11px] text-[#7C7E8C] dark:text-neutral-400 font-mono">
                Initial Account Credit: ₹10,00,000 Virtual Trading Capital
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{loading ? 'Registering Account...' : 'Open Demat & Trading Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-xs text-[#7C7E8C]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#00B386] hover:underline">
                Sign in here
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
