import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Zap,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
  Shield,
  Activity,
  Layers
} from 'lucide-react';

interface LandingNavbarProps {
  onOpenDemo?: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({ onOpenDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white stroke-[2.4]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#0a192f] tracking-tight flex items-center gap-1.5">
                OrderPulse
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  MTX
                </span>
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase">
                Matching Engine
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-semibold text-[#0a192f] hover:text-emerald-600 transition"
            >
              Home
            </Link>
            <Link
              to="/trade"
              className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Trading Terminal</span>
            </Link>
            <a
              href="#technology"
              className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition"
            >
              Technology
            </a>
            <a
              href="#features"
              className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition"
            >
              Features
            </a>
            <a
              href="#circuit-breaker"
              className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition flex items-center gap-1"
            >
              <Shield className="w-4 h-4 text-teal-500" />
              <span>Circuit Breakers</span>
            </a>
          </nav>

          {/* Right: Auth & CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-bold text-[#0a192f] hover:text-emerald-600 px-4 py-2 rounded-xl transition"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-6 py-2.5 rounded-full shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/35 hover:-translate-y-0.5"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/trade"
              className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200"
            >
              Terminal
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-[#0a192f] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3 animate-fade-in shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-[#0a192f]"
          >
            Home
          </Link>
          <Link
            to="/trade"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-emerald-600"
          >
            Trading Terminal
          </Link>
          <a
            href="#technology"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-600"
          >
            Technology
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-slate-600"
          >
            Features
          </a>
          <div className="pt-4 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-bold text-[#0a192f] bg-slate-100 rounded-xl"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-bold text-white bg-emerald-500 rounded-full shadow-md"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
