import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronUp, Copy, Download, FileArchive, FileSpreadsheet, FileText, Info, Mail } from 'lucide-react';
import {
  AccordionSection,
  GoNoGoRow,
  IndicatorCard,
  ReferenceInfoList,
  analysisReportCard,
  cn,
} from '../../components/rfp/ResultPrimitives';
import {
  EdgnexReportNavProvider,
  useEdgnexReportNav,
  useEdgnexSectionExpandBinding,
} from '../../contexts/EdgnexReportNavContext';
import {
  EDGNEX_CLIENT_NAME,
  EDGNEX_EXEC_SUMMARY,
  EDGNEX_GENERATED_LABEL,
  EDGNEX_GO_NO_GO,
  EDGNEX_GO_NO_GO_EARNED_POINTS,
  EDGNEX_GO_NO_GO_MAX_ACHIEVABLE_POINTS,
  EDGNEX_GO_NO_GO_MAX_POINTS,
  EDGNEX_KEY_FACTS,
  goNoGoScorePercent,
  EDGNEX_NEXT_STEPS_BY_SECTION,
  EDGNEX_NEXT_STEPS_ITEM_COUNT,
} from '../../data/edgnexDataCentresAnalysis';
import {
  downloadAllSourceDocuments,
  downloadSourceDocument,
  type SourceDocumentItem,
} from '../../lib/sourceDocumentDownload';
import { CommentAnchor } from '../../components/comments/CommentAnchor';
import { CommentsModeBanner } from '../../components/comments/CommentsModeBanner';
import { buildCommentAnchorId, buildCommentLabel } from '../../lib/commentAnchorId';

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
] as const;

const NEXT_STEP_SECTION_LINK: Record<string, string> = {
  overview: 'Overview',
  sources: 'Sources',
  scoring: 'Scoring',
  fidic: 'Contract',
  fee: 'Fee model',
};

const DOC_ITEMS: SourceDocumentItem[] = [
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

function SourceDocumentInfoButton({ doc }: { doc: SourceDocumentItem }) {
  return (
    <div className="group/info relative shrink-0">
      <button
        type="button"
        aria-label={`Document description for ${doc.name}`}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-border/90 bg-off-white text-text-secondary shadow-sm transition hover:border-navy-mid/35 hover:bg-surface-grey hover:text-navy-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/30 focus-visible:ring-offset-2"
      >
        <Info size={14} strokeWidth={2.5} aria-hidden />
      </button>
      <div
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-[calc(100%+8px)] right-0 z-[80] w-[min(18rem,calc(100vw-2.5rem))] translate-y-1 opacity-0 transition-all duration-200 ease-out group-hover/info:visible group-hover/info:translate-y-0 group-hover/info:opacity-100 group-focus-within/info:visible group-focus-within/info:translate-y-0 group-focus-within/info:opacity-100"
      >
        <div className="relative rounded-lg border border-white/15 bg-navy-mid px-3.5 py-3 text-left shadow-modal ring-1 ring-black/25">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow">About this file</p>
          <p className="mt-2 border-t border-white/15 pt-2 text-[11px] leading-relaxed text-white/95">{doc.desc}</p>
          <p className="mt-2 text-[10px] leading-snug text-white/60">{doc.name}</p>
          <div
            className="absolute -bottom-[5px] right-3 h-0 w-0 border-x-[6px] border-x-transparent border-t-[7px] border-t-navy-mid"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}

function SourceDocumentCard({
  doc,
  onCopyFilename,
  onDownload,
  isCopying,
  isDownloading,
}: {
  doc: SourceDocumentItem;
  onCopyFilename: (name: string) => void;
  onDownload: (doc: SourceDocumentItem) => void;
  isCopying: boolean;
  isDownloading: boolean;
}) {
  return (
    <CommentAnchor
      anchorId={buildCommentAnchorId('edgnex-sources', doc.name)}
      label={buildCommentLabel('Sources', doc.name)}
      variant="inline"
      className="h-full"
    >
    <article className="flex flex-col rounded-xl border border-border/80 bg-white p-4 shadow-sm ring-1 ring-black/[0.02] transition hover:border-navy-mid/20 hover:shadow-md h-full">
      <div className="flex items-start gap-3">
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
          <div className="flex items-start gap-1.5">
            <p className="min-w-0 flex-1 text-xs font-semibold leading-snug text-navy-primary">{doc.name}</p>
            <SourceDocumentInfoButton doc={doc} />
          </div>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-text-secondary/80">
            {docKindLabel(doc.kind)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
        <button
          type="button"
          onClick={() => onDownload(doc)}
          disabled={isDownloading}
          className="inline-flex flex-1 min-w-[120px] items-center justify-center gap-1.5 rounded-lg border border-navy-mid/25 bg-navy-primary px-3 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-navy-mid focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/40 disabled:cursor-wait disabled:opacity-70 sm:flex-none"
        >
          <Download size={14} aria-hidden className={isDownloading ? 'animate-pulse' : ''} />
          {isDownloading ? 'Downloading…' : 'Download'}
        </button>
        <button
          type="button"
          onClick={() => onCopyFilename(doc.name)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border/80 bg-white px-3 py-2 text-[11px] font-semibold text-navy-primary shadow-sm transition hover:bg-surface-grey focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/30"
        >
          <Copy size={14} aria-hidden />
          {isCopying ? 'Copied' : 'Copy name'}
        </button>
      </div>
    </article>
    </CommentAnchor>
  );
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

export const EdgnexDataCentresResults: React.FC = () => (
  <EdgnexReportNavProvider>
    <EdgnexDataCentresResultsContent />
  </EdgnexReportNavProvider>
);

const EdgnexDataCentresResultsContent: React.FC = () => {
  const { jumpToSection } = useEdgnexReportNav();
  const bindSourcesExpand = useEdgnexSectionExpandBinding('edgnex-sources');
  const bindScoringExpand = useEdgnexSectionExpandBinding('edgnex-scoring');
  const [overviewNextOpen, setOverviewNextOpen] = useState(false);
  const [copiedDocName, setCopiedDocName] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [downloadingDocName, setDownloadingDocName] = useState<string | null>(null);
  const [downloadAllBusy, setDownloadAllBusy] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
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

  const handleDownloadDoc = async (doc: SourceDocumentItem) => {
    setDownloadingDocName(doc.name);
    setDownloadStatus(null);
    try {
      const hosted = await downloadSourceDocument(doc);
      setDownloadStatus(
        hosted ? `Downloaded ${doc.name}` : `Placeholder downloaded for ${doc.name} (file not hosted yet)`,
      );
    } finally {
      setDownloadingDocName(null);
      if (copyResetRef.current) window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => setDownloadStatus(null), 4000);
    }
  };

  const handleDownloadAll = async () => {
    setDownloadAllBusy(true);
    try {
      await downloadAllSourceDocuments(DOC_ITEMS, setDownloadStatus);
    } finally {
      setDownloadAllBusy(false);
      if (copyResetRef.current) window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => setDownloadStatus(null), 5000);
    }
  };

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
    <div className="min-h-full overflow-x-hidden font-sans bg-off-white bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(26,46,69,0.06),transparent)] print:bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 pb-16">
        <CommentsModeBanner />
        <header className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
                RFP intelligence
              </p>
              <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3 sm:gap-y-0.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-navy-primary tracking-tight leading-tight">
                  EDGNEX Data Centres
                </h1>
                <span className="hidden sm:inline text-border/80 font-light select-none" aria-hidden>
                  |
                </span>
                <p className="text-base sm:text-lg font-semibold text-navy-mid leading-snug">
                  {EDGNEX_CLIENT_NAME}
                </p>
              </div>
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
            className="edgnex-print-static sticky top-0 z-10 py-3 border-b border-border/60 bg-off-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-off-white/75 print:border-0"
          >
            <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:thin]">
              {NAV_LINKS.map((link) => {
                const id = link.href.replace('#', '');
                const isActive = activeNavId === id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      jumpToSection(id);
                      setActiveNavId(id);
                    }}
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
        </header>

        <CommentAnchor anchorId="edgnex-overview" label="Overview" asSection scopeOnly className="scroll-mt-32 space-y-6 lg:space-y-8">
          <CommentAnchor anchorId="overview-at-glance" label="Overview · At a glance" variant="inline">
          <section
            aria-label="Assessment scores at a glance"
            className={cn(analysisReportCard, 'p-4 sm:p-5')}
          >
            <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-4">
              At a glance
            </p>
            <div className="flex min-w-0 flex-col gap-3 sm:gap-4">
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
              <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 [&>*]:min-w-0">
                <IndicatorCard label="Max possible" value="40%" subtext="120 / 300 pts" />
                <IndicatorCard
                  label="Overall risk"
                  value="High"
                  subtext="1 critical · 3 high · 6 medium"
                  alert
                />
                <IndicatorCard
                  label="Submission"
                  value="Unknown"
                  subtext="< 14 days implied"
                  alert
                />
                <IndicatorCard
                  label="Go / No-Go"
                  value="No-Go"
                  subtext="Decline per assessment"
                  alert
                />
              </div>
            </div>
          </section>
          </CommentAnchor>

          <div className={cn(analysisReportCard, 'relative overflow-hidden p-5 sm:p-6 lg:p-8')}>
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

            <CommentAnchor anchorId="overview-verdict" label="Overview · Verdict at a glance" variant="inline" className="rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/90 to-orange-50/20 p-4 sm:p-5 mb-8 ring-1 ring-amber-900/[0.04]">
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
            </CommentAnchor>

            <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-3">
              Key facts
            </h3>
            <div className="mb-6">
              <ReferenceInfoList
                dense
                commentPrefix="overview-facts"
                commentSectionLabel="Overview"
                rows={EDGNEX_KEY_FACTS.map((item) => ({
                  label: item.label,
                  value: item.value,
                  referenceNote: item.note,
                  referenceSource: item.ref,
                }))}
              />
            </div>

            <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-3">
              Executive summary
            </h3>
            <div className="mb-6">
              <ReferenceInfoList
                dense
                commentPrefix="overview-exec"
                commentSectionLabel="Overview"
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


            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">
              Next steps & action items
            </h3>
            <p className="mb-3 max-w-prose text-xs leading-relaxed text-text-secondary">
              Grouped by report area: next steps set direction and sequencing; action items are concrete clarifications,
              negotiations, or internal tasks.
            </p>
            <div id="edgnex-overview-next-steps" className="mb-8 scroll-mt-32">
              <div className="rounded-xl border border-border/70 bg-off-white/50 p-4 ring-1 ring-black/[0.02] sm:p-5">
                <p className="text-[11px] text-text-secondary">Checklist summary</p>
                <p className="mt-2 text-sm text-navy-primary leading-relaxed">
                  <span className="font-semibold">{EDGNEX_NEXT_STEPS_ITEM_COUNT} checklist items</span> across{' '}
                  {EDGNEX_NEXT_STEPS_BY_SECTION.length} areas (overview, sources, scoring, contract, fee). Use{' '}
                  <span className="font-semibold">Show full checklist</span> below to expand the full matrix.
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

                {overviewNextOpen ? (
                  <div id="edgnex-overview-next-steps-full" className="mt-6 border-t border-border/60 pt-6">
                    <p className="mb-4 text-[11px] font-semibold text-text-secondary">Full grouped checklist</p>
                    <EdgnexNextStepsGrouped />
                  </div>
                ) : null}

                <div className="mt-4 flex justify-end border-t border-border/50 pt-4">
                  <button
                    type="button"
                    onClick={() => setOverviewNextOpen((open) => !open)}
                    className="rounded-sm text-[11px] font-semibold text-navy-mid underline-offset-2 hover:text-navy-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/30 focus-visible:ring-offset-2"
                    aria-expanded={overviewNextOpen}
                    aria-controls="edgnex-overview-next-steps-full"
                  >
                    {overviewNextOpen ? 'Hide checklist' : 'Show full checklist'}
                  </button>
                </div>
              </div>
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
        </CommentAnchor>

        <CommentAnchor anchorId="edgnex-sources" label="Source documents" scopeOnly>
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
          onRegisterExpand={bindSourcesExpand}
        >
          <span className="sr-only" aria-live="polite">
            {copiedDocName
              ? `${copiedDocName} copied to clipboard`
              : downloadStatus ?? copyError ?? (downloadAllBusy ? 'Download in progress' : '')}
          </span>
          {copyError ? (
            <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800" role="status">
              {copyError}
            </p>
          ) : null}
          {downloadStatus ? (
            <p className="mb-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900" role="status">
              {downloadStatus}
            </p>
          ) : null}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-secondary max-w-prose leading-relaxed">
              Hover the <span className="font-semibold text-navy-primary">info</span> icon on each card for a short
              description. Download files one at a time or use Download all for the full pack.
            </p>
            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={downloadAllBusy || Boolean(downloadingDocName)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-yellow px-4 py-2.5 text-xs font-bold text-navy-primary shadow-sm transition hover:bg-yellow-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/35 disabled:cursor-wait disabled:opacity-70"
            >
              <Download size={16} aria-hidden className={downloadAllBusy ? 'animate-pulse' : ''} />
              {downloadAllBusy ? 'Downloading all…' : `Download all (${DOC_ITEMS.length} files)`}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DOC_ITEMS.map((doc) => (
              <SourceDocumentCard
                key={doc.name}
                doc={doc}
                onCopyFilename={copyDocFilename}
                onDownload={handleDownloadDoc}
                isCopying={copiedDocName === doc.name}
                isDownloading={downloadingDocName === doc.name}
              />
            ))}
          </div>
        </AccordionSection>
        </CommentAnchor>

        <div className="space-y-4">
          <CommentAnchor anchorId="edgnex-scoring" label="Go / No-Go scoring" scopeOnly>
          <AccordionSection
            sectionId="edgnex-scoring"
            number="01"
            title="Go / No-Go scoring breakdown"
            defaultExpanded
            onRegisterExpand={bindScoringExpand}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-5 border-b border-border/70 pb-4">
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
                10 criteria · assessment matrix
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-text-secondary max-w-full">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500" /> Positive
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-red-600" /> Penalty / blocker
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-red-400" /> Scored 0
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm border border-dashed border-amber-400 bg-amber-50" /> No option
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm border border-dashed border-sky-400 bg-sky-50" /> Not connected
                </span>
              </div>
            </div>

            <div className="space-y-1.5 min-w-0 overflow-hidden">
              {EDGNEX_GO_NO_GO.map((row) => (
                <GoNoGoRow key={row.id} data={row} commentScope="edgnex-scoring" commentSectionLabel="Scoring" />
              ))}
            </div>

            <div
              className={cn(
                analysisReportCard,
                'mt-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5',
              )}
              aria-label="Go / No-Go total score"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary">Total score</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-navy-primary sm:text-3xl">
                  {EDGNEX_GO_NO_GO_EARNED_POINTS}
                  <span className="text-lg font-semibold text-text-secondary sm:text-xl">
                    {' '}
                    / {EDGNEX_GO_NO_GO_MAX_POINTS} pts
                  </span>
                </p>
              </div>
              <div className="text-sm leading-relaxed text-text-secondary sm:text-right">
                <p>
                  <span className="font-semibold text-red-600">
                    {goNoGoScorePercent(EDGNEX_GO_NO_GO_EARNED_POINTS, EDGNEX_GO_NO_GO_MAX_POINTS)}%
                  </span>{' '}
                  earned vs matrix maximum
                </p>
                <p className="mt-1 text-[11px]">
                  Max achievable{' '}
                  <span className="font-semibold text-navy-primary">
                    {EDGNEX_GO_NO_GO_MAX_ACHIEVABLE_POINTS} / {EDGNEX_GO_NO_GO_MAX_POINTS} pts (
                    {goNoGoScorePercent(EDGNEX_GO_NO_GO_MAX_ACHIEVABLE_POINTS, EDGNEX_GO_NO_GO_MAX_POINTS)}%)
                  </span>{' '}
                  if neutral criteria are resolved
                </p>
              </div>
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
          </CommentAnchor>

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
