import React from 'react';
import { cn } from './ResultPrimitives';

/** Shared typography for long-form report narratives (FIDIC exec summary, fee overview, etc.). */
export function ReportNarrative({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-5 text-sm text-navy-primary leading-relaxed max-w-[85ch]', className)}>{children}</div>
  );
}

export function ReportNarrativeLead({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-navy-primary">{children}</p>;
}

export function ReportNarrativeHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary pt-1">{children}</h4>
  );
}

export function ReportNarrativeList({
  ordered,
  items,
}: {
  ordered?: boolean;
  items: readonly React.ReactNode[];
}) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag
      className={cn(
        'space-y-3 pl-5',
        ordered ? 'list-decimal marker:font-bold marker:text-navy-mid' : 'list-disc marker:text-navy-mid/70',
      )}
    >
      {items.map((item, i) => (
        <li key={i} className="pl-1">
          {item}
        </li>
      ))}
    </Tag>
  );
}

export function ReportNarrativeListItem({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {title ? <span className="font-semibold text-navy-primary">{title} </span> : null}
      <span className="text-text-primary">{children}</span>
    </>
  );
}
