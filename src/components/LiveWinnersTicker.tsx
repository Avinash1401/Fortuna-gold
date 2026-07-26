import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LiveWinnersTicker: React.FC = () => {
  const { recentWinners } = useAuth();

  return (
    <div className="bg-zinc-950 border-y border-amber-500/20 py-3 px-4 my-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Label */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold whitespace-nowrap shrink-0">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>RECENT WINNERS</span>
        </div>

        {/* Ticker marquee */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex items-center gap-6 whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
          >
            {recentWinners.concat(recentWinners).map((winner, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs"
              >
                <img
                  src={winner.avatar}
                  alt={winner.username}
                  className="w-5 h-5 rounded-full object-cover border border-amber-400/50"
                  referrerPolicy="no-referrer"
                />
                <span className="font-bold text-zinc-200">{winner.username}</span>
                <span className="text-zinc-500">won</span>
                <span className="font-extrabold text-amber-400 font-mono">
                  ${winner.amountWon.toLocaleString()}
                </span>
                <span className="text-zinc-500 text-[10px]">on {winner.gameTitle}</span>
                <Sparkles className="w-3 h-3 text-amber-400 ml-1" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
