import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, RotateCcw, Trash2, X } from 'lucide-react';
import type { DocumentComment } from '../../types/comments';
import { ANALYSIS_GENERAL_COMMENT_LABEL } from '../../lib/commentConstants';
import { cn } from '../rfp/ResultPrimitives';
import { useComments } from '../../contexts/CommentsContext';

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface CommentThreadCardProps {
  comment: DocumentComment;
  defaultExpanded?: boolean;
}

export function CommentThreadCard({
  comment,
  defaultExpanded = false,
}: CommentThreadCardProps) {
  const {
    authorName,
    activeCommentId,
    setActiveCommentId,
    scrollToComment,
    resolveComment,
    deleteComment,
    addReply,
    deleteReply,
  } = useComments();

  const [replyText, setReplyText] = useState('');
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isActive = activeCommentId === comment.id;

  const toggleExpanded = () => setIsExpanded((v) => !v);

  const submitReply = (e: React.FormEvent) => {
    e.preventDefault();
    const body = replyText.trim();
    if (!body) return;
    addReply(comment.id, { author: authorName, body });
    setReplyText('');
  };

  return (
    <article
      id={`comment-thread-${comment.id}`}
      className={cn(
        'rounded-lg border bg-white text-left shadow-sm transition',
        comment.resolved ? 'border-border/70 opacity-90' : 'border-yellow/40',
        isActive && 'ring-2 ring-yellow ring-offset-1',
      )}
    >
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={toggleExpanded}
          className="shrink-0 px-2 py-2.5 text-text-secondary hover:text-navy-primary hover:bg-off-white/80 rounded-l-lg"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? 'Collapse comment' : 'Expand comment'}
        >
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        <button
          type="button"
          onClick={() => scrollToComment(comment.id)}
          className="min-w-0 flex-1 px-2 py-2.5 text-left hover:bg-off-white/80 rounded-r-lg"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-navy-primary leading-snug line-clamp-2">
                {comment.anchorLabel}
              </p>
              {!isExpanded ? (
                <p className="mt-0.5 text-xs text-text-secondary truncate">{comment.author}</p>
              ) : (
                <>
                  <p className="mt-0.5 text-sm font-semibold text-navy-primary">{comment.author}</p>
                  <p className="text-xs text-text-secondary">{formatWhen(comment.createdAt)}</p>
                </>
              )}
            </div>
            {comment.resolved ? (
              <span className="shrink-0 rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold uppercase text-emerald-800">
                Resolved
              </span>
            ) : (
              <span className="shrink-0 rounded bg-yellow/25 px-2 py-0.5 text-xs font-bold uppercase text-navy-primary">
                Open
              </span>
            )}
          </div>
          {isExpanded && comment.excerpt ? (
            <p className="mt-2 border-l-2 border-yellow bg-yellow/10 px-2 py-1 text-sm italic text-navy-primary line-clamp-3">
              “{comment.excerpt}”
            </p>
          ) : isExpanded && comment.anchorLabel === ANALYSIS_GENERAL_COMMENT_LABEL ? (
            <p className="mt-2 text-xs text-text-secondary">General comment — entire analysis (no highlight).</p>
          ) : null}
        </button>
      </div>

      {isExpanded ? (
        <div className="border-t border-border/60 px-3 py-3 space-y-3">
          <p className="text-base leading-relaxed text-text-primary whitespace-pre-wrap">{comment.body}</p>

          {comment.replies.length > 0 ? (
            <ul className="space-y-2 border-l-2 border-border/80 pl-3">
              {comment.replies.map((reply) => (
                <li key={reply.id} className="group/reply">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-navy-primary">{reply.author}</p>
                      <p className="text-xs text-text-secondary">{formatWhen(reply.createdAt)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteReply(comment.id, reply.id)}
                      className="opacity-0 group-hover/reply:opacity-100 p-1 text-text-secondary hover:text-red-600 transition"
                      aria-label="Delete reply"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-text-primary whitespace-pre-wrap">{reply.body}</p>
                </li>
              ))}
            </ul>
          ) : null}

          <form onSubmit={submitReply} className="space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              placeholder="Reply to this comment…"
              className="w-full resize-none rounded-lg border border-border bg-off-white px-3 py-2 text-sm text-navy-primary placeholder:text-text-secondary/60 focus:border-yellow focus:outline-none focus:ring-1 focus:ring-yellow"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="rounded-lg bg-navy-primary px-3 py-1.5 text-sm font-bold text-white disabled:opacity-40"
            >
              Reply
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50">
            <button
              type="button"
              onClick={() => resolveComment(comment.id, !comment.resolved)}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-semibold text-navy-primary hover:bg-surface-grey"
            >
              {comment.resolved ? (
                <>
                  <RotateCcw size={14} /> Reopen
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} /> Resolve
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Delete this comment and all replies?')) {
                  deleteComment(comment.id);
                }
              }}
              className="inline-flex items-center gap-1 rounded-md border border-red-200 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
            >
              <Trash2 size={14} /> Delete
            </button>
            <button
              type="button"
              onClick={() => setActiveCommentId(isActive ? null : comment.id)}
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-text-secondary hover:text-navy-primary"
            >
              <X size={14} /> {isActive ? 'Unhighlight' : 'Highlight'}
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
