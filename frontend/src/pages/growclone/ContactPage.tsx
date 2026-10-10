import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Building2,
  Terminal
} from 'lucide-react';
import { IndexTickerStrip } from '../../components/growclone/IndexTickerStrip';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'How does the simulated matching engine work?',
    a: 'OrderPulse runs an in-memory C++20/TypeScript sequencer implementing strict FIFO Price-Time Priority. Orders are queued at discrete price ticks (1 tick = ₹0.01) and executed at resting price levels.'
  },
  {
    q: 'How does the ±5% volatility circuit breaker operate?',
    a: 'Before any candidate trade executes, its price is validated against a ±5% collar around the anchor reference price. If a candidate execution breaches this collar, the engine immediately pauses trading for a 30-second cooling period.'
  },
  {
    q: 'Are deposits and withdrawals connected to real bank accounts?',
    a: 'OrderPulse is a professional trading simulation platform built for MTX Hackathon 2026. All deposits (UPI, Netbanking, Cards) and withdrawals update simulated ledger balances with atomic multi-database journal logs.'
  },
  {
    q: 'How can the hackathon jury audit database persistence?',
    a: 'Visit the Terminal and switch to the "PostgreSQL Audit" tab or query /api/health to inspect real-time connectivity across PostgreSQL, MySQL 8.0, and MongoDB Atlas.'
  }
];

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-20">
      <IndexTickerStrip />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-10 space-y-16 animate-fade-in">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-mono font-bold text-[#00B386] uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Support & Investor Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#44475B] dark:text-white tracking-tight">
            Get in touch with the OrderPulse Team
          </h1>
          <p className="text-sm text-[#7C7E8C] dark:text-neutral-400">
            Have questions about our matching engine architecture, API integration, or simulated portfolio accounting? We are here to help.
          </p>
        </div>

        {/* 2-Column Contact Info + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-[#FAFAFA] dark:bg-[#151515] border border-[#E8E8E8] dark:border-white/10 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#44475B] dark:text-white">Email Inquiries</h4>
                  <p className="text-xs text-[#7C7E8C] mt-0.5">Response within 2 hours</p>
                  <a href="mailto:support@orderpulse.exchange" className="text-xs font-mono font-bold text-[#00B386] hover:underline mt-1 block">
                    support@orderpulse.exchange
                  </a>
                </div>
              </div>

              <div className="border-t border-[#F0F0F0] dark:border-white/[0.06] pt-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#44475B] dark:text-white">Phone Support Desk</h4>
                  <p className="text-xs text-[#7C7E8C] mt-0.5">Mon – Fri, 9:00 AM – 6:00 PM IST</p>
                  <span className="text-xs font-mono font-bold text-[#44475B] dark:text-white mt-1 block">
                    +91 (022) 6982 4500
                  </span>
                </div>
              </div>

              <div className="border-t border-[#F0F0F0] dark:border-white/[0.06] pt-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#44475B] dark:text-white">Headquarters</h4>
                  <p className="text-xs text-[#7C7E8C] mt-0.5 leading-relaxed font-mono">
                    OrderPulse FinTech Lab<br />
                    Bandra Kurla Complex (BKC), G-Block<br />
                    Mumbai, Maharashtra 400051
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-[#00B386] font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>MTX Hackathon 2026 Jury Notice</span>
              </div>
              <p className="text-xs text-[#7C7E8C] dark:text-neutral-400 leading-relaxed font-mono">
                Jury members can use administrative credentials to inspect live database records, run scenario tests, or trigger automated volatility circuit breaker demonstrations directly in the Terminal.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#151515] rounded-3xl border border-[#E8E8E8] dark:border-white/10 p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-base text-[#44475B] dark:text-white mb-1">
              Send us a Message
            </h3>
            <p className="text-xs text-[#7C7E8C] mb-6">
              Fill in your inquiry details below and our team will get back to you promptly.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-[#00B386] mx-auto" />
                <h4 className="font-bold text-sm text-[#00B386]">Message Transmitted Successfully!</h4>
                <p className="text-xs text-[#7C7E8C] dark:text-neutral-300">
                  Thank you for reaching out. A ticket has been created with our trading desk engineering team.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 px-4 py-2 rounded-full bg-[#00B386] text-white text-xs font-bold transition hover:bg-[#009e75]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aarav@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386]"
                  >
                    <option value="General Inquiry">General Platform Inquiry</option>
                    <option value="Matching Engine API">Matching Engine & WebSockets API</option>
                    <option value="Jury Evaluation">Hackathon Jury Evaluation Request</option>
                    <option value="Brokerage Accounts">Simulated Account & Margin Question</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#44475B] dark:text-neutral-300 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry or feedback..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white outline-none focus:border-[#00B386]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.01]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <section className="space-y-4">
          <div className="border-b border-[#F0F0F0] dark:border-white/[0.08] pb-3">
            <h2 className="text-xl font-bold text-[#44475B] dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-[#7C7E8C]">Quick answers about our trading engine & simulation</p>
          </div>

          <div className="divide-y divide-[#F0F0F0] dark:divide-white/[0.06] rounded-2xl border border-[#E8E8E8] dark:border-white/10 bg-white dark:bg-[#151515] overflow-hidden">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="p-5">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left cursor-pointer group"
                  >
                    <span className="font-bold text-xs sm:text-sm text-[#44475B] dark:text-white group-hover:text-[#00B386] transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#7C7E8C] transition-transform ${isOpen ? 'rotate-180 text-[#00B386]' : ''}`} />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs text-[#7C7E8C] dark:text-neutral-400 leading-relaxed font-mono animate-fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
