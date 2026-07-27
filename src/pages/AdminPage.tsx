import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Sliders,
  Users,
  Gamepad2,
  DollarSign,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Sparkles,
  Zap,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Radio,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Database,
  Flame,
  Check,
  Eye,
  Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Game, User, Transaction } from '../types';
import { sound } from '../utils/audio';

type AdminTab = 'overview' | 'livebets' | 'games' | 'users' | 'transactions' | 'settings' | 'broadcast';

export const AdminPage: React.FC = () => {
  const {
    user,
    games,
    updateGame,
    addGame,
    deleteGame,
    triggerDrawForGame,
    systemSettings,
    updateSystemSettings,
    allUsers,
    updateUserByAdmin,
    creditUserBalance,
    transactions,
    updateTransactionStatus,
    toggleAdminRole,
    triggerConfetti,
    liveBets,
    resolveLiveBet
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [liveBetFilter, setLiveBetFilter] = useState<'all' | 'pending' | 'won' | 'lost' | 'refunded'>('pending');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedVipFilter, setSelectedVipFilter] = useState<string>('ALL');

  // Edit Game Modal state
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);

  // Instant Draw state
  const [drawResultNumbers, setDrawResultNumbers] = useState<{ gameTitle: string; numbers: number[] } | null>(null);

  // New Game Form
  const [newGameData, setNewGameData] = useState<Partial<Game>>({
    title: '',
    category: 'Lottery',
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800',
    jackpotAmount: 1000000,
    minTicketPrice: 2,
    playersCount: 1200,
    nextDrawSeconds: 3600,
    description: 'Exclusive luxury high-stakes draw with instant multiplier payouts.',
    rtp: '98.5%'
  });

  // Balance Credit Modal / State
  const [creditingUser, setCreditingUser] = useState<User | null>(null);
  const [customCreditAmount, setCustomCreditAmount] = useState<string>('500');

  // Announcement Live Text
  const [announcementInput, setAnnouncementInput] = useState(systemSettings.announcement);

  if (!user || !user.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase italic">Access Restricted</h1>
        <p className="text-neutral-400 text-sm mt-2 max-w-md mx-auto">
          You need elevated Administrator privileges to access the Fortuna Command Center.
        </p>
        <button
          onClick={toggleAdminRole}
          className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-full text-xs uppercase tracking-wider transition-colors shadow-lg"
        >
          Enable Admin Privilege Mode
        </button>
      </div>
    );
  }

  // Calculate high-level stats
  const totalWagered = allUsers.reduce((sum, u) => sum + u.totalWagered, 0);
  const totalWon = allUsers.reduce((sum, u) => sum + u.totalWon, 0);
  const netGgr = totalWagered - totalWon;
  const pendingTxs = transactions.filter(t => t.status === 'pending');

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch =
      u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesVip = selectedVipFilter === 'ALL' || u.vipTier === selectedVipFilter;
    return matchesSearch && matchesVip;
  });

  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGame) {
      updateGame(editingGame);
      setEditingGame(null);
    }
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameData.title) return;
    const created: Game = {
      id: 'game_' + Date.now(),
      title: newGameData.title || 'New Draw',
      category: newGameData.category as any || 'Lottery',
      badge: newGameData.badge as any || 'NEW',
      image: newGameData.image || 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800',
      jackpotAmount: Number(newGameData.jackpotAmount) || 500000,
      minTicketPrice: Number(newGameData.minTicketPrice) || 2,
      playersCount: Number(newGameData.playersCount) || 1000,
      nextDrawSeconds: Number(newGameData.nextDrawSeconds) || 3600,
      description: newGameData.description || 'Fast action custom gaming draw.',
      rtp: newGameData.rtp || '98.5%'
    };
    addGame(created);
    setIsAddGameOpen(false);
  };

  const handleExecuteDraw = (game: Game) => {
    const nums = triggerDrawForGame(game.id);
    setDrawResultNumbers({
      gameTitle: game.title,
      numbers: nums
    });
  };

  const handleSaveAnnouncement = () => {
    updateSystemSettings({ announcement: announcementInput });
    triggerConfetti();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-60 h-60 bg-emerald-500/10 blur-[80px] rounded-full" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  SYSTEM OVERSEER
                </span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  VERSION 4.2 PRO
                </span>
              </div>
              <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter mt-1">
                Fortuna Command Center
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => updateSystemSettings({ maintenanceMode: !systemSettings.maintenanceMode })}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all border ${
                systemSettings.maintenanceMode
                  ? 'bg-rose-500 text-black border-rose-400'
                  : 'bg-neutral-900 text-neutral-300 border-white/10 hover:border-white/20'
              }`}
            >
              <Activity className="w-4 h-4" />
              {systemSettings.maintenanceMode ? 'Maintenance Mode ACTIVE' : 'System Operational'}
            </button>

            <button
              onClick={toggleAdminRole}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-neutral-300 rounded-full text-xs font-bold transition-all"
              title="Toggle role to test user view vs admin view"
            >
              <Users className="w-4 h-4 text-cyan-400" /> Switch to Player View
            </button>
          </div>
        </div>

        {/* System KPIs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
          <div>
            <span className="text-[10px] text-neutral-500 uppercase font-mono font-bold block">Gross Gaming Revenue (GGR)</span>
            <span className="text-xl font-black font-mono text-emerald-400">₹{netGgr.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase font-mono font-bold block">Grand Jackpot Pool</span>
            <span className="text-xl font-black font-mono text-amber-400">₹{systemSettings.grandJackpotPool.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase font-mono font-bold block">Total Players</span>
            <span className="text-xl font-black font-mono text-white">{allUsers.length + 142500}</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 uppercase font-mono font-bold block">Global RTP Target</span>
            <span className="text-xl font-black font-mono text-cyan-400">{systemSettings.globalRtp}%</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {[
          { id: 'overview', label: 'Dashboard & Metrics', icon: TrendingUp },
          { id: 'livebets', label: 'Resolve Live Bets', icon: Zap, alert: liveBets.filter(b => b.status === 'pending').length },
          { id: 'games', label: 'Game & Draw Catalog', icon: Gamepad2, badge: games.length },
          { id: 'users', label: 'Player Management', icon: Users, badge: allUsers.length },
          { id: 'transactions', label: 'Transactions Audit', icon: DollarSign, alert: pendingTxs.length },
          { id: 'settings', label: 'RTP & Fair Odds', icon: Sliders },
          { id: 'broadcast', label: 'Announcements', icon: Radio }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as AdminTab);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shrink-0 ${
                isActive
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-neutral-900 text-neutral-400 border border-white/5 hover:text-white hover:border-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono font-bold ${
                  isActive ? 'bg-black text-emerald-400' : 'bg-neutral-800 text-neutral-300'
                }`}>
                  {tab.badge}
                </span>
              )}
              {tab.alert ? (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-mono font-bold animate-pulse">
                  {tab.alert}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-neutral-900/90 border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 font-medium">Total Player Deposits</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black font-mono text-white">₹4,85,02,000.00</p>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">+14.2% from last week</p>
            </div>

            <div className="p-5 bg-neutral-900/90 border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 font-medium">Total Winnings Paid</span>
                <ArrowDownRight className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black font-mono text-amber-400">₹3,42,93,500.00</p>
              <p className="text-[11px] text-neutral-500 font-medium mt-1">Instant payouts verified</p>
            </div>

            <div className="p-5 bg-neutral-900/90 border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 font-medium">Active Games Online</span>
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-2xl font-black font-mono text-cyan-400">{games.length} Games</p>
              <p className="text-[11px] text-neutral-500 font-medium mt-1">100% SHA-256 RNG Active</p>
            </div>

            <div className="p-5 bg-neutral-900/90 border border-white/10 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 font-medium">House Profit Margin</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black font-mono text-emerald-400">29.3% Margin</p>
              <p className="text-[11px] text-emerald-400 font-medium mt-1">Target RTP maintained</p>
            </div>
          </div>

          {/* Interactive Chart & System Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Performance Chart */}
            <div className="lg:col-span-2 p-6 bg-neutral-900/90 border border-white/10 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-white">Weekly Wager & Revenue Volume</h3>
                  <p className="text-xs text-neutral-400">Comparison between total bets and house revenue</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Bets ($)
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Revenue ($)
                  </span>
                </div>
              </div>

              {/* Bar Chart Graphics */}
              <div className="h-60 flex items-end gap-3 pt-6 border-b border-white/5">
                {[
                  { day: 'Mon', bets: 65, rev: 40 },
                  { day: 'Tue', bets: 80, rev: 55 },
                  { day: 'Wed', bets: 45, rev: 30 },
                  { day: 'Thu', bets: 90, rev: 60 },
                  { day: 'Fri', bets: 120, rev: 85 },
                  { day: 'Sat', bets: 150, rev: 110 },
                  { day: 'Sun', bets: 180, rev: 135 }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${item.bets}%` }}
                        className="w-1/2 bg-emerald-500/80 hover:bg-emerald-400 rounded-t transition-all relative group"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-emerald-400 font-mono text-[10px] px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap z-20">
                          ${item.bets * 1000}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${item.rev}%` }}
                        className="w-1/2 bg-amber-400/80 hover:bg-amber-300 rounded-t transition-all relative group"
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-amber-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-white/10 whitespace-nowrap z-20">
                          ${item.rev * 1000}
                        </div>
                      </motion.div>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono font-bold mt-2">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Live Operations */}
            <div className="p-6 bg-neutral-900/90 border border-white/10 rounded-3xl flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-white mb-1">Quick Operations</h3>
                <p className="text-xs text-neutral-400 mb-4">Direct control triggers for games & rewards</p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const topGame = games[0];
                      if (topGame) handleExecuteDraw(topGame);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-neutral-950 hover:bg-neutral-800 border border-amber-500/30 rounded-2xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Force Powerball Draw</span>
                        <span className="text-[10px] text-neutral-400">Trigger immediate random winner</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400" />
                  </button>

                  <button
                    onClick={() => {
                      creditUserBalance(user.id, 1000);
                    }}
                    className="w-full flex items-center justify-between p-3 bg-neutral-950 hover:bg-neutral-800 border border-emerald-500/30 rounded-2xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <Gift className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Credit Yourself $1,000</span>
                        <span className="text-[10px] text-neutral-400">Grant admin test balance</span>
                      </div>
                    </div>
                    <Plus className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    onClick={() => setActiveTab('broadcast')}
                    className="w-full flex items-center justify-between p-3 bg-neutral-950 hover:bg-neutral-800 border border-cyan-500/30 rounded-2xl text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <Radio className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Live Banner Ticker</span>
                        <span className="text-[10px] text-neutral-400">Broadcast message to all players</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <span className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Provably Fair Engine: Online
                </span>
                <p className="text-[11px] text-neutral-400 mt-1">
                  SHA-256 hash seeds are generated and broadcasted to clients for 100% auditing transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: RESOLVE LIVE BETS */}
      {activeTab === 'livebets' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Live Wager Settlement Engine</h2>
                <span className="px-2.5 py-0.5 bg-rose-500/20 border border-rose-500/30 text-rose-400 font-mono font-bold text-xs rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> REALTIME AUDIT
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">Review active player wagers, verify provable results, and manually resolve payouts</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-neutral-900 p-1.5 rounded-xl border border-white/10 overflow-x-auto">
              {(['pending', 'all', 'won', 'lost', 'refunded'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => {
                    sound.playClick();
                    setLiveBetFilter(filter);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    liveBetFilter === filter
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {filter}
                  {filter === 'pending' && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-mono">
                      {liveBets.filter(b => b.status === 'pending').length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Colour Prediction & Manual/Automatic Result Control Panel */}
          <div className="p-5 bg-gradient-to-r from-neutral-900 via-zinc-900 to-neutral-900 border border-amber-500/30 rounded-3xl shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    Result Control Engine (Manual & Automatic Integration)
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">Set automatic RNG or force specific Win/Loss outcomes for 3D Colour Prediction & Games</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Outcome Mode Selector */}
              <div className="p-4 bg-black/60 border border-white/10 rounded-2xl">
                <label className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                  System Result Control Mode:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { mode: 'automatic', label: 'Automatic (RNG)', desc: 'Fair random draw' },
                    { mode: 'manual', label: 'Manual Control', desc: 'Hold for Admin' },
                    { mode: 'force_win', label: 'Force Player Win', desc: 'Guaranteed win' },
                    { mode: 'force_loss', label: 'Force Player Loss', desc: 'Guaranteed loss' },
                  ].map(item => {
                    const active = (systemSettings.resultControlMode || 'automatic') === item.mode;
                    return (
                      <button
                        key={item.mode}
                        onClick={() => {
                          sound.playClick();
                          updateSystemSettings({ resultControlMode: item.mode as any });
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          active
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-lg'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs block font-bold">{item.label}</span>
                        <span className="text-[10px] text-zinc-500 block">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3D Real Colour Prediction Number / Color Override */}
              <div className="p-4 bg-black/60 border border-white/10 rounded-2xl">
                <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-2">
                  3D Colour Prediction Manual Override:
                </label>
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-zinc-400 block mb-1">Set Forced Next Number (0-9):</span>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
                        const isSelected = systemSettings.resultNextPredictionNumber === num;
                        const colorClass = (num === 0 || num === 5)
                          ? 'bg-purple-600'
                          : num % 2 === 0
                          ? 'bg-rose-600'
                          : 'bg-emerald-600';
                        return (
                          <button
                            key={num}
                            onClick={() => {
                              sound.playClick();
                              updateSystemSettings({ resultNextPredictionNumber: num });
                            }}
                            className={`w-8 h-8 rounded-lg font-mono font-black text-xs text-white border transition-all ${colorClass} ${
                              isSelected ? 'ring-2 ring-amber-400 border-white scale-110 shadow-lg' : 'opacity-60 hover:opacity-100 border-transparent'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => updateSystemSettings({ resultNextPredictionNumber: undefined })}
                        className="px-2.5 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold rounded-lg border border-zinc-700 hover:text-white"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-400 bg-zinc-900/90 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                    <span>Active Control State:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {systemSettings.resultControlMode?.toUpperCase() || 'AUTOMATIC'}
                      {systemSettings.resultNextPredictionNumber !== undefined && ` (Forced Ball: ${systemSettings.resultNextPredictionNumber})`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Resolution Controls / Overview Card */}
          <div className="p-4 bg-neutral-900/90 border border-amber-500/20 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-white block">Pending Bet Settlement Queue</span>
                <span className="text-[11px] text-neutral-400">
                  {liveBets.filter(b => b.status === 'pending').length} wagers waiting for admin resolution or forced jackpot payout
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  // Resolve all pending bets as wins for testing
                  liveBets.filter(b => b.status === 'pending').forEach(b => resolveLiveBet(b.id, 'won'));
                }}
                className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Bulk Resolve Wins
              </button>
            </div>
          </div>

          {/* Live Bets Grid / List */}
          {liveBets.filter(b => liveBetFilter === 'all' ? true : b.status === liveBetFilter).length === 0 ? (
            <div className="p-12 text-center bg-neutral-900/50 border border-white/10 rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-white">No Live Bets Found</h3>
              <p className="text-xs text-neutral-400 mt-1">There are currently no wagers matching status filter "{liveBetFilter}".</p>
            </div>
          ) : (
            <div className="space-y-3">
              {liveBets
                .filter(b => liveBetFilter === 'all' ? true : b.status === liveBetFilter)
                .map(bet => {
                  return (
                    <div
                      key={bet.id}
                      className="bg-neutral-900/90 border border-white/10 hover:border-amber-500/30 rounded-2xl p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      {/* Left: Player & Game Info */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={bet.avatar}
                          alt={bet.username}
                          className="w-11 h-11 rounded-xl object-cover border border-amber-500/30 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-extrabold text-white">{bet.username}</span>
                            <span className="text-[10px] font-mono text-neutral-500">({bet.userId})</span>
                            <span className="text-[10px] text-neutral-400 font-mono">· {bet.timestamp}</span>
                          </div>
                          <div className="text-xs font-bold text-amber-400 mt-0.5">{bet.gameTitle}</div>
                          <div className="text-[11px] font-mono text-neutral-300 mt-1 bg-black/50 px-2.5 py-1 rounded-lg border border-white/5 inline-block">
                            {bet.betDetails}
                          </div>
                        </div>
                      </div>

                      {/* Middle: Financials */}
                      <div className="flex items-center gap-5 sm:gap-8 font-mono text-left md:text-center shrink-0">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block">Wager Amount</span>
                          <span className="text-sm font-black text-white">₹{bet.wagerAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block">Potential Payout</span>
                          <span className="text-sm font-black text-emerald-400">₹{bet.potentialPayout.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase block">Status</span>
                          <span
                            className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-full inline-block ${
                              bet.status === 'pending'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                                : bet.status === 'won'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : bet.status === 'lost'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            }`}
                          >
                            {bet.status}
                          </span>
                        </div>
                      </div>

                      {/* Right: Resolution Buttons */}
                      <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-white/5 shrink-0">
                        {bet.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => {
                                resolveLiveBet(bet.id, 'won');
                              }}
                              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Resolve WIN (${bet.potentialPayout.toLocaleString()})
                            </button>
                            <button
                              onClick={() => resolveLiveBet(bet.id, 'lost')}
                              className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold rounded-xl text-xs uppercase transition-all flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" /> Loss
                            </button>
                            <button
                              onClick={() => resolveLiveBet(bet.id, 'refunded')}
                              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-neutral-300 font-bold rounded-xl text-xs uppercase transition-all"
                            >
                              Refund
                            </button>
                          </>
                        ) : (
                          <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                            <span>Settled Payout: <strong className="text-white">${bet.payoutAmount?.toLocaleString() ?? 0}</strong></span>
                            <button
                              onClick={() => resolveLiveBet(bet.id, 'pending')}
                              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-[10px] text-amber-400 rounded-lg transition-all"
                            >
                              Re-open Bet
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GAME CATALOG & LOTTERY MANAGER */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">Game & Lottery Catalog</h2>
              <p className="text-xs text-neutral-400">Modify odds, ticket prices, jackpots, or force draws</p>
            </div>
            <button
              onClick={() => setIsAddGameOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-full text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Add New Game / Draw
            </button>
          </div>

          {/* Game List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games.map(game => (
              <div key={game.id} className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between">
                <div className="relative h-32 w-full">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover filter brightness-75" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-black font-black text-[10px] rounded uppercase">
                    {game.badge || game.category}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 text-emerald-400 font-mono text-[10px] rounded border border-white/10">
                    RTP: {game.rtp}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white">{game.title}</h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">{game.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Jackpot Pool:</span>
                      <span className="font-mono font-bold text-amber-400">${game.jackpotAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500">Min Price:</span>
                      <span className="font-mono font-bold text-emerald-400">${game.minTicketPrice}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 pt-2">
                      <button
                        onClick={() => handleExecuteDraw(game)}
                        className="px-2 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-extrabold uppercase flex items-center justify-center gap-1"
                        title="Force instant random draw payout"
                      >
                        <Zap className="w-3 h-3 text-amber-400" /> Draw
                      </button>
                      <button
                        onClick={() => setEditingGame(game)}
                        className="px-2 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-white/10 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => deleteGame(game.id)}
                        className="px-2 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[10px] font-bold uppercase flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-white">Registered Player Database</h2>
              <p className="text-xs text-neutral-400">Search players, edit VIP tiers, grant test balances, or ban users</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user or email..."
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-neutral-900 border border-white/10 rounded-full text-xs text-white focus:outline-none focus:border-emerald-500 w-60"
                />
              </div>

              <select
                value={selectedVipFilter}
                onChange={e => setSelectedVipFilter(e.target.value)}
                className="px-3 py-2 bg-neutral-900 border border-white/10 rounded-full text-xs text-neutral-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All VIP Tiers</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Diamond">Diamond</option>
                <option value="Royal">Royal</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 border-b border-white/10 text-neutral-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4">Player</th>
                    <th className="p-4">VIP Tier</th>
                    <th className="p-4">Main Balance</th>
                    <th className="p-4">Winnings</th>
                    <th className="p-4">Total Wagered</th>
                    <th className="p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt={u.username} className="w-8 h-8 rounded-full object-cover border border-amber-500/50" />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              {u.username}
                              {u.isAdmin && (
                                <span className="px-1.5 py-0.2 bg-rose-500/20 text-rose-400 text-[9px] rounded uppercase font-bold border border-rose-500/30">
                                  ADMIN
                                </span>
                              )}
                              {u.isBanned && (
                                <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] rounded uppercase font-bold">
                                  BANNED
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-neutral-500 font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <select
                          value={u.vipTier}
                          onChange={e => updateUserByAdmin(u.id, { vipTier: e.target.value as any })}
                          className="px-2 py-1 bg-black border border-white/10 rounded text-amber-400 font-bold text-xs"
                        >
                          <option value="Bronze">🥉 Bronze</option>
                          <option value="Silver">🥈 Silver</option>
                          <option value="Gold">🥇 Gold</option>
                          <option value="Platinum">💎 Platinum</option>
                          <option value="Diamond">👑 Diamond</option>
                          <option value="Royal">🏆 Royal</option>
                        </select>
                      </td>

                      <td className="p-4 font-mono font-bold text-emerald-400">₹{u.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-4 font-mono font-bold text-amber-400">₹{u.winningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="p-4 font-mono text-neutral-300">₹{u.totalWagered.toLocaleString('en-IN')}</td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setCreditingUser(u)}
                            className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold"
                          >
                            + Credit Funds
                          </button>
                          <button
                            onClick={() => updateUserByAdmin(u.id, { isBanned: !u.isBanned })}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${
                              u.isBanned
                                ? 'bg-emerald-500 text-black border-emerald-400'
                                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {u.isBanned ? 'Unban' : 'Ban'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRANSACTIONS & FINANCIAL AUDIT */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-white">Financial Transactions Audit Log</h2>
            <p className="text-xs text-neutral-400">Review pending withdrawals, deposits, and game payouts</p>
          </div>

          <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/60 border-b border-white/10 text-neutral-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-4">Tx ID</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-neutral-800/50 transition-colors font-mono">
                      <td className="p-4 text-neutral-500 text-[11px]">{tx.id}</td>
                      <td className="p-4 uppercase font-bold text-amber-400">{tx.type}</td>
                      <td className="p-4 font-bold text-emerald-400 text-sm">₹{tx.amount.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-neutral-300">{tx.paymentMethod || 'N/A'}</td>
                      <td className="p-4 text-neutral-400 font-sans">{tx.description}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            tx.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : tx.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-sans">
                        {tx.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => updateTransactionStatus(tx.id, 'completed')}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded text-[10px] uppercase"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateTransactionStatus(tx.id, 'failed')}
                              className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded text-[10px] uppercase font-bold"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-neutral-500">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RTP & PROVABLY FAIR ODDS */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 bg-neutral-900 border border-white/10 rounded-3xl space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">RTP & Fair Odds Engine Settings</h2>
              <p className="text-xs text-neutral-400 mt-1">Configure return-to-player target rates and RNG seed values</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">
                  Global RTP Target: <span className="text-emerald-400 font-mono text-sm">{systemSettings.globalRtp}%</span>
                </label>
                <input
                  type="range"
                  min="90"
                  max="99.5"
                  step="0.1"
                  value={systemSettings.globalRtp}
                  onChange={e => updateSystemSettings({ globalRtp: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                  <span>90.0% (Tight)</span>
                  <span>95.0% (Standard)</span>
                  <span>99.5% (High Payout)</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">
                  Grand Jackpot Reserve Pool Amount ($)
                </label>
                <input
                  type="number"
                  value={systemSettings.grandJackpotPool}
                  onChange={e => updateSystemSettings({ grandJackpotPool: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-sm font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">
                  SHA-256 Provably Fair Server Seed
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={systemSettings.provablyFairSeed}
                    className="flex-1 px-4 py-2 bg-black border border-white/10 rounded-xl text-xs font-mono text-neutral-400 select-all"
                  />
                  <button
                    onClick={() => {
                      const newSeed = Math.random().toString(36).substring(2) + Date.now().toString(36);
                      updateSystemSettings({ provablyFairSeed: newSeed });
                    }}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> Rotate Seed
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BROADCAST & ANNOUNCEMENTS */}
      {activeTab === 'broadcast' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 bg-neutral-900 border border-white/10 rounded-3xl space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Live Broadcast Announcement</h2>
              <p className="text-xs text-neutral-400 mt-1">Update the top ticker announcement shown to all online players</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div>
                <label className="text-xs font-bold text-neutral-300 block mb-2">
                  Announcement Message Text
                </label>
                <textarea
                  rows={3}
                  value={announcementInput}
                  onChange={e => setAnnouncementInput(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-white/10 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Enter global broadcast text..."
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Live preview matches top announcement bar.</span>
                <button
                  onClick={handleSaveAnnouncement}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-full text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  Broadcast Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSTANT DRAW WINNER RESULT MODAL */}
      <AnimatePresence>
        {drawResultNumbers && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full text-center shadow-2xl relative"
            >
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-4">
                <Flame className="w-7 h-7 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic">Instant Draw Executed</h3>
              <p className="text-xs text-amber-300 font-medium mt-1">{drawResultNumbers.gameTitle}</p>

              <div className="my-6">
                <span className="text-[11px] text-neutral-400 uppercase font-mono font-bold block mb-2">
                  Winning Numbers Drawn:
                </span>
                <div className="flex items-center justify-center gap-2">
                  {drawResultNumbers.numbers.map((num, i) => (
                    <span
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-black font-mono font-black text-sm flex items-center justify-center shadow-md shadow-amber-500/20"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed bg-black/50 p-3 rounded-xl border border-white/5 mb-6">
                Winner payout announced to the live winners ticker and system state updated!
              </p>

              <button
                onClick={() => setDrawResultNumbers(null)}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-colors"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT GAME MODAL */}
      <AnimatePresence>
        {editingGame && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <h3 className="text-lg font-black text-white mb-4">Edit Game Configuration</h3>
              <form onSubmit={handleSaveGame} className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-400 font-bold block mb-1">Game Title</label>
                  <input
                    type="text"
                    value={editingGame.title}
                    onChange={e => setEditingGame({ ...editingGame, title: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 font-bold block mb-1">Jackpot Pool ($)</label>
                    <input
                      type="number"
                      value={editingGame.jackpotAmount}
                      onChange={e => setEditingGame({ ...editingGame, jackpotAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-amber-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 font-bold block mb-1">Min Ticket Price ($)</label>
                    <input
                      type="number"
                      value={editingGame.minTicketPrice}
                      onChange={e => setEditingGame({ ...editingGame, minTicketPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-emerald-400 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 font-bold block mb-1">RTP %</label>
                    <input
                      type="text"
                      value={editingGame.rtp}
                      onChange={e => setEditingGame({ ...editingGame, rtp: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-cyan-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400 font-bold block mb-1">Badge</label>
                    <select
                      value={editingGame.badge || 'HOT'}
                      onChange={e => setEditingGame({ ...editingGame, badge: e.target.value as any })}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white"
                    >
                      <option value="HOT">HOT</option>
                      <option value="JACKPOT">JACKPOT</option>
                      <option value="NEW">NEW</option>
                      <option value="EXCLUSIVE">EXCLUSIVE</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingGame(null)}
                    className="flex-1 py-2.5 bg-neutral-800 text-neutral-300 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs uppercase"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD NEW GAME MODAL */}
      <AnimatePresence>
        {isAddGameOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <h3 className="text-lg font-black text-white mb-4">Add New Game or Draw</h3>
              <form onSubmit={handleCreateGame} className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-400 font-bold block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Speed Power Draw 7/42"
                    value={newGameData.title}
                    onChange={e => setNewGameData({ ...newGameData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 font-bold block mb-1">Category</label>
                    <select
                      value={newGameData.category}
                      onChange={e => setNewGameData({ ...newGameData, category: e.target.value as any })}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-white"
                    >
                      <option value="Lottery">Lottery</option>
                      <option value="Instant Win">Instant Win</option>
                      <option value="Wheel">Wheel</option>
                      <option value="Scratch">Scratch</option>
                      <option value="Casino">Casino</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 font-bold block mb-1">Jackpot Pool ($)</label>
                    <input
                      type="number"
                      value={newGameData.jackpotAmount}
                      onChange={e => setNewGameData({ ...newGameData, jackpotAmount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-black border border-white/10 rounded-xl text-xs text-amber-400 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddGameOpen(false)}
                    className="flex-1 py-2.5 bg-neutral-800 text-neutral-300 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs uppercase"
                  >
                    Create Game
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREDIT USER BALANCE MODAL */}
      <AnimatePresence>
        {creditingUser && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-900 border border-emerald-500/40 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-white">Credit Player Funds</h3>
              <p className="text-xs text-neutral-400 mt-0.5">{creditingUser.username} ({creditingUser.email})</p>

              <div className="my-4">
                <label className="text-xs text-neutral-400 block mb-1 font-bold">Credit Amount (₹ INR)</label>
                <input
                  type="number"
                  value={customCreditAmount}
                  onChange={e => setCustomCreditAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-center text-xl font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCreditingUser(null)}
                  className="flex-1 py-2.5 bg-neutral-800 text-neutral-300 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const amt = Number(customCreditAmount) || 500;
                    creditUserBalance(creditingUser.id, amt);
                    setCreditingUser(null);
                  }}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl text-xs uppercase"
                >
                  Grant ₹{customCreditAmount}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
