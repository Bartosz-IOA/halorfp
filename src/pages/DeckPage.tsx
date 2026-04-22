// src/pages/DeckPage.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Loader2, ExternalLink } from 'lucide-react';

// Legacy password hash from PDD Section 1.2
const CORRECT_HASH = "ecef53e99eb0526ec64b29a32a699d9f3056afcaeec21e91b8d61f5baf60e6b7";

export const DeckPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hashPassword = async (pwd: string) => {
    const msgUint8 = new TextEncoder().encode(pwd);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError(null);

    const hash = await hashPassword(password);
    
    if (hash === CORRECT_HASH) {
      // Simulate formsubmit.co notification
      console.log("Fired success notifications to steven@halorfp.com and lance@halorfp.com");
      
      // Delay for premium feel
      setTimeout(() => {
        setIsUnlocked(true);
        setIsLoading(false);
      }, 1000);
    } else {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
    }
  };

  if (isUnlocked) {
    return (
      <div className="h-screen bg-navy-primary flex flex-col">
        <nav className="h-16 flex items-center justify-between px-8 bg-black/20">
          <div className="text-yellow text-xl font-bold tracking-widest italic">HALO DECK</div>
          <button 
            onClick={() => setIsUnlocked(false)}
            className="text-white/60 hover:text-white text-sm"
          >
            Log Out
          </button>
        </nav>
        <div className="flex-1 bg-[#1E1E1E] flex items-center justify-center p-8">
           {/* Figma Embed Placeholder */}
           <div className="w-full h-full max-w-6xl aspect-[16/10] bg-white/5 rounded-lg flex flex-col items-center justify-center text-white/20 border border-white/10 group overflow-hidden relative">
              <ExternalLink size={48} className="mb-4 opacity-50 group-hover:scale-110 transition-transform" />
              <p className="text-xl font-bold">Figma Deck Embed</p>
              <p className="text-sm">HALO Deck V2 Master</p>
              
              <div className="absolute inset-0 bg-navy-mid flex items-center justify-center">
                <iframe 
                  className="w-full h-full"
                  src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2F0rvhjjplFYAizaweow9QOu%2FHALO-Deck-V2-Master" 
                  allowFullScreen
                />
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-primary flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Graphic */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="grid grid-cols-12 h-full gap-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border-r border-b border-yellow/20" />
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-yellow text-3xl font-bold tracking-[0.2em] mb-3 italic">HALO</h1>
          <div className="inline-block px-4 py-1 bg-yellow/10 rounded-full border border-yellow/20">
            <p className="text-yellow text-[10px] font-bold uppercase tracking-widest leading-none">
              Investor & Partner Access Only
            </p>
          </div>
        </div>

        <div className="card bg-surface-white border-t-4 border-yellow p-10 shadow-modal">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase mb-2 px-1">
                  Business Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase mb-2 px-1">
                  Access Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-50 text-status-failed text-xs font-bold rounded flex items-center gap-2 border border-red-100"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="btn btn-primary w-full h-[48px] text-base group"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  View Investor Deck
                  <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-text-inverse/40 text-[10px] uppercase tracking-widest font-bold">
          © 2026 IO Atelier. Confidential.
        </p>
      </motion.div>
    </div>
  );
};

// Simple AlertCircle fallback if lucide icons change
const AlertCircle = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

const ChevronRight = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
);
