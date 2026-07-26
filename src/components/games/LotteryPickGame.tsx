import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Dices, RefreshCw, Trophy, Ticket, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

interface Props {
  onClose: () => void;
}

export const LotteryPickGame: React.FC<Props> = ({ onClose }) => {
  const { user, buyTicket, addWin, triggerConfetti, placeLiveBet, updateLiveBetStatus } = useAuth();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [ticketPrice] = useState<number>(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const toggleNumber = (num: number) => {
    sound.playClick();
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      if (selectedNumbers.length < 6) {
        setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
      }
    }
  };

  const handleQuickPick = () => {
    sound.playClick();
    const picks = new Set<number>();
    while (picks.size < 6) {
      picks.add(Math.floor(Math.random() * 49) + 1);
    }
    setSelectedNumbers(Array.from(picks).sort((a, b) => a - b));
  };

  const clearSelection = () => {
    sound.playClick();
    setSelectedNumbers([]);
    setDrawnNumbers([]);
    setWinMessage(null);
  };

  const handleBuyAndDraw = () => {
    if (selectedNumbers.length !== 6) return;
    if (!user) return;

    const success = buyTicket('powerball-649', 'Fortuna Powerball 6/49', selectedNumbers, ticketPrice);
    if (!success) {
      alert('Insufficient wallet balance to purchase ticket!');
      return;
    }

    const liveBet = placeLiveBet('powerball-649', 'Fortuna Powerball 6/49', ticketPrice, `Picked [${selectedNumbers.join(', ')}]`, 250000);

    setIsDrawing(true);
    setDrawnNumbers([]);
    setWinMessage(null);

    // Simulate progressive ball draw
    const results = new Set<number>();
    // Make drawn numbers biased to give 2-5 matches frequently for fun
    const includeUserMatchCount = Math.floor(Math.random() * 4) + 1; // 1 to 4 matches
    const userSample = [...selectedNumbers].sort(() => 0.5 - Math.random()).slice(0, includeUserMatchCount);
    userSample.forEach(n => results.add(n));

    while (results.size < 6) {
      results.add(Math.floor(Math.random() * 49) + 1);
    }

    const finalDrawn = Array.from(results).sort((a, b) => a - b);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDrawnNumbers(finalDrawn.slice(0, step));
      sound.playTick();

      if (step === 6) {
        clearInterval(interval);
        setIsDrawing(false);

        // Calculate matches
        const matches = selectedNumbers.filter(n => finalDrawn.includes(n)).length;
        let payout = 0;

        if (matches === 6) payout = 250000;
        else if (matches === 5) payout = 5000;
        else if (matches === 4) payout = 250;
        else if (matches === 3) payout = 25;
        else if (matches === 2) payout = 5;

        if (payout > 0) {
          setWinMessage(`🎉 CONGRATULATIONS! Matched ${matches} Numbers! Won $${payout.toLocaleString()}`);
          addWin(payout, 'Powerball 6/49');
          updateLiveBetStatus(liveBet.id, 'won', payout);
          triggerConfetti();
        } else {
          setWinMessage(`Matched ${matches} numbers. Better luck on the next draw!`);
          updateLiveBetStatus(liveBet.id, 'lost', 0);
        }
      }
    }, 600);
  };

  return (
    <div className="bg-zinc-950 border border-amber-500/20 rounded-2xl p-6 max-w-2xl w-full text-white shadow-2xl overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Fortuna Powerball 6/49
            </h2>
            <p className="text-xs text-zinc-400">Pick 6 lucky numbers or Quick Pick to draw instantly!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg p-2 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Selected Numbers Bar */}
      <div className="my-5 p-4 bg-zinc-900/80 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-zinc-400 block mb-1">Your 6 Chosen Numbers:</span>
          <div className="flex items-center gap-2 min-h-[40px]">
            {[0, 1, 2, 3, 4, 5].map(idx => {
              const num = selectedNumbers[idx];
              return (
                <motion.div
                  key={idx}
                  layout
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border ${
                    num
                      ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-zinc-950 border-yellow-300 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-800/50 text-zinc-600 border-zinc-700/50'
                  }`}
                >
                  {num || '?'}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickPick}
            disabled={isDrawing}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-semibold transition-all"
          >
            <Dices className="w-4 h-4" /> Quick Pick
          </button>
          <button
            onClick={clearSelection}
            disabled={isDrawing || selectedNumbers.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 rounded-lg text-xs transition-all disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Number Grid 1..49 */}
      <div className="grid grid-cols-7 sm:grid-cols-10 gap-2 mb-6 max-h-[220px] overflow-y-auto p-1 custom-scrollbar">
        {Array.from({ length: 49 }, (_, i) => i + 1).map(num => {
          const isSelected = selectedNumbers.includes(num);
          return (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              disabled={isDrawing || (!isSelected && selectedNumbers.length >= 6)}
              className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center border ${
                isSelected
                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-zinc-950 border-amber-300 shadow-sm scale-105'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:border-zinc-700'
              } disabled:opacity-40`}
            >
              {num}
            </button>
          );
        })}
      </div>

      {/* Live Ball Draw Display */}
      {drawnNumbers.length > 0 && (
        <div className="mb-5 p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-xl">
          <span className="text-xs text-emerald-400 font-semibold block mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
            Live Draw Result:
          </span>
          <div className="flex items-center gap-2">
            {drawnNumbers.map((num, idx) => {
              const isMatched = selectedNumbers.includes(num);
              return (
                <motion.div
                  key={idx}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shadow-lg border ${
                    isMatched
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-300 shadow-emerald-500/40'
                      : 'bg-zinc-800 text-white border-zinc-600'
                  }`}
                >
                  {num}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Win Banner Message */}
      <AnimatePresence>
        {winMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-xl mb-4 text-center font-bold text-sm border flex items-center justify-center gap-2 ${
              winMessage.includes('CONGRATULATIONS')
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}
          >
            {winMessage.includes('CONGRATULATIONS') ? (
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-zinc-400" />
            )}
            {winMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Action */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div>
          <span className="text-xs text-zinc-400 block">Ticket Price:</span>
          <span className="text-lg font-bold text-amber-400">${ticketPrice}.00 Cash</span>
        </div>

        <button
          onClick={handleBuyAndDraw}
          disabled={selectedNumbers.length !== 6 || isDrawing}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-extrabold rounded-xl text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
        >
          {isDrawing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Drawing Balls...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Buy Ticket & Draw Now
            </>
          )}
        </button>
      </div>
    </div>
  );
};
