// src/types/analysis.ts
// This file defines the TypeScript types that mirror the Supabase database schema.
// The `results` JSONB column maps exactly to `AnalysisResults`.

// ─── DATABASE ROW ───────────────────────────────────────────────────────────

export type AnalysisStatus = 'PROCESSING' | 'COMPLETE' | 'FAILED';

export interface Analysis {
  id: string;
  user_id: string;
  name: string;
  comment: string | null;
  created_at: string;
  updated_at: string;
  status: AnalysisStatus;
  error_message: string | null;
  file_urls: string[];
  file_names: string[];
  file_sizes: number[];
  results: AnalysisResults | null;
}

// ─── RESULTS JSON (populated by n8n) ────────────────────────────────────────

export interface AnalysisResults {
  project: ProjectInfo;
  verdict: Verdict;
  go_no_go_criteria: GoNoGoCriterion[];
  breakdown: BreakdownItem[];
  buildings: Building[];
  questions: Question[];
  documents: DocumentRef[];
  project_images: ProjectImage[];
  processed_at: string;
}

export interface ProjectInfo {
  name: string;
  client: string;
  location: string;
  executive_summary: string;
}

export interface Verdict {
  decision: 'GO' | 'NO-GO' | 'CONDITIONAL';
  total_score: number;
  max_score: number;
  score_percentage: number;
  has_blocker: boolean;
  blocker_reason: string | null;
}

export interface GoNoGoCriterion {
  id: string;
  name: string;
  score: number;
  max: number;
  text: string;
  color: 'green' | 'amber' | 'grey' | 'red';
  is_blocker?: boolean;
}

export interface BreakdownItem {
  label: string;
  value: string;
  note: string;
  ref: string;
}

export interface Building {
  name: string;
  typology: string;
  gfa_m2: number;
}

export interface Question {
  question: string;
  answer: string;
  notes: string;
  reference: string;
}

export interface DocumentRef {
  name: string;
  size_bytes: number;
  description: string;
}

export interface ProjectImage {
  url: string;
  description: string;
  reference: string;
}
