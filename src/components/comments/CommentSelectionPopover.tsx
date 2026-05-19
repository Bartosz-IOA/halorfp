import { motion } from 'framer-motion';
import { MessageSquarePlus } from 'lucide-react';

export interface SelectionDraftUi {
  excerpt: string;
  anchorLabel: string;
  top: number;
  left: number;
}

interface CommentSelectionPopoverProps {
  draft: SelectionDraftUi;
  onAddComment: () => void;
}

export function CommentSelectionPopover({ draft, onAddComment }: CommentSelectionPopoverProps) {
  return (
    <motion.button
      type="button"
      role="dialog"
      aria-label="Add comment to selection"
      data-comment-selection-popover
      onClick={(e) => {
        e.stopPropagation();
        onAddComment();
      }}
      className="fixed z-[60] inline-flex items-center gap-1.5 rounded-lg bg-navy-primary px-2.5 py-1.5 text-sm font-bold text-white shadow-lg hover:bg-navy-mid transition-fast whitespace-nowrap"
      style={{
        top: draft.top,
        left: draft.left,
      }}
      initial={{ opacity: 0, y: 4, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.96 }}
      transition={{ duration: 0.12 }}
    >
      <MessageSquarePlus size={14} aria-hidden />
      Add comment
    </motion.button>
  );
}
