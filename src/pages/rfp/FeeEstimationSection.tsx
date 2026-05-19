import React from 'react';
import {
  AccordionSection,
  AnalysisReportHero,
  CollapsibleSubsection,
  ReferenceInfoList,
  analysisNestedStack,
  analysisTableHead,
  analysisTableShell,
  cn,
} from '../../components/rfp/ResultPrimitives';
import { useEdgnexSectionExpandBinding } from '../../contexts/EdgnexReportNavContext';
import {
  EDGNEX_FEE_ASSET_1_HEADER,
  EDGNEX_FEE_ASSET_2_HEADER,
  EDGNEX_FEE_ASSET_SUMMARY,
  EDGNEX_FEE_DISCIPLINE_PER_ASSET,
  EDGNEX_FEE_INFERRED_CAPTION,
  EDGNEX_FEE_KEY_ROWS,
  EDGNEX_FEE_SECTION_OVERVIEW,
  EDGNEX_FEE_META,
  EDGNEX_FEE_NOTES,
  EDGNEX_FEE_PORTFOLIO_DISCIPLINES,
  EDGNEX_FEE_PORTFOLIO_SUMMARY_LINE,
} from '../../data/edgnexFeeEstimation';

function DisciplineTable() {
  return (
    <div className={cn('overflow-x-auto', analysisTableShell)}>
      <table className="w-full text-left text-xs min-w-[520px]">
        <thead>
          <tr className={cn(analysisTableHead, 'border-b border-border')}>
            <th className="px-3 py-2.5 font-bold text-text-secondary">Discipline</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary w-20">Share %</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary">Fee (AED)</th>
            <th className="hidden px-3 py-2.5 font-bold text-text-secondary text-right md:table-cell md:w-24">
              Per m²
            </th>
          </tr>
        </thead>
        <tbody>
          {EDGNEX_FEE_DISCIPLINE_PER_ASSET.map((row) => (
            <tr
              key={row.discipline}
              className={
                row.discipline.startsWith('TOTAL')
                  ? 'bg-off-white font-bold border-t-2 border-border'
                  : 'border-b border-border/60 odd:bg-off-white/[0.25] hover:bg-surface-grey/40 transition-colors'
              }
            >
              <td className="px-3 py-2.5 text-navy-primary">{row.discipline}</td>
              <td className="px-3 py-2.5 text-text-secondary tabular-nums">{row.sharePct}</td>
              <td className="px-3 py-2.5 text-navy-primary tabular-nums">{row.feeAed}</td>
              <td className="hidden px-3 py-2.5 text-right text-navy-primary tabular-nums md:table-cell">{row.perM2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AssetSummaryTable() {
  return (
    <div className={cn('overflow-x-auto', analysisTableShell)}>
      <table className="w-full text-left text-xs min-w-[960px]">
        <thead>
          <tr className={cn(analysisTableHead, 'border-b border-border')}>
            <th className="px-3 py-2.5 font-bold text-text-secondary">Asset</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary">Reference typology</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary">Cost Typology (Tier)</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary w-24">GFA (m²)</th>
            <th className="hidden px-3 py-2.5 font-bold text-text-secondary lg:table-cell">Cost/m²</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary">CAPEX</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary">CAPEX Tier</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary w-16">Fee %</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary">Total Design Fee</th>
          </tr>
        </thead>
        <tbody>
          {EDGNEX_FEE_ASSET_SUMMARY.map((row) => (
            <tr
              key={row.asset}
              className={
                row.isPortfolioTotal
                  ? 'bg-off-white font-bold border-t-2 border-border'
                  : 'border-b border-border/60 odd:bg-off-white/[0.25] hover:bg-surface-grey/40 transition-colors'
              }
            >
              <td className="px-3 py-2.5 text-navy-primary tabular-nums whitespace-nowrap">{row.asset}</td>
              <td className="px-3 py-2.5 text-text-secondary">{row.tejTypology || '—'}</td>
              <td className="px-3 py-2.5 text-text-secondary">{row.costTypology || '—'}</td>
              <td className="px-3 py-2.5 text-navy-primary tabular-nums">{row.gfaM2}</td>
              <td className="hidden px-3 py-2.5 text-text-secondary tabular-nums lg:table-cell">{row.costPerM2}</td>
              <td className="px-3 py-2.5 text-navy-primary whitespace-nowrap tabular-nums">{row.capex}</td>
              <td className="px-3 py-2.5 text-text-secondary">{row.capexTier}</td>
              <td className="px-3 py-2.5 text-navy-primary tabular-nums">{row.feePct}</td>
              <td className="px-3 py-2.5 text-navy-primary font-semibold whitespace-nowrap tabular-nums">{row.totalDesignFee}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PortfolioDisciplineTable() {
  return (
    <div className={cn('overflow-x-auto', analysisTableShell)}>
      <table className="w-full text-left text-xs min-w-[720px]">
        <thead>
          <tr className={cn(analysisTableHead, 'border-b border-border')}>
            <th className="px-3 py-2.5 font-bold text-text-secondary">Discipline</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary text-center max-w-[140px]">
              Asset 1
              <br />
              <span className="font-normal text-[10px] text-text-secondary/90">Dhahran Data Center (Site 1)</span>
            </th>
            <th className="px-3 py-2.5 font-bold text-text-secondary text-center max-w-[140px]">
              Asset 2
              <br />
              <span className="font-normal text-[10px] text-text-secondary/90">Dammam Data Center (Site 2)</span>
            </th>
            <th className="px-3 py-2.5 font-bold text-text-secondary">Total Fee</th>
            <th className="px-3 py-2.5 font-bold text-text-secondary text-right w-20 hidden md:table-cell">Per m²</th>
          </tr>
        </thead>
        <tbody>
          {EDGNEX_FEE_PORTFOLIO_DISCIPLINES.map((row) => (
            <tr
              key={row.discipline}
              className={
                row.discipline.startsWith('TOTAL')
                  ? 'bg-off-white font-bold border-t-2 border-border'
                  : 'border-b border-border/60 odd:bg-off-white/[0.25] hover:bg-surface-grey/40 transition-colors'
              }
            >
              <td className="px-3 py-2.5 text-navy-primary">{row.discipline}</td>
              <td className="px-3 py-2.5 text-navy-primary text-center whitespace-nowrap">{row.asset1}</td>
              <td className="px-3 py-2.5 text-navy-primary text-center whitespace-nowrap">{row.asset2}</td>
              <td className="px-3 py-2.5 text-navy-primary whitespace-nowrap">{row.totalFee}</td>
              <td className="px-3 py-2.5 text-right text-navy-primary tabular-nums hidden md:table-cell">{row.perM2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const FeeEstimationSection: React.FC = () => {
  const bindFeeExpand = useEdgnexSectionExpandBinding('edgnex-fee');

  return (
    <AccordionSection
      sectionId="edgnex-fee"
      number="03"
      title="Fee estimation"
      summaryPill={
        <span className="text-[10px] text-text-secondary">
          AED · <strong className="text-navy-primary">2</strong> assets ·{' '}
          <strong className="text-navy-primary">286.6M</strong> total design fee
        </span>
      }
      defaultExpanded={false}
      onRegisterExpand={bindFeeExpand}
    >
      <div className="space-y-6 sm:space-y-8">
        <AnalysisReportHero
          eyebrow="Structured report"
          title={EDGNEX_FEE_META.title}
          subtitle={EDGNEX_FEE_META.projectLine}
          generatedLabel={EDGNEX_FEE_META.generatedLabel}
          intro={EDGNEX_FEE_SECTION_OVERVIEW}
          footer={<ReferenceInfoList rows={EDGNEX_FEE_KEY_ROWS} />}
        />

        <div className={analysisNestedStack}>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] px-3 pt-3 pb-1">
            Fee tables — expand each block as needed
          </p>

          <CollapsibleSubsection
            title="Asset-level summary (AED)"
            defaultOpen
            summary="CAPEX, fee %, and total design fee by asset and portfolio roll-up."
          >
            <AssetSummaryTable />
          </CollapsibleSubsection>

          <CollapsibleSubsection
            title="Per-asset discipline breakdown — Asset 1 (Dhahran)"
            summary={EDGNEX_FEE_ASSET_1_HEADER}
          >
            <p className="text-[11px] text-text-secondary mb-3 leading-relaxed">{EDGNEX_FEE_ASSET_1_HEADER}</p>
            <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5 mb-3">
              {EDGNEX_FEE_INFERRED_CAPTION}
            </p>
            <h4 className="text-xs font-bold text-navy-primary mb-2">Discipline fee table — Asset 1 (Dhahran)</h4>
            <DisciplineTable />
          </CollapsibleSubsection>

          <CollapsibleSubsection
            title="Per-asset discipline breakdown — Asset 2 (Dammam)"
            summary={EDGNEX_FEE_ASSET_2_HEADER}
          >
            <p className="text-[11px] text-text-secondary mb-3 leading-relaxed">{EDGNEX_FEE_ASSET_2_HEADER}</p>
            <p className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5 mb-3">
              {EDGNEX_FEE_INFERRED_CAPTION}
            </p>
            <h4 className="text-xs font-bold text-navy-primary mb-2">Discipline fee table — Asset 2 (Dammam)</h4>
            <DisciplineTable />
          </CollapsibleSubsection>

          <CollapsibleSubsection
            title="Portfolio discipline summary — all assets combined"
            summary={EDGNEX_FEE_PORTFOLIO_SUMMARY_LINE}
          >
            <p className="text-xs text-text-secondary mb-3 leading-relaxed">{EDGNEX_FEE_PORTFOLIO_SUMMARY_LINE}</p>
            <PortfolioDisciplineTable />
          </CollapsibleSubsection>

          <CollapsibleSubsection
            title="Methodology notes"
            summary="FX, CAPEX tiers, discipline coverage, and inferred-value labelling."
          >
            <ol className="list-decimal pl-5 space-y-2 text-xs text-navy-primary leading-relaxed">
              {EDGNEX_FEE_NOTES.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ol>
          </CollapsibleSubsection>
        </div>
      </div>
    </AccordionSection>
  );
};
