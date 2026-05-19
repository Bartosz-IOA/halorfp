import { EDGNEX_FIDIC_EXEC_SUMMARY_CONTENT } from '../../data/edgnexFidicContractAnalysis';
import {
  ReportNarrative,
  ReportNarrativeHeading,
  ReportNarrativeLead,
  ReportNarrativeList,
  ReportNarrativeListItem,
} from './ReportNarrative';

export function FidicExecutiveSummary() {
  const c = EDGNEX_FIDIC_EXEC_SUMMARY_CONTENT;

  return (
    <ReportNarrative>
      <ReportNarrativeLead>{c.lead}</ReportNarrativeLead>

      <div>
        <ReportNarrativeHeading>Top exposures</ReportNarrativeHeading>
        <ReportNarrativeList
          ordered
          items={c.topExposures.map((item) => (
            <ReportNarrativeListItem key={item.title} title={item.title}>
              {item.detail}
            </ReportNarrativeListItem>
          ))}
        />
      </div>

      <div>
        <ReportNarrativeHeading>Compounding factors</ReportNarrativeHeading>
        <ReportNarrativeList items={c.compounding} />
      </div>

      <div>
        <ReportNarrativeHeading>Pre-bid negotiation prerequisites</ReportNarrativeHeading>
        <p className="mb-3 text-text-primary">{c.negotiationIntro}</p>
        <ReportNarrativeList
          items={c.negotiationItems.map((text) => (
            <span key={text}>{text}</span>
          ))}
        />
      </div>
    </ReportNarrative>
  );
}
