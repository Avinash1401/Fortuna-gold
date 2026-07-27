export type NavigationTab = 'home' | 'games' | 'dashboard' | 'referrals' | 'vip' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  balance: number; // main cash
  winningBalance: number; // withdrawable winnings
  bonusBalance: number; // bonus cash
  totalWagered: number;
  totalWon: number;
  vipTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Royal';
  vipPoints: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  referralEarnings: number;
  claimedDailyStreak: number; // day index 0..6
  lastCheckInDate?: string;
  createdAt: string;
  isAdmin?: boolean;
  isBanned?: boolean;
  isTwoFactorEnabled?: boolean;
}

export interface SystemSettings {
  announcement: string;
  maintenanceMode: boolean;
  globalRtp: number;
  grandJackpotPool: number;
  provablyFairSeed: string;
  resultControlMode?: 'automatic' | 'manual' | 'force_win' | 'force_loss';
  resultNextPredictionColor?: 'red' | 'green' | 'violet';
  resultNextPredictionNumber?: number;
}

export interface Game {
  id: string;
  title: string;
  category: 'Lottery' | 'Instant Win' | 'Wheel' | 'Scratch' | 'Casino' | 'Prediction';
  badge?: 'HOT' | 'JACKPOT' | 'NEW' | 'EXCLUSIVE' | '3D FEATURED';
  image: string;
  jackpotAmount: number;
  minTicketPrice: number;
  playersCount: number;
  nextDrawSeconds: number; // countdown
  description: string;
  rtp: string; // e.g. "98.5%"
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'ticket_purchase' | 'game_win' | 'daily_bonus' | 'referral_claim';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod?: string;
  description: string;
  timestamp: string;
}

export interface LotteryTicket {
  id: string;
  gameId: string;
  gameTitle: string;
  numbers: number[];
  multiplier: number;
  price: number;
  status: 'active' | 'won' | 'lost';
  prizeWon?: number;
  drawTime: string;
}

export interface LiveBet {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  gameId: string;
  gameTitle: string;
  wagerAmount: number;
  betDetails: string;
  potentialPayout: number;
  status: 'pending' | 'won' | 'lost' | 'refunded';
  payoutAmount?: number;
  timestamp: string;
}

export interface RecentWinner {
  id: string;
  username: string;
  avatar: string;
  gameTitle: string;
  amountWon: number;
  timestamp: string;
}

export interface VipTierInfo {
  name: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Royal';
  icon: string;
  requiredPoints: number;
  cashbackPercent: number;
  rakebackPercent: number;
  dailyBonusMultiplier: number;
  withdrawLimit: string;
  perks: string[];
  color: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'General' | 'Payments' | 'Games' | 'VIP & Rewards';
}
