import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronUp, FileArchive, FileSpreadsheet, FileText, Mail } from 'lucide-react';
import {
  AccordionSection,
  GoNoGoRow,
  IndicatorCard,
  ReferenceInfoList,
  analysisReportCard,
  cn,
} from '../../components/rfp/ResultPrimitives';
import {
  EDGNEX_EXEC_SUMMARY,
  EDGNEX_GENERATED_LABEL,
  EDGNEX_GO_NO_GO,
  EDGNEX_KEY_FACTS,
  EDGNEX_NEXT_STEPS_BY_SECTION,
  EDGNEX_NEXT_STEPS_ITEM_COUNT,
} from '../../data/edgnexDataCentresAnalysis';

const FidicContractAnalysisSection = lazy(() =>
  import('./FidicContractAnalysisSection').then((m) => ({ default: m.FidicContractAnalysisSection })),
);
const FeeEstimationSection = lazy(() =>
  import('./FeeEstimationSection').then((m) => ({ default: m.FeeEstimationSection })),
);

const EDGNEX_NAV_IDS = [
  'edgnex-overview',
  'edgnex-sources',
  'edgnex-scoring',
  'edgnex-fidic',
  'edgnex-fee',
  'edgnex-next',
] as const;

const NEXT_STEP_SECTION_LINK: Record<string, string> = {
  overview: 'Overview',
  sources: 'Sources',
  scoring: 'Scoring',
  fidic: 'Contract',
  fee: 'Fee model',
};

const DOC_ITEMS = [
  {
    name: 'PART 02-DC_DLC_RFP__Services Brief Summary.pdf',
    desc: 'Services scope, programme, and deliverables summary.',
    kind: 'pdf' as const,
  },
  {
    name: 'PART 1B- PROPOSAL SCHEDULES.pdf',
    desc: 'Proposal schedules and authority submission staging.',
    kind: 'pdf' as const,
  },
  {
    name: 'Commercial Qualifications - DMM & DAH DC (1).xlsx',
    desc: 'Retention, insurances, LDs, and commercial qualifications.',
    kind: 'xlsx' as const,
  },
  { name: 'EMAIL THREAD (1749041467524.txt)', desc: 'Correspondence on bid timing.', kind: 'txt' as const },
  { name: 'Assessment.xlsx', desc: 'Structured scoring matrix and rationale.', kind: 'xlsx' as const },
];

const NAV_LINKS = [
  { href: '#edgnex-overview', label: 'Overview' },
  { href: '#edgnex-sources', label: 'Sources' },
  { href: '#edgnex-scoring', label: 'Scoring' },
  { href: '#edgnex-fidic', label: 'Contract' },
  { href: '#edgnex-fee', label: 'Fee model' },
  { href: '#edgnex-next', label: 'Next steps' },
];

function DocKindIcon({ kind }: { kind: 'pdf' | 'xlsx' | 'txt' }) {
  if (kind === 'xlsx') return <FileSpreadsheet size={18} className="text-emerald-700" aria-hidden />;
  if (kind === 'txt') return <Mail size={18} className="text-sky-700" aria-hidden />;
  return <FileText size={18} className="text-red-700" aria-hidden />;
}

function docKindLabel(kind: 'pdf' | 'xlsx' | 'txt') {
  if (kind === 'xlsx') return 'XLSX';
  if (kind === 'txt') return 'TXT';
  return 'PDF';
}

function docKindStyles(kind: 'pdf' | 'xlsx' | 'txt') {
  if (kind === 'xlsx') return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
  if (kind === 'txt') return 'bg-sky-50 text-sky-800 border-sky-200/80';
  return 'bg-red-50 text-red-800 border-red-200/80';
}

function EdgnexNextStepsGrouped({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      {EDGNEX_NEXT_STEPS_BY_SECTION.map((section, idx) => (
        <article key={section.id} className={idx > 0 ? 'border-t border-border/60 pt-6' : ''}>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-sm font-bold text-navy-primary">{section.title}</h4>
            <a
              href={`#${section.anchorId}`}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-navy-mid underline-offset-2 hover:text-navy-primary hover:underline"
            >
              <ChevronRight size={12} className="shrink-0 opacity-80" aria-hidden />
              Go to {NEXT_STEP_SECTION_LINK[section.id] ?? 'section'}
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary">Next steps</p>
              <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-text-primary marker:text-navy-mid">
                {section.nextSteps.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-navy-primary">Action items</p>
              <ul className="list-disc space-y-2 pl-4 text-sm leading-relaxed text-text-primary marker:text-navy-primary/50">
                {section.actionItems.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export const EdgnexDataCentresResults: React.FC = () => {
  const [overviewNextOpen, setOverviewNextOpen] = useState(false);
  const [copiedDocName, setCopiedDocName] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [readingGuideOpen, setReadingGuideOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const [activeNavId, setActiveNavId] = useState<string>('edgnex-overview');
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let observer: IntersectionObserver | null = null;
    let attempts = 0;

    const attach = () => {
      if (cancelled) return;
      attempts += 1;
      const elements = EDGNEX_NAV_IDS.map((id) => document.getElementById(id)).filter(
        (el): el is HTMLElement => Boolean(el),
      );
      if (elements.length < EDGNEX_NAV_IDS.length && attempts < 240) {
        requestAnimationFrame(attach);
        return;
      }
      if (elements.length === 0) return;
      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting && e.intersectionRatio > 0.05)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const top = visible[0];
          if (top?.target.id) setActiveNavId(top.target.id);
        },
        { root: null, rootMargin: '-100px 0px -48% 0px', threshold: [0, 0.08, 0.15, 0.25, 0.45, 0.65] },
      );
      elements.forEach((el) => observer!.observe(el));
    };

    attach();
    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);

  const copyDocFilename = async (name: string) => {
    try {
      await navigator.clipboard.writeText(name);
      setCopiedDocName(name);
      setCopyError(null);
      if (copyResetRef.current) window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => setCopiedDocName(null), 2000);
    } catch {
      setCopiedDocName(null);
      setCopyError('Clipboard unavailable — copy the filename manually.');
      if (copyResetRef.current) window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => setCopyError(null), 4000);
    }
  };

  return (
    <div className="min-h-full font-sans bg-off-white bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(26,46,69,0.06),transparent)] print:bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 pb-16">
        <header className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
                RFP intelligence
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-navy-primary tracking-tight leading-tight">
                EDGNEX Data Centres
              </h1>
              <p className="text-sm text-text-secondary mt-1.5">
                Dhahran & Dammam Tech · {EDGNEX_GENERATED_LABEL}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700">
                Recommendation: Decline
              </span>
              <span className="inline-flex items-center rounded-full border border-border/80 bg-white px-3 py-1 text-[11px] font-medium text-text-secondary shadow-sm">
                Lead consultant + AOR
              </span>
            </div>
          </div>

          <nav
            aria-label="On this page"
            className="edgnex-print-static sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-b border-border/60 bg-off-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-off-white/75 print:border-0"
          >
            <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:thin]">
              {NAV_LINKS.map((link) => {
                const id = link.href.replace('#', '');
                const isActive = activeNavId === id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/30',
                      isActive
                        ? 'border-navy-primary bg-navy-primary text-white'
                        : 'border-border/80 bg-white text-navy-primary hover:border-navy-mid/25 hover:bg-surface-grey',
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </nav>
          <div className="rounded-lg border border-border/60 bg-white/80 px-3 py-2 shadow-sm">
            <button
              type="button"
              onClick={() => setReadingGuideOpen((o) => !o)}
              aria-expanded={readingGuideOpen}
              className="flex w-full items-center justify-between gap-2 text-left text-[11px] font-semibold text-navy-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/25 rounded-md"
            >
              <span>How to read this page</span>
              <ChevronRight
                size={14}
                className={cn('shrink-0 text-text-secondary transition-transform', readingGuideOpen && 'rotate-90')}
                aria-hidden
              />
            </button>
            {readingGuideOpen && (
              <p className="mt-2 text-[11px] text-text-secondary leading-relaxed max-w-[90ch] border-t border-border/50 pt-2">
                <span className="font-semibold text-navy-primary">Reading order:</span> at-a-glance KPIs → narrative
                (verdict, structured summary, key facts) → optional full checklist → then collapsible detail sections
                (sources, scoring, contract, fee, next steps archive).
              </p>
            )}
          </div>
        </header>

        <div id="edgnex-overview" className="scroll-mt-32 space-y-6 lg:space-y-8">
          <section
            aria-label="Assessment scores at a glance"
            className={cn(analysisReportCard, 'p-4 sm:p-5')}
          >
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-4">
              At a glance
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
              <div className="col-span-2 xl:col-span-2">
                <IndicatorCard
                  label="Score vs RFP minimum floor"
                  value="30 / 300 pts"
                  subtext={
                    <span>
                      Both the <span className="font-semibold text-navy-primary">10% earned band</span> and the{' '}
                      <span className="font-semibold text-navy-primary">10% minimum floor</span> equal 30 points — no
                      headroom until positive evidence scores on currently neutral criteria. Maximum achievable remains{' '}
                      <span className="font-semibold text-navy-primary">120 pts (40%)</span>.
                    </span>
                  }
                  alert
                />
              </div>
              <IndicatorCard label="Max possible" value="40%" subtext="120 / 300 pts" />
              <IndicatorCard
                label="Overall risk"
                value="High"
                subtext="1 critical · 3 high · 6 medium"
                alert
              />
              <IndicatorCard
                label="Submission"
                value={<span className="text-xl sm:text-2xl">Unknown</span>}
                subtext="< 14 days implied"
                alert
              />
              <IndicatorCard
                label="Go / No-Go"
                value={<span className="text-xl sm:text-2xl">No-Go</span>}
                subtext="Decline per assessment"
                alert
              />
            </div>
          </section>

          <div className={cn(analysisReportCard, 'relative overflow-visible p-6 sm:p-8')}>
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy-mid via-navy-primary to-yellow"
              aria-hidden
            />
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-primary tracking-tight">
                Assessment narrative
              </h2>
              <p className="text-sm text-text-secondary mt-2">
                Damac Properties Co. LLC · Dhahran & Dammam Tech, KSA
              </p>
            </div>

            <div className="rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 to-orange-50/20 p-4 sm:p-5 mb-8 ring-1 ring-amber-900/[0.04]">
              <h3 className="text-[10px] font-bold text-amber-900/80 uppercase tracking-[0.2em] mb-2">
                Verdict at a glance
              </h3>
              <p className="text-sm text-navy-primary leading-relaxed max-w-[85ch]">
                Multi-site hyperscale data centres with Lead Consultant / AOR obligations across full
                multi-disciplinary design, tender support, and approvals. Submission timing unclear (email implies
                under two weeks). Internal recommendation is{' '}
                <span className="font-bold text-red-600">Decline</span> based on score band, programme compression,
                and commercial exposures.
              </p>
            </div>

            <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-4">
              Executive summary
            </h3>
            <div className="mb-10">
              <ReferenceInfoList
                rows={EDGNEX_EXEC_SUMMARY.map((block) =>
                  block.reference
                    ? {
                        label: block.heading,
                        value: block.body,
                        referenceNote: `${block.reference.summary}\n\n${block.reference.detail}`,
                        referenceSource: block.reference.citations,
                      }
                    : {
                        label: block.heading,
                        value: block.body,
                        showReference: false,
                      },
                )}
              />
            </div>

            <div className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-border/70" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary whitespace-nowrap">
                Supporting detail
              </span>
              <div className="h-px flex-1 bg-border/70" />
            </div>

            <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-4">
              Key facts
            </h3>
            <div className="mb-8">
              <ReferenceInfoList
                rows={EDGNEX_KEY_FACTS.map((item) => ({
                  label: item.label,
                  value: item.value,
                  referenceNote: item.note,
                  referenceSource: item.ref,
                }))}
              />
            </div>

            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
              Next steps & action items
            </h3>
            <p className="mb-3 max-w-prose text-xs leading-relaxed text-text-secondary">
              Grouped by report area: next steps set direction and sequencing; action items are concrete clarifications,
              negotiations, or internal tasks.
            </p>
            <div id="edgnex-overview-next-steps" className="mb-8 scroll-mt-32">
              {!overviewNextOpen ? (
                <div className="rounded-xl border border-border/70 bg-off-white/50 p-4 ring-1 ring-black/[0.02] sm:p-5">
                  <p className="text-sm text-navy-primary leading-relaxed">
                    <span className="font-semibold">{EDGNEX_NEXT_STEPS_ITEM_COUNT} checklist items</span> across{' '}
                    {EDGNEX_NEXT_STEPS_BY_SECTION.length} areas (overview, sources, scoring, contract, fee). Expand when
                    you want the full matrix in this narrative, or open the archived section at the bottom of the page.
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-border/50 pt-4 text-left">
                    {EDGNEX_NEXT_STEPS_BY_SECTION.map((s) => (
                      <li
                        key={s.id}
                        className="flex flex-col gap-0.5 text-[11px] text-text-secondary sm:flex-row sm:items-baseline sm:gap-2"
                      >
                        <span className="shrink-0 font-bold text-navy-primary">{s.title}</span>
                        <span className="line-clamp-2 sm:line-clamp-1">{s.nextSteps[0]}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setOverviewNextOpen(true)}
                    className="mt-4 inline-flex items-center justify-center rounded-xl border border-navy-mid/25 bg-navy-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-navy-mid focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/40"
                  >
                    Show full checklist
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-border/70 bg-off-white/50 p-4 ring-1 ring-black/[0.02] sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] text-text-secondary">Full grouped checklist</p>
                    <button
                      type="button"
                      onClick={() => setOverviewNextOpen(false)}
                      className="text-[11px] font-semibold text-navy-mid underline-offset-2 hover:text-navy-primary hover:underline"
                    >
                      Hide checklist
                    </button>
                  </div>
                  <EdgnexNextStepsGrouped />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700">
                30 / 300 pts (10%)
              </span>
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-900">
                Max achievable 40%
              </span>
              <span className="inline-flex items-center rounded-full border border-border/80 bg-white px-3 py-1.5 text-[11px] font-medium text-navy-primary shadow-sm">
                Multi-site hyperscale DC
              </span>
            </div>
          </div>
        </div>

        <AccordionSection
          sectionId="edgnex-sources"
          number="00"
          title="Source documents"
          summaryPill={
            <span className="text-[10px] text-text-secondary">
              <strong className="text-navy-primary">{DOC_ITEMS.length}</strong> pack inputs
            </span>
          }
          defaultExpanded={false}
        >
          <span className="sr-only" aria-live="polite">
            {copiedDocName ? `${copiedDocName} copied to clipboard` : copyError ?? ''}
          </span>
          {copyError ? (
            <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="status">
              {copyError}
            </p>
          ) : null}
          <p className="text-xs text-text-secondary mb-4 max-w-prose leading-relaxed">
            Filenames mirror the issued RFP pack and supporting files. Cards are for orientation only — click a card to
            copy its filename to the clipboard (for example when locating the file in your document management system).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DOC_ITEMS.map((doc) => (
              <button
                key={doc.name}
                type="button"
                onClick={() => copyDocFilename(doc.name)}
                title="Copy filename to clipboard"
                className="group flex w-full gap-3 rounded-xl border border-border/80 bg-white p-4 text-left shadow-sm ring-1 ring-black/[0.02] transition hover:border-navy-mid/20 hover:bg-surface-grey/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/30"
              >
                <div
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border font-bold text-[9px] tracking-wide',
                    docKindStyles(doc.kind),
                  )}
                >
                  <span className="sr-only">{docKindLabel(doc.kind)}</span>
                  <DocKindIcon kind={doc.kind} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-navy-primary leading-snug group-hover:text-navy-mid transition-colors">
                    {doc.name}
                  </p>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">{doc.desc}</p>
                  <p className="mt-2 text-[10px] font-semibold text-navy-mid">
                    {copiedDocName === doc.name ? 'Copied' : 'Click to copy filename'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </AccordionSection>

        <div className="space-y-4">
          <AccordionSection
            sectionId="edgnex-scoring"
            number="01"
            title="Go / No-Go scoring breakdown"
            defaultExpanded
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-5 border-b border-border/70 pb-4">
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
                10 criteria · assessment matrix
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500" /> Positive
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-red-600" /> Penalty / blocker
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-slate-400" /> No score
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              {EDGNEX_GO_NO_GO.map((row) => (
                <GoNoGoRow key={row.id} data={row} />
              ))}
            </div>

            <div className="mt-8 border-t border-border/70 pt-5 flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                disabled
                title="Export will be available when the assessment workbook is attached to this build."
                aria-disabled="true"
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border/80 bg-surface-grey/60 px-4 py-2.5 text-xs font-bold text-text-secondary shadow-sm opacity-80"
              >
                <FileArchive size={16} className="text-text-secondary/70" aria-hidden />
                Download xlsx breakdown (coming soon)
              </button>
            </div>
            <p className="mt-3 max-w-lg text-right text-[11px] leading-relaxed text-text-secondary sm:ml-auto">
              The matrix export is not bundled in this build yet. Use the on-screen criteria or request the Assessment
              workbook from the team if you need a spreadsheet for workshops.
            </p>
          </AccordionSection>

          <Suspense
            fallback={
              <div className="rounded-2xl border border-border/80 bg-white p-10 text-center text-sm text-text-secondary shadow-card">
                Loading contract and fee sections…
              </div>
            }
          >
            <FidicContractAnalysisSection />
            <FeeEstimationSection />
          </Suspense>

          <AccordionSection
            sectionId="edgnex-next"
            number="04"
            title="Next steps"
            defaultExpanded={false}
            summaryPill={
              <span className="text-[10px] text-text-secondary">
                <strong className="text-navy-primary">{EDGNEX_NEXT_STEPS_ITEM_COUNT}</strong> items · mirror of overview
              </span>
            }
          >
            <p className="text-xs text-text-secondary mb-4 max-w-prose leading-relaxed">
              Same grouped checklist as in{' '}
              <a
                href="#edgnex-overview-next-steps"
                className="font-semibold text-navy-mid underline-offset-2 hover:text-navy-primary hover:underline"
              >
                {'Overview → Next steps & action items'}
              </a>
              . Open the overview section and use <span className="font-semibold">Show full checklist</span> if it is
              collapsed. This block stays available for deep-linking and printing.
            </p>
            <EdgnexNextStepsGrouped />
          </AccordionSection>
        </div>
      </div>

      <button
        type="button"
        className={cn(
          'edgnex-print-hide fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-white text-navy-primary shadow-lg transition hover:bg-surface-grey focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/35',
          showBackTop ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-2',
        )}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ChevronUp size={20} strokeWidth={2.5} aria-hidden />
      </button>
    </div>
  );
};
