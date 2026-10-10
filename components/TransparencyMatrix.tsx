"use client";

import React from "react";
import { Check, ArrowRight, Cpu, ShieldCheck, Activity } from "lucide-react";
import { TRANSPARENCY_COMPARISON } from "@/lib/data";

export default function TransparencyMatrix() {
  const cards = [
    {
      title: "Matching Engine",
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      features: [
        "Price-time priority (strict FIFO)",
        "Partial fills & residual resting queues",
        "Deterministic O(1) order cancellation",
        "Monotonic sequence counter numbering",
      ],
      link: "#terminal-demo",
      cta: "Test Matching in Terminal →",
    },
    {
      title: "Circuit Breaker",
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      features: [
        "Configurable ±5% dynamic price bands",
        "Pre-commit candidate execution validation",
        "Automated 30-second cooldown timer",
        "Audited manual operator resume controls",
      ],
      link: "#terminal-demo",
      cta: "Trigger Circuit Breaker →",
    },
    {
      title: "Observability",
      icon: <Activity className="w-5 h-5 text-sky-400" />,
      features: [
        "Real-time WebSocket event streaming",
        "Trade executions & WAL audit logs",
        "Hardware-level microsecond percentiles",
        "Four repeatable market stress scenarios",
      ],
      link: "#performance",
      cta: "Inspect Latency Metrics →",
    },
  ];

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 mb-2">
          SYSTEM VERIFIABILITY
        </h2>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Built for Transparency
        </h3>
        <p className="mt-3 text-sm text-[#9CA3AF] leading-relaxed">
          Unlike opaque proprietary matching engines, every decision, queue order, and circuit breaker trip in OrderPulse is fully observable.
        </p>
      </div>

      {/* 3 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {cards.map((c) => (
          <div
            key={c.title}
            className="p-7 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-5">
                {c.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-4">{c.title}</h4>
              <ul className="space-y-2.5 mb-6 text-xs text-[#9CA3AF]">
                {c.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={c.link}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 pt-3 border-t border-white/[0.06]"
            >
              <span>{c.cta}</span>
            </a>
          </div>
        ))}
      </div>

      {/* Comparison Matrix Table */}
      <div className="p-6 rounded-3xl bg-[#0A0A0A] border border-white/10 overflow-x-auto shadow-xl">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Architectural Differentiation
        </h4>
        <table className="w-full text-left text-xs min-w-[550px]">
          <thead>
            <tr className="border-b border-white/[0.08] text-[10px] text-neutral-500 uppercase">
              <th className="pb-3 w-1/4">Aspect</th>
              <th className="pb-3 w-3/8 text-neutral-400">Typical Exchange Infrastructure</th>
              <th className="pb-3 w-3/8 text-emerald-400">OrderPulse Simulation Focus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {TRANSPARENCY_COMPARISON.map((row) => (
              <tr key={row.aspect} className="hover:bg-white/[0.02]">
                <td className="py-3 font-semibold text-white">{row.aspect}</td>
                <td className="py-3 text-neutral-400">{row.traditional}</td>
                <td className="py-3 text-neutral-200 font-medium">{row.orderPulse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
