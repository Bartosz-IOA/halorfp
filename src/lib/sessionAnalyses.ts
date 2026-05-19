import type { Analysis } from './database.types';
import {
  EDGNEX_SOURCE_SANDBOX_NAMES,
  PORTFOLIO_EDGNEX_ANALYSIS_NAME,
} from './analysisDisplayNames';
import { EDGNEX_DEMO_ANALYSIS_ID } from '../store/useEdgnexDemoStore';

export { PORTFOLIO_EDGNEX_ANALYSIS_NAME as EDGNEX_DEMO_ANALYSIS_NAME };

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

/** Removes legacy EDGNEX portfolio rows so EDGNEX only appears after New Analysis. */
export function stripHiddenEdgnexPortfolioRows(analyses: Analysis[]): Analysis[] {
  const hiddenSandbox = new Set(EDGNEX_SOURCE_SANDBOX_NAMES.map(normalizeLabel));
  return analyses.filter((a) => {
    const name = normalizeLabel(a.name);
    const title = a.title ? normalizeLabel(a.title) : '';
    const display = normalizeLabel(a.title || a.name);
    if (display === normalizeLabel(PORTFOLIO_EDGNEX_ANALYSIS_NAME)) return false;
    if (hiddenSandbox.has(name)) return false;
    if (title && hiddenSandbox.has(title)) return false;
    return true;
  });
}

export function buildEdgnexDemoAnalysis(
  organizationId: string,
  createdBy: string,
  options: { status: Analysis['status']; createdAt: string },
): Analysis {
  const now = new Date().toISOString();
  return {
    id: EDGNEX_DEMO_ANALYSIS_ID,
    organization_id: organizationId,
    created_by: createdBy,
    name: PORTFOLIO_EDGNEX_ANALYSIS_NAME,
    title: PORTFOLIO_EDGNEX_ANALYSIS_NAME,
    comment: null,
    status: options.status,
    created_at: options.createdAt,
    updated_at: now,
    completed_at: options.status === 'complete' ? options.createdAt : null,
  };
}

/** Merges the session EDGNEX demo into the list; hides portfolio EDGNEX until New Analysis. */
export function mergeSessionAnalyses(
  analyses: Analysis[],
  organizationId: string | undefined,
  createdBy: string | undefined,
  options: {
    edgnexVisible: boolean;
    edgnexProcessing: boolean;
    edgnexCreatedAt: string | null;
    search?: string;
  },
): Analysis[] {
  const list = stripHiddenEdgnexPortfolioRows(analyses);

  if (!organizationId || !createdBy) return list;
  if (!options.edgnexVisible && !options.edgnexProcessing) return list;

  const status: Analysis['status'] =
    options.edgnexVisible ? 'complete' : 'processing';

  const demo = buildEdgnexDemoAnalysis(organizationId, createdBy, {
    status,
    createdAt: options.edgnexCreatedAt ?? new Date().toISOString(),
  });

  if (options.search) {
    const q = options.search.toLowerCase();
    const haystack = `${demo.name} ${demo.title ?? ''}`.toLowerCase();
    if (!haystack.includes(q)) return list;
  }

  if (list.some((a) => a.id === demo.id)) return list;

  return [demo, ...list];
}
