"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/data";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 px-4 max-w-4xl mx-auto w-full">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-xs text-neutral-400 mb-3">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono uppercase tracking-wider text-[11px]">Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Clear Answers & Mechanics
        </h2>
        <p className="mt-3 text-sm text-[#9CA3AF] leading-relaxed">
          Technical insights into price-time matching rules, pre-execution volatility checks, and demo simulation boundaries.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {FAQ_ITEMS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0A0A0A] border border-white/10 overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span className="text-sm font-bold text-white">{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-emerald-400" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-[#9CA3AF] leading-relaxed border-t border-white/[0.04] pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
