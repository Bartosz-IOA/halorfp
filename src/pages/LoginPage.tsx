// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/rfp";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await login(key);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid access key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-primary flex flex-col items-center justify-center p-4">
      {/* Background Graphic Placeholder */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-yellow rounded-full animate-pulse blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="text-center mb-8">
          {/* HALO Logo Placeholder */}
          <div className="text-yellow text-4xl font-bold tracking-widest mb-2 font-sans italic">
            HALO
          </div>
          <p className="text-text-secondary text-sm uppercase tracking-widest">
            Pre-Contract Intelligence
          </p>
        </div>

        <div className="card shadow-modal bg-surface-white p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="access-key" 
                className="block text-sm font-bold text-text-primary mb-2"
              >
                Access Key
              </label>
              <div className="relative">
                <input
                  id="access-key"
                  type={showKey ? "text" : "password"}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="input pr-10"
                  placeholder="Enter workspace key"
                  autoFocus
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-navy-primary"
                >
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-50 border-l-4 border-status-failed p-3 flex items-start gap-3"
                >
                  <AlertCircle className="text-status-failed shrink-0" size={18} />
                  <p className="text-text-primary text-xs">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading || !key.trim()}
              className="btn btn-primary w-full h-[44px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Enter Workspace</span>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
