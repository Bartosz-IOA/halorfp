// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  workspaceKey: string | null;
  workspaceName: string | null;
  login: (key: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      workspaceKey: null,
      workspaceName: null,
      login: async (key: string) => {
        // Mocking API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // Any non-empty key works for now as per PDD "placeholders"
        if (key.trim().length > 0) {
          set({
            isAuthenticated: true,
            workspaceKey: key,
            workspaceName: "HALO Demo Workspace",
          });
        } else {
          throw new Error("Invalid access key");
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          workspaceKey: null,
          workspaceName: null,
        });
      },
    }),
    {
      name: 'halo-auth-storage',
    }
  )
);
