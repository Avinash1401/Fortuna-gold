import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, Wallet, CreditCard, Sparkles, X, Check, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sound } from '../../utils/audio';

export const DepositModal: React.FC = () => {
  const { isDepositModalOpen, setIsDepositModalOpen, depositFunds } = useAuth();
  const { showToast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string>('UPI / QR');
  const [amount, setAmount] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);

  if (!isDepositModalOpen) return null;

  const methods = [
    { id: 'UPI / QR', name: 'UPI / PhonePe / Paytm / GPay', type: 'UPI', bonus: 'Instant 0% Fee' },
    { id: 'IMPS Bank Transfer', name: 'IMPS / Net Banking', type: 'Bank', bonus: 'Instant Transfer' },
    { id: 'USDT (TRC20)', name: 'USDT Crypto', type: 'Crypto', bonus: '+10% Bonus' },
    { id: 'Debit / Credit Card', name: 'Debit / Credit Card', type: 'Card', bonus: 'Instant' }
  ];

  const handleDeposit = () => {
    sound.playClick();

    if (!amount || amount < 100) {
      showToast('Deposit Error', 'Minimum deposit amount is ₹100', 'error');
      return;
    }
    if (amount > 500000) {
      showToast('Deposit Limit Reached', 'Maximum single deposit is ₹5,00,000', 'error');
      return;
    }

    setIsProcessing(true);
    setProgress(15);
    setProcessStep('Initiating secure payment gateway...');

    setTimeout(() => {
      setProgress(55);
      setProcessStep(`Confirming ₹${amount.toLocaleString()} top-up via ${selectedMethod}...`);
    }, 600);

    setTimeout(() => {
      setProgress(90);
      setProcessStep('Crediting wallet balance & calculating bonus...');
    }, 1100);

    setTimeout(() => {
      setProgress(100);
      setIsProcessing(false);
      depositFunds(amount, selectedMethod);
      showToast(
        'Deposit Successful!',
        `₹${amount.toLocaleString('en-IN')} credited to your wallet via ${selectedMethod} (+₹${(amount * 0.1).toFixed(0)} Bonus Cash).`,
        'success'
      );
    }, 1600);
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
            onClick={() => setIsDepositModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800 mb-6">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-emerald-400 bg-clip-text text-transparent">
                Deposit Wallet Funds
              </h3>
              <p className="text-xs text-zinc-400">Select payment method & amount to credit your balance instantly.</p>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="mb-6">
            <label className="text-xs font-bold text-zinc-300 block mb-2">Select Payment Method:</label>
            <div className="grid grid-cols-2 gap-2">
              {methods.map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedMethod(m.id);
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedMethod === m.id
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {m.type === 'Crypto' ? <Wallet className="w-4 h-4 text-amber-400" /> : <CreditCard className="w-4 h-4 text-emerald-400" />}
                    <div>
                      <span className="text-xs font-bold block">{m.name}</span>
                      <span className="text-[10px] text-emerald-400 font-semibold">{m.bonus}</span>
                    </div>
                  </div>
                  {selectedMethod === m.id && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Amounts */}
          <div className="mb-6">
            <label className="text-xs font-bold text-zinc-300 block mb-2">Select Deposit Amount (₹ INR):</label>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[500, 1000, 2000, 5000, 10000].map(val => (
                <button
                  key={val}
                  onClick={() => {
                    sound.playClick();
                    setAmount(val);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    amount === val
                      ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  ₹{val.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-zinc-500 font-bold">₹</span>
              <input
                type="number"
                min="100"
                max="500000"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full pl-7 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Bonus calculation pill */}
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl mb-6 text-xs flex items-center justify-between text-emerald-300 font-semibold">
            <span>Estimated Instant Cash Bonus:</span>
            <span className="font-bold text-amber-400">+₹{(amount * 0.1).toFixed(2)} Bonus Cash</span>
          </div>

          {/* Loading status & progress indicator */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-zinc-900 border border-amber-500/30 rounded-xl space-y-2"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {processStep}
                </span>
                <span className="text-zinc-400 font-mono font-bold">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <button
            onClick={handleDeposit}
            disabled={isProcessing || amount < 100}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 flex items-center justify-center gap-2 relative overflow-hidden"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" /> Processing Top-Up...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Deposit ₹{amount.toLocaleString()}.00 Now
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-zinc-500 mt-4 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted Instant Payment Processing
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
