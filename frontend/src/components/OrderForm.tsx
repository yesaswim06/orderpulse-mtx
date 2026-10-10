import React, { useState } from 'react';
import { Side, BreakerStatus } from '../types';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';

interface OrderFormProps {
  breaker: BreakerStatus | null;
  onSubmitOrder: (order: {
    participantId: string;
    symbol: string;
    side: Side;
    priceTicks: number;
    quantity: number;
  }) => Promise<{ success: boolean; message?: string }>;
}

export const OrderForm: React.FC<OrderFormProps> = ({ breaker, onSubmitOrder }) => {
  const [side, setSide] = useState<Side>('BUY');
  const [participantId, setParticipantId] = useState<string>('PROP_DESK_1');
  const [priceRupees, setPriceRupees] = useState<string>('100.00');
  const [quantity, setQuantity] = useState<string>('50');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isHalted = breaker?.state === 'HALTED';

  const handlePriceChange = (val: number) => {
    setPriceRupees(val.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const price = parseFloat(priceRupees);
    const qty = parseInt(quantity, 10);

    if (isNaN(price) || price <= 0) {
      setStatusMessage({ type: 'error', text: 'Enter a valid positive price in Rupees.' });
      return;
    }

    if (isNaN(qty) || qty <= 0) {
      setStatusMessage({ type: 'error', text: 'Enter a valid positive quantity.' });
      return;
    }

    const priceTicks = Math.round(price * 100);

    try {
      setSubmitting(true);
      const res = await onSubmitOrder({
        participantId,
        symbol: 'DEMO',
        side,
        priceTicks,
        quantity: qty,
      });

      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: `Order submitted: ${side} ${qty} DEMO @ ₹${price.toFixed(2)}`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message || 'Submission failed.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Network error submitting order.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calculatedTotal = (parseFloat(priceRupees) || 0) * (parseInt(quantity, 10) || 0);

  return (
    <div className="bg-trading-card border border-trading-border rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-trading-border mb-3">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Order Entry (DEMO)
        </h2>
        <span className="text-xs text-slate-400 font-mono">Limit Order</span>
      </div>

      {isHalted && (
        <div className="mb-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Engine is HALTED: Submissions are rejected until operator resumes.</span>
        </div>
      )}

      {statusMessage && (
        <div className={`mb-3 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
          statusMessage.type === 'success'
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span className="break-all">{statusMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* BUY / SELL Switch */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => setSide('BUY')}
            className={`py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              side === 'BUY'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BUY / BID
          </button>
          <button
            type="button"
            onClick={() => setSide('SELL')}
            className={`py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
              side === 'SELL'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            SELL / ASK
          </button>
        </div>

        {/* Participant Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Participant ID
          </label>
          <select
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="PROP_DESK_1">PROP_DESK_1 (Institutional)</option>
            <option value="HFT_ALPHA">HFT_ALPHA (High Frequency)</option>
            <option value="RETAIL_FLOW">RETAIL_FLOW (Client Order)</option>
            <option value="MARKET_MAKER_2">MARKET_MAKER_2 (Liquidity)</option>
            <option value="ARBITRAGEUR">ARBITRAGEUR (Cross Market)</option>
          </select>
        </div>

        {/* Limit Price */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span>Price (₹)</span>
            <span className="font-mono text-cyan-400">1 Tick = ₹0.01</span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-500 text-xs">₹</span>
            <input
              type="number"
              step="0.01"
              value={priceRupees}
              onChange={(e) => setPriceRupees(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs font-mono-numbers text-white focus:outline-none focus:border-cyan-500"
              placeholder="100.00"
              required
            />
          </div>

          {/* Quick Price Buttons */}
          <div className="grid grid-cols-4 gap-1.5 mt-1.5">
            {[98.00, 100.00, 104.50, 106.00].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePriceChange(p)}
                className={`text-[10px] py-1 px-1 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer font-mono-numbers ${
                  p > 105 ? 'text-rose-400 hover:text-rose-300' : 'text-slate-300'
                }`}
                title={p > 105 ? 'Will breach Rs 105 band!' : ''}
              >
                ₹{p.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span>Quantity (Shares)</span>
            <span className="text-slate-500">Min 1</span>
          </div>
          <input
            type="number"
            step="1"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono-numbers text-white focus:outline-none focus:border-cyan-500"
            placeholder="50"
            required
          />

          {/* Quick Lots */}
          <div className="grid grid-cols-4 gap-1.5 mt-1.5">
            {[10, 50, 100, 500].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuantity(String(q))}
                className="text-[10px] py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer font-mono-numbers"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Order Value Summary */}
        <div className="bg-slate-900/80 rounded-lg p-2.5 border border-slate-800 text-xs flex items-center justify-between font-mono-numbers">
          <span className="text-slate-400">Total Notional:</span>
          <span className="font-bold text-white">₹{calculatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || isHalted}
          className={`w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
            isHalted
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : side === 'BUY'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>
            {isHalted
              ? 'Engine Halted'
              : submitting
              ? 'Routing...'
              : `Place ${side} Order`}
          </span>
        </button>
      </form>
    </div>
  );
};
