import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { User, NavigationTab, Game, Transaction, LotteryTicket, RecentWinner, SystemSettings, LiveBet } from '../types';
import { RECENT_WINNERS_INITIAL, DAILY_BONUSES, INITIAL_GAMES } from '../data/mockData';
import { sound } from '../utils/audio';

interface AuthContextType {
  user: User | null;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  isWithdrawModalOpen: boolean;
  setIsWithdrawModalOpen: (open: boolean) => void;
  activeGameModal: Game | null;
  openGameModal: (game: Game) => void;
  closeGameModal: () => void;
  login: (email: string) => void;
  register: (email: string, username: string) => void;
  logout: () => void;
  depositFunds: (amount: number, method: string) => void;
  withdrawFunds: (amount: number, destination: string) => boolean;
  buyTicket: (gameId: string, gameTitle: string, numbers: number[], price: number) => boolean;
  addWin: (amount: number, gameTitle: string) => void;
  deductBet: (amount: number) => boolean;
  claimDailyBonus: () => void;
  claimReferralEarnings: () => void;
  userTickets: LotteryTicket[];
  transactions: Transaction[];
  recentWinners: RecentWinner[];
  soundEnabled: boolean;
  toggleSound: () => void;
  triggerConfetti: () => void;

  // Admin Panel Extensions & Live Bets
  games: Game[];
  updateGame: (updatedGame: Game) => void;
  addGame: (newGame: Game) => void;
  deleteGame: (gameId: string) => void;
  triggerDrawForGame: (gameId: string) => number[];
  systemSettings: SystemSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  allUsers: User[];
  updateUserByAdmin: (userId: string, updates: Partial<User>) => void;
  creditUserBalance: (userId: string, amount: number) => void;
  updateTransactionStatus: (txId: string, status: 'completed' | 'failed') => void;
  toggleAdminRole: () => void;
  liveBets: LiveBet[];
  resolveLiveBet: (betId: string, resolution: 'won' | 'lost' | 'refunded', customPayout?: number) => void;
  placeLiveBet: (gameId: string, gameTitle: string, wagerAmount: number, betDetails: string, potentialPayout: number) => LiveBet;
  updateLiveBetStatus: (betId: string, status: 'won' | 'lost' | 'refunded', payoutAmount: number) => void;
  toggleTwoFactor: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr_777',
  username: 'GoldRider77',
  email: 'player@fortunagold.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  balance: 1250.00,
  winningBalance: 850.00,
  bonusBalance: 150.00,
  totalWagered: 4320.00,
  totalWon: 5890.00,
  vipTier: 'Gold',
  vipPoints: 2450,
  referralCode: 'FORTUNA777',
  referralCount: 14,
  referralEarnings: 285.50,
  claimedDailyStreak: 2, // day 3 ready to claim
  lastCheckInDate: '',
  createdAt: '2026-01-10',
  isAdmin: true,
  isBanned: false,
  isTwoFactorEnabled: false
};

const INITIAL_SYSTEM_SETTINGS: SystemSettings = {
  announcement: 'Fortuna Grand Powerball Jackpot Pool is now $12,845,920.00 | $1,000 Welcome Pack Active',
  maintenanceMode: false,
  globalRtp: 98.5,
  grandJackpotPool: 12845920,
  provablyFairSeed: '8f41e52b2d0a0b671a93e8271e8204620d440ef4167e89139882a93b482'
};

const MOCK_ALL_USERS: User[] = [
  DEFAULT_USER,
  {
    id: 'usr_101',
    username: 'Elena_V',
    email: 'elena.v@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    balance: 4250.00,
    winningBalance: 14250.00,
    bonusBalance: 500.00,
    totalWagered: 18900.00,
    totalWon: 34200.00,
    vipTier: 'Platinum',
    vipPoints: 8900,
    referralCode: 'ELENA99',
    referralCount: 28,
    referralEarnings: 1240.00,
    claimedDailyStreak: 6,
    createdAt: '2025-11-04',
    isAdmin: false,
    isBanned: false
  },
  {
    id: 'usr_102',
    username: 'Marcus_Crypto',
    email: 'marcus@blockmail.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    balance: 850.00,
    winningBalance: 2500.00,
    bonusBalance: 0.00,
    totalWagered: 12400.00,
    totalWon: 15800.00,
    vipTier: 'Gold',
    vipPoints: 4100,
    referralCode: 'MARCUSX',
    referralCount: 9,
    referralEarnings: 450.00,
    claimedDailyStreak: 4,
    createdAt: '2025-12-19',
    isAdmin: false,
    isBanned: false
  },
  {
    id: 'usr_103',
    username: 'Satoshi_777',
    email: 'satoshi@peer2peer.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    balance: 15400.00,
    winningBalance: 35000.00,
    bonusBalance: 1000.00,
    totalWagered: 95000.00,
    totalWon: 142000.00,
    vipTier: 'Royal',
    vipPoints: 108000,
    referralCode: 'SATOSHI777',
    referralCount: 142,
    referralEarnings: 8900.00,
    claimedDailyStreak: 7,
    createdAt: '2025-08-12',
    isAdmin: false,
    isBanned: false
  }
];

const INITIAL_LIVE_BETS: LiveBet[] = [
  {
    id: 'bet_101',
    userId: 'usr_101',
    username: 'Elena_V',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    gameId: 'game_1',
    gameTitle: 'Fortuna Grand Powerball 6/49',
    wagerAmount: 100,
    betDetails: 'Selected: [4, 12, 19, 28, 35, 41] (5x Powerplay)',
    potentialPayout: 25000,
    status: 'pending',
    timestamp: '2 mins ago'
  },
  {
    id: 'bet_102',
    userId: 'usr_102',
    username: 'Marcus_Crypto',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    gameId: 'game_2',
    gameTitle: 'Mega Fortune Wheel 100x',
    wagerAmount: 250,
    betDetails: 'Segment Wager: 50x Multiplier Slot',
    potentialPayout: 12500,
    status: 'pending',
    timestamp: '5 mins ago'
  },
  {
    id: 'bet_103',
    userId: 'usr_103',
    username: 'Satoshi_777',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    gameId: 'game_3',
    gameTitle: 'Gold Rush Mines',
    wagerAmount: 500,
    betDetails: '8 Mines Mode - 5 Gems Unlocked Unclaimed',
    potentialPayout: 4200,
    status: 'pending',
    timestamp: '8 mins ago'
  },
  {
    id: 'bet_104',
    userId: 'usr_777',
    username: 'GoldRider77',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    gameId: 'game_4',
    gameTitle: 'Cyber Coin Flip 2x',
    wagerAmount: 50,
    betDetails: 'Selected: Tails (Double or Nothing 2.0x)',
    potentialPayout: 100,
    status: 'pending',
    timestamp: '12 mins ago'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('fortuna_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [activeGameModal, setActiveGameModal] = useState<Game | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fortuna_txs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'tx_101',
        type: 'deposit',
        amount: 500,
        status: 'completed',
        paymentMethod: 'USDT (TRC20)',
        description: 'Crypto Deposit Completed',
        timestamp: '2 hours ago'
      },
      {
        id: 'tx_102',
        type: 'game_win',
        amount: 350,
        status: 'completed',
        paymentMethod: 'Fortuna Powerball',
        description: 'Match 4 Winner Payout',
        timestamp: '5 hours ago'
      },
      {
        id: 'tx_103',
        type: 'daily_bonus',
        amount: 15,
        status: 'completed',
        paymentMethod: 'Streak Reward',
        description: 'Day 2 Daily Check-in Bonus',
        timestamp: '1 day ago'
      }
    ];
  });

  const [userTickets, setUserTickets] = useState<LotteryTicket[]>(() => {
    const saved = localStorage.getItem('fortuna_tickets');
    return saved ? JSON.parse(saved) : [
      {
        id: 'tkt_801',
        gameId: 'powerball-649',
        gameTitle: 'Fortuna Powerball 6/49',
        numbers: [7, 14, 21, 33, 42, 49],
        multiplier: 2,
        price: 4,
        status: 'active',
        drawTime: 'Today at 21:00 UTC'
      }
    ];
  });

  const [recentWinners, setRecentWinners] = useState<RecentWinner[]>(RECENT_WINNERS_INITIAL);

  // Admin Managed States
  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('fortuna_games');
    return saved ? JSON.parse(saved) : INITIAL_GAMES;
  });

  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('fortuna_settings');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_SETTINGS;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('fortuna_all_users');
    return saved ? JSON.parse(saved) : MOCK_ALL_USERS;
  });

  const [liveBets, setLiveBets] = useState<LiveBet[]>(() => {
    const saved = localStorage.getItem('fortuna_live_bets');
    return saved ? JSON.parse(saved) : INITIAL_LIVE_BETS;
  });

  useEffect(() => {
    localStorage.setItem('fortuna_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('fortuna_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    localStorage.setItem('fortuna_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('fortuna_live_bets', JSON.stringify(liveBets));
  }, [liveBets]);

  // Admin Methods
  const updateGame = (updatedGame: Game) => {
    setGames(prev => prev.map(g => (g.id === updatedGame.id ? updatedGame : g)));
    sound.playClick();
  };

  const addGame = (newGame: Game) => {
    setGames(prev => [newGame, ...prev]);
    sound.playCoin();
  };

  const deleteGame = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
    sound.playClick();
  };

  const resolveLiveBet = (betId: string, resolution: 'won' | 'lost' | 'refunded', customPayout?: number) => {
    setLiveBets(prev => {
      const updated = prev.map(bet => {
        if (bet.id !== betId) return bet;

        const payout = resolution === 'won' ? (customPayout ?? bet.potentialPayout) : (resolution === 'refunded' ? bet.wagerAmount : 0);

        // If won or refunded, credit the user's balance
        if (resolution === 'won' || resolution === 'refunded') {
          creditUserBalance(bet.userId, payout);

          if (resolution === 'won') {
            const newWinner: RecentWinner = {
              id: 'win_resolved_' + Date.now(),
              username: bet.username,
              avatar: bet.avatar,
              gameTitle: `${bet.gameTitle} (RESOLVED)`,
              amountWon: payout,
              timestamp: 'Just now'
            };
            setRecentWinners(winPrev => [newWinner, ...winPrev.slice(0, 9)]);
          }
        }

        return {
          ...bet,
          status: resolution,
          payoutAmount: payout
        };
      });
      localStorage.setItem('fortuna_live_bets', JSON.stringify(updated));
      return updated;
    });

    window.dispatchEvent(new CustomEvent('fortuna_sync'));
    sound.playCoin();
    triggerConfetti();
  };

  const placeLiveBet = (gameId: string, gameTitle: string, wagerAmount: number, betDetails: string, potentialPayout: number): LiveBet => {
    const currentU = user || DEFAULT_USER;
    const newBet: LiveBet = {
      id: 'bet_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      userId: currentU.id,
      username: currentU.username,
      avatar: currentU.avatar,
      gameId,
      gameTitle,
      wagerAmount,
      betDetails,
      potentialPayout,
      status: 'pending',
      timestamp: 'Just now'
    };
    setLiveBets(prev => {
      const updated = [newBet, ...prev];
      localStorage.setItem('fortuna_live_bets', JSON.stringify(updated));
      return updated;
    });
    window.dispatchEvent(new CustomEvent('fortuna_sync'));
    return newBet;
  };

  const updateLiveBetStatus = (betId: string, status: 'won' | 'lost' | 'refunded', payoutAmount: number) => {
    setLiveBets(prev => {
      const updated = prev.map(b => b.id === betId ? { ...b, status, payoutAmount } : b);
      localStorage.setItem('fortuna_live_bets', JSON.stringify(updated));
      return updated;
    });
    window.dispatchEvent(new CustomEvent('fortuna_sync'));
  };

  const triggerDrawForGame = (gameId: string): number[] => {
    const game = games.find(g => g.id === gameId);
    if (!game) return [7, 14, 21, 33, 42, 49];

    // Generate winning numbers
    const generated: number[] = [];
    while (generated.length < 6) {
      const num = Math.floor(Math.random() * 49) + 1;
      if (!generated.includes(num)) generated.push(num);
    }
    generated.sort((a, b) => a - b);

    // Pick a random winner from user list or current user
    const winnerUser = allUsers[Math.floor(Math.random() * allUsers.length)] || DEFAULT_USER;
    const winAmount = Math.floor(game.jackpotAmount * 0.15) || 5000;

    const newWinner: RecentWinner = {
      id: 'draw_' + Date.now(),
      username: winnerUser.username,
      avatar: winnerUser.avatar,
      gameTitle: `${game.title} (INSTANT DRAW)`,
      amountWon: winAmount,
      timestamp: 'Just now'
    };

    setRecentWinners(prev => [newWinner, ...prev.slice(0, 9)]);

    // Update game next draw seconds and bump jackpot slightly
    updateGame({
      ...game,
      nextDrawSeconds: 3600,
      jackpotAmount: Math.floor(game.jackpotAmount * 0.9 + 50000)
    });

    sound.playWinFanfare();
    triggerConfetti();

    return generated;
  };

  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...newSettings }));
    sound.playClick();
  };

  const updateUserByAdmin = (userId: string, updates: Partial<User>) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
    sound.playClick();
  };

  const creditUserBalance = (userId: string, amount: number) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          balance: u.balance + amount
        };
      }
      return u;
    }));

    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, balance: prev.balance + amount } : null);
    }

    const newTx: Transaction = {
      id: 'tx_admin_' + Date.now(),
      type: 'deposit',
      amount,
      status: 'completed',
      paymentMethod: 'Admin Grant',
      description: `Admin credited $${amount.toLocaleString()} bonus funds`,
      timestamp: 'Just now'
    };

    setTransactions(prev => [newTx, ...prev]);
    sound.playCoin();
    triggerConfetti();
  };

  const updateTransactionStatus = (txId: string, status: 'completed' | 'failed') => {
    setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status } : tx));
    sound.playClick();
  };

  const toggleAdminRole = () => {
    if (!user) return;
    const nextAdmin = !user.isAdmin;
    setUser({ ...user, isAdmin: nextAdmin });
    sound.playClick();
  };

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('fortuna_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fortuna_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fortuna_txs', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fortuna_tickets', JSON.stringify(userTickets));
  }, [userTickets]);

  // Real-time synchronization for Admin & Player Panels
  useEffect(() => {
    const handleRealtimeSync = () => {
      try {
        const savedBets = localStorage.getItem('fortuna_live_bets');
        if (savedBets) setLiveBets(JSON.parse(savedBets));

        const savedUser = localStorage.getItem('fortuna_user');
        if (savedUser) setUser(JSON.parse(savedUser));

        const savedAllUsers = localStorage.getItem('fortuna_all_users');
        if (savedAllUsers) setAllUsers(JSON.parse(savedAllUsers));

        const savedTxs = localStorage.getItem('fortuna_txs');
        if (savedTxs) setTransactions(JSON.parse(savedTxs));

        const savedGames = localStorage.getItem('fortuna_games');
        if (savedGames) setGames(JSON.parse(savedGames));
      } catch (err) {
        console.error("Realtime sync error:", err);
      }
    };

    window.addEventListener('storage', handleRealtimeSync);
    window.addEventListener('fortuna_sync', handleRealtimeSync);
    return () => {
      window.removeEventListener('storage', handleRealtimeSync);
      window.removeEventListener('fortuna_sync', handleRealtimeSync);
    };
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#FBBF24', '#34D399', '#FEF08A']
      });
    } catch {
      // ignore
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
    sound.playClick();
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openGameModal = (game: Game) => {
    setActiveGameModal(game);
    sound.playClick();
  };

  const closeGameModal = () => {
    setActiveGameModal(null);
  };

  const login = (email: string) => {
    const isAdmin = email.toLowerCase().includes('admin') || email.toLowerCase().includes('alex.gold');
    const loggedInUser: User = {
      ...DEFAULT_USER,
      email,
      username: email.split('@')[0] || (isAdmin ? 'SystemAdmin' : 'GoldVIP'),
      isAdmin
    };
    setUser(loggedInUser);
    closeAuthModal();
    sound.playCoin();
    triggerConfetti();
  };

  const register = (email: string, username: string) => {
    const newUser: User = {
      ...DEFAULT_USER,
      email,
      username: username || 'Player' + Math.floor(Math.random() * 8999 + 1000),
      balance: 100.00, // $100 Welcome Gift
      bonusBalance: 50.00
    };
    setUser(newUser);
    closeAuthModal();
    sound.playWinFanfare();
    triggerConfetti();
  };

  const logout = () => {
    setUser(null);
    sound.playClick();
  };

  const toggleTwoFactor = () => {
    if (!user) return;
    const next2FAState = !user.isTwoFactorEnabled;
    setUser({
      ...user,
      isTwoFactorEnabled: next2FAState
    });
    if (next2FAState) {
      sound.playWinFanfare();
      triggerConfetti();
    } else {
      sound.playClick();
    }
  };

  const depositFunds = (amount: number, method: string) => {
    if (!user) return;
    const newBalance = user.balance + amount;
    const newPoints = user.vipPoints + Math.floor(amount * 2);

    let nextTier = user.vipTier;
    if (newPoints >= 25000) nextTier = 'Diamond';
    else if (newPoints >= 7500) nextTier = 'Platinum';
    else if (newPoints >= 2000) nextTier = 'Gold';
    else if (newPoints >= 500) nextTier = 'Silver';

    setUser({
      ...user,
      balance: newBalance,
      vipPoints: newPoints,
      vipTier: nextTier
    });

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'deposit',
      amount,
      status: 'completed',
      paymentMethod: method,
      description: `Instant ${method} Top-Up`,
      timestamp: 'Just now'
    };

    setTransactions([newTx, ...transactions]);
    setIsDepositModalOpen(false);
    sound.playCoin();
    triggerConfetti();
  };

  const withdrawFunds = (amount: number, destination: string): boolean => {
    if (!user) return false;
    const totalAvailable = user.winningBalance + user.balance;
    if (amount > totalAvailable) {
      return false;
    }

    let remainingToDeduct = amount;
    let newWinning = user.winningBalance;
    let newBalance = user.balance;

    if (newWinning >= remainingToDeduct) {
      newWinning -= remainingToDeduct;
    } else {
      remainingToDeduct -= newWinning;
      newWinning = 0;
      newBalance -= remainingToDeduct;
    }

    setUser({
      ...user,
      balance: newBalance,
      winningBalance: newWinning
    });

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'withdrawal',
      amount,
      status: 'completed',
      paymentMethod: destination,
      description: `Withdrawal to ${destination.slice(0, 8)}...`,
      timestamp: 'Just now'
    };

    setTransactions([newTx, ...transactions]);
    setIsWithdrawModalOpen(false);
    sound.playCoin();
    return true;
  };

  const deductBet = (amount: number): boolean => {
    if (!user) return false;
    const totalAvailable = user.balance + user.bonusBalance + user.winningBalance;
    if (totalAvailable < amount) return false;

    let cost = amount;
    let bBalance = user.bonusBalance;
    let mainBal = user.balance;
    let winBal = user.winningBalance;

    // Deduct bonus balance first, then main balance, then winning balance
    if (bBalance >= cost) {
      bBalance -= cost;
    } else {
      cost -= bBalance;
      bBalance = 0;
      if (mainBal >= cost) {
        mainBal -= cost;
      } else {
        cost -= mainBal;
        mainBal = 0;
        winBal -= cost;
      }
    }

    setUser({
      ...user,
      balance: mainBal,
      bonusBalance: bBalance,
      winningBalance: winBal,
      totalWagered: user.totalWagered + amount,
      vipPoints: user.vipPoints + Math.floor(amount * 1)
    });

    sound.playClick();
    return true;
  };

  const buyTicket = (gameId: string, gameTitle: string, numbers: number[], price: number): boolean => {
    if (!deductBet(price)) return false;

    const ticket: LotteryTicket = {
      id: 'tkt_' + Math.floor(Math.random() * 89999 + 10000),
      gameId,
      gameTitle,
      numbers,
      multiplier: 1,
      price,
      status: 'active',
      drawTime: 'In next live draw'
    };

    setUserTickets([ticket, ...userTickets]);

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'ticket_purchase',
      amount: price,
      status: 'completed',
      paymentMethod: 'Wallet Balance',
      description: `Purchased Ticket for ${gameTitle}`,
      timestamp: 'Just now'
    };
    setTransactions([newTx, ...transactions]);
    sound.playCoin();
    return true;
  };

  const addWin = (amount: number, gameTitle: string) => {
    if (!user) return;
    setUser({
      ...user,
      winningBalance: user.winningBalance + amount,
      totalWon: user.totalWon + amount
    });

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'game_win',
      amount,
      status: 'completed',
      paymentMethod: gameTitle,
      description: `Win Payout from ${gameTitle}`,
      timestamp: 'Just now'
    };

    const newWinner: RecentWinner = {
      id: 'win_' + Date.now(),
      username: user.username,
      avatar: user.avatar,
      gameTitle,
      amountWon: amount,
      timestamp: 'Just now'
    };

    setTransactions([newTx, ...transactions]);
    setRecentWinners([newWinner, ...recentWinners.slice(0, 9)]);
    sound.playWinFanfare();
    triggerConfetti();
  };

  const claimDailyBonus = () => {
    if (!user) return;
    const currentStreakIdx = user.claimedDailyStreak % 7;
    const todayConfig = DAILY_BONUSES[currentStreakIdx];
    const amount = todayConfig.bonusCash;

    const nextStreak = user.claimedDailyStreak + 1;

    setUser({
      ...user,
      bonusBalance: user.bonusBalance + amount,
      claimedDailyStreak: nextStreak,
      lastCheckInDate: new Date().toISOString()
    });

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'daily_bonus',
      amount,
      status: 'completed',
      paymentMethod: 'Daily Streak',
      description: `Claimed ${todayConfig.label} Bonus ($${amount})`,
      timestamp: 'Just now'
    };

    setTransactions([newTx, ...transactions]);
    sound.playWinFanfare();
    triggerConfetti();
  };

  const claimReferralEarnings = () => {
    if (!user || user.referralEarnings <= 0) return;
    const amount = user.referralEarnings;

    setUser({
      ...user,
      winningBalance: user.winningBalance + amount,
      referralEarnings: 0
    });

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      type: 'referral_claim',
      amount,
      status: 'completed',
      paymentMethod: 'Referral Bonus',
      description: 'Transferred Referral Commission to Wallet',
      timestamp: 'Just now'
    };

    setTransactions([newTx, ...transactions]);
    sound.playCoin();
    triggerConfetti();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        isDepositModalOpen,
        setIsDepositModalOpen,
        isWithdrawModalOpen,
        setIsWithdrawModalOpen,
        activeGameModal,
        openGameModal,
        closeGameModal,
        login,
        register,
        logout,
        depositFunds,
        withdrawFunds,
        buyTicket,
        addWin,
        deductBet,
        claimDailyBonus,
        claimReferralEarnings,
        userTickets,
        transactions,
        recentWinners,
        soundEnabled,
        toggleSound,
        triggerConfetti,
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
        updateTransactionStatus,
        toggleAdminRole,
        liveBets,
        resolveLiveBet,
        placeLiveBet,
        updateLiveBetStatus,
        toggleTwoFactor
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
