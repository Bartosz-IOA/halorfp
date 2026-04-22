// src/store/useAuthStore.ts
import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  workspaceName: string | null;
  setIsAuthenticated: (isAuth: boolean) => void;
  setUser: (user: User | null) => void;
  // We'll update the signature once we connect the UI, 
  // but for now keeping the old struct to not break other files immediately.
  login: (email: string, password?: string) => Promise<void>; 
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  workspaceName: "HALO Demo Workspace",

  setIsAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
  setUser: (user) => set({ user, isAuthenticated: !!user }),

  initialize: async () => {
    // Check active session on load
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ user: session.user, isAuthenticated: true });
    }

    // Listen for auth changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user || null, isAuthenticated: !!session?.user });
    });
  },

  login: async (email: string, password?: string) => {
    // For the UI transition, if no password is provided, we throw an error.
    if (!password) {
      throw new Error("Password is required for Supabase authentication.");
    }
    
    // Attempt Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    set({
      isAuthenticated: true,
      user: data.user,
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({
      isAuthenticated: false,
      user: null,
    });
  },
}));
