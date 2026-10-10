"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TradingTerminalLive from "@/components/TradingTerminalLive";
import FeatureGrid from "@/components/FeatureGrid";
import Architecture from "@/components/Architecture";
import EngineeringPrinciples from "@/components/EngineeringPrinciples";
import TransparencyMatrix from "@/components/TransparencyMatrix";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-[#E5E7EB] selection:bg-emerald-500/20 selection:text-white flex flex-col items-center">
      {/* 1. Floating Sticky Navbar */}
      <Navbar />

      <main className="w-full flex flex-col items-center">
        {/* 2. Hero Section */}
        <Hero />

        {/* 3. Centerpiece Live Trading Terminal Preview */}
        <section id="terminal-demo" className="w-full max-w-7xl px-4 py-8 mb-16 scroll-mt-24">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-transparent shadow-2xl">
            <div className="p-5 sm:p-6 rounded-[22px] bg-[#080808]">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <span>OrderPulse Real-Time Trading Terminal</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Live Simulation
                    </span>
                  </h2>
                  <p className="text-xs text-[#9CA3AF]">
                    In-memory C++20 matching engine with pre-commit volatility circuit breaker checks.
                  </p>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 self-start sm:self-auto">
                  Symbol: <span className="text-white font-bold">DEMO</span> · Tick Size: <span className="text-white font-bold">₹0.05</span>
                </div>
              </div>

              {/* Full interactive terminal */}
              <TradingTerminalLive />
            </div>
          </div>
        </section>

        {/* 4. Core Features Bento Grid */}
        <FeatureGrid />

        {/* 5. System Architecture Section */}
        <Architecture />

        {/* 6. Engineering Principles (replacing testimonials) */}
        <EngineeringPrinciples />

        {/* 7. Built For Transparency (replacing pricing) */}
        <TransparencyMatrix />

        {/* 8. FAQ Accordion */}
        <FAQ />

        {/* 9. Final CTA */}
        <FinalCTA />
      </main>

      {/* 10. Comprehensive Footer */}
      <Footer />
    </div>
  );
}
