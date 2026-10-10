"use client";

import React from "react";
import { FEATURE_CARDS } from "@/lib/data";
import { Cpu, ShieldCheck, Activity, BarChart2, Check } from "lucide-react";

export default function FeatureGrid() {
  const icons = [
    <Cpu key="cpu" className="w-5 h-5 text-emerald-400" />,
    <ShieldCheck key="shield" className="w-5 h-5 text-amber-400" />,
    <Activity key="activity" className="w-5 h-5 text-sky-400" />,
    <BarChart2 key="chart" className="w-5 h-5 text-purple-400" />,
  ];

  return (
    <section id="features" className="py-20 px-4 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 mb-2">
          CORE CAPABILITIES
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Precision Engineering Standards
        </h3>
        <p className="mt-3 text-sm text-[#9CA3AF] leading-relaxed">
          Combining deterministic matching algorithms with pre-trade risk controls and hardware-level performance monitoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURE_CARDS.map((card, idx) => (
          <div
            key={card.id}
            className="p-7 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5">
                {icons[idx]}
              </div>
              <h4 className="text-lg font-bold text-white mb-1">{card.title}</h4>
              <span className="text-xs font-mono text-[#737373] block mb-3">{card.subtitle}</span>
              <p className="text-xs text-[#9CA3AF] leading-relaxed mb-6">{card.description}</p>
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex flex-wrap gap-2">
              {card.highlights.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-white/[0.03] text-neutral-300 border border-white/[0.06]"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>{h}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
