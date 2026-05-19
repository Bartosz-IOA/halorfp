import React, { useMemo, useState } from 'react';
import { AlertTriangle, FileWarning, ShieldOff } from 'lucide-react';
import {
  AccordionSection,
  AnalysisReportHero,
  CollapsibleSubsection,
  analysisNestedStack,
  analysisTableHead,
  analysisTableShell,
  cn,
} from '../../components/rfp/ResultPrimitives';
import { useEdgnexSectionExpandBinding } from '../../contexts/EdgnexReportNavContext';
import { CommentAnchor } from '../../components/comments/CommentAnchor';
import { FidicExecutiveSummary } from '../../components/rfp/FidicExecutiveSummary';
import {
  EDGNEX_FIDIC_CLAUSE_ROWS,
  EDGNEX_FIDIC_CONTRACT_DETAILS,
  EDGNEX_FIDIC_DRAFTING_ERROR_ITEMS,
  EDGNEX_FIDIC_INTRO,
  EDGNEX_FIDIC_META,
  EDGNEX_FIDIC_MISSING_PROTECTION_ITEMS,
  EDGNEX_FIDIC_OVERALL_RATING,
  EDGNEX_FIDIC_TOP_RISKS,
  type FidicCatalogItem,
  type FidicSeverity,
} from '../../data/edgnexFidicContractAnalysis';

const FIDIC_IN_PAGE_NAV = [
  { href: '#fidic-ss-exec', label: 'Summary' },
  { href: '#fidic-ss-rating', label: 'Rating' },
  { href: '#fidic-ss-risks', label: 'Top risks' },
  { href: '#fidic-ss-clauses', label: 'Clauses' },
  { href: '#fidic-ss-missing', label: 'Missing' },
  { href: '#fidic-ss-drafting', label: 'Drafting' },
] as const;

type SeverityFilter = 'ALL' | FidicSeverity;

function severityPill(severity: FidicSeverity) {
  const styles: Record<FidicSeverity, string> = {
    CRITICAL: 'bg-red-100 text-red-800 border-red-200',
    HIGH: 'bg-amber-100 text-amber-900 border-amber-200',
    MEDIUM: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide shrink-0',
        styles[severity],
      )}
    >
      {severity}
    </span>
  );
}

function catalogCategoryPill(category: string, variant: 'missing' | 'drafting') {
  const styles =
    variant === 'missing'
      ? 'bg-red-50 text-red-800 border-red-200/90'
      : 'bg-amber-50 text-amber-900 border-amber-200/90';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide',
        styles,
      )}
    >
      {category}
    </span>
  );
}

function IssueCatalogSummary({
  count,
  headline,
  subline,
  variant,
}: {
  count: number;
  headline: string;
  subline: string;
  variant: 'missing' | 'drafting';
}) {
  const shell =
    variant === 'missing'
      ? 'border-red-200/80 bg-gradient-to-br from-red-50/90 to-red-50/30'
      : 'border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-amber-50/25';
  const Icon = variant === 'missing' ? ShieldOff : FileWarning;
  return (
    <div className={cn('mb-5 flex gap-4 rounded-xl border p-4 sm:p-5', shell)}>
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border shadow-sm',
          variant === 'missing'
            ? 'border-red-200/80 bg-white text-red-700'
            : 'border-amber-200/80 bg-white text-amber-800',
        )}
        aria-hidden
      >
        <Icon size={22} strokeWidth={2} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">{headline}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-2xl font-bold tabular-nums text-navy-primary">{count}</span>
          <span className="text-sm font-semibold text-navy-primary">{subline}</span>
        </p>
      </div>
    </div>
  );
}

function IssueCatalogCard({
  item,
  index,
  variant,
}: {
  item: FidicCatalogItem;
  index: number;
  variant: 'missing' | 'drafting';
}) {
  const border =
    variant === 'missing' ? 'border-l-red-500 hover:border-red-200/80' : 'border-l-amber-500 hover:border-amber-200/80';
  const Icon = variant === 'missing' ? ShieldOff : AlertTriangle;
  return (
    <article
      className={cn(
        'rounded-xl border border-border/80 border-l-4 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] transition-colors',
        border,
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold tabular-nums',
            variant === 'missing' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-900',
          )}
          aria-hidden
        >
          {index + 1}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h4 className="text-sm font-bold leading-snug text-navy-primary pr-1">{item.title}</h4>
            {catalogCategoryPill(item.category, variant)}
          </div>
          {item.detail ? (
            <p className="text-xs leading-relaxed text-text-secondary">{item.detail}</p>
          ) : null}
          <div className="flex items-center gap-1.5 pt-0.5 text-[10px] font-medium text-text-secondary/90">
            <Icon size={12} className="shrink-0 opacity-70" aria-hidden />
            <span>{variant === 'missing' ? 'Standard FIDIC-style protection absent' : 'Review before pricing or submission'}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function IssueCatalogGrid({ items, variant }: { items: FidicCatalogItem[]; variant: 'missing' | 'drafting' }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <IssueCatalogCard key={item.id} item={item} index={index} variant={variant} />
      ))}
    </div>
  );
}

function FidicSeverityFilter({
  value,
  onChange,
  idPrefix,
  groupAriaLabel = 'Filter by severity',
}: {
  value: SeverityFilter;
  onChange: (v: SeverityFilter) => void;
  idPrefix: string;
  /** Distinct label when multiple filters exist on the page */
  groupAriaLabel?: string;
}) {
  const opts: { key: SeverityFilter; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'CRITICAL', label: 'Critical' },
    { key: 'HIGH', label: 'High' },
    { key: 'MEDIUM', label: 'Medium' },
  ];
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label={groupAriaLabel}>
      <span id={`${idPrefix}-label`} className="text-[10px] font-bold uppercase tracking-wide text-text-secondary">
        Severity
      </span>
      {opts.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={value === o.key}
          aria-labelledby={`${idPrefix}-label`}
          onClick={() => onChange(o.key)}
          className={cn(
            'rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/35',
            value === o.key
              ? 'border-navy-primary bg-navy-primary text-white'
              : 'border-border/80 bg-white text-text-secondary hover:border-navy-mid/30',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export const FidicContractAnalysisSection: React.FC = () => {
  const bindFidicExpand = useEdgnexSectionExpandBinding('edgnex-fidic');
  const [topRisksSeverity, setTopRisksSeverity] = useState<SeverityFilter>('ALL');
  const [clausesSeverity, setClausesSeverity] = useState<SeverityFilter>('ALL');
  const [clausePaneTall, setClausePaneTall] = useState(false);

  const filteredTopRisks = useMemo(
    () =>
      topRisksSeverity === 'ALL'
        ? EDGNEX_FIDIC_TOP_RISKS
        : EDGNEX_FIDIC_TOP_RISKS.filter((r) => r.severity === topRisksSeverity),
    [topRisksSeverity],
  );

  const filteredClauseRows = useMemo(
    () =>
      clausesSeverity === 'ALL'
        ? EDGNEX_FIDIC_CLAUSE_ROWS
        : EDGNEX_FIDIC_CLAUSE_ROWS.filter((r) => r.severity === clausesSeverity),
    [clausesSeverity],
  );

  return (
    <CommentAnchor anchorId="edgnex-fidic" label="Contract analysis (FIDIC)" scopeOnly>
    <AccordionSection
      sectionId="edgnex-fidic"
      number="02"
      title="Contract analysis (FIDIC risk review)"
      summaryPill={
        <span className="text-[10px] text-text-secondary">
          White Book 2017 · <strong className="text-red-700">{EDGNEX_FIDIC_OVERALL_RATING}</strong>
        </span>
      }
      defaultExpanded={false}
      onRegisterExpand={bindFidicExpand}
    >
      <div className="space-y-6 sm:space-y-8">
        <AnalysisReportHero
          eyebrow="Structured report"
          title={EDGNEX_FIDIC_META.title}
          subtitle={EDGNEX_FIDIC_META.projectLine}
          generatedLabel={EDGNEX_FIDIC_META.generatedLabel}
          benchmarkLine="Benchmark: FIDIC White Book 2017"
          intro={EDGNEX_FIDIC_INTRO}
        />

        <nav
          aria-label="Jump within contract analysis"
          className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border/70 bg-white/90 px-3 py-2.5 text-[11px] shadow-sm ring-1 ring-black/[0.02]"
        >
          <span className="text-[10px] font-bold uppercase tracking-wide text-text-secondary">Jump to</span>
          {FIDIC_IN_PAGE_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-semibold text-navy-mid underline-offset-2 hover:text-navy-primary hover:underline"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className={analysisNestedStack}>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] px-3 pt-3 pb-1">
            Report sections — expand each block as needed
          </p>

          <CollapsibleSubsection
            commentPrefix="edgnex-fidic"
            commentSectionLabel="Contract"
            anchorId="fidic-ss-exec"
            title="Executive summary"
            defaultOpen
            summary="Overall risk narrative and negotiation prerequisites."
          >
            <FidicExecutiveSummary />
          </CollapsibleSubsection>

          <CollapsibleSubsection
            commentPrefix="edgnex-fidic"
            commentSectionLabel="Contract"
            anchorId="fidic-ss-rating"
            title="Overall risk rating & contract details"
            summary={`Rating: ${EDGNEX_FIDIC_OVERALL_RATING} · Client, project, law, and commercial metadata.`}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Overall risk</span>
              {severityPill(EDGNEX_FIDIC_OVERALL_RATING)}
            </div>
            <h5 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3">
              Contract details
            </h5>
            <dl className="divide-y divide-border/70 text-xs">
              {EDGNEX_FIDIC_CONTRACT_DETAILS.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-1 gap-1 py-3.5 md:grid-cols-[140px_1fr] md:gap-4 md:items-start"
                >
                  <dt className="font-bold text-text-secondary shrink-0">{row.label}</dt>
                  <dd className="m-0 text-navy-primary leading-relaxed">{row.value}</dd>
                </div>
              ))}
            </dl>
          </CollapsibleSubsection>

          <CollapsibleSubsection
            commentPrefix="edgnex-fidic"
            commentSectionLabel="Contract"
            anchorId="fidic-ss-risks"
            title="Top 10 risk items"
            summary="Ranked exposures with clause references, severity, and DSA position."
          >
            <FidicSeverityFilter
              idPrefix="fidic-top-risks"
              value={topRisksSeverity}
              onChange={setTopRisksSeverity}
              groupAriaLabel="Filter top 10 risks by severity"
            />
            {filteredTopRisks.length === 0 ? (
              <p className="text-xs text-text-secondary leading-relaxed">
                No risks at this severity. Choose <span className="font-semibold">All</span> or another band to see the
                full ranked list.
              </p>
            ) : (
              <>
                <div className={cn('hidden lg:block overflow-x-auto', analysisTableShell)}>
                  <table className="w-full text-left text-xs min-w-[900px]">
                    <thead>
                      <tr className={cn(analysisTableHead, 'border-b border-border')}>
                        <th className="px-3 py-2.5 w-8 font-bold text-text-secondary">#</th>
                        <th className="px-3 py-2.5 font-bold text-text-secondary">Risk</th>
                        <th className="px-3 py-2.5 font-bold text-text-secondary w-[220px]">Clause / ref</th>
                        <th className="px-3 py-2.5 font-bold text-text-secondary w-24">Severity</th>
                        <th className="px-3 py-2.5 font-bold text-text-secondary">DSA position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTopRisks.map((r) => (
                        <tr
                          key={r.rank}
                          className="border-b border-border/60 align-top odd:bg-off-white/[0.35] hover:bg-surface-grey/50 transition-colors"
                        >
                          <td className="px-3 py-3 font-mono font-bold text-navy-primary tabular-nums">{r.rank}</td>
                          <td className="px-3 py-3">
                            <p className="font-bold text-navy-primary mb-1">{r.title}</p>
                            <p className="text-text-secondary leading-relaxed">{r.description}</p>
                          </td>
                          <td className="px-3 py-3 text-text-secondary leading-relaxed">{r.clause}</td>
                          <td className="px-3 py-3">{severityPill(r.severity)}</td>
                          <td className="px-3 py-3 text-navy-primary leading-relaxed">{r.dsaPosition}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="lg:hidden space-y-3">
                  {filteredTopRisks.map((r) => (
                    <div
                      key={r.rank}
                      className="rounded-xl border border-border/80 bg-white p-4 text-xs space-y-2 shadow-sm ring-1 ring-black/[0.02]"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-mono font-bold text-navy-primary">#{r.rank}</span>
                        {severityPill(r.severity)}
                      </div>
                      <p className="font-bold text-navy-primary">{r.title}</p>
                      <p className="text-text-secondary leading-relaxed">{r.description}</p>
                      <p className="text-[10px] text-text-secondary border-t border-border pt-2">
                        <span className="font-bold uppercase tracking-wide">Clause</span>
                        <br />
                        {r.clause}
                      </p>
                      <p className="text-navy-primary leading-relaxed border-t border-border pt-2">
                        <span className="font-bold text-text-secondary uppercase tracking-wide text-[10px]">
                          DSA position
                        </span>
                        <br />
                        {r.dsaPosition}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CollapsibleSubsection>

          <CollapsibleSubsection
            commentPrefix="edgnex-fidic"
            commentSectionLabel="Contract"
            anchorId="fidic-ss-clauses"
            title="Clause-by-clause analysis"
            summary="Twelve clauses vs FIDIC White Book 2017 — expand each clause for full text, amendment, and rationale."
          >
            <p className="text-xs text-text-secondary mb-3 leading-relaxed">
              Each row compares the retrieved wording to FIDIC, assigns a risk category, proposes amended language, and
              records client-facing and DSA notes. Use the severity filter below for this list only—it is independent
              of the Top 10 filter.
            </p>
            <FidicSeverityFilter
              idPrefix="fidic-clauses"
              value={clausesSeverity}
              onChange={setClausesSeverity}
              groupAriaLabel="Filter clause-by-clause rows by severity"
            />
            {filteredClauseRows.length === 0 ? (
              <p className="text-xs text-text-secondary leading-relaxed">
                No clauses at this severity. Choose <span className="font-semibold">All</span> or another band.
              </p>
            ) : (
              <>
                <div className="mb-2 flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setClausePaneTall((v) => !v)}
                    className="rounded-lg border border-border/80 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-navy-primary shadow-sm transition hover:bg-surface-grey focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/30"
                  >
                    {clausePaneTall ? 'Use bounded scroll window' : 'Expand clause list (full page height)'}
                  </button>
                </div>
                <div
                  className={cn(
                    'space-y-1 pr-1 rounded-xl border border-border/60 bg-off-white/20 p-1',
                    clausePaneTall ? 'max-h-none overflow-visible' : 'max-h-[70vh] overflow-y-auto',
                  )}
                >
                  {filteredClauseRows.map((row) => (
                    <CollapsibleSubsection
                      commentPrefix="edgnex-fidic"
                      commentSectionLabel="Contract"
                      key={row.clauseRef}
                      nested
                      title={row.topic}
                      summary={row.clauseRef}
                      badge={severityPill(row.severity)}
                    >
                      <div className="space-y-3">
                        <div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                            Clause reference
                          </p>
                          <p className="text-text-secondary leading-relaxed">{row.clauseRef}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                            Original (excerpt)
                          </p>
                          <p className="text-navy-primary leading-relaxed italic">{row.original}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                            FIDIC White Book position
                          </p>
                          <p className="text-text-secondary leading-relaxed">{row.fidicPosition}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-text-secondary uppercase">Risk category</span>
                          <span className="text-[11px] font-semibold text-navy-primary bg-off-white px-2 py-0.5 rounded border border-border">
                            {row.riskCategory}
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                            Proposed amendment
                          </p>
                          <p className="text-navy-primary leading-relaxed">{row.proposedAmendment}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
                            Rationale & DSA notes
                          </p>
                          <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{row.rationale}</p>
                        </div>
                      </div>
                    </CollapsibleSubsection>
                  ))}
                </div>
              </>
            )}
          </CollapsibleSubsection>

          <CollapsibleSubsection
            commentPrefix="edgnex-fidic"
            commentSectionLabel="Contract"
            anchorId="fidic-ss-missing"
            title="Missing protections"
            summary={`${EDGNEX_FIDIC_MISSING_PROTECTION_ITEMS.length} standard protections not found in the retrieved RFP set`}
          >
            <p className="mb-4 text-xs leading-relaxed text-text-secondary max-w-[85ch]">
              Each item is a FIDIC White Book–style protection that was not located in the issued pack. Absence
              increases uncapped or unqualified exposure and should be treated as a pre-bid negotiation point.
            </p>
            <IssueCatalogSummary
              count={EDGNEX_FIDIC_MISSING_PROTECTION_ITEMS.length}
              headline="Missing protections"
              subline="items not found in retrieved documents"
              variant="missing"
            />
            <IssueCatalogGrid items={EDGNEX_FIDIC_MISSING_PROTECTION_ITEMS} variant="missing" />
          </CollapsibleSubsection>

          <CollapsibleSubsection
            commentPrefix="edgnex-fidic"
            commentSectionLabel="Contract"
            anchorId="fidic-ss-drafting"
            title="Drafting errors & inconsistencies"
            summary={`${EDGNEX_FIDIC_DRAFTING_ERROR_ITEMS.length} cross-reference, scope, and commercial ambiguities`}
          >
            <p className="mb-4 text-xs leading-relaxed text-text-secondary max-w-[85ch]">
              Internal contradictions, dangling references, and unresolved placeholders that affect scope certainty,
              insurance, liquidated damages, and payment milestones. Resolve or qualify before final pricing.
            </p>
            <IssueCatalogSummary
              count={EDGNEX_FIDIC_DRAFTING_ERROR_ITEMS.length}
              headline="Drafting & consistency"
              subline="issues requiring clarification"
              variant="drafting"
            />
            <IssueCatalogGrid items={EDGNEX_FIDIC_DRAFTING_ERROR_ITEMS} variant="drafting" />
          </CollapsibleSubsection>
        </div>
      </div>
    </AccordionSection>
    </CommentAnchor>
  );
};
