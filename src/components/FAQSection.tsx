import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_ITEMS } from '../data/mockData';
import { sound } from '../utils/audio';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Payments', 'Games', 'VIP & Rewards'];

  const filteredItems = activeCategory === 'All'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter(f => f.category === activeCategory);

  const toggleAccordion = (idx: number) => {
    sound.playClick();
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="my-16 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          HELP & SUPPORT
        </span>
        <h2 className="text-3xl font-black text-white mt-3">Frequently Asked Questions</h2>
        <p className="text-xs text-zinc-400 mt-2">Find quick answers about deposits, game odds, instant payouts, and VIP levels.</p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              sound.playClick();
              setActiveCategory(cat);
              setOpenIdx(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              activeCategory === cat
                ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredItems.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/30 rounded-2xl overflow-hidden transition-all shadow-md"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-sm font-bold text-white">{item.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-400 transition-transform ${
                    isOpen ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-3"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
