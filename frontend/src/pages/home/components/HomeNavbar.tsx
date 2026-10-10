import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  Shield,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const HomeNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-md border-b border-[#E8E8E8] dark:border-white/10 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00B386] via-[#00c997] to-[#10b981] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-[#44475B] dark:text-white tracking-tight flex items-center gap-1.5">
                OrderPulse
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] border border-emerald-500/20">
                  MTX
                </span>
              </span>
              <span className="text-[10px] font-bold text-[#00B386] tracking-wider uppercase">
                Matching Engine · C++20 FIFO
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold">
            <a
              href="#simulator"
              className="text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white transition"
            >
              Matching Simulator
            </a>
            <a
              href="#circuit-breaker"
              className="text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white transition"
            >
              ±5% Circuit Breaker
            </a>
            <a
              href="#markets"
              className="text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white transition"
            >
              Live Markets
            </a>
            <Link
              to="/stocks/user/explore"
              className="text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white transition"
            >
              Stocks
            </Link>
            <Link
              to="/about"
              className="text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white transition"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-[#7C7E8C] dark:text-neutral-400 hover:text-[#44475B] dark:hover:text-white transition"
            >
              Contact
            </Link>
            <Link
              to="/trade"
              className="text-[#00B386] font-bold hover:text-[#009e75] transition flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Matching Terminal</span>
            </Link>
          </nav>

          {/* Right: Authentication Aware Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Go to Dashboard</span>
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#00B386]" />
                  <span className="font-bold text-slate-800 dark:text-neutral-200 truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-full text-[#7C7E8C] hover:text-[#EB5B3C] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-bold text-[#44475B] dark:text-white hover:text-[#00B386] transition"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold shadow-sm hover:scale-105 transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/trade"
              className="text-xs font-bold text-[#00B386] bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/20"
            >
              Terminal
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#141414] border-b border-[#E8E8E8] dark:border-white/10 px-6 pt-3 pb-6 space-y-3 text-xs animate-fade-in shadow-xl">
          <Link
            to="/stocks/user/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-semibold text-[#44475B] dark:text-white"
          >
            Stocks & Markets
          </Link>
          <a
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-semibold text-[#7C7E8C] dark:text-neutral-400"
          >
            Matching Simulator
          </a>
          <a
            href="#circuit-breaker"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-semibold text-[#7C7E8C] dark:text-neutral-400"
          >
            ±5% Volatility Collar
          </a>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-semibold text-[#7C7E8C] dark:text-neutral-400"
          >
            About Architecture
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-semibold text-[#7C7E8C] dark:text-neutral-400"
          >
            Contact & Support
          </Link>
          <Link
            to="/trade"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-bold text-[#00B386]"
          >
            Trading Terminal
          </Link>

          <div className="pt-3 border-t border-[#F0F0F0] dark:border-white/10 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-[#00B386] text-white font-bold"
                >
                  Enter Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-rose-500 font-semibold"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 font-bold text-[#44475B] dark:text-white"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-[#00B386] text-white font-bold"
                >
                  Sign up for Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
