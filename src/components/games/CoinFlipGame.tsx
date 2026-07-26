import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coins, Sparkles, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

interface Props {
  onClose: () => void;
}

export const CoinFlipGame: React.FC<Props> = ({ onClose }) => {
  const { deductBet, addWin, triggerConfetti } = useAuth();
  const [betAmount, setBetAmount] = useState<number>(5);
  const [chosenSide, setChosenSide] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipResult, setFlipResult] = useState<'heads' | 'tails' | null>(null);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const handleFlip = () => {
    if (isFlipping) return;
    if (!deductBet(betAmount)) {
      alert('Insufficient wallet balance to flip coin!');
      return;
    }

    setIsFlipping(true);
    setFlipResult(null);
    setWinMessage(null);
    sound.playClick();

    // Sound ticking
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      sound.playTick();
      if (tickCount >= 10) clearInterval(tickInterval);
    }, 150);

    setTimeout(() => {
      const outcome: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
      setFlipResult(outcome);
      setIsFlipping(false);

      if (outcome === chosenSide) {
        const payout = betAmount * 1.96;
        setWinMessage(`🎉 WINNER! Coin landed on ${outcome.toUpperCase()}. Won $${payout.toFixed(2)}`);
        addWin(payout, 'Emerald Coin Flip');
        triggerConfetti();
      } else {
        setWinMessage(`Landed on ${outcome.toUpperCase()}. Better luck next flip!`);
      }
    }, 2000);
  };

  return (
    <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 bg-clip-text text-transparent">
              Emerald Coin Flip
            </h2>
            <p className="text-xs text-zinc-400">Predict Heads or Tails on a 24k gold coin for a 1.96x multiplier payout!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg p-2 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Coin Flip Stage */}
      <div className="my-8 flex flex-col items-center justify-center min-h-[180px]">
        <motion.div
          animate={{
            rotateY: isFlipping ? [0, 1800] : 0,
            scale: isFlipping ? [1, 1.3, 1] : 1
          }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 border-4 border-amber-300 flex items-center justify-center shadow-xl shadow-amber-500/30 text-zinc-950 font-black text-2xl uppercase"
        >
          {isFlipping ? '...' : flipResult ? flipResult : chosenSide}
        </motion.div>
      </div>

      {/* Side Selector */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => {
            sound.playClick();
            setChosenSide('heads');
          }}
          disabled={isFlipping}
          className={`py-3 rounded-xl font-extrabold text-sm border transition-all ${
            chosenSide === 'heads'
              ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-lg shadow-amber-500/20'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
          }`}
        >
          👑 HEADS
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setChosenSide('tails');
          }}
          disabled={isFlipping}
          className={`py-3 rounded-xl font-extrabold text-sm border transition-all ${
            chosenSide === 'tails'
              ? 'bg-emerald-500 text-zinc-950 border-emerald-300 shadow-lg shadow-emerald-500/20'
              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
          }`}
        >
          ⚡ TAILS
        </button>
      </div>

      {/* Stake Selector */}
      <div className="mb-6 flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
        <span className="text-xs text-zinc-400 font-semibold">Bet Stake ($):</span>
        <div className="flex items-center gap-2">
          {[1, 5, 10, 50, 100].map(val => (
            <button
              key={val}
              disabled={isFlipping}
              onClick={() => setBetAmount(val)}
              className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                betAmount === val
                  ? 'bg-amber-500 text-zinc-950 border-amber-300'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
              }`}
            >
              ${val}
            </button>
          ))}
        </div>
      </div>

      {/* Result Message */}
      {winMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl mb-4 text-center font-bold text-sm border flex items-center justify-center gap-2 ${
            winMessage.includes('WINNER')
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
          }`}
        >
          {winMessage.includes('WINNER') ? (
            <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
          ) : (
            <Coins className="w-5 h-5 text-zinc-400" />
          )}
          {winMessage}
        </motion.div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div>
          <span className="text-xs text-zinc-400 block">Potential Win:</span>
          <span className="text-lg font-bold text-amber-400">${(betAmount * 1.96).toFixed(2)}</span>
        </div>

        <button
          onClick={handleFlip}
          disabled={isFlipping}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-extrabold rounded-xl text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" /> FLIP COIN (${betAmount})
        </button>
      </div>
    </div>
  );
};
