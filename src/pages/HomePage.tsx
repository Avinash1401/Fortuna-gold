import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Gamepad2, ArrowRight } from 'lucide-react';
import { HeroBanner } from '../components/HeroBanner';
import { GlobalWinners } from '../components/GlobalWinners';
import { GameCard } from '../components/GameCard';
import { DailyCheckIn } from '../components/DailyCheckIn';
import { StatsSection } from '../components/StatsSection';
import { Testimonials } from '../components/Testimonials';
import { FAQSection } from '../components/FAQSection';
import { INITIAL_GAMES } from '../data/mockData';
import { Game } from '../types';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export const HomePage: React.FC = () => {
  const { openGameModal, setActiveTab } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Lottery', 'Instant Win', 'Wheel', 'Scratch'];

  const filteredGames = activeCategory === 'All'
    ? INITIAL_GAMES
    : INITIAL_GAMES.filter(g => g.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Global Winners Feed */}
      <GlobalWinners />

      {/* Daily Reward Streak Component */}
      <DailyCheckIn />

      {/* Games Catalog Section */}
      <div className="my-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
              POPULAR DRAWS & GAMES
            </span>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mt-1">Instant Play Arena</h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setActiveCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 border border-white/5 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Game Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGames.map(game => (
            <GameCard key={game.id} game={game} onPlay={openGameModal} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('games');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-amber-300 font-bold rounded-full text-xs uppercase tracking-wider transition-colors"
          >
            <Gamepad2 className="w-4 h-4 text-amber-400" /> View All Games & Live Countdown Draw Lobby <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Platform Stats */}
      <StatsSection />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ Accordion */}
      <FAQSection />
    </div>
  );
};
