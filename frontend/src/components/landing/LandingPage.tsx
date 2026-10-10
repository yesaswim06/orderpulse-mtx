import React from 'react';
import { TopMarketTicker } from './TopMarketTicker';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import {
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* 1. Top Market Ticker */}
      <TopMarketTicker />

      {/* 2. Responsive Navigation Bar */}
      <LandingNavbar />

      {/* 3. Hero Section with 3D Isometric Fintech City */}
      <HeroSection />

      {/* 4. Core Technology Highlights Section */}
      <section id="technology" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold font-sans uppercase tracking-widest text-emerald-600 mb-2">
              ENGINEERING SPECIFICATION
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight">
              Institutional Core Architecture
            </h3>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Designed for extreme throughput and deterministic price-time priority execution under high-frequency market stress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#0a192f] mb-2">2.1 µs Median Matching</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic C++20 memory layouts, lock-free ring buffers, and sub-microsecond FIFO order matching with O(1) cancel time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-teal-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#0a192f] mb-2">±5% Volatility Circuit Breakers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Autonomous pre-fill price band validation. Violating candidate trades are rejected prior to execution, triggering a 30-second cooling pause.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-[#0a192f] mb-2">Dual Database Persistence</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ACID transactional ledger in Railway MySQL, document audit trail in MongoDB Atlas, and zero-wait async queuing on the hot-path.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Conversion Call to Action */}
      <section className="py-20 bg-[#0a192f] text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Ready to test institutional order matching?
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Access the simulated continuous auction order book, trigger price shock scenarios, and query live database records.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all"
            >
              Sign Up for Free Account
            </Link>
            <Link
              to="/trade"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Enter Trading Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="py-8 bg-[#060e1d] border-t border-white/[0.08] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-300">OrderPulse MTX 2026</span>
            <span>• Trading Simulation Platform</span>
          </div>
          <div>
            Built for MTX Hackathon 2026 • Single Symbol Continuous Auction Engine (DEMO)
          </div>
        </div>
      </footer>
    </div>
  );
};
