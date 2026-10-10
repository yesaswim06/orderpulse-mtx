import React from 'react';
import { Trade } from '../types';

interface TradesTableProps {
  trades: Trade[];
}

export const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {
  return (
    <div className="glass-panel p-4 flex flex-col h-full">
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] mb-2">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Market Trades (Executed)
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {trades.length} Prints
        </span>
      </div>

      <div className="overflow-x-auto flex-1 max-h-[300px]">
        <table className="w-full text-left text-xs font-mono-numbers">
          <thead className="text-[11px] font-semibold text-slate-400 border-b border-white/[0.08] sticky top-0 bg-[#0c1322]/80 backdrop-blur-md">
            <tr>
              <th className="py-2.5 px-2">Trade ID</th>
              <th className="py-2.5 px-2">Price (₹)</th>
              <th className="py-2.5 px-2 text-right">Qty</th>
              <th className="py-2.5 px-2">Maker / Taker</th>
              <th className="py-2.5 px-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {trades.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                  No trades executed yet
                </td>
              </tr>
            ) : (
              trades.slice(0, 30).map((t) => {
                const date = new Date(t.timestampNs / 1_000_000);
                const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${Math.floor(date.getMilliseconds() / 100)}`;
                return (
                  <tr key={t.tradeId} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-2 px-2 text-slate-300 font-medium">{t.tradeId}</td>
                    <td className="py-2 px-2 font-bold text-cyan-400">
                      ₹{(t.priceTicks / 100).toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-right text-white font-semibold">
                      {t.quantity.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-slate-400 text-[11px]">
                      <span className="text-slate-200">{t.makerParticipantId}</span>
                      <span className="text-slate-500 mx-1">vs</span>
                      <span className="text-slate-200">{t.takerParticipantId}</span>
                    </td>
                    <td className="py-2 px-2 text-right text-slate-400 text-[11px]">
                      {timeStr}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
