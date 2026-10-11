import React, { useState } from 'react';
import {
  CreditCard,
  Smartphone,
  Building2,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Wallet,
  Sparkles,
  Lock
} from 'lucide-react';
import { getApiBase, safeFetchJson } from '../config/api';
import { useAuth } from '../context/AuthContext';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase?: string;
  currentBalance: number;
  onBalanceUpdated: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  apiBase: propApiBase,
  currentBalance,
  onBalanceUpdated
}) => {
  const { user } = useAuth();
  const apiBase = propApiBase || getApiBase();
  const activeUserId = user?.userId || 'USER-DEMO-01';
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [depositMethod, setDepositMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [depositAmount, setDepositAmount] = useState<string>('50000');
  const [upiId, setUpiId] = useState<string>('trader@okhdfcbank');

  // Card details
  const [cardNumber, setCardNumber] = useState<string>('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvv, setCardCvv] = useState<string>('821');

  // Netbanking
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');

  // Withdrawal details
  const [withdrawAmount, setWithdrawAmount] = useState<string>('25000');
  const [accountNumber, setAccountNumber] = useState<string>('50100492817281');
  const [ifsc, setIfsc] = useState<string>('HDFC0000060');
  const [beneficiaryName, setBeneficiaryName] = useState<string>('Prop Desk Master Account');

  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`${apiBase}/api/wallet/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId,
          amount: parseFloat(depositAmount),
          method: depositMethod,
          paymentDetails: {
            upiId: depositMethod === 'UPI' ? upiId : undefined,
            cardLast4: depositMethod === 'CARD' ? '8821' : undefined,
            bank: depositMethod === 'NETBANKING' ? selectedBank : undefined
          }
        })
      });
      const data = await safeFetchJson(res, { success: false, error: 'Empty or invalid server response' });
      if (res.ok && data?.success) {
        setStatusMsg({
          type: 'success',
          text: `Instant deposit of ₹${parseFloat(depositAmount).toLocaleString()} confirmed via ${depositMethod}. Reference ID: ${data.txnId}`
        });
        onBalanceUpdated();
      } else {
        setStatusMsg({ type: 'error', text: data?.error || 'Deposit failed' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Network error processing deposit' });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch(`${apiBase}/api/wallet/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId,
          amount: parseFloat(withdrawAmount),
          bankDetails: {
            accountNumber,
            ifsc,
            beneficiaryName
          }
        })
      });
      const data = await safeFetchJson(res, { success: false, error: 'Empty or invalid server response' });
      if (res.ok && data?.success) {
        setStatusMsg({
          type: 'success',
          text: `Withdrawal of ₹${parseFloat(withdrawAmount).toLocaleString()} queued to ${beneficiaryName} (A/C: ${accountNumber.slice(-4).padStart(accountNumber.length, '•')}). Reference ID: ${data.txnId}`
        });
        onBalanceUpdated();
      } else {
        setStatusMsg({ type: 'error', text: data.error || 'Withdrawal failed' });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Network error processing withdrawal' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-full max-w-xl p-6 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Account Portfolio & Banking</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  DEMO TRADING
                </span>
              </h2>
              <p className="text-xs text-slate-400">Institutional capital funding & settlement desk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Available Balance Card */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/30 border border-sky-500/20 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Available Cash Margin (INR)</span>
            <div className="text-2xl font-bold font-mono-numbers text-white mt-0.5">
              ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Instant Liquidity</span>
          </div>
        </div>

        {/* Tab Selector: Deposit vs Withdraw */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/[0.03] border border-white/5 mb-5">
          <button
            onClick={() => { setTab('deposit'); setStatusMsg(null); }}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
              tab === 'deposit'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Add Funds (Deposit)</span>
          </button>
          <button
            onClick={() => { setTab('withdraw'); setStatusMsg(null); }}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
              tab === 'withdraw'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw to Bank</span>
          </button>
        </div>

        {statusMsg && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-start gap-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Deposit Flow */}
        {tab === 'deposit' && (
          <form onSubmit={handleDeposit} className="space-y-4">
            {/* Method Chooser */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Select Payment Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDepositMethod('UPI')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition ${
                    depositMethod === 'UPI'
                      ? 'bg-sky-500/15 border-sky-500 text-white'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-semibold">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDepositMethod('CARD')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition ${
                    depositMethod === 'CARD'
                      ? 'bg-sky-500/15 border-sky-500 text-white'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-sky-400" />
                  <span className="text-[11px] font-semibold">Credit / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDepositMethod('NETBANKING')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1 transition ${
                    depositMethod === 'NETBANKING'
                      ? 'bg-sky-500/15 border-sky-500 text-white'
                      : 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span className="text-[11px] font-semibold">Net Banking</span>
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Deposit Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-bold">₹</span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="glass-input w-full pl-8 pr-3 py-2 text-sm font-mono-numbers"
                  min="100"
                  step="100"
                  required
                />
              </div>
              <div className="flex gap-2 mt-2">
                {['10000', '50000', '100000', '500000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDepositAmount(preset)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 hover:border-sky-500/40"
                  >
                    +₹{Number(preset).toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Method Details */}
            {depositMethod === 'UPI' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Virtual Payment Address (UPI ID)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="glass-input w-full py-2 px-3 text-xs font-mono"
                  placeholder="username@bank"
                  required
                />
              </div>
            )}

            {depositMethod === 'CARD' && (
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="glass-input w-full py-2 px-3 text-xs font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="glass-input w-full py-2 px-3 text-xs font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="glass-input w-full py-2 px-3 text-xs font-mono"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {depositMethod === 'NETBANKING' && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="glass-input w-full py-2 px-3 text-xs"
                >
                  <option value="HDFC Bank" className="bg-[#0b1220] text-white">HDFC Bank</option>
                  <option value="State Bank of India" className="bg-[#0b1220] text-white">State Bank of India (SBI)</option>
                  <option value="ICICI Bank" className="bg-[#0b1220] text-white">ICICI Bank</option>
                  <option value="Axis Bank" className="bg-[#0b1220] text-white">Axis Bank</option>
                  <option value="Kotak Mahindra" className="bg-[#0b1220] text-white">Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? 'Processing Transaction...' : `Deposit ₹${Number(depositAmount || 0).toLocaleString()} Now`}</span>
            </button>
          </form>
        )}

        {/* Withdrawal Flow */}
        {tab === 'withdraw' && (
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Withdrawal Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-500 text-sm font-bold">₹</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="glass-input w-full pl-8 pr-3 py-2 text-sm font-mono-numbers"
                  min="500"
                  max={currentBalance}
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Maximum withdrawal: ₹{currentBalance.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Beneficiary Name</label>
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  className="glass-input w-full py-2 px-3 text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="glass-input w-full py-2 px-3 text-xs font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  className="glass-input w-full py-2 px-3 text-xs font-mono uppercase"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || Number(withdrawAmount) > currentBalance}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-950/40 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{loading ? 'Initiating Settlement...' : `Withdraw ₹${Number(withdrawAmount || 0).toLocaleString()} to Bank`}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
