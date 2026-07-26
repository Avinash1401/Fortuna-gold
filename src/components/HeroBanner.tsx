import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Gift, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export const HeroBanner: React.FC = () => {
  const { setActiveTab, openAuthModal, user, setIsDepositModalOpen } = useAuth();
  const [jackpot, setJackpot] = useState<number>(12845920);

  // Live ticking progressive jackpot increment
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.floor(Math.random() * 8 + 2));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl my-4">
      {/* Background Hero Asset Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/lottery_hero_banner_1785085959046.jpg"
          alt="Fortuna Lottery Arena"
          className="w-full h-full object-cover opacity-25 filter brightness-90 saturate-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-4xl">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-white/10 text-amber-400 text-xs font-bold mb-4">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span className="text-white font-normal uppercase tracking-wider text-[11px]">LUXE ARENA</span>
          <span className="text-amber-400">• LIVE POWERBALL POOL</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none mb-3">
          WIN THE GRAND <br />
          <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-400 bg-clip-text text-transparent">
            $12,845,920
          </span>{' '}
          JACKPOT
        </h1>

        {/* Live Progressive Ticker */}
        <div className="my-4 p-3.5 bg-neutral-950/90 backdrop-blur-xl border border-white/10 rounded-2xl inline-block max-w-md shadow-2xl">
          <span className="text-[11px] text-neutral-400 uppercase tracking-widest block mb-1 font-mono font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" /> LIVE PROGRESSIVE GRAND POOL
          </span>
          <motion.div
            key={jackpot}
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight font-mono"
          >
            ${jackpot.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </motion.div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mb-6 leading-relaxed">
          Join thousands of players drawing powerballs, spinning 24k golden wheels, scratching instant prizes, and earning daily VIP streak rewards with 100% provably fair gameplay.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('games');
            }}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-full text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-98 transition-all"
          >
            Play Games & Lottery <ArrowRight className="w-4 h-4" />
          </button>

          {user ? (
            <button
              onClick={() => {
                sound.playClick();
                setIsDepositModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-3 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-amber-300 font-bold rounded-full text-xs transition-all"
            >
              <Gift className="w-4 h-4 text-amber-400" /> Deposit & Get 100% Match
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('register')}
              className="flex items-center gap-2 px-5 py-3 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-amber-300 font-bold rounded-full text-xs transition-all"
            >
              <Trophy className="w-4 h-4 text-amber-400" /> Claim $1,000 Welcome Pack
            </button>
          )}
        </div>

        {/* Guarantees */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center gap-5 text-[11px] text-neutral-400 font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% SHA-256 Provably Fair
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Instant 15-Min Crypto Cashouts
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> 24/7 VIP Live Support
          </span>
        </div>
      </div>
    </div>
  );
};
