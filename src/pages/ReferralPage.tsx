import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Copy, Check, Gift, DollarSign, Sparkles, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export const ReferralPage: React.FC = () => {
  const { user, claimReferralEarnings, openAuthModal } = useAuth();
  const [copied, setCopied] = useState(false);

  const refCode = user ? user.referralCode : 'FORTUNA777';
  const refLink = `https://fortunagold.com/ref/${refCode}`;

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Referral Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-950/60 via-zinc-950 to-emerald-950/60 border border-amber-500/30 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 mb-3">
            <Users className="w-4 h-4 text-amber-400" /> AFFILIATE & REFERRAL SYSTEM
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Earn Up To <span className="text-amber-400">10% Lifetime</span> Commissions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
            Invite friends, gamers, or crypto enthusiasts to Fortuna Gold. Earn instant wager & deposit commission across 3 multi-tiered levels directly credited to your wallet!
          </p>

          {/* Referral Link Box */}
          <div className="mt-6 p-3 bg-zinc-900/90 backdrop-blur-md rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-800 text-xs font-mono text-amber-400 truncate">
              {refLink}
            </div>
            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Link!' : 'Copy Referral Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Referral Earnings Summary Bar */}
      {user && (
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 flex-1">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Total Referrals</span>
              <span className="text-2xl font-black text-white font-mono">{user.referralCount} Players</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Unclaimed Commission</span>
              <span className="text-2xl font-black text-amber-400 font-mono">${user.referralEarnings.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Commission Tier</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">Tier 1 (10%)</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              claimReferralEarnings();
            }}
            disabled={user.referralEarnings <= 0}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Claim Commission To Wallet (${user.referralEarnings.toFixed(2)})
          </button>
        </div>
      )}

      {/* Tier Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-amber-500/30 shadow-xl">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl w-fit text-amber-400 mb-4">
            <Trophy className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-amber-400 uppercase block mb-1">Tier 1 Direct Referrals</span>
          <h3 className="text-3xl font-black text-white mb-2 font-mono">10% Commission</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Earn 10% on every deposit and wager placed by users who sign up directly using your referral link.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-emerald-500/30 shadow-xl">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl w-fit text-emerald-400 mb-4">
            <Users className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase block mb-1">Tier 2 Sub-Referrals</span>
          <h3 className="text-3xl font-black text-white mb-2 font-mono">5% Commission</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Earn 5% passive income whenever players invited by your Tier 1 friends deposit or play games!
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-cyan-500/30 shadow-xl">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl w-fit text-cyan-400 mb-4">
            <Gift className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-cyan-400 uppercase block mb-1">Tier 3 Deep Network</span>
          <h3 className="text-3xl font-black text-white mb-2 font-mono">2% Commission</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Earn 2% on 3rd tier invited network players with automatic instant wallet payout transfers.
          </p>
        </div>
      </div>
    </div>
  );
};
