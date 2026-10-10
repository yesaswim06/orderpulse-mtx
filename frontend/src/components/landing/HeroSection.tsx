import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Zap,
  ShieldCheck,
  Cpu,
  TrendingUp,
  Activity,
  Layers,
  Database,
  BarChart3,
  Server
} from 'lucide-react';

interface HeroSectionProps {
  onOpenDemo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDemo }) => {
  return (
    <section className="relative pt-12 pb-24 overflow-hidden bg-white">
      {/* Background Soft Lighting Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-40">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-200/50 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Micro Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 mb-6 shadow-sm hover:scale-105 transition-transform cursor-default">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold font-sans uppercase tracking-wider text-emerald-800">
            MTX HACKATHON 2026 • ULTRA-LOW LATENCY MATCHING ENGINE
          </span>
        </div>

        {/* Large Centered Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#0a192f] tracking-tight max-w-4xl mx-auto leading-[1.1]">
          Grow Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500">Trading Edge</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Ultra-Low Latency Order Matching with Real-Time Market Safety Controls. Built with C++20 Price-Time Priority and Autonomous ±5% Volatility Circuit Breakers.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/stocks/user/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-xl shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:-translate-y-0.5 group cursor-pointer"
          >
            <span>Get Started (Explore Stocks)</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/trade"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg shadow-slate-950/20 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Live Terminal</span>
          </Link>
        </div>

        {/* Live Performance Chips */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>Matching Latency: <strong className="text-[#0a192f]">2.1 µs (p50)</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
            <span>Collar Band: <strong className="text-[#0a192f]">±5.0% Pre-Fill Check</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
            <Server className="w-3.5 h-3.5 text-purple-500" />
            <span>Dual Database: <strong className="text-[#0a192f]">MySQL + MongoDB</strong></span>
          </div>
        </div>

        {/* 3D Isometric Financial City Graphic */}
        <div className="mt-12 relative max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/15 border-4 border-white bg-slate-50">
            <img
              src="/fintech_city.jpg"
              alt="OrderPulse Futuristic Isometric Financial City"
              className="w-full h-auto object-cover max-h-[580px] rounded-2xl transform hover:scale-[1.01] transition-transform duration-700"
            />
            {/* Ambient Lighting Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none" />
            
            {/* Live Holographic Floating Overlay Badge */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-lg text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0a192f]">OrderPulse Exchange HQ Simulation</h4>
                  <p className="text-xs text-slate-500">
                    High-frequency order routing, price-time priority FIFO match queues, and PostgreSQL/MySQL replication
                  </p>
                </div>
              </div>
              <Link
                to="/trade"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shrink-0 shadow-md transition"
              >
                View Live Book →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
