import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { WalletModal } from '../../components/WalletModal';

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAW' | 'TRADE_BUY' | 'TRADE_SELL';
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  timestamp: number;
  description: string;
}

export const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(1000000);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-90812',
      type: 'DEPOSIT',
      amount: 1000000,
      status: 'COMPLETED',
      timestamp: Date.now() - 86400000,
      description: 'Initial Demo Seed Capital via UPI'
    },
    {
      id: 'TXN-90813',
      type: 'TRADE_BUY',
      amount: 9950,
      status: 'COMPLETED',
      timestamp: Date.now() - 3600000,
      description: '100 shares DEMO @ ₹99.50 executed'
    }
  ]);

  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const apiBase = isLocal ? '' : 'https://orderpulse-mtx.up.railway.app';

  const fetchBalance = async () => {
    try {
      const res = await fetch(`${apiBase}/api/wallet/balances?userId=USER-DEMO-01`);
      if (res.ok) {
        const data = await res.json();
        if (data.inr !== undefined) setBalance(data.inr);
      }
    } catch {}
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0E0E0E] text-[#44475B] dark:text-[#E5E7EB] transition-colors py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Wallet Balance Hero Card */}
        <div className="bg-gradient-to-tr from-[#00B386] to-teal-700 text-white p-8 rounded-3xl shadow-xl shadow-emerald-950/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-100 text-xs font-semibold uppercase tracking-wider">
              <Wallet className="w-4 h-4" />
              <span>Available Margin & Trading Funds</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight mt-2">
              ₹{(balance / 1).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h1>
            <p className="text-xs text-emerald-100 mt-2">
              Reserved for Open Orders: <strong className="font-mono">₹0.00</strong> • Collateral Margin: <strong className="font-mono">₹0.00</strong>
            </p>
          </div>

          <div className="flex sm:flex-col gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsDepositOpen(true)}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-white text-[#00B386] hover:bg-slate-50 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Funds</span>
            </button>
            <Link
              to="/trade"
              className="flex-1 sm:flex-initial px-6 py-3 rounded-full bg-black/20 hover:bg-black/30 text-white font-bold text-xs border border-white/20 transition flex items-center justify-center gap-2"
            >
              <span>Terminal</span>
            </Link>
          </div>
        </div>

        {/* Ledger & Transactions */}
        <div className="bg-white dark:bg-[#141414] p-6 sm:p-8 rounded-3xl border border-[#E8E8E8] dark:border-white/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#44475B] dark:text-white">
              Ledger Transactions
            </h2>
            <button
              onClick={fetchBalance}
              className="p-2 rounded-xl border border-[#E8E8E8] dark:border-white/10 text-[#7C7E8C] hover:bg-slate-50 dark:hover:bg-neutral-800 transition"
              title="Refresh Balance"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => {
              const isCredit = tx.type === 'DEPOSIT' || tx.type === 'TRADE_SELL';
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/40 border border-slate-100 dark:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCredit
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#00B386]'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-[#EB5B3C]'
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#44475B] dark:text-white">
                        {tx.description}
                      </div>
                      <div className="text-[11px] text-[#7C7E8C] font-mono">
                        {tx.id} • {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-bold font-mono ${
                        isCredit ? 'text-[#00B386]' : 'text-[#EB5B3C]'
                      }`}
                    >
                      {isCredit ? '+' : '-'}₹{(tx.amount / 1).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <WalletModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        apiBase={apiBase}
        currentBalance={balance}
        onBalanceUpdated={fetchBalance}
      />
    </div>
  );
};
