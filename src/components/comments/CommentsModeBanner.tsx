import { TextSelect } from 'lucide-react';
import { useCommentsOptional } from '../../contexts/CommentsContext';

export function CommentsModeBanner() {
  const comments = useCommentsOptional();
  if (!comments?.isModeActive) return null;

  return (
    <div className="sticky top-0 z-20 border-b border-yellow/40 bg-yellow/15 px-4 py-2 text-center text-sm font-medium text-navy-primary">
      <span className="inline-flex items-center justify-center gap-2">
        <TextSelect size={14} className="shrink-0" aria-hidden />
        Comment mode — use General comment in the panel, or select text and click Add comment. Click elsewhere to dismiss.
      </span>
    </div>
  );
}
