import { Game, VipTierInfo, FAQItem, RecentWinner } from '../types';

export const INITIAL_GAMES: Game[] = [
  {
    id: 'colour-prediction-3d',
    title: '3D Real Colour Prediction',
    category: 'Prediction',
    badge: '3D FEATURED',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800',
    jackpotAmount: 1000000,
    minTicketPrice: 10,
    playersCount: 52400,
    nextDrawSeconds: 30,
    description: 'High-octane 3D real-time colour parity game. Bet on Red (2x), Green (2x), Violet (4.5x), or Numbers (9x) with live 3D ball animation!',
    rtp: '98.9%'
  },
  {
    id: 'powerball-649',
    title: 'Fortuna Powerball 6/49',
    category: 'Lottery',
    badge: 'JACKPOT',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=800',
    jackpotAmount: 128459200,
    minTicketPrice: 20,
    playersCount: 42100,
    nextDrawSeconds: 8420,
    description: 'Pick 6 lucky numbers between 1 and 49 for a chance to win the ₹12.8 Cr progressive grand jackpot!',
    rtp: '98.2%'
  },
  {
    id: 'mega-cash-draw',
    title: 'Mega Gold Draw 5/35',
    category: 'Lottery',
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=800',
    jackpotAmount: 34500000,
    minTicketPrice: 10,
    playersCount: 28900,
    nextDrawSeconds: 1800,
    description: 'Ultra fast 30-minute draw interval with boosted ₹3.4 Cr prize pool and 1-in-8 win odds.',
    rtp: '97.8%'
  },
  {
    id: 'fortune-wheel',
    title: 'Lucky Gold Wheel Spin',
    category: 'Wheel',
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&q=80&w=800',
    jackpotAmount: 5000000,
    minTicketPrice: 50,
    playersCount: 19400,
    nextDrawSeconds: 0,
    description: 'Spin the 12-segment golden wheel for instant cash multipliers up to 500x or free tickets!',
    rtp: '99.0%'
  },
  {
    id: 'speed-scratch-gold',
    title: 'Speed Scratch Gold',
    category: 'Scratch',
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
    jackpotAmount: 1000000,
    minTicketPrice: 10,
    playersCount: 15200,
    nextDrawSeconds: 0,
    description: 'Drag or tap to scratch off 6 panels. Match 3 golden crown or coin symbols for instant cash payouts.',
    rtp: '98.5%'
  },
  {
    id: 'mines-gold-rush',
    title: 'Mines Gold Rush',
    category: 'Instant Win',
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    jackpotAmount: 2500000,
    minTicketPrice: 20,
    playersCount: 31000,
    nextDrawSeconds: 0,
    description: 'Uncover gold nuggets on a 5x5 grid while avoiding hidden mines. Cash out anytime!',
    rtp: '99.2%'
  },
  {
    id: 'coin-flip-gold',
    title: 'Emerald Coin Flip',
    category: 'Instant Win',
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=800',
    jackpotAmount: 500000,
    minTicketPrice: 10,
    playersCount: 9800,
    nextDrawSeconds: 0,
    description: 'Predict Heads or Tails on a 24k gold coin. Build streak multipliers up to 128x!',
    rtp: '98.8%'
  },
  {
    id: 'speed-keno-live',
    title: 'Speed Keno 20/80',
    category: 'Lottery',
    badge: 'EXCLUSIVE',
    image: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&q=80&w=800',
    jackpotAmount: 7500000,
    minTicketPrice: 20,
    playersCount: 12400,
    nextDrawSeconds: 120,
    description: 'Draws happen every 2 minutes! Pick up to 10 numbers out of 80 for rapid fire excitement.',
    rtp: '98.0%'
  }
];

export const VIP_TIERS: VipTierInfo[] = [
  {
    name: 'Bronze',
    icon: '🥉',
    requiredPoints: 0,
    cashbackPercent: 2,
    rakebackPercent: 1,
    dailyBonusMultiplier: 1.0,
    withdrawLimit: '₹2,50,000 / day',
    perks: ['Daily Wheel Check-in', 'Standard Support', '2% Weekly Cashback'],
    color: 'from-amber-700 to-amber-900'
  },
  {
    name: 'Silver',
    icon: '🥈',
    requiredPoints: 500,
    cashbackPercent: 4,
    rakebackPercent: 2,
    dailyBonusMultiplier: 1.25,
    withdrawLimit: '₹5,00,000 / day',
    perks: ['4% Weekly Cashback', 'Priority Support', 'Exclusive Silver Tournaments', '1.25x Daily Bonus'],
    color: 'from-slate-400 to-slate-600'
  },
  {
    name: 'Gold',
    icon: '🥇',
    requiredPoints: 2000,
    cashbackPercent: 7,
    rakebackPercent: 3.5,
    dailyBonusMultiplier: 1.5,
    withdrawLimit: '₹15,00,000 / day',
    perks: ['7% Weekly Cashback', '3.5% Instant Rakeback', 'Dedicated Account Assistant', '1.5x Daily Bonus', 'Free Weekly Tickets'],
    color: 'from-amber-400 via-yellow-500 to-amber-600'
  },
  {
    name: 'Platinum',
    icon: '💎',
    requiredPoints: 7500,
    cashbackPercent: 10,
    rakebackPercent: 5,
    dailyBonusMultiplier: 2.0,
    withdrawLimit: '₹50,00,000 / day',
    perks: ['10% Weekly Cashback', '5% Instant Rakeback', 'VIP Personal Host', 'Birthday Cash Gift (₹25,000)', 'Zero Withdrawal Fees'],
    color: 'from-cyan-400 via-teal-500 to-emerald-600'
  },
  {
    name: 'Diamond',
    icon: '👑',
    requiredPoints: 25000,
    cashbackPercent: 15,
    rakebackPercent: 8,
    dailyBonusMultiplier: 3.0,
    withdrawLimit: 'Unlimited',
    perks: ['15% Weekly Cashback', '8% Instant Rakeback', 'Exclusive Luxury Giveaways', '3x Daily Check-in Rewards', 'Custom Ticket Limits'],
    color: 'from-purple-500 via-indigo-600 to-blue-700'
  },
  {
    name: 'Royal',
    icon: '🏆',
    requiredPoints: 100000,
    cashbackPercent: 20,
    rakebackPercent: 12,
    dailyBonusMultiplier: 5.0,
    withdrawLimit: 'Unlimited Instant',
    perks: ['20% Weekly Cashback', '12% Instant Rakeback', 'All-inclusive VIP Trip Invites', 'Direct Line to Operations Director', 'Custom Designed Avatar Badge'],
    color: 'from-yellow-300 via-amber-500 to-red-600'
  }
];

export const DAILY_BONUSES = [
  { day: 1, label: 'Day 1', reward: '₹50 Cash', bonusCash: 50 },
  { day: 2, label: 'Day 2', reward: '₹100 Cash', bonusCash: 100 },
  { day: 3, label: 'Day 3', reward: '₹150 Cash + 1 Ticket', bonusCash: 150 },
  { day: 4, label: 'Day 4', reward: '₹250 Cash', bonusCash: 250 },
  { day: 5, label: 'Day 5', reward: '₹400 Cash + 2 Tickets', bonusCash: 400 },
  { day: 6, label: 'Day 6', reward: '₹600 Cash', bonusCash: 600 },
  { day: 7, label: 'Day 7', reward: '🌟 ₹1,500 Jackpot Chest', bonusCash: 1500 }
];

export const RECENT_WINNERS_INITIAL: RecentWinner[] = [
  {
    id: 'w1',
    username: 'Elena_V',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    gameTitle: 'Powerball 6/49',
    amountWon: 14250,
    timestamp: '2 mins ago'
  },
  {
    id: 'w2',
    username: 'Marcus_Crypto',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    gameTitle: 'Lucky Gold Wheel',
    amountWon: 2500,
    timestamp: '4 mins ago'
  },
  {
    id: 'w3',
    username: 'Sarah_Gold',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    gameTitle: 'Mines Gold Rush',
    amountWon: 890,
    timestamp: '7 mins ago'
  },
  {
    id: 'w4',
    username: 'Satoshi_777',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    gameTitle: 'Mega Gold Draw',
    amountWon: 35000,
    timestamp: '11 mins ago'
  },
  {
    id: 'w5',
    username: 'David_K',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    gameTitle: 'Speed Scratch Gold',
    amountWon: 500,
    timestamp: '15 mins ago'
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'General',
    question: 'How do I participate in the Fortuna Gold lottery?',
    answer: 'Simply sign up or login to your account, deposit funds using any of our instant crypto or card options, pick your lucky numbers or buy instant tickets, and join the draw!'
  },
  {
    category: 'Payments',
    question: 'What payment methods are supported for deposits & withdrawals?',
    answer: 'We support Bitcoin (BTC), Ethereum (ETH), USDT (TRC20 / ERC20), Visa, Mastercard, Apple Pay, Google Pay, and Direct Bank Transfers. Withdrawals are processed within 15 minutes.'
  },
  {
    category: 'Games',
    question: 'Are the lottery draws and instant games provably fair?',
    answer: 'Yes! All Fortuna Gold draws and instant mini-games use industry-standard SHA-256 cryptographic Provably Fair random number generators (RNG) audited independently.'
  },
  {
    category: 'VIP & Rewards',
    question: 'How does the Daily Check-in Bonus work?',
    answer: 'Logged-in users can claim a free cash bonus every 24 hours. Completing a consecutive 7-day streak unlocks the $150 Golden Jackpot Chest bonus.'
  },
  {
    category: 'VIP & Rewards',
    question: 'How do I earn referral commissions?',
    answer: 'Share your personal referral link from the Referral page. You earn 10% commission on Tier 1 referral deposits, 5% on Tier 2, and 2% on Tier 3 instantly credited to your wallet.'
  }
];

export const TESTIMONIALS = [
  {
    id: 't1',
    name: 'Alexander Sterling',
    role: 'VIP Gold Member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    text: 'Fortuna Gold is by far the slickest gaming app I’ve used. I won $14,250 on the Powerball draw last night and my USDT withdrawal landed in my wallet in 8 minutes!',
    rating: 5,
    wonAmount: '$14,250'
  },
  {
    id: 't2',
    name: 'Michael Chang',
    role: 'Platinum High Roller',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    text: 'The 5% instant rakeback and weekly cashback rewards keep my balance growing consistently. The Gold Wheel and Mines games are super addictive.',
    rating: 5,
    wonAmount: '$28,400'
  },
  {
    id: 't3',
    name: 'Sophia Patel',
    role: 'Regular Player',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    text: 'I started with just the daily check-in free cash bonuses and built my way up to a $500 cashout without depositing a dime. Highly recommended!',
    rating: 5,
    wonAmount: '$500'
  }
];
