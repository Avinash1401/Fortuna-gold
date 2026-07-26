import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bomb, Coins, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

interface Props {
  onClose: () => void;
}

export const MinesGame: React.FC<Props> = ({ onClose }) => {
  const { deductBet, addWin, triggerConfetti, placeLiveBet, updateLiveBetStatus } = useAuth();
  const [betAmount, setBetAmount] = useState<number>(2);
  const [mineCount, setMineCount] = useState<number>(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'cashout' | 'busted'>('idle');
  const [tiles, setTiles] = useState<{ isMine: boolean; revealed: boolean }[]>([]);
  const [safeRevealed, setSafeRevealed] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [currentBetId, setCurrentBetId] = useState<string | null>(null);

  const startNewGame = () => {
    if (!deductBet(betAmount)) {
      alert('Insufficient wallet balance to start Mines!');
      return;
    }

    const liveBet = placeLiveBet('mines-gold', 'Mines Gold Rush', betAmount, `${mineCount} Mines Field`, betAmount * 5);
    setCurrentBetId(liveBet.id);

    // Generate 25 tiles with mineCount mines
    const grid = Array(25).fill(null).map(() => ({ isMine: false, revealed: false }));
    let placed = 0;
    while (placed < mineCount) {
      const idx = Math.floor(Math.random() * 25);
      if (!grid[idx].isMine) {
        grid[idx].isMine = true;
        placed++;
      }
    }

    setTiles(grid);
    setSafeRevealed(0);
    setMultiplier(1.15);
    setGameState('playing');
    sound.playClick();
  };

  const handleTileClick = (idx: number) => {
    if (gameState !== 'playing' || tiles[idx].revealed) return;

    const tile = tiles[idx];
    const updated = [...tiles];
    updated[idx].revealed = true;
    setTiles(updated);

    if (tile.isMine) {
      // BOOM
      sound.playClick();
      setGameState('busted');
      if (currentBetId) {
        updateLiveBetStatus(currentBetId, 'lost', 0);
      }
      // Reveal all mines
      setTiles(tiles.map(t => ({ ...t, revealed: true })));
    } else {
      sound.playCoin();
      const newSafe = safeRevealed + 1;
      setSafeRevealed(newSafe);
      // Calculate multiplier step
      const nextMult = parseFloat((1.15 + newSafe * 0.28).toFixed(2));
      setMultiplier(nextMult);
    }
  };

  const cashOut = () => {
    if (gameState !== 'playing' || safeRevealed === 0) return;

    const winAmount = parseFloat((betAmount * multiplier).toFixed(2));
    setGameState('cashout');
    addWin(winAmount, 'Mines Gold Rush');
    if (currentBetId) {
      updateLiveBetStatus(currentBetId, 'won', winAmount);
    }
    triggerConfetti();
    // Reveal all remaining
    setTiles(tiles.map(t => ({ ...t, revealed: true })));
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
              Mines Gold Rush
            </h2>
            <p className="text-xs text-zinc-400">Uncover safe gold tiles and cash out your multiplier before hitting a bomb!</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg p-2 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Control Panel */}
      <div className="my-4 grid grid-cols-2 gap-3 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
        <div>
          <label className="text-[11px] text-zinc-400 block mb-1">Bet Stake ($):</label>
          <div className="flex items-center gap-1.5">
            {[2, 5, 10, 25].map(val => (
              <button
                key={val}
                disabled={gameState === 'playing'}
                onClick={() => setBetAmount(val)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
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

        <div>
          <label className="text-[11px] text-zinc-400 block mb-1">Mines Count:</label>
          <div className="flex items-center gap-1.5">
            {[1, 3, 5, 8].map(count => (
              <button
                key={count}
                disabled={gameState === 'playing'}
                onClick={() => setMineCount(count)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                  mineCount === count
                    ? 'bg-rose-500 text-white border-rose-300'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                {count} 💣
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5x5 Tile Grid */}
      <div className="my-5 grid grid-cols-5 gap-2">
        {Array.from({ length: 25 }).map((_, idx) => {
          const tile = tiles[idx];
          const isRevealed = tile?.revealed;
          const isMine = tile?.isMine;

          return (
            <motion.button
              key={idx}
              whileHover={{ scale: gameState === 'playing' && !isRevealed ? 1.05 : 1 }}
              whileTap={{ scale: gameState === 'playing' && !isRevealed ? 0.95 : 1 }}
              onClick={() => handleTileClick(idx)}
              disabled={gameState !== 'playing' || isRevealed}
              className={`h-14 rounded-xl border flex items-center justify-center text-lg font-bold transition-all shadow-md ${
                isRevealed
                  ? isMine
                    ? 'bg-rose-950/80 border-rose-500 text-rose-400'
                    : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-emerald-500/20'
                  : 'bg-zinc-900 border-zinc-800 hover:border-amber-500/50 text-zinc-500'
              }`}
            >
              {isRevealed ? (
                isMine ? (
                  <Bomb className="w-6 h-6 text-rose-500 animate-bounce" />
                ) : (
                  <Coins className="w-6 h-6 text-amber-400" />
                )
              ) : (
                <ShieldCheck className="w-5 h-5 text-zinc-700" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Game State Banners */}
      {gameState === 'cashout' && (
        <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl mb-4 text-center text-emerald-300 font-extrabold text-sm flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
          Cashed Out ${(betAmount * multiplier).toFixed(2)} ({multiplier}x Multiplier)!
        </div>
      )}

      {gameState === 'busted' && (
        <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl mb-4 text-center text-rose-300 font-bold text-sm flex items-center justify-center gap-2">
          <Bomb className="w-5 h-5 text-rose-400" />
          Boom! You hit a mine. Better luck next time.
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <div>
          <span className="text-xs text-zinc-400 block">Current Multiplier:</span>
          <span className="text-lg font-bold text-emerald-400">{multiplier}x (${(betAmount * multiplier).toFixed(2)})</span>
        </div>

        {gameState === 'playing' ? (
          <button
            onClick={cashOut}
            disabled={safeRevealed === 0}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-zinc-950 font-extrabold rounded-xl text-sm shadow-md hover:brightness-110 transition-all disabled:opacity-50"
          >
            Cash Out ${(betAmount * multiplier).toFixed(2)}
          </button>
        ) : (
          <button
            onClick={startNewGame}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-extrabold rounded-xl text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" /> Start Game (${betAmount})
          </button>
        )}
      </div>
    </div>
  );
};
