// src/store/useEdgnexDemoStore.ts
import { create } from 'zustand';
import { useCommentsStore } from './useCommentsStore';

export const EDGNEX_DEMO_ANALYSIS_ID = 'edgnex-dc-ksa';

const STORAGE_PREFIX = 'halo-edgnex-demo';

interface PersistedDemoSession {
  isVisible: boolean;
  createdAt: string | null;
}

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`;
}

function loadSession(userId: string | null): PersistedDemoSession {
  if (!userId) return { isVisible: false, createdAt: null };
  try {
    const raw = sessionStorage.getItem(storageKey(userId));
    if (!raw) return { isVisible: false, createdAt: null };
    const parsed = JSON.parse(raw) as PersistedDemoSession;
    return {
      isVisible: !!parsed.isVisible,
      createdAt: parsed.createdAt ?? null,
    };
  } catch {
    return { isVisible: false, createdAt: null };
  }
}

function persistSession(userId: string | null, session: PersistedDemoSession) {
  if (!userId) return;
  try {
    if (!session.isVisible && !session.createdAt) {
      sessionStorage.removeItem(storageKey(userId));
      return;
    }
    sessionStorage.setItem(storageKey(userId), JSON.stringify(session));
  } catch {
    /* private mode */
  }
}

interface EdgnexDemoState {
  /** When true, EDGNEX appears on the list and /rfp/edgnex-dc-ksa is allowed. */
  isVisible: boolean;
  /** Set when starting analysis from New Analysis; allows the processing route for EDGNEX. */
  isProcessingFromNewFlow: boolean;
  /** When the demo analysis was first created this session (for list ordering / dates). */
  createdAt: string | null;
  hydrateForUser: (userId: string | null) => void;
  beginDemoFromNewAnalysis: () => void;
  completeDemoProcessing: () => void;
  reset: () => void;
}

let activeUserId: string | null = null;

export const useEdgnexDemoStore = create<EdgnexDemoState>((set, get) => ({
  isVisible: false,
  isProcessingFromNewFlow: false,
  createdAt: null,

  hydrateForUser: (userId) => {
    activeUserId = userId;
    const session = loadSession(userId);
    set({
      isVisible: session.isVisible,
      createdAt: session.createdAt,
      // Resume in-progress demo if the user refreshed before processing finished.
      isProcessingFromNewFlow: !!session.createdAt && !session.isVisible,
    });
  },

  beginDemoFromNewAnalysis: () => {
    const comments = useCommentsStore.getState();
    comments.clearCommentsForAnalysis(EDGNEX_DEMO_ANALYSIS_ID);
    comments.closeCommentMode();
    const createdAt = new Date().toISOString();
    persistSession(activeUserId, { isVisible: false, createdAt });
    set({ isProcessingFromNewFlow: true, createdAt });
  },

  completeDemoProcessing: () => {
    const { createdAt } = get();
    const at = createdAt ?? new Date().toISOString();
    persistSession(activeUserId, { isVisible: true, createdAt: at });
    set({ isVisible: true, isProcessingFromNewFlow: false, createdAt: at });
  },

  reset: () => {
    persistSession(activeUserId, { isVisible: false, createdAt: null });
    set({ isVisible: false, isProcessingFromNewFlow: false, createdAt: null });
  },
}));
