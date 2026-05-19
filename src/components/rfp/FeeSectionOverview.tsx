import { EDGNEX_FEE_SECTION_OVERVIEW } from '../../data/edgnexFeeEstimation';
import {
  ReportNarrative,
  ReportNarrativeHeading,
  ReportNarrativeLead,
  ReportNarrativeList,
} from './ReportNarrative';

export function FeeSectionOverview() {
  const o = EDGNEX_FEE_SECTION_OVERVIEW;

  return (
    <ReportNarrative>
      <ReportNarrativeLead>{o.purpose}</ReportNarrativeLead>
      <div>
        <ReportNarrativeHeading>How the model is built</ReportNarrativeHeading>
        <ReportNarrativeList ordered items={o.steps} />
      </div>
      <p className="text-text-primary">{o.usage}</p>
    </ReportNarrative>
  );
}
