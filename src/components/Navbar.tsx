import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Wallet, Volume2, VolumeX, Menu, X, Gift, Users, Trophy, Flame, LogOut, User, PlusCircle, Gamepad2, Home, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavigationTab } from '../types';
import { sound } from '../utils/audio';

export const Navbar: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    openAuthModal,
    logout,
    setIsDepositModalOpen,
    soundEnabled,
    toggleSound,
    systemSettings
  } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleTabClick = (tab: NavigationTab) => {
    sound.playClick();
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const navTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'games', label: 'All Games', icon: Gamepad2 },
    { id: 'vip', label: 'VIP Club', icon: Trophy },
    { id: 'referrals', label: 'Referrals', icon: Users },
    { id: 'dashboard', label: 'Wallet', icon: Wallet },
    ...(user?.isAdmin ? [{ id: 'admin', label: 'Admin Panel', icon: Shield }] : [])
  ];

  return (
    <>
      {/* Top Announcement Ticker */}
      <div className="bg-gradient-to-r from-black via-neutral-950 to-black border-b border-white/5 py-1.5 px-6 text-xs font-medium text-neutral-300 flex items-center justify-between overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px] uppercase tracking-wider">
              <Flame className="w-3 h-3 text-amber-400 animate-bounce" /> LIVE ANNOUNCEMENT
            </span>
            <span className="text-neutral-300 text-xs truncate max-w-xl">
              {systemSettings?.announcement || 'Fortuna Grand Powerball Jackpot Pool is now ₹12,84,59,200.00'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1 text-amber-300">
              <Gift className="w-3.5 h-3.5 text-amber-400" /> ₹1,00,000 Welcome Pack
            </span>
            <span className="text-white/10">|</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
              142,500 Online
            </span>
          </div>
        </div>
      </div>

      {/* Main Glass High Density Navbar */}
      <header className="sticky top-0 z-40 h-16 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-black font-black text-xl italic shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              F
            </div>
            <div>
              <span className="font-black text-xl tracking-tighter uppercase italic bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent block leading-none">
                Fortuna<span className="text-white font-normal">Gold</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 block font-mono font-bold">
                Luxe Arena
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-400">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id as NavigationTab)}
                  className={`flex items-center gap-2 pb-1 text-sm font-medium transition-all ${
                    isActive
                      ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold'
                      : 'hover:text-white border-b-2 border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                  {tab.label}
                  {tab.id === 'admin' && (
                    <span className="px-1.5 py-0.2 text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded uppercase font-bold ml-0.5">
                      ADMIN
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Controls & Actions */}
          <div className="flex items-center gap-3">
            {/* Mute/Sound Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 bg-neutral-900 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white rounded-full transition-colors"
              title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Balance Pill */}
                <div className="flex items-center gap-3 bg-neutral-900 px-3.5 py-1.5 rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-sm font-mono text-emerald-400 font-bold">
                    ₹{(user.balance + user.winningBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsDepositModalOpen(true);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-3 py-1 rounded-full text-[11px] uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Deposit
                  </button>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className="w-9 h-9 rounded-full border-2 border-amber-500 p-0.5 overflow-hidden transition-transform hover:scale-105"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-neutral-950 border border-white/10 rounded-2xl p-2 shadow-2xl z-50 text-xs"
                      >
                        <div className="p-3 bg-neutral-900/80 rounded-xl mb-2 border border-white/5">
                          <p className="font-extrabold text-amber-300 truncate">{user.username}</p>
                          <p className="text-[11px] text-neutral-400">{user.email}</p>
                          <div className="mt-2 flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                            <span className="text-neutral-400">VIP Tier:</span>
                            <span className="font-extrabold text-amber-400">{user.vipTier}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleTabClick('dashboard')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors font-medium"
                        >
                          <User className="w-4 h-4 text-amber-400" /> My Wallet & Profile
                        </button>
                        <button
                          onClick={() => handleTabClick('vip')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors font-medium"
                        >
                          <Trophy className="w-4 h-4 text-emerald-400" /> VIP Status & Perks
                        </button>
                        <button
                          onClick={() => handleTabClick('referrals')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-xl transition-colors font-medium"
                        >
                          <Users className="w-4 h-4 text-cyan-400" /> Referral Earnings
                        </button>
                        {user.isAdmin && (
                          <button
                            onClick={() => handleTabClick('admin')}
                            className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-xl transition-colors font-bold"
                          >
                            <Shield className="w-4 h-4 text-rose-400" /> Admin Control Panel
                          </button>
                        )}

                        <div className="my-1 border-t border-white/5" />

                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors font-semibold"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-full text-xs transition-colors uppercase tracking-wider"
                >
                  Register
                </button>
              </div>
            )}

            {/* Sound Mute/Unmute Toggle for Mobile/Desktop */}
            <button
              onClick={toggleSound}
              className="lg:hidden p-2 bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white rounded-full transition-colors"
              title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
            </button>
          </div>
        </div>
      </header>

      {/* Persistent Mobile Bottom Navigation Bar (One-Handed Thumb Access) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-t border-amber-500/30 px-2 py-2.5 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'games', label: 'Games', icon: Gamepad2 },
          { id: 'vip', label: 'VIP Club', icon: Trophy },
          { id: 'referrals', label: 'Referrals', icon: Users },
          { id: 'dashboard', label: 'Wallet', icon: Wallet },
          ...(user?.isAdmin ? [{ id: 'admin', label: 'Admin', icon: Shield }] : [])
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id as NavigationTab)}
              className={`relative flex flex-col items-center justify-center min-w-[52px] min-h-[48px] px-1 py-1 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-amber-400 font-extrabold scale-105'
                  : 'text-zinc-500 hover:text-zinc-300 font-medium'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTabGlow"
                  className="absolute inset-0 bg-amber-500/10 rounded-2xl border border-amber-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'text-amber-400 scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'text-zinc-500'}`} />
              <span className={`text-[10px] mt-1 relative z-10 font-bold ${isActive ? 'text-amber-300' : 'text-zinc-500'}`}>
                {tab.label}
              </span>
              {tab.id === 'admin' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
};
