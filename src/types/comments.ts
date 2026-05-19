export interface CommentReply {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface DocumentComment {
  id: string;
  anchorId: string;
  anchorLabel: string;
  /** Highlighted excerpt when the user selected text */
  excerpt?: string;
  body: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  resolved: boolean;
  replies: CommentReply[];
}

export interface PendingCommentAnchor {
  anchorId: string;
  anchorLabel: string;
  excerpt?: string;
}
