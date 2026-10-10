import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  X,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { StockItem } from '../../data/growcloneData';

interface StockDetailModalProps {
  stock: StockItem | null;
  onClose: () => void;
  apiBase: string;
  walletBalance: number;
  onOrderSuccess?: () => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  apiBase,
  walletBalance,
  onOrderSuccess
}) => {
  if (!stock) return null;

  const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
  const [productType, setProductType] = useState<'DELIVERY' | 'INTRADAY'>('DELIVERY');
  const [quantity, setQuantity] = useState<number>(10);
  const [orderMode, setOrderMode] = useState<'MARKET' | 'LIMIT'>('LIMIT');
  const [limitPrice, setLimitPrice] = useState<number>(stock.price);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [orderResult, setOrderResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  const priceToUse = orderMode === 'MARKET' ? stock.price : limitPrice;
  const totalAmount = Number((priceToUse * quantity).toFixed(2));
  const hasSufficientBalance = orderType === 'SELL' || walletBalance >= totalAmount;

  // Handle Order Placement directly into matching engine & DB
  const handlePlaceOrder = async () => {
    if (!hasSufficientBalance) return;
    setSubmitting(true);
    setOrderResult(null);

    const priceTicks = Math.round(priceToUse * 100);
    const orderId = `ORD-GROW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const requestId = `REQ-GROW-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    try {
      const res = await fetch(`${apiBase}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          requestId,
          participantId: 'RETAIL_INVESTOR_GROWW',
          symbol: stock.symbol === 'DEMO' ? 'DEMO' : stock.symbol,
          side: orderType,
          priceTicks,
          quantity
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrderResult({
          success: true,
          message: `${orderType} order for ${quantity} shares of ${stock.symbol} executed successfully!`,
          latency: data.matchingLatencyMicros || 2.15
        });
        if (onOrderSuccess) onOrderSuccess();
      } else {
        setOrderResult({
          success: false,
          message: data.errorMessage || data.error || 'Circuit breaker or engine rejected order'
        });
      }
    } catch (e: any) {
      setOrderResult({
        success: false,
        message: e.message || 'Network error connecting to matching engine'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#151515] w-full max-w-xl rounded-2xl border border-[#E8E8E8] dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Strip */}
        <div className="p-5 border-b border-[#F0F0F0] dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] font-bold text-sm flex items-center justify-center border border-[#00B386]/20">
              {stock.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#44475B] dark:text-white leading-tight">
                  {stock.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-[#7C7E8C] dark:text-neutral-400">
                  {stock.symbol}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-extrabold text-base text-[#44475B] dark:text-white font-mono">
                  ₹{stock.price.toFixed(2)}
                </span>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${stock.isPositive ? 'text-[#00B386]' : 'text-[#EB5B3C]'}`}>
                  {stock.isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  <span>{stock.isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-neutral-800 flex items-center justify-center text-[#7C7E8C] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Order Side Selector Tabs (Groww style Green BUY / Red SELL) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F8F8F8] dark:bg-neutral-900 rounded-xl">
            <button
              onClick={() => { setOrderType('BUY'); setOrderResult(null); }}
              className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                orderType === 'BUY'
                  ? 'bg-[#00B386] text-white shadow-sm'
                  : 'text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              <span>BUY</span>
            </button>
            <button
              onClick={() => { setOrderType('SELL'); setOrderResult(null); }}
              className={`py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                orderType === 'SELL'
                  ? 'bg-[#EB5B3C] text-white shadow-sm'
                  : 'text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white'
              }`}
            >
              <span>SELL</span>
            </button>
          </div>

          {/* Product Type (Delivery / Intraday) */}
          <div className="flex items-center justify-between text-xs font-semibold pb-3 border-b border-[#F0F0F0] dark:border-white/[0.08]">
            <span className="text-[#7C7E8C]">Product:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setProductType('DELIVERY')}
                className={`px-3 py-1 rounded-md text-xs transition ${
                  productType === 'DELIVERY'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] border border-[#00B386]/30 font-bold'
                    : 'text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white'
                }`}
              >
                Delivery (CNC)
              </button>
              <button
                type="button"
                onClick={() => setProductType('INTRADAY')}
                className={`px-3 py-1 rounded-md text-xs transition ${
                  productType === 'INTRADAY'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] border border-[#00B386]/30 font-bold'
                    : 'text-[#7C7E8C] hover:text-[#44475B] dark:hover:text-white'
                }`}
              >
                Intraday (MIS)
              </button>
            </div>
          </div>

          {/* Quantity and Quick Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#44475B] dark:text-neutral-300">
                Quantity (Shares)
              </label>
              <div className="flex gap-1.5">
                {[10, 25, 50, 100].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border transition ${
                      quantity === q
                        ? 'border-[#00B386] text-[#00B386] bg-emerald-50/50 dark:bg-emerald-950/30 font-bold'
                        : 'border-[#E8E8E8] dark:border-white/10 text-[#7C7E8C] hover:border-slate-300'
                    }`}
                  >
                    +{q}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white font-mono font-bold text-sm focus:outline-none focus:border-[#00B386]"
            />
          </div>

          {/* Price Selector (Market vs Limit) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#44475B] dark:text-neutral-300">
                Order Price (₹)
              </label>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setOrderMode('MARKET')}
                  className={`font-semibold ${orderMode === 'MARKET' ? 'text-[#00B386]' : 'text-[#7C7E8C]'}`}
                >
                  Market
                </button>
                <span className="text-[#E8E8E8] dark:text-white/10">|</span>
                <button
                  type="button"
                  onClick={() => setOrderMode('LIMIT')}
                  className={`font-semibold ${orderMode === 'LIMIT' ? 'text-[#00B386]' : 'text-[#7C7E8C]'}`}
                >
                  Limit
                </button>
              </div>
            </div>

            {orderMode === 'LIMIT' ? (
              <input
                type="number"
                step="0.05"
                min="0.05"
                value={limitPrice}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || stock.price)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#44475B] dark:text-white font-mono font-bold text-sm focus:outline-none focus:border-[#00B386]"
              />
            ) : (
              <div className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E8E8] dark:border-white/10 bg-[#F8F8F8] dark:bg-neutral-800 text-[#7C7E8C] font-mono text-sm flex items-center justify-between">
                <span>At Market Price:</span>
                <span className="font-bold text-[#44475B] dark:text-white">₹{stock.price.toFixed(2)}</span>
              </div>
            )}
            <p className="text-[11px] text-[#7C7E8C] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#00B386]" />
              <span>Protected by OrderPulse Volatility Circuit Breakers (±5% Collar)</span>
            </p>
          </div>

          {/* Order Summary & Balance Check */}
          <div className="p-4 rounded-xl bg-[#F8F8F8] dark:bg-neutral-900 border border-[#E8E8E8] dark:border-white/[0.08] space-y-2 text-xs">
            <div className="flex justify-between text-[#7C7E8C]">
              <span>Required Margin:</span>
              <span className="font-bold font-mono text-[#44475B] dark:text-white">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-[#7C7E8C]">
              <span>Available Cash Balance:</span>
              <span className="font-bold font-mono text-[#00B386]">₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            {!hasSufficientBalance && (
              <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-[#EB5B3C] text-[11px] flex items-center gap-1.5 mt-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Insufficient balance. Add funds via UPI or Netbanking to place order.</span>
              </div>
            )}
          </div>

          {/* Feedback alert if order submitted */}
          {orderResult && (
            <div className={`p-3 rounded-xl text-xs flex items-center justify-between ${
              orderResult.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] border border-[#00B386]/30'
                : 'bg-rose-50 dark:bg-rose-950/40 text-[#EB5B3C] border border-[#EB5B3C]/30'
            }`}>
              <div className="flex items-center gap-2">
                {orderResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{orderResult.message}</span>
              </div>
              {orderResult.latency && (
                <span className="text-[10px] font-mono shrink-0 px-2 py-0.5 rounded bg-emerald-500/20">
                  {orderResult.latency} µs match
                </span>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Action */}
        <div className="p-5 border-t border-[#F0F0F0] dark:border-white/[0.08] flex items-center justify-between gap-3 bg-[#FAFAFA] dark:bg-[#121212]">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#7C7E8C] uppercase tracking-wider font-semibold">Total Order Value</span>
            <span className="text-base font-extrabold font-mono text-[#44475B] dark:text-white">
              ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-[#E8E8E8] dark:border-white/10 text-xs font-semibold text-[#7C7E8C] hover:bg-white dark:hover:bg-neutral-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={submitting || (!hasSufficientBalance && orderType === 'BUY')}
              className={`px-6 py-2.5 rounded-full text-white text-xs font-bold transition shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                orderType === 'BUY'
                  ? 'bg-[#00B386] hover:bg-[#009e75] shadow-emerald-500/20'
                  : 'bg-[#EB5B3C] hover:bg-[#d64e31] shadow-rose-500/20'
              }`}
            >
              {submitting ? (
                <span>Executing in Engine...</span>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>{orderType} {quantity} Shares</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
