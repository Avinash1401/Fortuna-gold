import React from 'react';
import { Crown, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NavigationTab } from '../types';

export const Footer: React.FC = () => {
  const { setActiveTab } = useAuth();

  return (
    <footer className="bg-black border-t border-white/5 pt-10 pb-20 lg:pb-10 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5">
                <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center text-amber-400 font-black italic text-xs">
                  F
                </div>
              </div>
              <span className="text-base font-black tracking-tighter text-white italic uppercase">
                Fortuna<span className="text-amber-400 font-light">Gold</span>
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              High-density provably fair lottery & gaming platform featuring instant draws, 24k gold wheels, and 15-minute crypto payouts.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-emerald-400 text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> Curacao eGaming License #8048/JAZ
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mb-3">Games & Draws</h4>
            <ul className="space-y-2 text-[11px]">
              {['Powerball 6/49', 'Mega Gold Draw', 'Royal Wheel', 'Speed Scratch', 'Mines Gold Rush'].map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setActiveTab('games')}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* VIP & Rewards */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mb-3">VIP Club</h4>
            <ul className="space-y-2 text-[11px]">
              <li><button onClick={() => setActiveTab('vip')} className="text-neutral-400 hover:text-white transition-colors">Daily Bonus Streak</button></li>
              <li><button onClick={() => setActiveTab('vip')} className="text-neutral-400 hover:text-white transition-colors">VIP Tiers & Perks</button></li>
              <li><button onClick={() => setActiveTab('referrals')} className="text-neutral-400 hover:text-white transition-colors">10% Referral Earnings</button></li>
              <li><button onClick={() => setActiveTab('dashboard')} className="text-neutral-400 hover:text-white transition-colors">Weekly Rakeback</button></li>
            </ul>
          </div>

          {/* Payment Providers */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest mb-3">Crypto & Cards</h4>
            <p className="text-[10px] text-neutral-500 mb-2">Instant deposits & withdrawals:</p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono font-bold">
              {['BTC', 'ETH', 'USDT', 'VISA', 'MASTERCARD', 'APPLE PAY'].map((pay, i) => (
                <span key={i} className="px-2 py-0.5 bg-neutral-900 border border-white/5 text-neutral-300 rounded">
                  {pay}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Responsible Gaming & Status Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Fairness</a>
            <a href="#" className="hover:text-white transition-colors">Responsible Gambling (18+)</a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 items-center">
              <div className="w-2 h-2 rounded-full bg-neutral-700" />
              <div className="w-2 h-2 rounded-full bg-neutral-700" />
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
              Server: LDN-02 [Stable]
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
