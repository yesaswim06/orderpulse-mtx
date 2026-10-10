"use client";

import React from "react";
import { ENGINEERING_PRINCIPLES } from "@/lib/data";
import { ShieldCheck, Target, Eye, Gauge } from "lucide-react";

export default function EngineeringPrinciples() {
  const icons = [
    <Target key="target" className="w-4 h-4 text-emerald-400" />,
    <ShieldCheck key="shield" className="w-4 h-4 text-amber-400" />,
    <Eye key="eye" className="w-4 h-4 text-sky-400" />,
    <Gauge key="gauge" className="w-4 h-4 text-purple-400" />,
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 mb-2">
          FOUNDATIONAL VALUES
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Engineering Principles
        </h3>
        <p className="mt-3 text-sm text-[#9CA3AF] leading-relaxed">
          Verifiable design goals governing matching logic, fault boundaries, and system telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ENGINEERING_PRINCIPLES.map((principle, idx) => (
          <div
            key={principle.title}
            className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  {icons[idx]}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] text-neutral-400 border border-white/[0.06]">
                  {principle.tag}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{principle.title}</h4>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">{principle.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
