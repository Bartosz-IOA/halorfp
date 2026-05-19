import React, { useState } from 'react';
import { MessageSquare, MessageSquarePlus, X } from 'lucide-react';
import { ANALYSIS_GENERAL_COMMENT_LABEL } from '../../lib/commentConstants';
import { cn } from '../rfp/ResultPrimitives';
import { useComments } from '../../contexts/CommentsContext';
import { CommentThreadCard } from './CommentThreadCard';

export function CommentsPanel() {
  const {
    isPanelOpen,
    isModeActive,
    comments,
    pendingAnchor,
    authorName,
    closeCommentMode,
    cancelPendingComment,
    startGeneralComment,
    addComment,
  } = useComments();

  const [draft, setDraft] = useState('');
  const [listLayoutKey, setListLayoutKey] = useState(0);
  const [defaultExpanded, setDefaultExpanded] = useState(false);

  if (!isPanelOpen || !isModeActive) return null;

  const sorted = [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const openCount = sorted.filter((c) => !c.resolved).length;

  const submitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAnchor) return;
    const body = draft.trim();
    if (!body) return;
    addComment({
      id: pendingAnchor.anchorId,
      anchorId: pendingAnchor.anchorId,
      anchorLabel: pendingAnchor.anchorLabel,
      excerpt: pendingAnchor.excerpt,
      body,
      author: authorName,
    });
    setDraft('');
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-navy-mid/10 backdrop-blur-[1px] md:hidden"
        onClick={closeCommentMode}
        aria-hidden
      />
      <aside
        className={cn(
          'fixed top-[var(--topbar-height)] right-0 z-50 flex h-[calc(100vh-var(--topbar-height))] w-full max-w-[380px] flex-col border-l border-border bg-white shadow-2xl',
        )}
        aria-label="Document comments"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-border bg-off-white/80 px-4 py-4">
          <div>
            <h2 className="text-md font-bold text-navy-primary">Comments</h2>
            <p className="mt-1 text-sm leading-relaxed text-text-secondary">
              Add a general comment on the whole analysis, or select text in the report and use Add comment in the
              popup.
            </p>
            <p className="mt-2 text-xs font-semibold text-navy-mid">
              {openCount} open · {sorted.length} total
            </p>
            {sorted.length > 0 ? (
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDefaultExpanded(true);
                    setListLayoutKey((k) => k + 1);
                  }}
                  className="text-xs font-semibold text-navy-mid hover:text-navy-primary underline-offset-2 hover:underline"
                >
                  Expand all
                </button>
                <span className="text-xs text-border">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setDefaultExpanded(false);
                    setListLayoutKey((k) => k + 1);
                  }}
                  className="text-xs font-semibold text-navy-mid hover:text-navy-primary underline-offset-2 hover:underline"
                >
                  Collapse all
                </button>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={closeCommentMode}
            className="shrink-0 rounded-lg border border-border bg-white p-2 text-text-secondary hover:bg-surface-grey hover:text-navy-primary"
            aria-label="Close comments"
          >
            <X size={16} />
          </button>
        </header>

        {pendingAnchor ? (
          <form onSubmit={submitNew} className="shrink-0 border-b border-yellow/30 bg-yellow/10 px-4 py-4 space-y-3">
            <div className="flex items-start gap-2">
              <MessageSquarePlus size={16} className="shrink-0 text-navy-primary mt-0.5" aria-hidden />
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-navy-mid">New comment</p>
                <p className="text-sm font-semibold text-navy-primary">{pendingAnchor.anchorLabel}</p>
                {pendingAnchor.excerpt ? (
                  <p className="mt-1 text-sm italic text-text-secondary line-clamp-2">
                    “{pendingAnchor.excerpt}”
                  </p>
                ) : pendingAnchor.anchorLabel === ANALYSIS_GENERAL_COMMENT_LABEL ? (
                  <p className="mt-1 text-sm text-text-secondary">Applies to the full report — no text highlight.</p>
                ) : null}
              </div>
            </div>
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="Write your comment…"
              className="w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-base text-navy-primary focus:border-yellow focus:outline-none focus:ring-1 focus:ring-yellow"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!draft.trim()}
                className="flex-1 rounded-lg bg-navy-primary py-2 text-sm font-bold text-white disabled:opacity-40"
              >
                Add comment
              </button>
              <button
                type="button"
                onClick={() => {
                  cancelPendingComment();
                  setDraft('');
                }}
                className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-text-secondary hover:bg-white"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="shrink-0 border-b border-border/60 bg-surface-grey/40 px-4 py-3 space-y-2">
            <p className="text-sm text-text-secondary">
              Select text in the report, or add a comment on the entire analysis without highlighting.
            </p>
            <button
              type="button"
              onClick={startGeneralComment}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-navy-mid/25 bg-white px-3 py-2.5 text-sm font-semibold text-navy-primary shadow-sm transition hover:bg-surface-grey focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/30"
            >
              <MessageSquare size={16} aria-hidden />
              General comment on whole analysis
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
          {sorted.length === 0 ? (
            <p className="px-2 py-8 text-center text-sm text-text-secondary">No comments yet on this analysis.</p>
          ) : (
            sorted.map((comment) => (
              <CommentThreadCard
                key={`${comment.id}-${listLayoutKey}`}
                comment={comment}
                defaultExpanded={defaultExpanded}
              />
            ))
          )}
        </div>
      </aside>
    </>
  );
}
