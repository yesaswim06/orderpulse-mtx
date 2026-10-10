"use client";

import React from "react";
import { Zap } from "lucide-react";
import { SITE_CONFIG } from "@/lib/data";

export default function Footer() {
  const GITHUB_REPO_URL = "https://github.com/yesaswim06/orderpulse-mtx.git";

  return (
    <footer className="w-full bg-[#030303] border-t border-white/[0.08] text-xs text-[#737373] py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-white/20 bg-neutral-900 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">
                  {SITE_CONFIG.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {SITE_CONFIG.hackathon}
                </span>
              </div>
              <span className="text-[11px] text-[#737373]">{SITE_CONFIG.title}</span>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#architecture" className="hover:text-white transition">Architecture</a>
            <a href="#terminal-demo" className="hover:text-white transition">Live Terminal</a>
            <a href="#performance" className="hover:text-white transition">Performance</a>
            <a href="#faq" className="hover:text-white transition">Testing</a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition text-emerald-400"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Required Disclaimer Notice */}
        <div className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 leading-relaxed text-center sm:text-left">
          <p>
            OrderPulse is an educational trading simulation. It does not execute real exchange orders. Circuit-breaker parameters are demonstration settings, not official exchange rules.
          </p>
          <p className="shrink-0 font-mono">
            MTX Hackathon 2026 · Single-Symbol Continuous Auction
          </p>
        </div>
      </div>
    </footer>
  );
}
