import React from 'react';
import { motion } from 'motion/react';
import { Gift, CheckCircle, Sparkles, Flame, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DAILY_BONUSES } from '../data/mockData';
import { sound } from '../utils/audio';

export const DailyCheckIn: React.FC = () => {
  const { user, claimDailyBonus, openAuthModal } = useAuth();

  const currentStreakIdx = user ? user.claimedDailyStreak % 7 : 0;

  return (
    <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 my-8 shadow-2xl relative overflow-hidden">
      {/* Glow aura */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> DAILY REWARD STREAK
          </span>
          <h2 className="text-2xl font-black text-white">Daily Check-in Cash Bonus</h2>
          <p className="text-xs text-zinc-400">Log in every 24 hours to claim cash gifts. Complete Day 7 to unlock the $150 Golden Chest!</p>
        </div>

        {user ? (
          <button
            onClick={() => {
              sound.playClick();
              claimDailyBonus();
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-black rounded-xl text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Gift className="w-4 h-4" /> Claim Day {currentStreakIdx + 1} Bonus (${DAILY_BONUSES[currentStreakIdx].bonusCash})
          </button>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-3 bg-amber-500 text-zinc-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-all"
          >
            Login to Claim Daily Cash
          </button>
        )}
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {DAILY_BONUSES.map((item, idx) => {
          const isClaimed = user ? idx < (user.claimedDailyStreak % 7) : false;
          const isCurrent = user ? idx === (user.claimedDailyStreak % 7) : idx === 0;

          return (
            <motion.div
              key={item.day}
              whileHover={{ scale: 1.03 }}
              className={`p-4 rounded-2xl border flex flex-col items-center text-center relative overflow-hidden transition-all ${
                isClaimed
                  ? 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
                  : isCurrent
                  ? 'bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-emerald-500/20 border-amber-500 shadow-lg shadow-amber-500/20 text-white'
                  : 'bg-zinc-900/80 border-zinc-800 text-zinc-300'
              }`}
            >
              {item.day === 7 && (
                <div className="absolute top-1 right-1">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                </div>
              )}

              <span className="text-[11px] font-bold text-zinc-400 uppercase mb-2 block">{item.label}</span>

              <div className="my-2">
                {isClaimed ? (
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                ) : item.day === 7 ? (
                  <Trophy className="w-8 h-8 text-amber-400 animate-pulse" />
                ) : (
                  <Gift className={`w-8 h-8 ${isCurrent ? 'text-amber-400' : 'text-zinc-500'}`} />
                )}
              </div>

              <span className="text-xs font-black text-amber-300 mt-1 block">{item.reward}</span>

              {isClaimed && (
                <span className="mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Claimed
                </span>
              )}

              {isCurrent && !isClaimed && (
                <span className="mt-2 text-[10px] font-extrabold text-zinc-950 bg-amber-400 px-2 py-0.5 rounded-full animate-pulse">
                  Ready Now
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
