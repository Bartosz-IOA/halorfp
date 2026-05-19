export type ExecSummaryReference = {
  /** Shown in card footer, e.g. document names and page spans */
  citations: string;
  /** Short title inside hover panel */
  summary: string;
  /** Longer context for the hover panel */
  detail: string;
};

export type ExecSummaryBlock = {
  heading: string;
  body: string;
  reference?: ExecSummaryReference;
};

export type GoNoGoDetail = {
  q: string;
  a: string;
  notes: string;
  ref: string;
};

/** How criterion input is represented in the matrix UI. */
export type GoNoGoInputState = 'scored' | 'unselected' | 'disconnected';

export type GoNoGoRowData = {
  id: string;
  name: string;
  score: number;
  max: number;
  text: string;
  color: string;
  isBlocker?: boolean;
  /** Defaults to `scored` when omitted. */
  inputState?: GoNoGoInputState;
  details: GoNoGoDetail[];
};
