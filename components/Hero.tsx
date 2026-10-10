"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Layers, ShieldCheck, Zap, Terminal } from "lucide-react";
import { SITE_CONFIG, CAPABILITY_BADGES } from "@/lib/data";

export default function Hero() {
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 flex flex-col items-center text-center px-4 max-w-5xl mx-auto overflow-hidden">
      {/* Background radial spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[650px] h-[400px] bg-gradient-to-b from-emerald-500/[0.08] via-white/[0.03] to-transparent blur-3xl rounded-full"
      />

      {/* Eyebrow badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A0A0A] border border-white/10 text-xs text-[#9CA3AF] mb-6 shadow-sm backdrop-blur-md"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono font-semibold tracking-wider uppercase text-[11px] text-emerald-400">
          {SITE_CONFIG.eyebrow}
        </span>
      </motion.div>

      {/* Staggered headline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]"
        >
          <span className="block text-gradient-fade">{SITE_CONFIG.headlineFirst}</span>
          <span className="block text-gradient-subtle mt-1">{SITE_CONFIG.headlineSecond}</span>
        </motion.h1>

        {/* Supporting copy */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-sm sm:text-base md:text-lg text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed"
        >
          {SITE_CONFIG.description}
        </motion.p>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mt-8 w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <a
          href="#terminal-demo"
          className="shimmer-sweep w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-[0_0_25px_-5px_rgba(16,185,129,0.35)] active:scale-95 transition-all"
        >
          <Terminal className="w-4 h-4" />
          <span>Open Live Demo</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </a>

        <a
          href="#architecture"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#101010] hover:bg-[#151515] border border-white/10 hover:border-white/20 text-[#E5E7EB] font-semibold text-xs sm:text-sm active:scale-95 transition-all"
        >
          <Layers className="w-4 h-4 text-neutral-400" />
          <span>Explore Architecture</span>
        </a>
      </motion.div>

      {/* 3 Capability Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="mt-14 w-full grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl"
      >
        {CAPABILITY_BADGES.map((badge, idx) => (
          <div
            key={badge.title}
            className="p-4 rounded-2xl bg-[#0A0A0A]/80 border border-white/10 flex flex-col items-center text-center shadow-inner hover:border-white/20 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-1">
              {idx === 0 && <Zap className="w-3.5 h-3.5 text-emerald-400" />}
              {idx === 1 && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
              {idx === 2 && <Layers className="w-3.5 h-3.5 text-sky-400" />}
              <span>{badge.title}</span>
            </div>
            <span className="text-[11px] text-[#737373]">{badge.subtitle}</span>
            <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-neutral-300 border border-white/[0.08]">
              {badge.highlight}
            </span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
