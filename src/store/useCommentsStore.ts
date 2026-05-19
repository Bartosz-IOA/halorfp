import { create } from 'zustand';
import type { DocumentComment, CommentReply, PendingCommentAnchor } from '../types/comments';
import { unwrapHighlight } from '../lib/textSelectionComment';

const STORAGE_KEY = 'halo-document-comments-v1';

/** Stable empty list — avoids new `[]` on every selector run (infinite re-renders). */
export const EMPTY_COMMENTS: DocumentComment[] = [];

function loadByAnalysis(): Record<string, DocumentComment[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, DocumentComment[]>;
  } catch {
    return {};
  }
}

function persist(byAnalysis: Record<string, DocumentComment[]>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(byAnalysis));
  } catch {
    /* quota or private mode */
  }
}

function newId() {
  return crypto.randomUUID();
}

interface CommentsState {
  isModeActive: boolean;
  isPanelOpen: boolean;
  activeCommentId: string | null;
  pendingAnchor: PendingCommentAnchor | null;
  byAnalysis: Record<string, DocumentComment[]>;

  toggleCommentMode: () => void;
  closeCommentMode: () => void;
  setActiveCommentId: (id: string | null) => void;
  setPendingAnchor: (anchor: PendingCommentAnchor | null) => void;
  getComments: (analysisId: string) => DocumentComment[];
  getCommentsForAnchor: (analysisId: string, anchorId: string) => DocumentComment[];
  addComment: (
    analysisId: string,
    input: Omit<DocumentComment, 'id' | 'createdAt' | 'updatedAt' | 'resolved' | 'replies'> & {
      id: string;
    },
  ) => DocumentComment;
  updateCommentBody: (analysisId: string, commentId: string, body: string) => void;
  resolveComment: (analysisId: string, commentId: string, resolved: boolean) => void;
  deleteComment: (analysisId: string, commentId: string) => void;
  addReply: (analysisId: string, commentId: string, reply: Omit<CommentReply, 'id' | 'createdAt'>) => void;
  deleteReply: (analysisId: string, commentId: string, replyId: string) => void;
  /** Remove all saved comments for an analysis (e.g. when starting a fresh run). */
  clearCommentsForAnalysis: (analysisId: string) => void;
}

export const useCommentsStore = create<CommentsState>((set, get) => ({
  isModeActive: false,
  isPanelOpen: false,
  activeCommentId: null,
  pendingAnchor: null,
  byAnalysis: loadByAnalysis(),

  toggleCommentMode: () =>
    set((state) => {
      const next = !state.isModeActive;
      return {
        isModeActive: next,
        isPanelOpen: next,
        activeCommentId: null,
        pendingAnchor: null,
      };
    }),

  closeCommentMode: () =>
    set({
      isModeActive: false,
      isPanelOpen: false,
      activeCommentId: null,
      pendingAnchor: null,
    }),

  setActiveCommentId: (id) => set({ activeCommentId: id }),
  setPendingAnchor: (anchor) => set({ pendingAnchor: anchor, activeCommentId: null }),

  getComments: (analysisId) => get().byAnalysis[analysisId] ?? EMPTY_COMMENTS,

  getCommentsForAnchor: (analysisId, anchorId) =>
    (get().byAnalysis[analysisId] ?? []).filter((c) => c.anchorId === anchorId),

  addComment: (analysisId, input) => {
    const now = new Date().toISOString();
    const comment: DocumentComment = {
      ...input,
      createdAt: now,
      updatedAt: now,
      resolved: false,
      replies: [],
    };
    set((state) => {
      const list = [...(state.byAnalysis[analysisId] ?? []), comment];
      const byAnalysis = { ...state.byAnalysis, [analysisId]: list };
      persist(byAnalysis);
      return { byAnalysis, pendingAnchor: null, activeCommentId: comment.id };
    });
    return comment;
  },

  updateCommentBody: (analysisId, commentId, body) => {
    set((state) => {
      const list = (state.byAnalysis[analysisId] ?? []).map((c) =>
        c.id === commentId ? { ...c, body, updatedAt: new Date().toISOString() } : c,
      );
      const byAnalysis = { ...state.byAnalysis, [analysisId]: list };
      persist(byAnalysis);
      return { byAnalysis };
    });
  },

  resolveComment: (analysisId, commentId, resolved) => {
    set((state) => {
      const list = (state.byAnalysis[analysisId] ?? []).map((c) =>
        c.id === commentId ? { ...c, resolved, updatedAt: new Date().toISOString() } : c,
      );
      const byAnalysis = { ...state.byAnalysis, [analysisId]: list };
      persist(byAnalysis);
      return { byAnalysis };
    });
  },

  deleteComment: (analysisId, commentId) => {
    set((state) => {
      const list = (state.byAnalysis[analysisId] ?? []).filter((c) => c.id !== commentId);
      const byAnalysis = { ...state.byAnalysis, [analysisId]: list };
      persist(byAnalysis);
      return {
        byAnalysis,
        activeCommentId: state.activeCommentId === commentId ? null : state.activeCommentId,
      };
    });
  },

  addReply: (analysisId, commentId, reply) => {
    const entry: CommentReply = { ...reply, id: newId(), createdAt: new Date().toISOString() };
    set((state) => {
      const list = (state.byAnalysis[analysisId] ?? []).map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, entry], updatedAt: new Date().toISOString() }
          : c,
      );
      const byAnalysis = { ...state.byAnalysis, [analysisId]: list };
      persist(byAnalysis);
      return { byAnalysis, activeCommentId: commentId };
    });
  },

  deleteReply: (analysisId, commentId, replyId) => {
    set((state) => {
      const list = (state.byAnalysis[analysisId] ?? []).map((c) =>
        c.id === commentId
          ? { ...c, replies: c.replies.filter((r) => r.id !== replyId), updatedAt: new Date().toISOString() }
          : c,
      );
      const byAnalysis = { ...state.byAnalysis, [analysisId]: list };
      persist(byAnalysis);
      return { byAnalysis };
    });
  },

  clearCommentsForAnalysis: (analysisId) => {
    const list = get().byAnalysis[analysisId] ?? [];
    for (const comment of list) {
      if (document.querySelector(`mark[data-comment-id="${comment.id}"]`)) {
        unwrapHighlight(comment.id);
      }
    }
    set((state) => {
      const { [analysisId]: _removed, ...rest } = state.byAnalysis;
      persist(rest);
      return {
        byAnalysis: rest,
        activeCommentId: null,
        pendingAnchor: null,
      };
    });
  },
}));
