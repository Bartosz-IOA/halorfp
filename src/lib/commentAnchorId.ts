/** Stable id fragment for comment anchors (URL-safe, lowercase). */
export function slugifyCommentId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function buildCommentAnchorId(prefix: string, label: string): string {
  return `${prefix}-${slugifyCommentId(label)}`;
}

export function buildCommentLabel(section: string, piece: string): string {
  return `${section} · ${piece}`;
}
