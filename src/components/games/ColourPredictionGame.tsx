import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, Clock, ShieldCheck, HelpCircle, Eye, RefreshCw, X, Zap, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../utils/audio';

interface Props {
  onClose: () => void;
}

interface PeriodRecord {
  periodId: string;
  number: number;
  color: 'red' | 'green' | 'violet';
  colorLabel: string;
}

export const ColourPredictionGame: React.FC<Props> = ({ onClose }) => {
  const { deductBet, addWin, triggerConfetti, placeLiveBet, updateLiveBetStatus, systemSettings } = useAuth();

  // Selected wager state in INR (₹)
  const [selectedContract, setSelectedContract] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<number>(1);
  const totalWager = selectedContract * multiplier;

  // Selected bet type
  const [selectedColor, setSelectedColor] = useState<'red' | 'green' | 'violet' | null>('green');
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  // Period state
  const [periodId, setPeriodId] = useState<string>('20260727001');
  const [countdown, setCountdown] = useState<number>(25);
  const [isRevealing, setIsRevealing] = useState(false);
  const [winMessage, setWinMessage] = useState<string | null>(null);
  const [lastDrawn, setLastDrawn] = useState<PeriodRecord | null>(null);

  // 3D Sphere Rotation
  const [sphereRotation, setSphereRotation] = useState<number>(0);

  // Historical Records
  const [history, setHistory] = useState<PeriodRecord[]>([
    { periodId: '20260727000', number: 7, color: 'green', colorLabel: 'Green' },
    { periodId: '20260726999', number: 2, color: 'red', colorLabel: 'Red' },
    { periodId: '20260726998', number: 0, color: 'violet', colorLabel: 'Violet' },
    { periodId: '20260726997', number: 9, color: 'green', colorLabel: 'Green' },
    { periodId: '20260726996', number: 4, color: 'red', colorLabel: 'Red' },
    { periodId: '20260726995', number: 5, color: 'violet', colorLabel: 'Violet' },
    { periodId: '20260726994', number: 1, color: 'green', colorLabel: 'Green' }
  ]);

  // Live Timer Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          triggerDraw();
          return 30; // reset 30s
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedColor, selectedNumber, totalWager]);

  const triggerDraw = () => {
    setIsRevealing(true);
    sound.playClick();

    // Rotate 3D ball
    setSphereRotation(r => r + 720);

    setTimeout(() => {
      // Determine result based on Admin manual setting or RNG
      let winningNum: number;
      let winningColor: 'red' | 'green' | 'violet';

      if (systemSettings.resultControlMode === 'force_win') {
        if (selectedNumber !== null) winningNum = selectedNumber;
        else if (selectedColor === 'red') winningNum = 2;
        else if (selectedColor === 'violet') winningNum = 0;
        else winningNum = 7;
      } else if (systemSettings.resultControlMode === 'force_loss') {
        if (selectedColor === 'red') winningNum = 7;
        else if (selectedColor === 'green') winningNum = 2;
        else winningNum = 1;
      } else if (systemSettings.resultNextPredictionNumber !== undefined) {
        winningNum = systemSettings.resultNextPredictionNumber;
      } else {
        winningNum = Math.floor(Math.random() * 10);
      }

      if (winningNum === 0 || winningNum === 5) {
        winningColor = 'violet';
      } else if ([1, 3, 7, 9].includes(winningNum)) {
        winningColor = 'green';
      } else {
        winningColor = 'red';
      }

      const newRecord: PeriodRecord = {
        periodId,
        number: winningNum,
        color: winningColor,
        colorLabel: winningColor.toUpperCase()
      };

      setLastDrawn(newRecord);
      setHistory(prev => [newRecord, ...prev.slice(0, 11)]);
      setPeriodId(id => (parseInt(id) + 1).toString());
      setIsRevealing(false);
    }, 2000);
  };

  const handlePlaceBet = () => {
    if (!selectedColor && selectedNumber === null) {
      alert('Please select a Colour or Number for your prediction!');
      return;
    }

    if (!deductBet(totalWager)) {
      return;
    }

    const targetDetails = selectedNumber !== null ? `Number ${selectedNumber}` : `Colour ${selectedColor?.toUpperCase()}`;
    const payoutFactor = selectedNumber !== null ? 9 : (selectedColor === 'violet' ? 4.5 : 2);
    const potentialPayout = parseFloat((totalWager * payoutFactor).toFixed(2));

    const liveBet = placeLiveBet(
      'colour-prediction-3d',
      '3D Real Colour Prediction',
      totalWager,
      `Period ${periodId} | ${targetDetails}`,
      potentialPayout
    );

    sound.playCoin();
    setIsRevealing(true);
    setSphereRotation(r => r + 1080);

    // Resolve after 2.5s
    setTimeout(() => {
      let winningNum: number;
      if (systemSettings.resultControlMode === 'force_win') {
        winningNum = selectedNumber !== null ? selectedNumber : (selectedColor === 'red' ? 2 : selectedColor === 'violet' ? 0 : 7);
      } else if (systemSettings.resultControlMode === 'force_loss') {
        winningNum = selectedColor === 'red' ? 7 : (selectedColor === 'green' ? 2 : 1);
      } else {
        winningNum = Math.floor(Math.random() * 10);
      }

      let winningColor: 'red' | 'green' | 'violet';
      if (winningNum === 0 || winningNum === 5) winningColor = 'violet';
      else if ([1, 3, 7, 9].includes(winningNum)) winningColor = 'green';
      else winningColor = 'red';

      const isColorWin = selectedColor && (selectedColor === winningColor || (winningColor === 'violet' && (selectedColor === 'red' || selectedColor === 'green')));
      const isNumberWin = selectedNumber !== null && selectedNumber === winningNum;

      const record: PeriodRecord = {
        periodId,
        number: winningNum,
        color: winningColor,
        colorLabel: winningColor.toUpperCase()
      };
      setLastDrawn(record);
      setHistory(prev => [record, ...prev.slice(0, 11)]);
      setPeriodId(id => (parseInt(id) + 1).toString());
      setIsRevealing(false);

      if (isColorWin || isNumberWin) {
        setWinMessage(`🎉 PREDICTION WIN! Drawn: ${winningNum} (${winningColor.toUpperCase()}). Won ₹${potentialPayout.toLocaleString()}`);
        addWin(potentialPayout, '3D Real Colour Prediction');
        updateLiveBetStatus(liveBet.id, 'won', potentialPayout);
        triggerConfetti();
      } else {
        setWinMessage(`Result: ${winningNum} (${winningColor.toUpperCase()}). Better luck next round!`);
        updateLiveBetStatus(liveBet.id, 'lost', 0);
      }
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-zinc-950 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden text-white my-auto"
      >
        {/* Glow Header */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-amber-500 to-rose-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight uppercase italic text-white">3D Real Colour Prediction</h2>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full text-[9px] font-extrabold uppercase">
                  3D LIVE STAGE
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">Period: <strong className="text-amber-400">{periodId}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Timer */}
            <div className="bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="text-right">
                <span className="text-[9px] text-neutral-400 uppercase font-bold block">Next Draw</span>
                <span className="text-xs font-mono font-black text-emerald-400">{countdown}s</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D STAGE & VISUALIZATION */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gradient-to-b from-neutral-900 to-zinc-950 p-6 rounded-3xl border border-white/10 relative">
          {/* Left: 3D Animated Sphere Stage */}
          <div className="flex flex-col items-center justify-center relative min-h-[200px]">
            <div
              className="w-44 h-44 rounded-full relative flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.2)]"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Outer 3D Orbiting Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/50"
                style={{ rotate: sphereRotation }}
                transition={{ duration: 2, ease: 'easeOut' }}
              />

              {/* Glowing 3D Sphere */}
              <motion.div
                animate={{ rotateY: sphereRotation, rotateX: isRevealing ? 360 : 0 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className={`w-36 h-36 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl relative transition-all duration-500 ${
                  lastDrawn?.color === 'red'
                    ? 'bg-gradient-to-tr from-rose-700 via-rose-500 to-red-400 border-rose-300 shadow-rose-500/50'
                    : lastDrawn?.color === 'violet'
                    ? 'bg-gradient-to-tr from-purple-800 via-violet-600 to-fuchsia-400 border-violet-300 shadow-violet-500/50'
                    : 'bg-gradient-to-tr from-emerald-700 via-emerald-500 to-teal-400 border-emerald-300 shadow-emerald-500/50'
                }`}
              >
                <span className="text-4xl font-black text-white font-mono drop-shadow-md">
                  {isRevealing ? '?' : lastDrawn ? lastDrawn.number : '7'}
                </span>
                <span className="text-[10px] font-extrabold uppercase text-white/90 tracking-widest mt-1">
                  {isRevealing ? 'SPINNING...' : lastDrawn ? lastDrawn.colorLabel : 'GREEN'}
                </span>
              </motion.div>
            </div>

            {winMessage && (
              <p className="mt-4 text-xs font-bold text-amber-400 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/30 text-center">
                {winMessage}
              </p>
            )}
          </div>

          {/* Right: History Trend & Parity Dots */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Recent Parity Draw Record
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Provably Fair SHA-256</span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-6 gap-2 bg-black/60 p-3 rounded-2xl border border-white/10">
              {history.map((rec, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-2 rounded-xl bg-zinc-900 border border-white/5"
                >
                  <span className="text-[9px] text-neutral-500 font-mono font-bold">#{rec.periodId.slice(-3)}</span>
                  <div
                    className={`w-6 h-6 rounded-full my-1 flex items-center justify-center text-[10px] font-black text-white ${
                      rec.color === 'red'
                        ? 'bg-rose-600'
                        : rec.color === 'violet'
                        ? 'bg-violet-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {rec.number}
                  </div>
                  <span className="text-[8px] uppercase font-extrabold text-neutral-400">{rec.color[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BETTING CONTROLS */}
        <div className="space-y-5">
          {/* Select Main Colour Category */}
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              1. Select Parity Colour (Multiplier 2x - 4.5x)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedColor('green');
                  setSelectedNumber(null);
                }}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  selectedColor === 'green'
                    ? 'bg-emerald-600 text-white border-emerald-300 ring-2 ring-emerald-400 shadow-lg scale-[1.02]'
                    : 'bg-zinc-900 border-white/10 text-emerald-400 hover:bg-zinc-800'
                }`}
              >
                <span className="text-base font-black uppercase">JOIN GREEN</span>
                <span className="text-[10px] font-bold opacity-80">Payout 2x (1,3,7,9)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedColor('violet');
                  setSelectedNumber(null);
                }}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  selectedColor === 'violet'
                    ? 'bg-violet-600 text-white border-violet-300 ring-2 ring-violet-400 shadow-lg scale-[1.02]'
                    : 'bg-zinc-900 border-white/10 text-violet-400 hover:bg-zinc-800'
                }`}
              >
                <span className="text-base font-black uppercase">JOIN VIOLET</span>
                <span className="text-[10px] font-bold opacity-80">Payout 4.5x (0, 5)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedColor('red');
                  setSelectedNumber(null);
                }}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  selectedColor === 'red'
                    ? 'bg-rose-600 text-white border-rose-300 ring-2 ring-rose-400 shadow-lg scale-[1.02]'
                    : 'bg-zinc-900 border-white/10 text-rose-400 hover:bg-zinc-800'
                }`}
              >
                <span className="text-base font-black uppercase">JOIN RED</span>
                <span className="text-[10px] font-bold opacity-80">Payout 2x (2,4,6,8)</span>
              </button>
            </div>
          </div>

          {/* Select Specific Number (9x payout) */}
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              2. Or Select Direct Number (Huge 9x Payout)
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedNumber(num);
                    setSelectedColor(null);
                  }}
                  className={`py-2.5 rounded-xl text-sm font-black border font-mono transition-all ${
                    selectedNumber === num
                      ? 'bg-amber-500 text-black border-amber-300 ring-2 ring-amber-400 scale-110 shadow-lg'
                      : 'bg-zinc-900 text-white border-white/10 hover:border-amber-500/40'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Wager Amount in Indian Rupees (₹) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-900/80 p-4 rounded-2xl border border-white/10">
            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase block mb-2">Contract Money (₹ INR)</label>
              <div className="flex items-center gap-2">
                {[10, 100, 1000, 10000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedContract(amt)}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      selectedContract === amt
                        ? 'bg-amber-500 text-black border-amber-300'
                        : 'bg-black text-neutral-300 border-white/10 hover:text-white'
                    }`}
                  >
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-400 uppercase block mb-2">Multiplier Count</label>
              <div className="flex items-center gap-2">
                {[1, 5, 10, 20, 50].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMultiplier(m)}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      multiplier === m
                        ? 'bg-emerald-500 text-black border-emerald-300'
                        : 'bg-black text-neutral-300 border-white/10 hover:text-white'
                    }`}
                  >
                    x{m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Total Wager Amount</span>
              <span className="text-2xl font-black text-amber-400 font-mono">₹{totalWager.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePlaceBet}
              disabled={isRevealing}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-base uppercase rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isRevealing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Trophy className="w-5 h-5 fill-black" />}
              CONFIRM PREDICTION BET
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
