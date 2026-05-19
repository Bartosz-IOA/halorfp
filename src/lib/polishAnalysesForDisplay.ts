import type { Analysis } from './database.types';
import { PORTFOLIO_EDGNEX_ANALYSIS_NAME } from './analysisDisplayNames';

/** Known sandbox labels → portfolio-style titles for demos and screenshots. */
const TEST_ANALYSIS_POLISH: Record<
  string,
  Pick<Analysis, 'name' | 'title' | 'comment' | 'status'>
> = {
  'test - a lot of files': {
    name: PORTFOLIO_EDGNEX_ANALYSIS_NAME,
    title: PORTFOLIO_EDGNEX_ANALYSIS_NAME,
    comment: null,
    status: 'complete',
  },
  'test 2': {
    name: 'Qiddiya Public Golf Club — Lead Design Consultancy',
    title: 'Qiddiya Public Golf Club — Lead Design Consultancy',
    comment: null,
    status: 'complete',
  },
  test: {
    name: 'Riyadh Metro Depot 3 — Design Competition',
    title: 'Riyadh Metro Depot 3 — Design Competition',
    comment: null,
    status: 'complete',
  },
};

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

function lookupPolish(label: string): (typeof TEST_ANALYSIS_POLISH)[string] | undefined {
  const key = normalizeLabel(label);
  return TEST_ANALYSIS_POLISH[key];
}

/** Returns true for informal sandbox names (e.g. "test", "test 2"). */
export function isSandboxAnalysisLabel(label: string): boolean {
  const trimmed = label.trim();
  if (!trimmed) return false;
  return /^test(\s|$|[-_])/i.test(trimmed) || /^test$/i.test(trimmed);
}

/** Rewrites known test rows so the analyses list reads like a live portfolio. */
export function polishAnalysisForDisplay(analysis: Analysis): Analysis {
  const label = (analysis.title || analysis.name).trim();
  const polish = lookupPolish(label) ?? lookupPolish(analysis.name);

  if (polish) {
    return {
      ...analysis,
      ...polish,
      completed_at: analysis.completed_at ?? analysis.updated_at ?? analysis.created_at,
    };
  }

  if (isSandboxAnalysisLabel(analysis.name)) {
    return {
      ...analysis,
      status: 'complete',
      completed_at: analysis.completed_at ?? analysis.updated_at ?? analysis.created_at,
    };
  }

  return analysis;
}

export function polishAnalysesForDisplay(analyses: Analysis[]): Analysis[] {
  return analyses.map(polishAnalysisForDisplay);
}
