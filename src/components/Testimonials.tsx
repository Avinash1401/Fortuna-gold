import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, Trophy } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export const Testimonials: React.FC = () => {
  return (
    <div className="my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          PLAYER REVIEWS
        </span>
        <h2 className="text-3xl font-black text-white mt-3">Trusted By Lucky Winners Worldwide</h2>
        <p className="text-xs text-zinc-400 mt-2">See what our VIP members have to say about instant cashouts and jackpot wins.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map(t => (
          <motion.div
            key={t.id}
            whileHover={{ y: -6 }}
            className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between relative"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-zinc-800" />

            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 italic mb-6 leading-relaxed">
                "{t.text}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400/50"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">{t.name}</h4>
                  <span className="text-[10px] text-amber-400 block">{t.role}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block">Total Won</span>
                <span className="text-xs font-extrabold text-emerald-400 font-mono flex items-center gap-1 justify-end">
                  <Trophy className="w-3 h-3 text-amber-400" /> {t.wonAmount}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
