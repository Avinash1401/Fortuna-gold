import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, PlusCircle, ArrowDownRight, Ticket, Clock, CheckCircle2, Trophy, ShieldCheck, History, User as UserIcon, ShieldAlert, Key, QrCode, Smartphone, Sparkles, Copy, Check, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/audio';

export const DashboardPage: React.FC = () => {
  const { user, setIsDepositModalOpen, setIsWithdrawModalOpen, userTickets, transactions, openAuthModal, toggleTwoFactor } = useAuth();
  const [txFilter, setTxFilter] = useState<string>('all');
  const [activeTabSection, setActiveTabSection] = useState<'overview' | 'tickets' | 'history' | 'profile'>('overview');
  const [copiedKey, setCopiedKey] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-zinc-950 border border-amber-500/30 rounded-3xl text-center">
        <Wallet className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">User Wallet & Dashboard</h2>
        <p className="text-xs text-zinc-400 mb-6">Please login to access your balance, active tickets, and transaction history.</p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-emerald-500 text-zinc-950 font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-lg"
        >
          Login to Account
        </button>
      </div>
    );
  }

  const filteredTx = txFilter === 'all'
    ? transactions
    : transactions.filter(t => t.type === txFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* User Header Greeting */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-950/60 via-zinc-950 to-emerald-950/60 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-lg"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">{user.username}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-extrabold uppercase">
                {user.vipTier} VIP
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{user.email} • Member since {user.createdAt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setIsDepositModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-zinc-950 font-extrabold rounded-2xl text-xs shadow-lg hover:brightness-110 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Deposit
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setIsWithdrawModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-zinc-900 border border-amber-500/40 text-amber-300 font-extrabold rounded-2xl text-xs hover:bg-zinc-800 transition-all"
          >
            <ArrowDownRight className="w-4 h-4" /> Withdraw
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-zinc-900/80 p-2 rounded-2xl border border-zinc-800">
        {[
          { id: 'overview', label: 'Wallet Balance & Stats', icon: Wallet },
          { id: 'tickets', label: `My Tickets (${userTickets.length})`, icon: Ticket },
          { id: 'history', label: 'Transaction History', icon: History },
          { id: 'profile', label: 'Profile Settings', icon: UserIcon }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTabSection(tab.id as any);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                activeTabSection === tab.id
                  ? 'bg-amber-500 text-zinc-950 border-amber-300 shadow-md'
                  : 'text-zinc-400 hover:text-white border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* OVERVIEW SECTION */}
      {activeTabSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 to-zinc-900 border border-amber-500/30 shadow-xl">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Main Cash Balance</span>
              <span className="text-2xl font-black text-amber-400 font-mono">${user.balance.toFixed(2)}</span>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-zinc-900 border border-emerald-500/30 shadow-xl">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Withdrawable Winnings</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">${user.winningBalance.toFixed(2)}</span>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Bonus Cash</span>
              <span className="text-2xl font-black text-cyan-400 font-mono">${user.bonusBalance.toFixed(2)}</span>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Total Won Lifetime</span>
              <span className="text-2xl font-black text-yellow-300 font-mono">${user.totalWon.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* TICKETS SECTION */}
      {activeTabSection === 'tickets' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-400" /> Purchased Lottery Tickets
          </h3>

          {userTickets.length > 0 ? (
            <div className="space-y-3">
              {userTickets.map(tkt => (
                <div key={tkt.id} className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-extrabold text-amber-400 block mb-1">{tkt.gameTitle}</span>
                    <div className="flex items-center gap-1.5 my-1">
                      {tkt.numbers.map((n, i) => (
                        <span key={i} className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center justify-center">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">Draw Time: {tkt.drawTime}</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold mt-1">
                      <Clock className="w-3 h-3" /> Status: {tkt.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 py-6 text-center">No active lottery tickets. Head over to Games to buy ticket picks!</p>
          )}
        </div>
      )}

      {/* HISTORY SECTION */}
      {activeTabSection === 'history' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-amber-400" /> Transaction Logs
            </h3>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5">
              {['all', 'deposit', 'withdrawal', 'game_win', 'daily_bonus'].map(type => (
                <button
                  key={type}
                  onClick={() => setTxFilter(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border capitalize transition-all ${
                    txFilter === type
                      ? 'bg-amber-500 text-zinc-950 border-amber-300'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredTx.map(tx => (
                  <tr key={tx.id} className="hover:bg-zinc-950/50">
                    <td className="py-3 px-3 capitalize font-bold text-white">{tx.type.replace('_', ' ')}</td>
                    <td className="py-3 px-3 text-zinc-300">{tx.description}</td>
                    <td className={`py-3 px-3 font-extrabold font-mono ${tx.type === 'withdrawal' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-zinc-400">{tx.paymentMethod}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-500">{tx.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROFILE SETTINGS SECTION */}
      {activeTabSection === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Overview */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-amber-400" /> Account Identity & Preferences
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Username:</label>
                <input type="text" readOnly value={user.username} className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-bold" />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Email Address:</label>
                <input type="email" readOnly value={user.email} className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-bold" />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">VIP Tier Status:</label>
                <div className="p-3 bg-zinc-950 border border-amber-500/30 rounded-xl flex items-center justify-between">
                  <span className="text-amber-400 font-extrabold flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" /> {user.vipTier} VIP Member
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">{user.vipPoints} VIP PTS</span>
                </div>
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Your Referral Code:</label>
                <input type="text" readOnly value={user.referralCode} className="w-full p-3 bg-zinc-950 border border-amber-500/30 rounded-xl text-amber-400 font-extrabold font-mono" />
              </div>
            </div>
          </div>

          {/* TWO-FACTOR AUTHENTICATION (2FA) CARD */}
          <div className="bg-zinc-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Two-Factor Authentication (2FA)</h3>
                    <span className="text-[11px] text-zinc-400">VIP Account Anti-Hijack & Withdrawal Lock</span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 border ${
                    user.isTwoFactorEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${user.isTwoFactorEnabled ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                  {user.isTwoFactorEnabled ? '2FA ACTIVE' : '2FA DISABLED'}
                </span>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Protect your VIP account, high-value lottery winnings, and instant crypto/fiat withdrawals with Google Authenticator or TOTP apps.
              </p>

              {/* 2FA Toggle Switch */}
              <div className="my-5 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-xs font-bold text-white block">Authenticator Security Layer</span>
                    <span className="text-[11px] text-zinc-400">
                      {user.isTwoFactorEnabled ? 'Required on every withdrawal request' : 'Click to enable 2FA verification code'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={toggleTwoFactor}
                  type="button"
                  className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none ${
                    user.isTwoFactorEnabled ? 'bg-emerald-500 justify-end' : 'bg-zinc-800 justify-start'
                  }`}
                >
                  <motion.div
                    layout
                    className="w-6 h-6 rounded-full bg-black shadow-md flex items-center justify-center text-[10px] font-black"
                  >
                    {user.isTwoFactorEnabled ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3 h-3 text-zinc-500" />}
                  </motion.div>
                </button>
              </div>

              {/* Expanded 2FA Info when enabled */}
              {user.isTwoFactorEnabled ? (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> 2FA Secret TOTP Key
                    </span>
                    <span className="text-[10px] text-zinc-400">Secret: <strong className="text-white font-mono">FORTUNA-8849-VIP</strong></span>
                  </div>

                  <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                    <div className="p-2 bg-white rounded-lg shrink-0">
                      {/* Simulated QR Code SVG */}
                      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="black">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 4h4v2h-4v-2zm-2-2h2v2h-2v-2zm4-2h2v2h-2v-2z" />
                      </svg>
                    </div>
                    <div className="text-[11px] text-zinc-300 space-y-1">
                      <p className="font-semibold text-white">Scan with Google Authenticator or Authy</p>
                      <div className="flex items-center gap-2">
                        <code className="text-[10px] bg-zinc-900 px-2 py-0.5 rounded text-amber-400 font-mono">FORTUNA-8849-VIP</code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('FORTUNA-8849-VIP');
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                          }}
                          className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copiedKey ? 'Copied' : 'Copy Key'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-[11px] text-amber-200/90">
                    <strong>Recommended for VIP Players:</strong> Enabling 2FA unlocks instant priority payouts and automated high-stakes withdrawal approvals.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-800 flex items-center justify-between">
              <span>Security Standard: TLS 1.3 / AES-256 Encrypted</span>
              <span>VIP Protection Lv. 3</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
