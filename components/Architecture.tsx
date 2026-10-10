"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Database, Network, ShieldCheck, Terminal, Layers } from "lucide-react";

export default function Architecture() {
  const components = [
    {
      title: "Interactive Trading UI",
      tech: "Next.js + Tailwind",
      icon: <Terminal className="w-5 h-5 text-emerald-400" />,
      desc: "Client-side dashboard displaying Level-2 order books, real-time depth, latency percentiles, and scenario triggers.",
    },
    {
      title: "Gateway & Sequencer",
      tech: "HTTP + WebSocket",
      icon: <Network className="w-5 h-5 text-sky-400" />,
      desc: "Assigns monotonic sequence IDs, ensures client idempotency via request keys, and handles resync on dropped packets.",
    },
    {
      title: "In-Memory Engine",
      tech: "C++20 FIFO Matching",
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      desc: "Zero-allocation matching loop executing orders by price-time priority with O(1) cancellations in 2.1 µs median latency.",
    },
    {
      title: "Volatility Breaker",
      tech: "±5% Pre-Check Collar",
      icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
      desc: "Validates every candidate fill before commitment; off-band trades trip a 30s halt while safely preserving earlier valid fills.",
    },
    {
      title: "Dual Persistence",
      tech: "Railway MySQL + Atlas",
      icon: <Database className="w-5 h-5 text-teal-400" />,
      desc: "ACID transactional balance ledger in MySQL and append-only tamper-evident audit trail in MongoDB Atlas.",
    },
  ];

  return (
    <section id="architecture" className="py-20 px-4 max-w-6xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs text-neutral-400 mb-3">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono uppercase tracking-wider text-[11px]">System Architecture</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Engineered for Determinism & Safety
        </h2>
        <p className="mt-3 text-sm text-[#9CA3AF] leading-relaxed">
          Isolation between the microsecond matching loop and asynchronous database writes ensures zero-compromise execution under market stress.
        </p>
      </div>

      {/* Grid of 5 components */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {components.map((comp, idx) => (
          <div
            key={comp.title}
            className="p-5 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  {comp.icon}
                </div>
                <span className="text-[10px] font-mono font-bold text-neutral-500">0{idx + 1}</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{comp.title}</h3>
              <span className="text-[10px] font-mono text-emerald-400 block mb-2">{comp.tech}</span>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">{comp.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
