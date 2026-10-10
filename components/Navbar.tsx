"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Zap, Activity } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/data";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className={`pointer-events-auto w-full max-w-6xl mx-auto rounded-full transition-all duration-300 backdrop-blur-xl px-4 py-2.5 flex items-center justify-between ${
          isScrolled
            ? "bg-[#0A0A0A]/90 border border-white/15 shadow-2xl shadow-black/80"
            : "bg-[#0A0A0A]/70 border border-white/10 shadow-lg shadow-black/40"
        }`}
      >
        {/* Brand Logo & Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-full py-1 pr-2"
          onClick={closeMenu}
        >
          <div className="relative w-8 h-8 rounded-full border border-white/20 bg-neutral-900 flex items-center justify-center shadow-inner group-hover:border-emerald-500/50 transition-colors">
            <Zap className="w-4 h-4 text-emerald-400" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold tracking-tight text-[#E5E7EB] group-hover:text-white transition-colors">
              {SITE_CONFIG.name}
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              MTX 2026
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium text-[#9CA3AF] hover:text-[#E5E7EB] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md px-1 py-0.5"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <a
            href="#terminal-demo"
            className="hidden md:inline-flex items-center gap-2 text-xs font-semibold text-white bg-neutral-900/90 border border-white/15 px-4 py-2 rounded-full hover:border-emerald-500/40 hover:bg-neutral-800 transition-all shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)] active:scale-95"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Trading Terminal</span>
          </a>

          {/* Hamburger Icon for Mobile */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-[#E5E7EB] hover:text-white bg-neutral-900/80 border border-white/10 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown / Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto fixed top-20 inset-x-4 max-w-sm mx-auto z-40 bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl shadow-black flex flex-col gap-5 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.2 }}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-white hover:bg-neutral-900/60 transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-600" />
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: NAV_LINKS.length * 0.05, duration: 0.2 }}
              className="pt-2 border-t border-white/10"
            >
              <a
                href="#terminal-demo"
                onClick={closeMenu}
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-emerald-500/10 border border-emerald-500/30 py-3 rounded-full hover:bg-emerald-500/20 transition-all shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] active:scale-[0.98]"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Open Trading Terminal</span>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
