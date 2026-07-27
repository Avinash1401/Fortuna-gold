/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { GamesPage } from './pages/GamesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReferralPage } from './pages/ReferralPage';
import { VipPage } from './pages/VipPage';
import { AdminPage } from './pages/AdminPage';
import { AuthModal } from './components/modals/AuthModal';
import { DepositModal } from './components/modals/DepositModal';
import { WithdrawModal } from './components/modals/WithdrawModal';
import { LotteryPickGame } from './components/games/LotteryPickGame';
import { FortuneWheelGame } from './components/games/FortuneWheelGame';
import { ScratchCardGame } from './components/games/ScratchCardGame';
import { MinesGame } from './components/games/MinesGame';
import { CoinFlipGame } from './components/games/CoinFlipGame';
import { ColourPredictionGame } from './components/games/ColourPredictionGame';

import { ToastProvider } from './context/ToastContext';

const MainAppContent: React.FC = () => {
  const { activeTab, activeGameModal, closeGameModal } = useAuth();

  const renderGameComponent = () => {
    if (!activeGameModal) return null;

    if (activeGameModal.id === 'colour-prediction-3d' || activeGameModal.category === 'Prediction') {
      return <ColourPredictionGame onClose={closeGameModal} />;
    }
    if (activeGameModal.id === 'fortune-wheel' || activeGameModal.category === 'Wheel') {
      return <FortuneWheelGame onClose={closeGameModal} />;
    }
    if (activeGameModal.id === 'speed-scratch-gold' || activeGameModal.category === 'Scratch') {
      return <ScratchCardGame onClose={closeGameModal} />;
    }
    if (activeGameModal.id === 'mines-gold-rush') {
      return <MinesGame onClose={closeGameModal} />;
    }
    if (activeGameModal.id === 'coin-flip-gold') {
      return <CoinFlipGame onClose={closeGameModal} />;
    }
    return <LotteryPickGame onClose={closeGameModal} />;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500 selection:text-black flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Page View Switcher */}
      <main className="flex-1 pb-24 lg:pb-0">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'games' && <GamesPage />}
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'referrals' && <ReferralPage />}
        {activeTab === 'vip' && <VipPage />}
        {activeTab === 'admin' && <AdminPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <AuthModal />
      <DepositModal />
      <WithdrawModal />

      {/* Active Playable Game Overlay */}
      <AnimatePresence>
        {activeGameModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md">
            {renderGameComponent()}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ToastProvider>
  );
}
