import React from 'react';
import { Trade } from '../types';

interface TradesTableProps {
  trades: Trade[];
}

export const TradesTable: React.FC<TradesTableProps> = ({ trades }) => {
  return (
    <div className="bg-trading-card border border-trading-border rounded-xl p-4 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-trading-border mb-2">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Recent Trades (Executed)
        </h3>
        <span className="text-xs text-slate-400 font-mono-numbers">
          {trades.length} Prints
        </span>
      </div>

      <div className="overflow-x-auto flex-1 max-h-[300px]">
        <table className="w-full text-left text-xs font-mono-numbers">
          <thead className="text-[11px] font-semibold text-slate-400 border-b border-slate-800 sticky top-0 bg-trading-card">
            <tr>
              <th className="py-2 px-2">Trade ID</th>
              <th className="py-2 px-2">Price (₹)</th>
              <th className="py-2 px-2 text-right">Qty</th>
              <th className="py-2 px-2">Maker / Taker</th>
              <th className="py-2 px-2 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {trades.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-600">
                  No trades executed yet
                </td>
              </tr>
            ) : (
              trades.slice(0, 30).map((t) => {
                const date = new Date(t.timestampNs / 1_000_000);
                const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${Math.floor(date.getMilliseconds() / 100)}`;
                return (
                  <tr key={t.tradeId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-1.5 px-2 text-slate-300 font-medium">{t.tradeId}</td>
                    <td className="py-1.5 px-2 font-bold text-cyan-400">
                      ₹{(t.priceTicks / 100).toFixed(2)}
                    </td>
                    <td className="py-1.5 px-2 text-right text-white">
                      {t.quantity.toLocaleString()}
                    </td>
                    <td className="py-1.5 px-2 text-slate-400 text-[11px]">
                      <span className="text-slate-300">{t.makerParticipantId}</span>
                      <span className="text-slate-600 mx-1">vs</span>
                      <span className="text-slate-300">{t.takerParticipantId}</span>
                    </td>
                    <td className="py-1.5 px-2 text-right text-slate-500 text-[11px]">
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
