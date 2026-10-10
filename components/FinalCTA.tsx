"use client";

import React from "react";
import { ArrowRight, Terminal, Layers } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 px-4 max-w-5xl mx-auto w-full text-center relative overflow-hidden">
      {/* Radial spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-b from-emerald-500/[0.08] to-transparent blur-3xl rounded-full"
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          See Every Trade. <br />
          <span className="text-gradient-fade">Understand Every Decision.</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#9CA3AF] max-w-xl mx-auto leading-relaxed">
          Explore deterministic matching, visible safety controls, and measured performance in the OrderPulse trading simulation.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#terminal-demo"
            className="shimmer-sweep w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch Trading Terminal</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </a>

          <a
            href="#architecture"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#101010] hover:bg-[#151515] border border-white/10 hover:border-white/20 text-[#E5E7EB] font-semibold text-xs sm:text-sm active:scale-95 transition-all"
          >
            <Layers className="w-4 h-4 text-neutral-400" />
            <span>Review Architecture</span>
          </a>
        </div>
      </div>
    </section>
  );
}
