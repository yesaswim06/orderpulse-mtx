import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrderPulse — Ultra-Low Latency Order-Book Matching Engine with Volatility Circuit Breakers",
  description:
    "Precision Matching. Real-Time Trading. Intelligent Protection. Built for MTX Hackathon 2026.",
  keywords: [
    "OrderPulse",
    "MTX Hackathon 2026",
    "matching engine",
    "order book",
    "circuit breaker",
    "fintech",
    "high frequency trading",
    "price-time priority",
  ],
  authors: [{ name: "OrderPulse MTX Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#050505] text-[#E5E7EB] antialiased selection:bg-emerald-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
