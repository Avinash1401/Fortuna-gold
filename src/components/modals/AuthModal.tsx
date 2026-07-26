import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Mail, Lock, User, Gift, Sparkles, X, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    if (mode === 'login') {
      login(email || 'player@fortunagold.com');
    } else {
      register(email || 'player@fortunagold.com', username || 'GoldVIP');
    }
  };

  const handleAdminLogin = () => {
    sound.playClick();
    setEmail('admin@fortunagold.com');
    setPassword('admin123');
    login('admin@fortunagold.com');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-zinc-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-0.5 mx-auto mb-3 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Crown className="w-7 h-7" />
              </div>
            </div>
            <h3 className="text-2xl font-black bg-gradient-to-r from-amber-200 via-yellow-400 to-emerald-400 bg-clip-text text-transparent">
              {mode === 'login' ? 'Welcome Back!' : 'Join Fortuna Gold'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {mode === 'login'
                ? 'Sign in to access your wallet, active tickets, and VIP rewards.'
                : 'Create an account to claim your $1,000 Welcome Pack & Daily Spin!'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-zinc-900 rounded-xl mb-5 border border-zinc-800">
            <button
              onClick={() => {
                sound.playClick();
                setMode('login');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setMode('register');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Register ($1,000 Bonus)
            </button>
          </div>

          {/* Quick Admin Access */}
          <div className="mb-5">
            <button
              onClick={handleAdminLogin}
              type="button"
              className="w-full py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Shield className="w-4 h-4 text-rose-400" /> System Admin Quick Access
            </button>
          </div>

          {/* Admin Credentials Info Card */}
          <div className="p-3 mb-5 bg-zinc-900/90 border border-white/10 rounded-xl text-[11px] font-mono text-zinc-300">
            <div className="flex items-center justify-between mb-1">
              <span className="text-rose-400 font-bold flex items-center gap-1 uppercase tracking-wider text-[10px]">
                <Shield className="w-3 h-3" /> System Admin Credentials
              </span>
              <span className="text-[9px] text-zinc-500">Auto-filled</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Email: <strong className="text-white">admin@fortunagold.com</strong></span>
              <span>Pass: <strong className="text-white">admin123</strong></span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. GoldRider77"
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-zinc-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="player@example.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-300 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-500 text-zinc-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-98 transition-all"
            >
              {mode === 'login' ? 'Sign In to Account' : 'Create VIP Account ($1,000 Bonus)'}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-[10px] text-center text-zinc-500 mt-5 flex items-center justify-center gap-1">
            <Gift className="w-3.5 h-3.5 text-amber-400" /> By continuing, you agree to our 18+ Responsible Gaming terms.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
