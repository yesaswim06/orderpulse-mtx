import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  TrendingUp,
  Calculator,
  ChevronRight,
  Info,
  Calendar,
  DollarSign,
  PieChart,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { POPULAR_BONDS, Bond } from '../../data/growcloneData';
import { IndexTickerStrip } from '../../components/growclone/IndexTickerStrip';
import { useAuth } from '../../context/AuthContext';
import { getApiBase, safeFetchJson } from '../../config/api';

interface BondsPageProps {
  walletBalance?: number;
  onRefreshBalance?: () => void;
  onOpenWallet?: () => void;
}

export const BondsPage: React.FC<BondsPageProps> = ({
  walletBalance = 0,
  onRefreshBalance = () => {},
  onOpenWallet = () => {}
}) => {
  const { user, updateBalance } = useAuth();
  const [selectedBond, setSelectedBond] = useState<Bond>(POPULAR_BONDS[0]);
  const [investmentAmount, setInvestmentAmount] = useState<number>(50000);
  const [holdingYears, setHoldingYears] = useState<number>(3);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [txnDetails, setTxnDetails] = useState<{ txnId?: string; newBalance?: number } | null>(null);

  // Yield calculations
  const yieldNumeric = parseFloat(selectedBond.yieldPercent) / 100;
  const estimatedReturns = Math.round(investmentAmount * Math.pow(1 + yieldNumeric, holdingYears) - investmentAmount);
  const maturityValue = investmentAmount + estimatedReturns;

  const hasSufficientBalance = walletBalance >= investmentAmount;

  const handleConfirmInterest = async () => {
    if (!hasSufficientBalance) {
      setOrderError(`Insufficient wallet balance. You need ₹${investmentAmount.toLocaleString('en-IN')}, but your current wallet balance is ₹${walletBalance.toLocaleString('en-IN')}. Please add funds.`);
      return;
    }

    setSubmitting(true);
    setOrderError(null);

    try {
      const activeUserId = user?.userId || 'USER-DEMO-01';
      const res = await fetch(`${getApiBase()}/api/bonds/invest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId,
          bondId: selectedBond.id,
          issuer: selectedBond.issuer,
          amount: investmentAmount,
          tenureYears: holdingYears
        })
      });

      const data = await safeFetchJson(res, { success: false, error: 'Server returned empty response' });

      if (res.ok && data?.success) {
        if (data.newBalance !== undefined) {
          updateBalance(data.newBalance);
        }
        onRefreshBalance();
        setTxnDetails({ txnId: data.txnId, newBalance: data.newBalance });
        setOrderConfirmed(true);
        setTimeout(() => {
          setShowReviewModal(false);
          setOrderConfirmed(false);
          setTxnDetails(null);
        }, 3500);
      } else {
        setOrderError(data?.error || data?.errorMessage || 'Failed to allocate bond capital');
      }
    } catch (e: any) {
      setOrderError(e.message || 'Network error executing bond investment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors pb-16">
      <IndexTickerStrip />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#7C7E8C] mb-2">
            <Link to="/stocks/user/explore" className="hover:text-[#00B386]">Home</Link>
            <span>/</span>
            <span className="text-[#44475B] dark:text-white font-medium">Bonds & Fixed Income</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#44475B] dark:text-white">
            High Yield Fixed Income Bonds
          </h1>
          <p className="text-xs sm:text-sm text-[#7C7E8C] mt-1">
            Institutional corporate bonds and NBFC debentures offering verified fixed returns up to 14.00% p.a.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Bond Cards & Details (8 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h2 className="text-base font-bold text-[#44475B] dark:text-white">
              Curated High-Yield Issues
            </h2>

            <div className="space-y-4">
              {POPULAR_BONDS.map((bond) => {
                const isSelected = selectedBond.id === bond.id;
                return (
                  <div
                    key={bond.id}
                    onClick={() => setSelectedBond(bond)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#00B386] bg-emerald-50/20 dark:bg-emerald-950/20 shadow-md ring-1 ring-[#00B386]'
                        : 'border-[#E8E8E8] dark:border-white/10 bg-white dark:bg-[#141414] hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-sm text-[#00B386]">
                          {bond.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#44475B] dark:text-white">
                            {bond.issuer}
                          </h3>
                          <div className="text-xs text-[#7C7E8C] mt-0.5">
                            Matures {bond.maturity} • {bond.tenure}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black font-mono text-[#00B386]">
                          {bond.yieldPercent}
                        </div>
                        <span className="text-[10px] text-[#7C7E8C] block">Indicative Yield</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8E8E8] dark:border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-[#44475B] dark:text-neutral-300">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            bond.ratingColor === 'orange' ? 'bg-[#F5A623]' : 'bg-[#00B386]'
                          }`}
                        />
                        <span>CRISIL {bond.rating} Rated</span>
                      </div>
                      <span className="text-xs font-bold text-[#00B386] flex items-center gap-1">
                        {isSelected ? 'Selected' : 'Select'} <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bond Educational Disclosure */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-neutral-800/40 border border-[#E8E8E8] dark:border-white/10 text-xs text-[#7C7E8C] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#44475B] dark:text-white">
                <Info className="w-4 h-4 text-[#00B386]" />
                <span>Fixed Income Bond Simulation Disclosure</span>
              </div>
              <p>
                Corporate debt instruments are simulated for the MTX Hackathon 2026. Yield calculations follow compound annual growth formulas with hypothetical coupon payouts credited to your OrderPulse demo wallet.
              </p>
            </div>
          </div>

          {/* Right Column: Calculator & Review Drawer (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white dark:bg-[#141414] p-6 rounded-3xl border border-[#E8E8E8] dark:border-white/10 shadow-lg space-y-6">
              <div className="flex items-center gap-2 border-b border-[#E8E8E8] dark:border-white/10 pb-4">
                <Calculator className="w-5 h-5 text-[#00B386]" />
                <h3 className="font-bold text-base text-[#44475B] dark:text-white">
                  Bond Returns Calculator
                </h3>
              </div>

              {/* Selected Bond Badge */}
              <div className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#7C7E8C] block">Selected Issuer</span>
                  <span className="font-bold text-sm text-[#44475B] dark:text-white">
                    {selectedBond.issuer}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#7C7E8C] block">Yield</span>
                  <span className="font-bold font-mono text-[#00B386]">
                    {selectedBond.yieldPercent}
                  </span>
                </div>
              </div>

              {/* Investment Amount Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#7C7E8C]">Investment Amount</span>
                  <span className="font-bold font-mono text-[#44475B] dark:text-white text-sm">
                    ₹{investmentAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="w-full accent-[#00B386] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#7C7E8C] mt-1 font-mono">
                  <span>₹10,000</span>
                  <span>₹5,00,000</span>
                </div>
              </div>

              {/* Tenure Selector */}
              <div>
                <span className="text-xs text-[#7C7E8C] block mb-2">Holding Period</span>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 5].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setHoldingYears(yr)}
                      className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        holdingYears === yr
                          ? 'bg-[#00B386] text-white'
                          : 'bg-slate-100 dark:bg-neutral-800 text-[#7C7E8C] hover:bg-slate-200'
                      }`}
                    >
                      {yr} {yr === 1 ? 'Year' : 'Years'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculations Box */}
              <div className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-neutral-800/50 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-[#7C7E8C]">
                  <span>Total Principal</span>
                  <span className="font-bold text-[#44475B] dark:text-white">
                    ₹{investmentAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[#00B386]">
                  <span>Estimated Total Interest</span>
                  <span className="font-bold">
                    +₹{estimatedReturns.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E8E8E8] dark:border-white/10 flex justify-between text-sm font-bold text-[#44475B] dark:text-white">
                  <span>Maturity Payout</span>
                  <span>₹{maturityValue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Wallet Balance Status */}
              <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#7C7E8C]">
                  <Wallet className="w-4 h-4 text-[#00B386]" />
                  <span>Available Balance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#44475B] dark:text-white">
                    ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  {!hasSufficientBalance && (
                    <button
                      onClick={onOpenWallet}
                      className="px-2 py-0.5 rounded-full bg-[#00B386] text-white text-[10px] font-bold hover:bg-[#009e75] transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Funds
                    </button>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setOrderError(null);
                  setShowReviewModal(true);
                }}
                className={`w-full py-3.5 rounded-full text-white text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  hasSufficientBalance
                    ? 'bg-[#00B386] hover:bg-[#009e75] shadow-emerald-500/20'
                    : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20'
                }`}
              >
                <span>
                  {hasSufficientBalance
                    ? `Invest in ${selectedBond.issuer}`
                    : `Add Funds & Invest (Needs ₹${(investmentAmount - walletBalance).toLocaleString('en-IN')})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Review & Confirmation Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-[#1A1A1A] max-w-md w-full rounded-3xl p-6 shadow-2xl border border-[#E8E8E8] dark:border-white/10 space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#44475B] dark:text-white">
                  Confirm Demo Bond Investment
                </h3>
                <p className="text-xs text-[#7C7E8C] mt-1">
                  You are allocating capital from your OrderPulse wallet. Amount will be debited instantly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#7C7E8C]">Issuer:</span>
                  <span className="font-bold text-[#44475B] dark:text-white">{selectedBond.issuer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7C7E8C]">Indicative Yield:</span>
                  <span className="font-bold text-[#00B386]">{selectedBond.yieldPercent} p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7C7E8C]">Investment Amount:</span>
                  <span className="font-bold font-mono text-[#44475B] dark:text-white">
                    ₹{investmentAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7C7E8C]">Tenure:</span>
                  <span className="font-bold text-[#44475B] dark:text-white">{holdingYears} Years</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-neutral-700 flex justify-between">
                  <span className="text-[#7C7E8C]">Your Wallet Balance:</span>
                  <span className={`font-bold font-mono ${hasSufficientBalance ? 'text-[#00B386]' : 'text-rose-500'}`}>
                    ₹{walletBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {orderError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div>{orderError}</div>
                    {!hasSufficientBalance && (
                      <button
                        onClick={() => {
                          setShowReviewModal(false);
                          onOpenWallet();
                        }}
                        className="font-bold underline cursor-pointer hover:text-rose-700 block"
                      >
                        Click here to deposit funds into wallet →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {orderConfirmed ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386] text-xs font-semibold space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Bond Investment Confirmed & Debited!</span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    ₹{investmentAmount.toLocaleString('en-IN')} debited from wallet.
                    {txnDetails?.newBalance !== undefined && (
                      <span className="block font-mono text-[#00B386] font-bold mt-1">
                        New Wallet Balance: ₹{txnDetails.newBalance.toLocaleString('en-IN')}
                      </span>
                    )}
                  </p>
                  {txnDetails?.txnId && (
                    <span className="text-[10px] font-mono text-neutral-400 block">
                      Ref Txn: {txnDetails.txnId}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowReviewModal(false)}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-full border border-[#E8E8E8] dark:border-white/10 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmInterest}
                    disabled={submitting || !hasSufficientBalance}
                    className="flex-1 py-3 rounded-full bg-[#00B386] hover:bg-[#009e75] text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span>Processing Debit...</span>
                    ) : !hasSufficientBalance ? (
                      <span>Insufficient Funds</span>
                    ) : (
                      <span>Confirm & Debit ₹{investmentAmount.toLocaleString('en-IN')}</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
