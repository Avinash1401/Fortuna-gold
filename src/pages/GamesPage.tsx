import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Gamepad2, Search, Filter, Sparkles, Trophy } from 'lucide-react';
import { GameCard } from '../components/GameCard';
import { GlobalWinners } from '../components/GlobalWinners';
import { INITIAL_GAMES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export const GamesPage: React.FC = () => {
  const { openGameModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Lottery', 'Instant Win', 'Wheel', 'Scratch'];

  const filtered = INITIAL_GAMES.filter(game => {
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-zinc-950 to-emerald-950/60 border border-amber-500/30 mb-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 mb-3">
            <Gamepad2 className="w-4 h-4 text-amber-400" /> FORTUNA GAMES & LOTTERIES
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Live Draw & Instant Win Arena
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
            Choose from Powerball 6/49 draws, 24k Golden Wheel spins, Speed Scratch cards, Mines Gold Rush, and Emerald Coin Flips with instant provably fair payouts.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Game Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(game => (
            <GameCard key={game.id} game={game} onPlay={openGameModal} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-zinc-900/50 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400 text-sm font-semibold">No games match your search parameters.</p>
        </div>
      )}

      {/* Global Winners Feed */}
      <GlobalWinners />
    </div>
  );
};
