import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { GoNoGoRowData } from '../../types/rfpAssessment';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared surfaces for document-analysis report pages */
export const analysisReportCard =
  'rounded-2xl border border-border/80 bg-white shadow-card ring-1 ring-black/[0.04]';
export const analysisNestedStack =
  'rounded-2xl border border-dashed border-border/70 bg-gradient-to-b from-off-white/60 via-off-white/30 to-transparent p-1.5 space-y-1.5';
export const analysisTableShell =
  'overflow-hidden rounded-xl border border-border/80 bg-white shadow-sm ring-1 ring-black/[0.03]';
export const analysisTableHead = 'bg-gradient-to-b from-surface-grey to-off-white/90';

export const IndicatorCard = ({
  label,
  value,
  subtext,
  alert,
}: {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  alert?: boolean;
}) => (
  <div
    className={cn(
      'flex w-full min-w-0 max-w-full flex-col overflow-hidden p-4 sm:p-5 rounded-2xl border min-h-[108px] justify-center transition-shadow duration-200',
      alert
        ? 'bg-gradient-to-br from-red-50 to-red-50/40 border-red-200/90 shadow-sm'
        : 'bg-white border-border/90 shadow-card hover:shadow-md ring-1 ring-black/[0.03]',
    )}
  >
    <p
      className={cn(
        'mb-1.5 text-[10px] font-bold uppercase leading-snug tracking-wide',
        alert ? 'text-red-800/90' : 'text-text-secondary',
      )}
    >
      {label}
    </p>
    <div
      className={cn(
        'mb-1 min-w-0 max-w-full text-[clamp(1.125rem,2.8vw,1.5rem)] font-bold leading-tight tabular-nums',
        alert ? 'text-red-600' : 'text-navy-primary',
      )}
    >
      {value}
    </div>
    {subtext && (
      <div className={cn('text-xs leading-snug break-words', alert ? 'text-red-700/85' : 'text-text-secondary')}>
        {subtext}
      </div>
    )}
  </div>
);

export type ReferenceInfoListRow = {
  label: string;
  value: React.ReactNode;
  /** Tooltip body (supports newlines). Required together with referenceSource to show the info control. */
  referenceNote?: string;
  referenceSource?: string;
  /** Set false to hide the info icon even if note/source exist */
  showReference?: boolean;
};

/**
 * Vertical “key facts” list: label | value | info icon. Hover/focus shows tooltip; tap/click the icon pins it open until dismissed or click outside.
 */
export const ReferenceInfoList = ({ rows }: { rows: ReferenceInfoListRow[] }) => {
  const [pinnedRow, setPinnedRow] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pinnedRow === null) return;
    const onDocPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!rootRef.current?.contains(t)) setPinnedRow(null);
    };
    document.addEventListener('pointerdown', onDocPointerDown, true);
    return () => document.removeEventListener('pointerdown', onDocPointerDown, true);
  }, [pinnedRow]);

  return (
    <div
      ref={rootRef}
      className="overflow-visible rounded-xl border border-border/80 bg-white shadow-sm ring-1 ring-black/[0.04]"
    >
      {rows.map((row, idx) => {
        const hasRef =
          row.showReference !== false &&
          Boolean(row.referenceNote?.trim()) &&
          Boolean(row.referenceSource?.trim());
        const isPinned = pinnedRow === idx;

        return (
          <div
            key={`${idx}-${row.label}`}
            className="relative flex items-start gap-3 border-b border-border/70 px-4 py-3.5 last:border-b-0 sm:gap-4 sm:px-5 sm:py-4"
          >
            <div className="w-[132px] shrink-0 pt-0.5 text-[11px] font-bold uppercase leading-snug tracking-wide text-text-secondary sm:w-[172px]">
              {row.label}
            </div>
            <div className="min-w-0 flex-1 break-words text-xs leading-relaxed text-navy-primary sm:text-sm">{row.value}</div>
            {hasRef ? (
              <div className="group/kftip relative shrink-0">
                <button
                  type="button"
                  aria-expanded={isPinned}
                  aria-label={`Reference note for ${row.label}. ${isPinned ? 'Expanded' : 'Collapsed'}.`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPinnedRow((cur) => (cur === idx ? null : idx));
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border/90 bg-off-white text-text-secondary shadow-sm transition hover:border-navy-mid/35 hover:bg-surface-grey hover:text-navy-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/30 focus-visible:ring-offset-2"
                >
                  <Info size={14} strokeWidth={2.5} aria-hidden />
                </button>
                <div
                  role="tooltip"
                  className={cn(
                    'absolute bottom-[calc(100%+10px)] right-0 z-[120] w-[min(20rem,calc(100vw-2rem))] shadow-none transition-all duration-200 ease-out',
                    isPinned
                      ? 'visible translate-y-0 opacity-100 pointer-events-auto'
                      : 'invisible translate-y-1 opacity-0 pointer-events-none group-hover/kftip:visible group-hover/kftip:translate-y-0 group-hover/kftip:opacity-100 group-focus-within/kftip:visible group-focus-within/kftip:translate-y-0 group-focus-within/kftip:opacity-100',
                  )}
                >
                  <div className="relative rounded-lg border border-white/15 bg-navy-mid px-4 py-3 pb-3.5 !text-gray-100 text-left shadow-modal ring-1 ring-black/30 [color-scheme:dark]">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow">Reference note</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPinnedRow(null);
                        }}
                        className="shrink-0 rounded-md border border-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/90 hover:bg-white/10"
                      >
                        Close
                      </button>
                    </div>
                    <div className="border-b border-white/20" />
                    <p className="!mt-2 whitespace-pre-line text-xs font-normal !leading-relaxed !text-white">
                      {row.referenceNote}
                    </p>
                    <div className="mt-3 flex items-end justify-between gap-3 border-t border-white/15 pt-2.5">
                      <span className="shrink-0 text-[10px] font-medium text-gray-300">Source:</span>
                      <span className="max-w-[70%] text-right text-[10px] font-semibold italic leading-snug text-yellow">
                        {row.referenceSource}
                      </span>
                    </div>
                    <div
                      className="absolute -bottom-[5px] right-4 h-0 w-0 border-x-[7px] border-x-transparent border-t-[8px] border-t-navy-mid"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-7 shrink-0 sm:w-8" aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
};

/**
 * Citation strip at bottom of a card; hover or keyboard focus shows a panel **above** (not inline).
 */
export const ReferenceHoverFootnote = ({
  citations,
  summary,
  detail,
  heading = 'Reference',
}: {
  citations: string;
  summary: string;
  detail: string;
  heading?: string;
}) => (
  <div
    tabIndex={0}
    className="group/refpop relative z-20 mt-auto overflow-visible border-t border-border/60 pt-3 outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-b-lg"
  >
    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary mb-1.5">{heading}</p>
    <p className="text-[11px] sm:text-xs text-navy-primary leading-snug border-b border-dashed border-navy-primary/35 w-fit max-w-full cursor-default">
      {citations}
    </p>

    <div
      role="tooltip"
      className={cn(
        'pointer-events-none invisible absolute left-0 z-[100] mb-2 w-full max-w-[min(100%,22rem)] -translate-y-1 opacity-0 transition-all duration-200 ease-out',
        'bottom-full',
        'group-hover/refpop:visible group-hover/refpop:translate-y-0 group-hover/refpop:opacity-100',
        'group-focus-within/refpop:visible group-focus-within/refpop:translate-y-0 group-focus-within/refpop:opacity-100',
      )}
    >
      <div className="rounded-xl border border-white/15 bg-navy-mid p-4 !text-gray-100 text-left shadow-modal ring-1 ring-black/25 [color-scheme:dark]">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-yellow">{summary}</p>
        <div className="mt-2 border-b border-white/20" />
        <p className="!mt-2 text-xs font-normal !leading-relaxed !text-white">{detail}</p>
        <div className="mt-3 flex items-end justify-between gap-2 border-t border-white/15 pt-2.5">
          <span className="shrink-0 text-[10px] font-medium text-gray-300">Source:</span>
          <span className="max-w-[70%] text-right text-[10px] font-semibold italic leading-snug text-yellow">
            {citations}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export const AnalysisReportHero = ({
  eyebrow,
  title,
  subtitle,
  generatedLabel,
  benchmarkLine,
  intro,
  leadWord,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  generatedLabel: string;
  benchmarkLine?: string;
  intro: string;
  /** Optional short lead-in (e.g. section label). Omit for a direct narrative opening. */
  leadWord?: string;
  footer?: React.ReactNode;
}) => (
  <header className={cn(analysisReportCard, 'relative overflow-visible p-5 sm:p-6')}>
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-navy-mid via-navy-primary to-yellow"
      aria-hidden
    />
    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-3 mt-1">{eyebrow}</p>
    <h2 className="text-xl sm:text-2xl font-bold text-navy-primary tracking-tight leading-snug">{title}</h2>
    {subtitle && (
      <p className="text-sm text-navy-primary/90 mt-2 font-medium leading-relaxed max-w-prose">{subtitle}</p>
    )}
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-mono text-text-secondary bg-off-white px-2.5 py-1.5 rounded-lg border border-border/80">
        {generatedLabel}
      </span>
      {benchmarkLine && (
        <span className="text-[11px] text-text-secondary px-2 py-1 rounded-lg bg-surface-grey/80 border border-border/60">
          {benchmarkLine}
        </span>
      )}
    </div>
    <div className="mt-5 border-t border-border/70 pt-5">
      <p className="text-sm text-text-primary leading-relaxed max-w-prose">
        {leadWord ? (
          <>
            <span className="font-semibold text-navy-primary">{leadWord}</span>
            <br />
            <br />
          </>
        ) : null}
        {intro}
      </p>
    </div>
    {footer && <div className="mt-5 border-t border-border/70 pt-5">{footer}</div>}
  </header>
);

export const AccordionSection = ({
  title,
  number,
  summaryPill,
  defaultExpanded = false,
  sectionId,
  onRegisterExpand,
  children,
}: {
  title: string;
  number?: string;
  summaryPill?: React.ReactNode;
  defaultExpanded?: boolean;
  /** Anchor id for in-page navigation (scroll-margin applied) */
  sectionId?: string;
  /** When provided, parent can open this accordion (e.g. in-page jump nav). */
  onRegisterExpand?: (expand: () => void) => void | (() => void);
  children?: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const baseId = useId();
  const regionId = `${baseId}-region`;
  const panelFocusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!onRegisterExpand) return;
    return onRegisterExpand(() => setExpanded(true));
  }, [onRegisterExpand]);

  useEffect(() => {
    if (!expanded) return;
    const t = window.setTimeout(() => {
      panelFocusRef.current?.focus({ preventScroll: true });
    }, 320);
    return () => window.clearTimeout(t);
  }, [expanded]);

  return (
    <section
      id={sectionId}
      className="scroll-mt-32 mb-4 rounded-2xl border border-border/80 bg-white shadow-card ring-1 ring-black/[0.03] overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={regionId}
        className="group w-full flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-gradient-to-r hover:from-surface-grey/40 hover:to-transparent transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
          {number && (
            <span className="shrink-0 mt-0.5 sm:mt-0 inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg bg-surface-grey text-text-secondary font-mono text-xs font-bold border border-border/60">
              {number}
            </span>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-navy-primary text-base sm:text-[1.05rem] tracking-tight leading-snug">
              {title}
            </h3>
            {summaryPill && (
              <div className="mt-1.5 hidden sm:block text-left opacity-90">{summaryPill}</div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {summaryPill && <div className="sm:hidden max-w-[140px] truncate text-right">{summaryPill}</div>}
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-off-white/80 text-text-secondary transition-transform duration-200',
              expanded && 'rotate-0',
            )}
          >
            <ChevronDown
              size={18}
              className={cn('transition-transform duration-200', expanded ? 'rotate-0' : '-rotate-90')}
              aria-hidden
            />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={regionId}
            role="region"
            aria-label={title}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              ref={panelFocusRef}
              tabIndex={-1}
              className="border-t border-border/70 bg-gradient-to-b from-off-white/40 via-off-white/25 to-off-white/50 p-4 sm:p-6 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy-mid/20"
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export const CollapsibleSubsection = ({
  title,
  summary,
  defaultOpen = false,
  badge,
  nested = false,
  children,
  anchorId,
  className,
}: {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  nested?: boolean;
  children: React.ReactNode;
  anchorId?: string;
  className?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const regionId = useId();

  return (
    <div
      id={anchorId}
      className={cn(
        'rounded-xl border overflow-hidden mb-3 last:mb-0 transition-shadow duration-200',
        anchorId && 'scroll-mt-32',
        nested
          ? 'bg-white/70 border-border/70 mb-2 shadow-sm hover:shadow'
          : 'bg-white border-border/80 shadow-sm hover:shadow-md ring-1 ring-black/[0.02]',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={regionId}
        className={cn(
          'w-full flex items-start gap-2 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-mid/25 focus-visible:ring-inset',
          nested ? 'p-3 gap-2' : 'gap-3 p-4 sm:p-4',
          open ? 'bg-surface-grey/35' : 'hover:bg-surface-grey/50',
        )}
      >
        <div className="text-navy-mid/70 pt-0.5 shrink-0">
          <ChevronDown
            size={nested ? 14 : 16}
            className={cn('transition-transform duration-200', open ? 'rotate-0' : '-rotate-90')}
            aria-hidden
          />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2 gap-y-1">
            <h4
              className={cn(
                'font-bold text-navy-primary tracking-tight',
                nested ? 'text-xs leading-snug' : 'text-sm sm:text-[0.9375rem]',
              )}
            >
              {title}
            </h4>
            {badge}
          </div>
          {summary && !open && (
            <p
              className={cn(
                'text-text-secondary mt-1.5 line-clamp-2 leading-relaxed',
                nested ? 'text-[10px]' : 'text-[11px] sm:text-xs',
              )}
            >
              {summary}
            </p>
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={regionId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                'border-t border-border/50 text-text-primary leading-relaxed bg-off-white/20',
                nested
                  ? 'px-3 pb-3 pl-9 pr-3 pt-2.5 text-xs'
                  : 'px-4 pb-4 pl-11 pr-4 pt-3.5 text-sm',
              )}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function answerToneClass(answer: string) {
  const a = answer.trim();
  if (/^yes$/i.test(a) || /^option a/i.test(a)) return 'text-green-700';
  if (/not connected/i.test(a)) return 'text-sky-700';
  if (/^no$/i.test(a) || /^not scored/i.test(a) || /^unknown/i.test(a)) return 'text-amber-700';
  if (/blocker|penalty|option b.*bond/i.test(a)) return 'text-red-600';
  return 'text-navy-primary';
}

function resolveGoNoGoInputState(data: GoNoGoRowData) {
  if (data.inputState) return data.inputState;
  return 'scored';
}

/** Full-width faint track behind the scored fill (submission-timeline style). */
function goNoGoFaintTrackClass(data: GoNoGoRowData, isScoredZero: boolean) {
  if (data.isBlocker || isScoredZero) return 'bg-red-100/90';
  if (data.color.includes('green')) return 'bg-green-100/85';
  if (data.color.includes('amber')) return 'bg-amber-100/85';
  if (data.color.includes('red')) return 'bg-red-100/90';
  return 'bg-slate-100/90';
}

export const GoNoGoRow = ({ data }: { data: GoNoGoRowData }) => {
  const [open, setOpen] = useState(false);
  const inputState = resolveGoNoGoInputState(data);
  const isDisconnected = inputState === 'disconnected';
  const isUnselected = inputState === 'unselected';
  const isScoredZero = inputState === 'scored' && !data.isBlocker && data.score === 0;

  const widthPercent =
    data.score > 0 ? (data.score / data.max) * 100 : data.score === 0 ? 0 : 100;

  const scoreLabel = data.isBlocker
    ? '-100 penalty'
    : isDisconnected
      ? 'Not connected'
      : isUnselected
        ? `— / ${data.max}`
        : `${data.score} / ${data.max}`;

  return (
    <div className="mb-2 min-w-0">
      <button
        type="button"
        className={cn(
          'w-full min-w-0 text-left rounded-xl border transition-colors',
          'grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(96px,112px)_24px] sm:gap-x-3 sm:items-center p-3 sm:p-2.5',
          isDisconnected && 'border-dashed border-sky-200/90 bg-sky-50/30',
          isUnselected && 'border-dashed border-amber-200/80 bg-amber-50/20',
          !isDisconnected &&
            !isUnselected &&
            (open
              ? 'bg-surface-grey border-border/60 shadow-sm'
              : 'border-transparent hover:bg-surface-grey/70 hover:border-border/40'),
        )}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="text-xs text-navy-primary font-semibold sm:truncate pr-1 leading-snug">{data.name}</div>

        <div
          className={cn(
            'relative h-2 sm:h-1.5 rounded-full overflow-hidden order-3 sm:order-none min-w-0',
            isDisconnected && 'border border-dashed border-sky-300/70 bg-sky-50/50',
            isUnselected && 'border border-dashed border-amber-300/60 bg-amber-50/30',
          )}
        >
          {data.isBlocker ? (
            <>
              <div className="absolute inset-0 rounded-full bg-red-100/90" aria-hidden />
              <div className="absolute left-0 top-0 bottom-0 w-full rounded-full bg-red-600" />
            </>
          ) : isDisconnected || isUnselected ? null : (
            <>
              <div
                className={cn('absolute inset-0 rounded-full', goNoGoFaintTrackClass(data, isScoredZero))}
                aria-hidden
              />
              {widthPercent > 0 ? (
                <div
                  className={cn(
                    'absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500',
                    data.color,
                  )}
                  style={{ width: `${widthPercent}%` }}
                />
              ) : null}
            </>
          )}
        </div>

        <div className="flex sm:flex-col sm:items-end justify-between sm:text-right items-center gap-2 order-2 sm:order-none min-w-0">
          <div
            className={cn(
              'shrink-0 text-xs font-bold tabular-nums',
              data.isBlocker && 'text-red-600',
              isDisconnected && 'text-sky-700',
              isUnselected && 'text-amber-800/90',
              isScoredZero && 'text-red-600',
              !data.isBlocker &&
                !isDisconnected &&
                !isUnselected &&
                !isScoredZero &&
                data.score > 0 &&
                'text-green-700',
            )}
          >
            {scoreLabel}
          </div>
          <div
            className={cn(
              'min-w-0 text-[10px] leading-snug sm:ml-auto break-words',
              isDisconnected && 'font-medium text-sky-800/90',
              isUnselected && 'italic text-amber-900/75',
              isScoredZero && 'text-red-800/85',
              !isDisconnected && !isUnselected && !isScoredZero && 'text-text-secondary',
            )}
          >
            {data.text}
          </div>
        </div>

        <div className="hidden sm:flex justify-end items-center">
          <ChevronLeft
            size={16}
            className={cn(
              'text-text-secondary/60 transition-transform duration-300',
              open ? '-rotate-90' : 'rotate-0',
            )}
            aria-hidden
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 ml-0 sm:ml-2 md:ml-4 mr-0 sm:mr-2 mb-4 space-y-3">
              <div className="hidden lg:block bg-white border border-border/80 shadow-sm rounded-xl overflow-x-auto ring-1 ring-black/[0.02]">
                <div className="p-4 min-w-[600px]">
                  <div className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 mb-2 pb-2 border-b border-border">
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wide">Question</div>
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wide">Answer</div>
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wide">Notes</div>
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-wide text-right">
                      Reference
                    </div>
                  </div>

                  {data.details.map((itm, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 py-2.5 border-b border-border/60 last:border-0 items-start"
                    >
                      <div className="text-xs text-navy-primary leading-relaxed">{itm.q}</div>
                      <div className={cn('text-xs font-bold', answerToneClass(itm.a))}>{itm.a}</div>
                      <div className="text-xs text-text-secondary leading-relaxed">{itm.notes}</div>
                      <div className="text-xs text-navy-primary font-medium text-right italic leading-relaxed">
                        {itm.ref}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:hidden space-y-3">
                {data.details.map((itm, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border/80 bg-white p-4 text-xs shadow-sm ring-1 ring-black/[0.02]"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide text-text-secondary">Question</p>
                    <p className="mt-1 text-navy-primary leading-relaxed">{itm.q}</p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-text-secondary">Answer</p>
                    <p className={cn('mt-1 font-bold', answerToneClass(itm.a))}>{itm.a}</p>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-text-secondary">Notes</p>
                    <p className="mt-1 text-text-secondary leading-relaxed">{itm.notes}</p>
                    <p className="mt-3 border-t border-border pt-3 text-[10px] font-bold uppercase tracking-wide text-text-secondary">
                      Reference
                    </p>
                    <p className="mt-1 text-navy-primary font-medium italic leading-relaxed">{itm.ref}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
