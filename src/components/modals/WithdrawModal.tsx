import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, ArrowDownRight, Sparkles, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

export const WithdrawModal: React.FC = () => {
  const { isWithdrawModalOpen, setIsWithdrawModalOpen, withdrawFunds, user } = useAuth();
  const [destination, setDestination] = useState<string>('');
  const [amount, setAmount] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isWithdrawModalOpen || !user) return null;

  const totalAvailable = user.winningBalance + user.balance;

  const handleWithdraw = () => {
    sound.playClick();
    if (amount > totalAvailable) {
      setErrorMsg(`Amount exceeds total withdrawable balance (₹${totalAvailable.toLocaleString('en-IN', { minimumFractionDigits: 2 })})`);
      return;
    }
    if (!destination.trim()) {
      setErrorMsg('Please enter a valid wallet address or bank account');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const ok = withdrawFunds(amount, destination);
      if (!ok) {
        setErrorMsg('Withdrawal failed. Please check your available balance.');
      }
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white shadow-2xl relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => setIsWithdrawModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800 mb-6">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <ArrowDownRight className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-emerald-400 bg-clip-text text-transparent">
                Withdraw Winnings
              </h3>
              <p className="text-xs text-zinc-400">Fast 15-minute cashouts directly to your crypto wallet or bank account.</p>
            </div>
          </div>

          {/* Balance info pill */}
          <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 mb-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-0.5">Withdrawable Winnings</span>
              <span className="text-xl font-extrabold text-emerald-400 font-mono">₹{user.winningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-0.5">Main Cash Balance</span>
              <span className="text-sm font-bold text-amber-400 font-mono">₹{user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Destination input */}
          <div className="mb-4">
            <label className="text-xs font-bold text-zinc-300 block mb-1.5">Payout UPI ID / PhonePe / Bank Account:</label>
            <input
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="e.g. name@upi, Paytm, or IFSC + Account No."
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Amount input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-zinc-300">Withdraw Amount (₹ INR):</label>
              <button
                type="button"
                onClick={() => setAmount(totalAvailable)}
                className="text-[11px] font-bold text-amber-400 hover:underline"
              >
                Max (₹{totalAvailable.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-bold">₹</span>
              <input
                type="number"
                min="100"
                max={totalAvailable}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-xs mb-4">
              {errorMsg}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleWithdraw}
            disabled={isProcessing || amount < 10 || amount > totalAvailable}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>Processing Cashout...</>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Request Cashout (₹{amount.toLocaleString()})
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-zinc-500 mt-4 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Zero Fee Cashout Processing for Gold+ VIP Members
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
