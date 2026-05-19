import { useEffect } from 'react';
import { EMPTY_COMMENTS, useCommentsStore } from '../../store/useCommentsStore';
import {
  restoreHighlightForComment,
  setHighlightActive,
  setHighlightResolved,
} from '../../lib/textSelectionComment';

interface CommentHighlightRestorerProps {
  analysisId: string | null;
  activeCommentId: string | null;
}

export function CommentHighlightRestorer({ analysisId, activeCommentId }: CommentHighlightRestorerProps) {
  const comments = useCommentsStore((s) =>
    analysisId ? (s.byAnalysis[analysisId] ?? EMPTY_COMMENTS) : EMPTY_COMMENTS,
  );

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-comment-root]');
    if (!root || !analysisId) return;

    const frame = requestAnimationFrame(() => {
      for (const comment of comments) {
        if (!comment.excerpt?.trim()) continue;
        restoreHighlightForComment(root, comment.excerpt, comment.id);
        setHighlightResolved(comment.id, comment.resolved);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [analysisId, comments]);

  useEffect(() => {
    setHighlightActive(activeCommentId);
  }, [activeCommentId]);

  return null;
}
