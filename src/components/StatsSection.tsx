import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Gamepad2, Zap } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      id: 'payouts',
      label: 'Total Jackpot Payouts',
      value: '$48,250,900+',
      icon: Trophy,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      id: 'players',
      label: 'Active Verified Players',
      value: '142,500+',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'games',
      label: 'Total Games Played',
      value: '3,840,000+',
      icon: Gamepad2,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/30'
    },
    {
      id: 'speed',
      label: 'Avg. Cashout Speed',
      value: '< 8 Minutes',
      icon: Zap,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30'
    }
  ];

  return (
    <div className="my-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.id}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 transition-all shadow-xl"
            >
              <div className={`p-3 rounded-xl border w-fit mb-4 ${s.bg}`}>
                <Icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white block mb-1 font-mono">
                {s.value}
              </span>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                {s.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
