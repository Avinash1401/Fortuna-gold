import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, RefreshCw, Crown, Coins, Gem, Flame, Star, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

interface Props {
  onClose: () => void;
}

const SYMBOLS = [
  { id: 'crown', label: 'Crown', icon: Crown, prize: 50, color: 'text-amber-400' },
  { id: 'coins', label: 'Coins', icon: Coins, prize: 25, color: 'text-yellow-400' },
  { id: 'gem', label: 'Diamond', icon: Gem, prize: 100, color: 'text-cyan-400' },
  { id: 'flame', label: 'Flame', icon: Flame, prize: 10, color: 'text-orange-400' },
  { id: 'star', label: 'Star', icon: Star, prize: 5, color: 'text-emerald-400' },
  { id: 'zap', label: 'Lightning', icon: Zap, prize: 15, color: 'text-purple-400' }
];

export const ScratchCardGame: React.FC<Props> = ({ onClose }) => {
  const { deductBet, addWin, triggerConfetti } = useAuth();
  const [ticketPrice] = useState(2);
  const [isPurchased, setIsPurchased] = useState(false);
  const [panels, setPanels] = useState<{ symbol: typeof SYMBOLS[0]; revealed: boolean }[]>([]);
  const [revealedCount, setRevealedCount] = useState(0);
  const [winMessage, setWinMessage] = useState<string | null>(null);

  const buyNewCard = () => {
    if (!deductBet(ticketPrice)) {
      alert('Insufficient wallet balance to buy Scratch Ticket ($2)');
      return;
    }

    sound.playCoin();

    // Generate 6 panels, biased towards matching 3
    const shouldWin = Math.random() < 0.6;
    let cardSymbols: typeof SYMBOLS[0][] = [];

    if (shouldWin) {
      const winningSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      cardSymbols = [winningSymbol, winningSymbol, winningSymbol];
      while (cardSymbols.length < 6) {
        cardSymbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      }
      cardSymbols.sort(() => 0.5 - Math.random());
    } else {
      while (cardSymbols.length < 6) {
        cardSymbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      }
    }

    setPanels(cardSymbols.map(s => ({ symbol: s, revealed: false })));
    setRevealedCount(0);
    setIsPurchased(true);
    setWinMessage(null);
  };

  const revealPanel = (idx: number) => {
    if (!isPurchased || panels[idx].revealed) return;

    sound.playScratch();
    const updated = [...panels];
    updated[idx].revealed = true;
    setPanels(updated);

    const newCount = revealedCount + 1;
    setRevealedCount(newCount);

    if (newCount === 6) {
      // Check for 3 matches
      const counts: Record<string, number> = {};
      updated.forEach(p => {
        counts[p.symbol.id] = (counts[p.symbol.id] || 0) + 1;
      });

      let matchedSymbolId: string | null = null;
      Object.entries(counts).forEach(([symId, count]) => {
        if (count >= 3) matchedSymbolId = symId;
      });

      if (matchedSymbolId) {
        const matchingSymbol = SYMBOLS.find(s => s.id === matchedSymbolId)!;
        setWinMessage(`🎉 MATCHED 3 ${matchingSymbol.label.toUpperCase()}! WON $${matchingSymbol.prize}`);
        addWin(matchingSymbol.prize, 'Speed Scratch Gold');
        triggerConfetti();
      } else {
        setWinMessage('No match. Try another card!');
      }
    }
  };

  const revealAll = () => {
    if (!isPurchased) return;
    panels.forEach((_, idx) => revealPanel(idx));
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
              Speed Scratch Gold
            </h2>
            <p className="text-xs text-zinc-400">Scratch 6 golden panels. Match 3 identical symbols to win up to $100!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg p-2 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Card Content */}
      <div className="my-6">
        {!isPurchased ? (
          <div className="bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px]">
            <Crown className="w-12 h-12 text-amber-400 mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-amber-300 mb-1">Buy Scratch Ticket</h3>
            <p className="text-xs text-zinc-400 mb-4 max-w-xs">Guaranteed fun with high win frequency. Match 3 crowns for $50 or 3 diamonds for $100!</p>
            <button
              onClick={buyNewCard}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-extrabold rounded-xl text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              Buy Ticket ($2.00)
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {panels.map((p, idx) => {
                const IconComp = p.symbol.icon;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: p.revealed ? 1 : 1.03 }}
                    whileTap={{ scale: p.revealed ? 1 : 0.95 }}
                    onClick={() => revealPanel(idx)}
                    className={`h-28 rounded-xl border flex flex-col items-center justify-center p-2 relative overflow-hidden transition-all shadow-md ${
                      p.revealed
                        ? 'bg-zinc-900 border-amber-500/40'
                        : 'bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 border-yellow-300 text-zinc-950 cursor-pointer shadow-amber-500/20'
                    }`}
                  >
                    {!p.revealed ? (
                      <div className="flex flex-col items-center gap-1">
                        <Sparkles className="w-6 h-6 text-zinc-950 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-zinc-900">Scratch</span>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <IconComp className={`w-8 h-8 ${p.symbol.color}`} />
                        <span className="text-xs font-bold text-zinc-200">{p.symbol.label}</span>
                        <span className="text-[10px] text-amber-400 font-semibold">${p.symbol.prize}</span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {revealedCount < 6 && (
              <div className="flex justify-end">
                <button
                  onClick={revealAll}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reveal All Panels
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Win Banner Message */}
      {winMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-xl mb-4 text-center font-bold text-sm border flex items-center justify-center gap-2 ${
            winMessage.includes('MATCHED')
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
          }`}
        >
          {winMessage.includes('MATCHED') ? (
            <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
          ) : (
            <Sparkles className="w-5 h-5 text-zinc-400" />
          )}
          {winMessage}
        </motion.div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div>
          <span className="text-xs text-zinc-400 block">Ticket Price:</span>
          <span className="text-lg font-bold text-amber-400">${ticketPrice}.00</span>
        </div>

        {isPurchased && (
          <button
            onClick={buyNewCard}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-extrabold rounded-xl text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            Buy Next Ticket ($2)
          </button>
        )}
      </div>
    </div>
  );
};
