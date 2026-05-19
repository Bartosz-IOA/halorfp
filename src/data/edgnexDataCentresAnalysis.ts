import type { ExecSummaryBlock, GoNoGoRowData } from '../types/rfpAssessment';

export const EDGNEX_GENERATED_LABEL = 'Generated 23/06/2024';

export const EDGNEX_EXEC_SUMMARY: ExecSummaryBlock[] = [
  {
    heading: 'Project overview',
    body:
      'Hyperscale / wholesale data centre initiative across two sites (Dhahran and Dammam Tech), requiring localization and calibration of an existing EDGNEX prototype to KSA conditions and compliance with TIA-942 and Uptime Tier III. Multi-site, multi-phase brief with comprehensive documentation and tender support.',
    reference: {
      citations: 'PART 02-DC_DLC_RFP__Services Brief Summary.pdf, p.2–5',
      summary: 'Services brief — project framing',
      detail:
        'Primary scope and site framing for the Dhahran and Dammam Tech programme: hyperscale / wholesale DC, TIA-942 and Uptime Tier III alignment, and programme structure as issued in the RFP pack.',
    },
  },
  {
    heading: 'Scope & deliverables',
    body:
      'Consultant to act as Lead Consultant, AOR, and design consultant. Disciplines include Architecture, Civil, Structural, MEP, Interiors, Landscape, and Special Systems; preparation of IFC and tender documentation; coordination of studies such as FRA, TVRA, geotechnical, security, sustainability (LEED), and Uptime Certification; tender documentation preparation and upload.',
    reference: {
      citations:
        'PART 02-DC_DLC_RFP__Services Brief Summary.pdf, p.15, 17–19, 23; PART 1B- PROPOSAL SCHEDULES.pdf, p.9',
      summary: 'Services brief & proposal schedules',
      detail:
        'Lead consultant and AOR remit, discipline list, IFC and tender deliverables, and studies coordination are set out across the Services Brief and Proposal Schedules at the cited pages.',
    },
  },
  {
    heading: 'Programme summary',
    body:
      'Design period is 3 months with staged submissions (Stage 1 optional; Stages 2–4 and 4T required). Construction period is 14 months. Proposal submission date not stated; email suggests less than two weeks from issuance.',
    reference: {
      citations:
        'PART 02-DC_DLC_RFP__Services Brief Summary.pdf, p.3–4, 14; EMAIL THREAD (1749041467524.txt), p.1',
      summary: 'Programme & bid timing',
      detail:
        'Staged design programme and construction duration are defined in the Services Brief; the email thread records correspondence on how little time may be available to submit after issuance.',
    },
  },
  {
    heading: 'Commercial notes',
    body:
      'Retention: 5% on each payment for Stages 1–4T, released upon last Tender Document issuance. Insurances: PI USD 8,000,000; Workers Compensation per law; Public Liability USD 1,300,000. Liquidated Damages: 0.5% of Contract Value per week of delay. Bonds/Bank Guarantees: Not specified. Payment terms: Not specified.',
    reference: {
      citations: 'Commercial Qualifications - DMM & DAH DC (1).xlsx, p.1',
      summary: 'Commercial qualifications sheet',
      detail:
        'Retention, insurance minimums, and LD basis are tabulated on the commercial qualifications workbook. Bonds and payment terms are not filled in on the extracted sheet.',
    },
  },
  {
    heading: 'Strategic fit',
    body:
      'Specialized hyperscale data centres with stringent technical and certification requirements. Documentation quality is high; however, scope breadth, multi-site coordination, compressed design programme, and commercial exposures elevate delivery risk. Internal scoring indicates low win likelihood and potential delivery strain.',
  },
  {
    heading: 'Recommendation summary',
    body:
      'Decline. Rationale: maximum score potential (40%) below internal threshold, compressed multi-site design programme with significant coordination and certification demands, and commercial exposures (retention, LDs, high PI) without compensating clarity on payment terms or submission timeline.',
  },
];

export const EDGNEX_KEY_FACTS: { label: string; value: string; note: string; ref: string }[] = [
  {
    label: 'Project',
    value: 'EDGNEX Data Centres – Dhahran & Dammam Tech (multi-site, multi-phase)',
    note: 'Hyperscale / wholesale DC; TIA-942 and Uptime Tier III alignment.',
    ref: 'Services Brief Summary.pdf, p.2–5',
  },
  {
    label: 'Client',
    value: 'Damac Properties Co. LLC',
    note: 'Client of record per RFP pack.',
    ref: 'RFP correspondence',
  },
  {
    label: 'Location',
    value: 'Dhahran and Dammam Tech, KSA',
    note: 'Two-site coordination and localization of prototype.',
    ref: 'Services Brief Summary.pdf',
  },
  {
    label: 'Submission',
    value: 'Unknown (email implies < 14 days)',
    note: 'No explicit proposal due date; inhibits approvals, pricing, and resourcing.',
    ref: 'EMAIL THREAD (1749041467524.txt), p.1',
  },
  {
    label: 'Design / construction',
    value: '3 months design · 14 months construction',
    note: 'Stage 1 optional; Stages 2–4 and 4T required.',
    ref: 'Services Brief Summary.pdf, p.3–4, 14',
  },
  {
    label: 'Decision rationale',
    value: 'Low maximum score potential (<50%) and multiple unresolved high/critical risks',
    note: 'Current score 30/300 (10%); max achievable 120/300 (40%).',
    ref: 'Assessment.xlsx',
  },
];

export const EDGNEX_GO_NO_GO: GoNoGoRowData[] = [
  {
    id: '1',
    name: 'Client or design partner',
    score: 0,
    max: 30,
    text: 'No data connected',
    color: 'bg-slate-300',
    inputState: 'disconnected',
    details: [
      {
        q: 'How is the client / design partner relationship scored?',
        a: 'Not connected',
        notes: 'CRM / relationship data stream is not configured for this workspace yet.',
        ref: '—',
      },
    ],
  },
  {
    id: '2',
    name: 'Scope',
    score: 30,
    max: 30,
    text: 'A — Lead design consultancy & AOR',
    color: 'bg-green-500',
    details: [
      {
        q: 'What scope tier is indicated?',
        a: 'Option A',
        notes: 'RFP states consultant will act as lead consultant and AOR across the stated disciplines.',
        ref: 'PART 02-DC_DLC_RFP__Services Brief Summary.pdf, p.15',
      },
    ],
  },
  {
    id: '3',
    name: 'Project type',
    score: 20,
    max: 30,
    text: 'B — Commercial, public, cultural',
    color: 'bg-amber-500',
    details: [
      {
        q: 'Primary typology',
        a: 'Option B',
        notes: 'Hyperscale / wholesale data centre programme.',
        ref: 'Services Brief Summary.pdf, p.2–5',
      },
    ],
  },
  {
    id: '4',
    name: 'Stages',
    score: 20,
    max: 30,
    text: 'B — Design or site',
    color: 'bg-amber-500',
    details: [
      {
        q: 'Which delivery stages apply?',
        a: 'Option B',
        notes: 'Includes Concept and Developed Design among staged submissions.',
        ref: 'Services Brief Summary.pdf, p.3–4',
      },
    ],
  },
  {
    id: '5',
    name: 'Programme',
    score: 0,
    max: 30,
    text: '— No option selected',
    color: 'bg-slate-400',
    inputState: 'unselected',
    details: [
      {
        q: 'Is the programme assessed as realistic?',
        a: 'Unknown',
        notes: 'No information to confirm realism of timeline versus scope.',
        ref: 'Assessment.xlsx',
      },
    ],
  },
  {
    id: '6',
    name: 'Resource capacity',
    score: 0,
    max: 30,
    text: 'No data connected',
    color: 'bg-slate-300',
    inputState: 'disconnected',
    details: [
      {
        q: 'Is capacity evidenced?',
        a: 'Not connected',
        notes: 'Resourcing / capacity API is not connected for this assessment build.',
        ref: '—',
      },
    ],
  },
  {
    id: '7',
    name: 'Quality of the RFP',
    score: 30,
    max: 30,
    text: 'A — Excellent level of information',
    color: 'bg-green-500',
    details: [
      {
        q: 'Documentation quality',
        a: 'Option A',
        notes: 'Detailed and comprehensive RFP documentation.',
        ref: 'Services Brief Summary.pdf',
      },
    ],
  },
  {
    id: '8',
    name: 'Prior knowledge of the RFP',
    score: 30,
    max: 30,
    text: 'A — Yes',
    color: 'bg-green-500',
    details: [
      {
        q: 'Prior exposure?',
        a: 'Yes',
        notes: 'Prior knowledge through NDA and previous discussions.',
        ref: 'Correspondence / NDA',
      },
    ],
  },
  {
    id: '9',
    name: 'Tender bonds, retention, bank guarantees',
    score: -100,
    max: 30,
    text: 'B — Bonds / retention / guarantees required',
    color: 'bg-red-500',
    isBlocker: true,
    details: [
      {
        q: 'Commercial security exposure',
        a: 'Option B (penalty)',
        notes: '5% retention on payments for Stages 1–4T; significant commercial drag.',
        ref: 'Commercial Qualifications - DMM & DAH DC (1).xlsx, p.1',
      },
    ],
  },
  {
    id: '10',
    name: 'Submission timeline',
    score: 0,
    max: 30,
    text: 'B — Fee proposal due in < two weeks',
    color: 'bg-red-400',
    inputState: 'scored',
    details: [
      {
        q: 'Bid period',
        a: 'Option B',
        notes: 'Compressed timeline (~one week) implied from correspondence.',
        ref: 'EMAIL THREAD (1749041467524.txt), p.1',
      },
    ],
  },
];

export const EDGNEX_GO_NO_GO_MAX_POINTS = EDGNEX_GO_NO_GO.reduce((sum, row) => sum + row.max, 0);
export const EDGNEX_GO_NO_GO_EARNED_POINTS = EDGNEX_GO_NO_GO.reduce((sum, row) => sum + row.score, 0);
/** Upper bound if neutral / disconnected criteria are resolved favourably (per Assessment.xlsx). */
export const EDGNEX_GO_NO_GO_MAX_ACHIEVABLE_POINTS = 120;

export function goNoGoScorePercent(earned: number, max: number): number {
  if (max <= 0) return 0;
  return Math.round((earned / max) * 1000) / 10;
}

/** Grouped follow-ups aligned to page sections: sequencing vs checklist. */
export type EdgnexNextStepsSectionBlock = {
  id: string;
  title: string;
  /** In-page anchor (matches `sectionId` on accordions / overview). */
  anchorId: string;
  nextSteps: string[];
  actionItems: string[];
};

export const EDGNEX_NEXT_STEPS_BY_SECTION: EdgnexNextStepsSectionBlock[] = [
  {
    id: 'overview',
    title: 'Overview & decision',
    anchorId: 'edgnex-overview',
    nextSteps: [
      'Align partner leadership on Decline vs any conditional proceed path before further client-facing effort.',
      'If participation is reconsidered, rebuild a week-level resourcing view with named discipline leads.',
    ],
    actionItems: [
      'Obtain formal proposal due date and clarification deadline; request at least a 2-week bid period if proceeding.',
      'Decide on formal decline and notify the client, citing programme and commercial constraints.',
    ],
  },
  {
    id: 'sources',
    title: 'Sources & clarifications',
    anchorId: 'edgnex-sources',
    nextSteps: [
      'Make BIM, approvals pathway, and programme assumptions auditable against the issued pack before any resubmission.',
    ],
    actionItems: [
      'Clarify building count, site phasing, and whether both sites run concurrently.',
      'Request BIM/CDE standards, LOD/LOI targets, file formats, and data exchange protocols.',
      'Confirm authority approval matrix, NOC list, and target timelines.',
    ],
  },
  {
    id: 'scoring',
    title: 'Go / No-Go & commercial',
    anchorId: 'edgnex-scoring',
    nextSteps: [
      'Stress-test payment security, retention, and specialist interfaces against the No-Go rationale before reversing posture.',
    ],
    actionItems: [
      'Seek confirmation on bonds/bank guarantees; request payment milestones and terms.',
      'Define interfaces and scope split for specialist studies (FRA, TVRA, Uptime, sustainability), and who leads certification.',
      'Assess internal resourcing for multi-site coordination if reconsidering.',
    ],
  },
  {
    id: 'fidic',
    title: 'Contract (FIDIC review)',
    anchorId: 'edgnex-fidic',
    nextSteps: [
      'Treat contract gaps as pre-bid negotiation topics only if leadership shifts from Decline; do not price unresolved exposures.',
    ],
    actionItems: [
      'Request a limitation of liability cap aligned to fee and PI cover.',
      'Negotiate AOR assumption for third-party designs: paid review period, Employer indemnity, and acceptance record.',
      'Cap and qualify delay penalties; remove one-sided deduction language; add a dispute resolution clause.',
      'Reconcile LD calculation basis (contract value vs stage remuneration) in writing.',
    ],
  },
  {
    id: 'fee',
    title: 'Fee model',
    anchorId: 'edgnex-fee',
    nextSteps: [
      'Re-run the fee model whenever GFA, CAPEX tiers, or currency assumptions change.',
    ],
    actionItems: [
      'Reconcile portfolio GFA and CAPEX tiers with any updated Services Brief figures.',
      'Confirm AED/USD conversion policy and document discipline exclusions or extended consultant lines.',
    ],
  },
];

export const EDGNEX_NEXT_STEPS_ITEM_COUNT = EDGNEX_NEXT_STEPS_BY_SECTION.reduce(
  (n, s) => n + s.nextSteps.length + s.actionItems.length,
  0,
);
