import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { DocumentComment, PendingCommentAnchor } from '../types/comments';
import { EMPTY_COMMENTS, useCommentsStore } from '../store/useCommentsStore';
import { useAuthStore } from '../store/useAuthStore';
import { CommentHighlightRestorer } from '../components/comments/CommentHighlightRestorer';
import {
  CommentSelectionPopover,
  type SelectionDraftUi,
} from '../components/comments/CommentSelectionPopover';
import { ANALYSIS_GENERAL_COMMENT_LABEL } from '../lib/commentConstants';
import {
  findContextLabelForRange,
  getSelectionPopoverPosition,
  isValidTextSelection,
  newCommentHighlightId,
  setHighlightResolved,
  unwrapHighlight,
  wrapRangeWithHighlight,
} from '../lib/textSelectionComment';

interface CommentsContextValue {
  analysisId: string | null;
  isResultsPage: boolean;
  isModeActive: boolean;
  isPanelOpen: boolean;
  activeCommentId: string | null;
  pendingAnchor: PendingCommentAnchor | null;
  comments: DocumentComment[];
  authorName: string;
  toggleCommentMode: () => void;
  closeCommentMode: () => void;
  setActiveCommentId: (id: string | null) => void;
  setPendingAnchor: (anchor: PendingCommentAnchor | null) => void;
  cancelPendingComment: () => void;
  /** Start a comment on the whole analysis (no text selection). */
  startGeneralComment: () => void;
  scrollToComment: (commentId: string) => void;
  addComment: (input: {
    id: string;
    anchorId: string;
    anchorLabel: string;
    excerpt?: string;
    body: string;
    author: string;
  }) => DocumentComment | undefined;
  updateCommentBody: (commentId: string, body: string) => void;
  resolveComment: (commentId: string, resolved: boolean) => void;
  deleteComment: (commentId: string) => void;
  addReply: (commentId: string, reply: { author: string; body: string }) => void;
  deleteReply: (commentId: string, replyId: string) => void;
}

const CommentsContext = createContext<CommentsContextValue | null>(null);

function parseResultsRoute(pathname: string): { analysisId: string } | null {
  const match = pathname.match(/^\/rfp\/([^/]+)$/);
  if (!match) return null;
  const analysisId = match[1];
  if (analysisId === 'new') return null;
  return { analysisId };
}

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const rootRef = useRef<HTMLDivElement>(null);
  const pendingRangeRef = useRef<Range | null>(null);
  const ignoreDismissRef = useRef(false);
  const [selectionDraft, setSelectionDraft] = useState<SelectionDraftUi | null>(null);

  const resultsRoute = parseResultsRoute(location.pathname);
  const isResultsPage = resultsRoute !== null;
  const analysisId = resultsRoute?.analysisId ?? null;

  const isModeActive = useCommentsStore((s) => s.isModeActive);
  const isPanelOpen = useCommentsStore((s) => s.isPanelOpen);
  const activeCommentId = useCommentsStore((s) => s.activeCommentId);
  const pendingAnchor = useCommentsStore((s) => s.pendingAnchor);
  const toggleCommentMode = useCommentsStore((s) => s.toggleCommentMode);
  const closeCommentMode = useCommentsStore((s) => s.closeCommentMode);
  const setActiveCommentId = useCommentsStore((s) => s.setActiveCommentId);
  const setPendingAnchor = useCommentsStore((s) => s.setPendingAnchor);
  const storeAddComment = useCommentsStore((s) => s.addComment);
  const storeUpdateCommentBody = useCommentsStore((s) => s.updateCommentBody);
  const storeResolveComment = useCommentsStore((s) => s.resolveComment);
  const storeDeleteComment = useCommentsStore((s) => s.deleteComment);
  const storeAddReply = useCommentsStore((s) => s.addReply);
  const storeDeleteReply = useCommentsStore((s) => s.deleteReply);

  const authorName =
    (user?.user_metadata?.full_name as string | undefined) ??
    user?.email?.split('@')[0] ??
    'You';

  const comments = useCommentsStore((s) =>
    analysisId ? (s.byAnalysis[analysisId] ?? EMPTY_COMMENTS) : EMPTY_COMMENTS,
  );

  useEffect(() => {
    if (!isResultsPage) closeCommentMode();
  }, [isResultsPage, closeCommentMode]);

  const dismissSelectionDraft = useCallback(() => {
    pendingRangeRef.current = null;
    setSelectionDraft(null);
    window.getSelection()?.removeAllRanges();
  }, []);

  const cancelPendingComment = useCallback(() => {
    if (pendingAnchor?.anchorId && document.querySelector(`mark[data-comment-id="${pendingAnchor.anchorId}"]`)) {
      unwrapHighlight(pendingAnchor.anchorId);
    }
    setPendingAnchor(null);
    dismissSelectionDraft();
  }, [pendingAnchor, setPendingAnchor, dismissSelectionDraft]);

  const startGeneralComment = useCallback(() => {
    dismissSelectionDraft();
    const pending = useCommentsStore.getState().pendingAnchor;
    if (pending?.anchorId && document.querySelector(`mark[data-comment-id="${pending.anchorId}"]`)) {
      unwrapHighlight(pending.anchorId);
    }
    setPendingAnchor({
      anchorId: newCommentHighlightId(),
      anchorLabel: ANALYSIS_GENERAL_COMMENT_LABEL,
    });
  }, [dismissSelectionDraft, setPendingAnchor]);

  const confirmCommentFromSelection = useCallback(() => {
    const range = pendingRangeRef.current;
    if (!range) return;

    const excerpt = range.toString().trim();
    const commentId = newCommentHighlightId();
    const contextLabel = findContextLabelForRange(range);

    if (!wrapRangeWithHighlight(range, commentId)) return;

    pendingRangeRef.current = null;
    setSelectionDraft(null);
    window.getSelection()?.removeAllRanges();

    setPendingAnchor({
      anchorId: commentId,
      anchorLabel: contextLabel,
      excerpt,
    });
    setActiveCommentId(null);
  }, [setPendingAnchor, setActiveCommentId]);

  const scrollToComment = useCallback(
    (commentId: string) => {
      setActiveCommentId(commentId);
      const mark = document.querySelector(`mark[data-comment-id="${commentId}"]`);
      if (mark) {
        mark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      const list = analysisId ? useCommentsStore.getState().byAnalysis[analysisId] ?? [] : [];
      const comment = list.find((c) => c.id === commentId);
      if (comment && !comment.excerpt?.trim()) {
        document.getElementById('edgnex-overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [setActiveCommentId, analysisId],
  );

  useEffect(() => {
    if (!isModeActive) dismissSelectionDraft();
  }, [isModeActive, dismissSelectionDraft]);

  useEffect(() => {
    if (!isModeActive || !isResultsPage) return;

    const onMouseUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;

      const range = sel.getRangeAt(0).cloneRange();
      const root = rootRef.current;
      if (!root || !isValidTextSelection(range, root)) return;

      const pending = useCommentsStore.getState().pendingAnchor;
      if (pending?.anchorId) {
        unwrapHighlight(pending.anchorId);
        setPendingAnchor(null);
      }

      const excerpt = range.toString().trim();
      const contextLabel = findContextLabelForRange(range);
      const { top, left } = getSelectionPopoverPosition(range);

      pendingRangeRef.current = range;
      ignoreDismissRef.current = true;
      requestAnimationFrame(() => {
        ignoreDismissRef.current = false;
      });

      setSelectionDraft({ excerpt, anchorLabel: contextLabel, top, left });
    };

    document.addEventListener('mouseup', onMouseUp);
    return () => document.removeEventListener('mouseup', onMouseUp);
  }, [isModeActive, isResultsPage, setPendingAnchor]);

  useEffect(() => {
    if (!selectionDraft) return;

    const onPointerDown = (e: PointerEvent) => {
      if (ignoreDismissRef.current) return;
      if (e.target instanceof Element && e.target.closest('[data-comment-selection-popover]')) return;
      dismissSelectionDraft();
    };

    const onScroll = () => dismissSelectionDraft();

    document.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [selectionDraft, dismissSelectionDraft]);

  const value = useMemo<CommentsContextValue>(
    () => ({
      analysisId,
      isResultsPage,
      isModeActive,
      isPanelOpen,
      activeCommentId,
      pendingAnchor,
      comments,
      authorName,
      toggleCommentMode,
      closeCommentMode,
      setActiveCommentId,
      setPendingAnchor,
      cancelPendingComment,
      startGeneralComment,
      scrollToComment,
      addComment: (input) => {
        if (!analysisId) return undefined;
        return storeAddComment(analysisId, input);
      },
      updateCommentBody: (commentId, body) => {
        if (!analysisId) return;
        storeUpdateCommentBody(analysisId, commentId, body);
      },
      resolveComment: (commentId, resolved) => {
        if (!analysisId) return;
        storeResolveComment(analysisId, commentId, resolved);
        setHighlightResolved(commentId, resolved);
      },
      deleteComment: (commentId) => {
        if (!analysisId) return;
        if (document.querySelector(`mark[data-comment-id="${commentId}"]`)) {
          unwrapHighlight(commentId);
        }
        storeDeleteComment(analysisId, commentId);
      },
      addReply: (commentId, reply) => {
        if (!analysisId) return;
        storeAddReply(analysisId, commentId, reply);
      },
      deleteReply: (commentId, replyId) => {
        if (!analysisId) return;
        storeDeleteReply(analysisId, commentId, replyId);
      },
    }),
    [
      analysisId,
      isResultsPage,
      isModeActive,
      isPanelOpen,
      activeCommentId,
      pendingAnchor,
      comments,
      authorName,
      toggleCommentMode,
      closeCommentMode,
      setActiveCommentId,
      setPendingAnchor,
      cancelPendingComment,
      startGeneralComment,
      scrollToComment,
      storeAddComment,
      storeUpdateCommentBody,
      storeResolveComment,
      storeDeleteComment,
      storeAddReply,
      storeDeleteReply,
    ],
  );

  return (
    <CommentsContext.Provider value={value}>
      <div ref={rootRef} data-comment-root className="contents">
        {children}
      </div>
      <CommentHighlightRestorer analysisId={analysisId} activeCommentId={activeCommentId} />
      <AnimatePresence>
        {selectionDraft && isModeActive ? (
          <CommentSelectionPopover draft={selectionDraft} onAddComment={confirmCommentFromSelection} />
        ) : null}
      </AnimatePresence>
    </CommentsContext.Provider>
  );
}

export function useComments() {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error('useComments must be used within CommentsProvider');
  return ctx;
}

export function useCommentsOptional() {
  return useContext(CommentsContext);
}
