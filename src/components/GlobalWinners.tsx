import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Sparkles, Flame, ShieldCheck, Zap, TrendingUp, PartyPopper } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RecentWinner } from '../types';
import { sound } from '../utils/audio';

const MOCK_EXTRA_WINNERS: RecentWinner[] = [
  {
    id: 'gw_1',
    username: 'CryptoKing_99',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    gameTitle: 'Fortuna Grand Powerball 6/49',
    amountWon: 25000,
    timestamp: 'Just now'
  },
  {
    id: 'gw_2',
    username: 'LuxeSpinner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    gameTitle: 'Mega Fortune Wheel 100x',
    amountWon: 12500,
    timestamp: '1m ago'
  },
  {
    id: 'gw_3',
    username: 'GoldMutter7',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
    gameTitle: 'Gold Rush Mines',
    amountWon: 4200,
    timestamp: '2m ago'
  },
  {
    id: 'gw_4',
    username: 'VipSatoshi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    gameTitle: 'Cyber Coin Flip 2x',
    amountWon: 1800,
    timestamp: '4m ago'
  },
  {
    id: 'gw_5',
    username: 'Aria_G',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    gameTitle: 'Speed Gold Scratch',
    amountWon: 3500,
    timestamp: '5m ago'
  }
];

export const GlobalWinners: React.FC = () => {
  const { recentWinners, triggerConfetti } = useAuth();
  const [feedFilter, setFeedFilter] = useState<'all' | 'jackpots' | 'highrollers'>('all');
  const [cheeredWinner, setCheeredWinner] = useState<string | null>(null);

  // Combined list of context winners and mock winners
  const [winnersList, setWinnersList] = useState<RecentWinner[]>(() => [
    ...MOCK_EXTRA_WINNERS,
    ...recentWinners
  ]);

  // Periodically add simulated big wins to increase dynamic platform activity
  useEffect(() => {
    const interval = setInterval(() => {
      const names = ['Evelyn_Win', 'JackpotJoe', 'Alpha_Rider', 'Royal_Hand', 'Satoshi_G', 'Vip_Luna'];
      const games = ['Fortuna Powerball 6/49', 'Mega Fortune Wheel 100x', 'Gold Rush Mines', 'Speed Gold Scratch'];
      const avatars = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150'
      ];

      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomGame = games[Math.floor(Math.random() * games.length)];
      const randomAmount = Math.floor(Math.random() * 8500) + 500;
      const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

      const newWinner: RecentWinner = {
        id: 'auto_win_' + Date.now(),
        username: randomName,
        avatar: randomAvatar,
        gameTitle: randomGame,
        amountWon: randomAmount,
        timestamp: 'Just now'
      };

      setWinnersList(prev => [newWinner, ...prev.slice(0, 14)]);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleCheer = (winner: RecentWinner) => {
    sound.playWinFanfare();
    triggerConfetti();
    setCheeredWinner(winner.id);
    setTimeout(() => setCheeredWinner(null), 2500);
  };

  const filteredWinners = winnersList.filter(w => {
    if (feedFilter === 'jackpots') return w.amountWon >= 5000;
    if (feedFilter === 'highrollers') return w.amountWon >= 2000;
    return true;
  });

  return (
    <section className="my-8 p-6 bg-gradient-to-b from-neutral-900/90 via-zinc-950 to-neutral-900/90 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden relative">
      {/* Glow Backdrop Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> LIVE GLOBAL FEED
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> PROVABLY FAIR
            </span>
          </div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tight mt-1.5 flex items-center gap-2">
            Global Winners Ticker <Trophy className="w-6 h-6 text-amber-400" />
          </h2>
          <p className="text-xs text-neutral-400 mt-1">Real-time verified payouts & high-roller wins across all games</p>
        </div>

        {/* Live Daily Stats Banner */}
        <div className="flex items-center gap-4 bg-zinc-950/80 p-3 rounded-2xl border border-white/10 shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 uppercase font-bold block">Paid Out Today</span>
            <span className="text-base font-black text-emerald-400 font-mono">$1,482,920.00</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <span className="text-[10px] text-neutral-400 uppercase font-bold block">Top Winner</span>
            <span className="text-base font-black text-amber-400 font-mono">$25,000.00</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Cheering Toast */}
      <div className="relative z-10 my-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-white/10">
          {(['all', 'jackpots', 'highrollers'] as const).map(f => (
            <button
              key={f}
              onClick={() => {
                sound.playClick();
                setFeedFilter(f);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                feedFilter === f
                  ? 'bg-amber-500 text-black font-extrabold shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All Wins' : f === 'jackpots' ? 'Jackpots ($5,000+)' : 'High Rollers ($2,000+)'}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {cheeredWinner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-emerald-500 text-black font-extrabold text-xs rounded-full flex items-center gap-1.5 shadow-lg"
            >
              <PartyPopper className="w-4 h-4 text-black" /> Cheered Winner! Confetti Triggered!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Infinite Smooth Scrolling Marquee Bar */}
      <div className="relative z-10 my-4 bg-zinc-950/80 border border-amber-500/20 rounded-2xl py-3 px-4 overflow-hidden">
        <motion.div
          className="flex items-center gap-6 whitespace-nowrap"
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
        >
          {filteredWinners.concat(filteredWinners).map((winner, idx) => (
            <div
              key={idx}
              onClick={() => handleCheer(winner)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-neutral-900 to-zinc-900 border border-white/10 hover:border-amber-500/50 px-3.5 py-2 rounded-xl text-xs cursor-pointer transition-all hover:scale-105 shrink-0"
            >
              <img
                src={winner.avatar}
                alt={winner.username}
                className="w-7 h-7 rounded-full object-cover border-2 border-amber-400/80 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white">{winner.username}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30">
                    +${winner.amountWon.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">{winner.gameTitle} · {winner.timestamp}</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Detailed Winner Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filteredWinners.slice(0, 6).map(winner => {
          const isBigJackpot = winner.amountWon >= 5000;
          return (
            <motion.div
              key={winner.id}
              whileHover={{ y: -3 }}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                isBigJackpot
                  ? 'bg-gradient-to-br from-amber-950/60 via-zinc-950 to-neutral-950 border-amber-500/50 shadow-lg shadow-amber-500/10'
                  : 'bg-zinc-950/80 border-white/10 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={winner.avatar}
                    alt={winner.username}
                    className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
                    referrerPolicy="no-referrer"
                  />
                  {isBigJackpot && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-black rounded-full p-0.5">
                      <Zap className="w-3 h-3 fill-black" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-white">{winner.username}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">· {winner.timestamp}</span>
                  </div>
                  <span className="text-xs text-amber-300 font-medium block">{winner.gameTitle}</span>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-base font-black text-emerald-400 font-mono">
                      ${winner.amountWon.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    {isBigJackpot && (
                      <span className="text-[9px] font-extrabold uppercase bg-amber-500 text-black px-1.5 py-0.2 rounded font-mono">
                        JACKPOT
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCheer(winner)}
                className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                title="Cheer for this winner!"
              >
                <PartyPopper className="w-3.5 h-3.5" /> Cheer
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
