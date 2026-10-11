import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  BarChart3,
  Server,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { HomeNavbar } from './components/HomeNavbar';
import { LiveIndicesTicker } from './components/LiveIndicesTicker';
import { EngineSimulatorCard } from './components/EngineSimulatorCard';
import { CircuitBreakerVisualizer } from './components/CircuitBreakerVisualizer';
import { TopStocksBoard } from './components/TopStocksBoard';
import { DatabaseAuditBadge } from './components/DatabaseAuditBadge';
import { useAuth } from '../../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] font-sans selection:bg-[#00B386]/20 selection:text-[#00B386] transition-colors">
      {/* 1. Clean, Minimal, Coded Home Navigation Bar (Sticky Top) */}
      <HomeNavbar />

      {/* 2. Live Market Indices Ticker Strip */}
      <LiveIndicesTicker />

      {/* 3. Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 text-center space-y-6">
          {/* Micro Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00B386] animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#00B386]">
              MTX HACKATHON 2026 • HIGH-FREQUENCY EXCHANGE ARCHITECTURE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-[#44475B] dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Trade Faster. <br className="hidden sm:inline" />
            Trade Smarter. <span className="text-[#00B386]">Trade Safer.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#7C7E8C] dark:text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed">
            OrderPulse combines an ultra-low latency C++20 FIFO matching sequencer with autonomous ±5.0% volatility circuit breakers, persistent PostgreSQL WAL ledgers, and a modern Indian brokerage experience.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white font-bold text-xs shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter Your Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white font-bold text-xs shadow-sm hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Free Demat Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}

            <Link
              to="/stocks/user/explore"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-neutral-200 dark:border-white/10 hover:border-[#00B386] text-xs font-bold text-[#44475B] dark:text-white hover:text-[#00B386] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Stock Markets</span>
            </Link>

            <Link
              to="/trade"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 text-xs font-mono font-bold text-slate-800 dark:text-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-[#00B386]" />
              <span>Matching Terminal</span>
            </Link>
          </div>

          {/* Quick Benchmark Chips */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-mono">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
              <Zap className="w-3.5 h-3.5 text-[#00B386]" />
              <span>Matching: <strong className="text-slate-900 dark:text-white">2.1 µs (p50)</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>Safety Collar: <strong className="text-slate-900 dark:text-white">±5.0% Pre-Fill</strong></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10">
              <Server className="w-3.5 h-3.5 text-purple-500" />
              <span>Dual DB: <strong className="text-slate-900 dark:text-white">PostgreSQL + MongoDB</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Main Feature Sections */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pb-24 space-y-16">
        {/* Interactive Feature 1: Matching Engine Simulator */}
        <EngineSimulatorCard />

        {/* Interactive Feature 2: Volatility Circuit Breaker Visualizer */}
        <CircuitBreakerVisualizer />

        {/* Feature 3: Liquid Indian Equities Board */}
        <TopStocksBoard />

        {/* Feature 4: Dual Database Persistence Live Verifier */}
        <DatabaseAuditBadge />
      </main>

      {/* 5. Minimal Coded Footer */}
      <footer className="border-t border-[#E8E8E8] dark:border-white/10 py-10 bg-neutral-50 dark:bg-[#121212] text-xs text-[#7C7E8C]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-[#00B386] flex items-center justify-center text-white">
              <Zap className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-bold text-[#44475B] dark:text-white">OrderPulse</span>
            <span>• Built for MTX Hackathon 2026</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link to="/stocks/user/explore" className="hover:text-[#00B386] transition">Stocks</Link>
            <Link to="/dashboard" className="hover:text-[#00B386] transition">Dashboard</Link>
            <Link to="/trade" className="hover:text-[#00B386] transition">Matching Terminal</Link>
            <Link to="/about" className="hover:text-[#00B386] transition">About Us</Link>
            <Link to="/contact" className="hover:text-[#00B386] transition">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
