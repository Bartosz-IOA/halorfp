const HIGHLIGHT_CLASS = 'comment-text-highlight';

export function newCommentHighlightId(): string {
  return crypto.randomUUID();
}

/** Wrap the current selection range in a persistent highlight mark. */
export function wrapRangeWithHighlight(range: Range, commentId: string): boolean {
  const mark = document.createElement('mark');
  mark.setAttribute('data-comment-id', commentId);
  mark.className = HIGHLIGHT_CLASS;

  try {
    const contents = range.extractContents();
    mark.appendChild(contents);
    range.insertNode(mark);
    return true;
  } catch {
    try {
      range.surroundContents(mark);
      return true;
    } catch {
      return false;
    }
  }
}

export function unwrapHighlight(commentId: string) {
  const mark = document.querySelector(`mark[data-comment-id="${commentId}"]`);
  if (!mark?.parentNode) return;
  const parent = mark.parentNode;
  while (mark.firstChild) {
    parent.insertBefore(mark.firstChild, mark);
  }
  parent.removeChild(mark);
  parent.normalize();
}

export function findContextLabelForRange(range: Range): string {
  let node: Node | null = range.commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement;
  }
  let el = node instanceof Element ? node : null;
  while (el) {
    const piece = el.getAttribute('data-comment-label');
    if (piece) return piece;
    const section = el.getAttribute('data-comment-section-label');
    if (section) return section;
    el = el.parentElement;
  }
  return 'Report';
}

function isInsideExcludedElement(node: Node | null): boolean {
  let el: Element | null = node instanceof Element ? node : node?.parentElement ?? null;
  while (el) {
    if (el.closest('[data-comment-selection-popover]')) return true;
    if (el.closest('aside[aria-label="Document comments"]')) return true;
    if (el.closest('button, input, textarea, select, [contenteditable="true"]')) return true;
    if (el.closest('nav[aria-label="On this page"]')) return true;
    el = el.parentElement;
  }
  return false;
}

/** Viewport position for a floating “Add comment” control beside the selection. */
export function getSelectionPopoverPosition(range: Range): { top: number; left: number } {
  const rect = range.getBoundingClientRect();
  const pad = 8;
  const popoverWidth = 160;
  const top = Math.min(rect.bottom + pad, window.innerHeight - 48);
  const left = Math.max(pad, Math.min(rect.left, window.innerWidth - popoverWidth - pad));
  return { top, left };
}

export function isValidTextSelection(range: Range, root: HTMLElement): boolean {
  if (!root.contains(range.commonAncestorContainer)) return false;
  if (isInsideExcludedElement(range.commonAncestorContainer)) return false;
  const text = range.toString().trim();
  if (!text || text.length < 2) return false;
  return true;
}

/** Re-apply highlight after React re-render when mark was lost. */
export function restoreHighlightForComment(root: HTMLElement, excerpt: string, commentId: string) {
  if (!excerpt.trim()) return;
  if (document.querySelector(`mark[data-comment-id="${commentId}"]`)) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (parent.closest(`mark[data-comment-id]`)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('script, style, button, input, textarea, select')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let textNode: Text | null;
  while ((textNode = walker.nextNode() as Text | null)) {
    const content = textNode.textContent ?? '';
    const idx = content.indexOf(excerpt);
    if (idx < 0) continue;

    const range = document.createRange();
    range.setStart(textNode, idx);
    range.setEnd(textNode, idx + excerpt.length);
    wrapRangeWithHighlight(range, commentId);
    return;
  }
}

export function setHighlightActive(commentId: string | null) {
  document.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`).forEach((el) => {
    el.classList.toggle('comment-text-highlight--active', commentId !== null && el.getAttribute('data-comment-id') === commentId);
  });
}

export function setHighlightResolved(commentId: string, resolved: boolean) {
  const mark = document.querySelector(`mark[data-comment-id="${commentId}"]`);
  mark?.classList.toggle('comment-text-highlight--resolved', resolved);
}
