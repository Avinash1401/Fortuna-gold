import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'success') => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5);
    const newToast: ToastItem = { id, title, message, type };

    setToasts(prev => [newToast, ...prev.slice(0, 4)]); // max 5 active toasts

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.85, x: 30 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 relative overflow-hidden text-white ${
                toast.type === 'success'
                  ? 'bg-zinc-950/95 border-emerald-500/50 shadow-emerald-500/20'
                  : toast.type === 'error'
                  ? 'bg-zinc-950/95 border-rose-500/50 shadow-rose-500/20'
                  : 'bg-zinc-950/95 border-amber-500/50 shadow-amber-500/20'
              }`}
            >
              {/* Top Accent Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  toast.type === 'success'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : toast.type === 'error'
                    ? 'bg-gradient-to-r from-rose-500 to-red-600'
                    : 'bg-gradient-to-r from-amber-400 to-yellow-500'
                }`}
              />

              {/* Icon */}
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' ? (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                ) : toast.type === 'error' ? (
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Text Body */}
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-white leading-tight">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-[11px] text-zinc-300 mt-1 leading-snug font-medium">
                    {toast.message}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Progress bar line at bottom */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 4.5, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-0.5 ${
                  toast.type === 'success'
                    ? 'bg-emerald-500'
                    : toast.type === 'error'
                    ? 'bg-rose-500'
                    : 'bg-amber-400'
                }`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
