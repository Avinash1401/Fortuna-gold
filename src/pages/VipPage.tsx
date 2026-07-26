import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Crown, CheckCircle2, ShieldCheck, Flame, Gift } from 'lucide-react';
import { VIP_TIERS } from '../data/mockData';
import { DailyCheckIn } from '../components/DailyCheckIn';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export const VipPage: React.FC = () => {
  const { user } = useAuth();

  const currentPoints = user ? user.vipPoints : 2450;
  const currentTier = user ? user.vipTier : 'Gold';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* VIP Club Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-950/60 via-zinc-950 to-emerald-950/60 border border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 mb-3">
            <Crown className="w-4 h-4 text-amber-400" /> FORTUNA ROYAL VIP CLUB
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Unlock Exclusive Perks, <span className="text-amber-400">Rakeback & Cashback</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
            Every wager and ticket purchase earns VIP Points. Level up from Bronze to Royal to unlock up to 20% cashback, 12% instant rakeback, and dedicated account management.
          </p>

          {/* Current VIP Status Bar */}
          <div className="mt-6 p-4 bg-zinc-900/90 rounded-2xl border border-amber-500/30">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-zinc-400 font-bold flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" /> Current Tier: <strong className="text-amber-400">{currentTier}</strong>
              </span>
              <span className="text-amber-400 font-extrabold font-mono">{currentPoints.toLocaleString()} VIP Points</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, (currentPoints / 7500) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Check-in Streak */}
      <DailyCheckIn />

      {/* 6 VIP Tier Cards Grid */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            TIER PRIVILEGES
          </span>
          <h2 className="text-3xl font-black text-white mt-2">VIP Tier Benefits</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIP_TIERS.map(tier => {
            const isUserTier = currentTier === tier.name;
            return (
              <motion.div
                key={tier.name}
                whileHover={{ y: -6 }}
                className={`p-6 rounded-3xl border flex flex-col justify-between transition-all shadow-xl relative overflow-hidden ${
                  isUserTier
                    ? 'bg-gradient-to-b from-amber-950/50 via-zinc-900 to-zinc-950 border-amber-500 shadow-amber-500/10'
                    : 'bg-zinc-900/90 border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{tier.icon}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black text-zinc-950 bg-gradient-to-r ${tier.color}`}>
                      {tier.name}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{tier.name} VIP</h3>
                  <span className="text-xs text-amber-400 font-semibold block mb-4">
                    {tier.requiredPoints === 0 ? 'Starting Tier' : `${tier.requiredPoints.toLocaleString()} Points Required`}
                  </span>

                  {/* Perks List */}
                  <ul className="space-y-2 mb-6 text-xs text-zinc-300">
                    <li className="flex items-center gap-2 font-semibold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> {tier.cashbackPercent}% Weekly Cashback
                    </li>
                    <li className="flex items-center gap-2 font-semibold text-amber-400">
                      <CheckCircle2 className="w-4 h-4 shrink-0" /> {tier.rakebackPercent}% Instant Rakeback
                    </li>
                    {tier.perks.map((perk, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-zinc-500 shrink-0" /> {perk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-zinc-800 text-xs flex justify-between items-center text-zinc-400">
                  <span>Daily Withdrawal Limit:</span>
                  <span className="font-extrabold text-white font-mono">{tier.withdrawLimit}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
