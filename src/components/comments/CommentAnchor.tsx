import React from 'react';

interface CommentAnchorProps {
  anchorId: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  /** Sets element id for in-page navigation (section jump links). */
  asSection?: boolean;
  /** Section container — provides context label for text selections inside. */
  scopeOnly?: boolean;
  /** @deprecated Layout only; comments are added via text selection. */
  variant?: 'block' | 'inline';
}

/** Layout / navigation wrapper only. Comments are added by selecting text, not clicking here. */
export function CommentAnchor({
  anchorId,
  label,
  children,
  className,
  asSection,
  scopeOnly = false,
}: CommentAnchorProps) {
  return (
    <div
      id={asSection ? anchorId : undefined}
      data-comment-section-label={scopeOnly ? label : undefined}
      data-comment-label={!scopeOnly ? label : undefined}
      className={className}
    >
      {children}
    </div>
  );
}
