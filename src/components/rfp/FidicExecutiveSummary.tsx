import { EDGNEX_FIDIC_EXEC_SUMMARY_CONTENT } from '../../data/edgnexFidicContractAnalysis';
import { ReportNarrative, ReportNarrativeLead } from './ReportNarrative';

export function FidicExecutiveSummary() {
  const { paragraphs } = EDGNEX_FIDIC_EXEC_SUMMARY_CONTENT;

  return (
    <ReportNarrative className="space-y-4">
      {paragraphs.map((text, index) =>
        index === 0 ? (
          <ReportNarrativeLead key={index}>{text}</ReportNarrativeLead>
        ) : (
          <p key={index} className="text-text-primary leading-relaxed">
            {text}
          </p>
        ),
      )}
    </ReportNarrative>
  );
}
