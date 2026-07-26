import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

interface Props {
  onClose: () => void;
}

const WHEEL_SEGMENTS = [
  { label: '$10 Cash', multiplier: 10, color: 'bg-amber-500 text-zinc-950', prize: 10 },
  { label: '$25 Cash', multiplier: 25, color: 'bg-emerald-600 text-white', prize: 25 },
  { label: '$5 Cash', multiplier: 5, color: 'bg-amber-600 text-zinc-950', prize: 5 },
  { label: '🌟 $500 JACKPOT', multiplier: 500, color: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-zinc-950', prize: 500 },
  { label: '$15 Cash', multiplier: 15, color: 'bg-emerald-500 text-zinc-950', prize: 15 },
  { label: '$2 Cash', multiplier: 2, color: 'bg-zinc-800 text-white', prize: 2 },
  { label: '$50 Cash', multiplier: 50, color: 'bg-amber-400 text-zinc-950', prize: 50 },
  { label: '$100 Cash', multiplier: 100, color: 'bg-emerald-400 text-zinc-950', prize: 100 }
];

export const FortuneWheelGame: React.FC<Props> = ({ onClose }) => {
  const { deductBet, addWin, triggerConfetti } = useAuth();
  const [spinCost] = useState(5);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const [wonPrize, setWonPrize] = useState<string | null>(null);

  const handleSpin = () => {
    if (isSpinning) return;
    if (!deductBet(spinCost)) {
      alert('Insufficient wallet balance to spin ($5 required)');
      return;
    }

    setIsSpinning(true);
    setWonPrize(null);

    // Random target segment index
    const randomIndex = Math.floor(Math.random() * WHEEL_SEGMENTS.length);
    const segmentDegree = 360 / WHEEL_SEGMENTS.length;
    // Extra rotations for wheel spin effect
    const extraTurns = 5 * 360;
    const targetDegree = rotationDegree + extraTurns + (360 - (randomIndex * segmentDegree + segmentDegree / 2));

    setRotationDegree(targetDegree);
    sound.playClick();

    // Sound ticking effect
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      tickCount++;
      sound.playTick();
      if (tickCount >= 18) clearInterval(tickInterval);
    }, 200);

    setTimeout(() => {
      setIsSpinning(false);
      const winner = WHEEL_SEGMENTS[randomIndex];
      setWonPrize(`Won ${winner.label}!`);
      addWin(winner.prize, 'Lucky Gold Wheel');
      triggerConfetti();
    }, 4000);
  };

  return (
    <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 bg-clip-text text-transparent">
              Lucky Gold Wheel Spin
            </h2>
            <p className="text-xs text-zinc-400">$5 per spin. Guaranteed instant cash multiplier every turn!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg p-2 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Wheel Stage */}
      <div className="my-8 flex flex-col items-center justify-center relative">
        {/* Top Pointer */}
        <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-md" />

        {/* Wheel Disk */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-amber-500/80 shadow-2xl shadow-amber-500/20 relative overflow-hidden flex items-center justify-center bg-zinc-900">
          <motion.div
            className="w-full h-full rounded-full relative"
            animate={{ rotate: rotationDegree }}
            transition={{ duration: 4, ease: [0.15, 0.99, 0.35, 1.0] }}
          >
            {WHEEL_SEGMENTS.map((seg, idx) => {
              const rotate = idx * (360 / WHEEL_SEGMENTS.length);
              return (
                <div
                  key={idx}
                  className="absolute top-0 left-1/2 -ml-12 w-24 h-32 origin-bottom flex flex-col items-center justify-start pt-3 font-bold text-xs"
                  style={{ transform: `rotate(${rotate}deg)` }}
                >
                  <span className={`px-2 py-1 rounded-md text-[11px] font-extrabold shadow ${seg.color}`}>
                    {seg.label}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* Center Hub */}
          <div className="absolute z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 border-2 border-zinc-950 flex items-center justify-center shadow-lg text-zinc-950 font-black text-xs">
            FORTUNA
          </div>
        </div>
      </div>

      {/* Prize Result Banner */}
      {wonPrize && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-3 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border border-amber-500/40 rounded-xl mb-4 text-center text-amber-300 font-extrabold text-sm flex items-center justify-center gap-2"
        >
          <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
          {wonPrize}
        </motion.div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div>
          <span className="text-xs text-zinc-400 block">Spin Stake:</span>
          <span className="text-lg font-bold text-amber-400">${spinCost}.00</span>
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-extrabold rounded-xl text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSpinning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Spinning Wheel...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> SPIN NOW ($5)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
