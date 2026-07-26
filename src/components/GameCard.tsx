import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Clock, Flame, Play, Trophy } from 'lucide-react';
import { Game } from '../types';
import { sound } from '../utils/audio';

interface Props {
  game: Game;
  onPlay: (game: Game) => void;
}

export const GameCard: React.FC<Props> = ({ game, onPlay }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(game.nextDrawSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatCountdown = (secs: number) => {
    if (secs <= 0) return 'DRAW LIVE NOW';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-neutral-900 border border-white/10 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-emerald-500/5 transition-all flex flex-col group relative"
    >
      {/* Game Image Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-black">
        <img
          src={game.image}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />

        {/* Badge */}
        {game.badge && (
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400 text-black shadow-md">
            {game.badge}
          </div>
        )}

        {/* Category Tag */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-black/80 backdrop-blur-md text-emerald-400 border border-white/10">
          {game.category}
        </div>

        {/* Countdown Timer */}
        {game.nextDrawSeconds > 0 && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1 rounded-lg bg-black/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
            <span className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Next Draw:
            </span>
            <span className="font-mono text-amber-400 text-xs">{formatCountdown(secondsLeft)}</span>
          </div>
        )}
      </div>

      {/* Game Card Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors mb-1">
            {game.title}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Jackpot & Stats */}
        <div className="pt-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase text-neutral-500 block font-bold font-mono">Jackpot Pool</span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                ${game.jackpotAmount.toLocaleString()}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase text-neutral-500 block font-bold font-mono flex items-center gap-1 justify-end">
                <Users className="w-3 h-3 text-emerald-400" /> Players
              </span>
              <span className="text-xs font-mono font-bold text-neutral-300">
                {game.playersCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              sound.playClick();
              onPlay(game);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md active:scale-98"
          >
            <Play className="w-3.5 h-3.5 fill-black" /> Play (${game.minTicketPrice})
          </button>
        </div>
      </div>
    </motion.div>
  );
};
