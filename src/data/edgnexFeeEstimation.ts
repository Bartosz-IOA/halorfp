/** Portfolio roll-up from the fee model (both sites). */
export const EDGNEX_FEE_PORTFOLIO_DESIGN_FEE = 'AED 286,627,000';

export const EDGNEX_FEE_META = {
  title: 'Fee Estimation',
  projectLine: 'Dhahran & Dammam Tech Data Center',
  generatedLabel: 'Generated 13/05/2026',
} as const;

/** Structured opening under the fee report hero. */
export const EDGNEX_FEE_SECTION_OVERVIEW = {
  purpose:
    'This section turns the RFP scope into indicative design-fee levels for the two data centre assets.',
  steps: [
    'Roll construction cost density into CAPEX per asset.',
    'Apply tier-based design-fee percentages to each CAPEX band.',
    'Split results by discipline for asset-level and portfolio comparison.',
  ],
  usage:
    'Use the tables below to sanity-check assumptions against the scoring narrative and to see where FX, GFA, or typology would move the numbers.',
} as const;

export const EDGNEX_FEE_KEY_ROWS: {
  label: string;
  value: string;
  referenceNote: string;
  referenceSource: string;
}[] = [
  {
    label: 'Project',
    value: 'Dhahran & Dammam Tech Data Center',
    referenceNote:
      'Project title and dual-site data centre programme framing as used for this fee estimate.',
    referenceSource: 'PART 02-DC_DLC_RFP__Services Brief Summary.pdf',
  },
  {
    label: 'Client',
    value: 'Damac Properties Co. LLC',
    referenceNote: 'Employer of record as stated in the issued RFP and commercial documentation.',
    referenceSource: 'RFP pack & Commercial Qualifications',
  },
  {
    label: 'Location',
    value: 'Dhahran & Dammam, Saudi Arabia',
    referenceNote: 'Geographic scope of the two-plot programme reflected in the model.',
    referenceSource: 'Services Brief Summary.pdf',
  },
  {
    label: 'Portfolio GFA',
    value: '100,000 m²',
    referenceNote: 'Combined GFA assumed as 50,000 m² per plot for both Dhahran and Dammam assets.',
    referenceSource: 'Fee model assumptions',
  },
  {
    label: 'Total design fee',
    value: 'AED 286,627,000',
    referenceNote:
      'Portfolio total after per-asset CAPEX and tier-based design fee percentages, before extended consultant lines.',
    referenceSource: 'Fee model portfolio roll-up',
  },
  {
    label: 'Methodology',
    value: 'Three-step model: CAPEX → design fee % → discipline split (AED).',
    referenceNote:
      'Construction cost density is taken from Fee_Generator master costs (USD) and converted at 3.67 AED/USD; fee % follows CAPEX tier bands.',
    referenceSource: 'Fee_Generator_Rev00.xlsx — Master Con Cost',
  },
];

export type FeeAssetSummaryRow = {
  asset: string;
  tejTypology: string;
  costTypology: string;
  gfaM2: string;
  costPerM2: string;
  capex: string;
  capexTier: string;
  feePct: string;
  totalDesignFee: string;
  isPortfolioTotal?: boolean;
};

export const EDGNEX_FEE_ASSET_SUMMARY: FeeAssetSummaryRow[] = [
  {
    asset: 'Dhahran Data Center (Site 1)',
    tejTypology: 'Commercial Office',
    costTypology: 'Data Centre (Large ≤10,000m²) (High)',
    gfaM2: '50,000',
    costPerM2: 'AED 52,114',
    capex: 'AED 2,605,700,000',
    capexTier: '500M+ AED',
    feePct: '5.5%',
    totalDesignFee: 'AED 143,313,500',
  },
  {
    asset: 'Dammam Data Center (Site 2)',
    tejTypology: 'Commercial Office',
    costTypology: 'Data Centre (Large ≤10,000m²) (High)',
    gfaM2: '50,000',
    costPerM2: 'AED 52,114',
    capex: 'AED 2,605,700,000',
    capexTier: '500M+ AED',
    feePct: '5.5%',
    totalDesignFee: 'AED 143,313,500',
  },
  {
    asset: 'PORTFOLIO TOTAL',
    tejTypology: '',
    costTypology: '',
    gfaM2: '100,000',
    costPerM2: '—',
    capex: 'AED 5,211,400,000',
    capexTier: '—',
    feePct: '5.5%',
    totalDesignFee: 'AED 286,627,000',
    isPortfolioTotal: true,
  },
];

export type FeeDisciplineRow = {
  discipline: string;
  sharePct: string;
  feeAed: string;
  perM2: string;
};

/** Per-asset discipline split (identical for Site 1 and Site 2). */
export const EDGNEX_FEE_DISCIPLINE_PER_ASSET: FeeDisciplineRow[] = [
  { discipline: 'Project Management', sharePct: '3.0%', feeAed: 'AED 4,299,405', perM2: '85.99' },
  { discipline: 'Design Mgmt / BIM', sharePct: '4.0%', feeAed: 'AED 5,732,540', perM2: '114.65' },
  { discipline: 'Architecture', sharePct: '19.0%', feeAed: 'AED 27,229,565', perM2: '544.59' },
  { discipline: 'Architecture Dev', sharePct: '14.0%', feeAed: 'AED 20,063,890', perM2: '401.28' },
  { discipline: 'Interior Design', sharePct: '3.0%', feeAed: 'AED 4,299,405', perM2: '85.99' },
  { discipline: 'Landscape', sharePct: '2.0%', feeAed: 'AED 2,866,270', perM2: '57.33' },
  { discipline: 'MEP', sharePct: '22.0%', feeAed: 'AED 31,528,970', perM2: '630.58' },
  { discipline: 'Structures', sharePct: '12.0%', feeAed: 'AED 17,197,620', perM2: '343.95' },
  { discipline: 'Façade Engineering', sharePct: '5.0%', feeAed: 'AED 7,165,675', perM2: '143.31' },
  { discipline: 'Sustainability / Energy', sharePct: '2.5%', feeAed: 'AED 3,582,838', perM2: '71.66' },
  { discipline: 'Infrastructure / Civil', sharePct: '2.0%', feeAed: 'AED 2,866,270', perM2: '57.33' },
  { discipline: 'Authority Liaison (AOR)', sharePct: '3.0%', feeAed: 'AED 4,299,405', perM2: '85.99' },
  { discipline: 'Cost Consultant / QS', sharePct: '2.0%', feeAed: 'AED 2,866,270', perM2: '57.33' },
  { discipline: 'TOTAL (13 core disciplines)', sharePct: '93.5%', feeAed: 'AED 133,998,123', perM2: '2679.96' },
];

export type FeePortfolioDisciplineRow = {
  discipline: string;
  asset1: string;
  asset2: string;
  totalFee: string;
  perM2: string;
};

export const EDGNEX_FEE_PORTFOLIO_DISCIPLINES: FeePortfolioDisciplineRow[] = [
  {
    discipline: 'Project Management',
    asset1: 'AED 4,299,405',
    asset2: 'AED 4,299,405',
    totalFee: 'AED 8,598,810',
    perM2: '85.99',
  },
  {
    discipline: 'Design Mgmt / BIM',
    asset1: 'AED 5,732,540',
    asset2: 'AED 5,732,540',
    totalFee: 'AED 11,465,080',
    perM2: '114.65',
  },
  {
    discipline: 'Architecture',
    asset1: 'AED 27,229,565',
    asset2: 'AED 27,229,565',
    totalFee: 'AED 54,459,130',
    perM2: '544.59',
  },
  {
    discipline: 'Architecture Dev',
    asset1: 'AED 20,063,890',
    asset2: 'AED 20,063,890',
    totalFee: 'AED 40,127,780',
    perM2: '401.28',
  },
  {
    discipline: 'Interior Design',
    asset1: 'AED 4,299,405',
    asset2: 'AED 4,299,405',
    totalFee: 'AED 8,598,810',
    perM2: '85.99',
  },
  {
    discipline: 'Landscape',
    asset1: 'AED 2,866,270',
    asset2: 'AED 2,866,270',
    totalFee: 'AED 5,732,540',
    perM2: '57.33',
  },
  {
    discipline: 'MEP',
    asset1: 'AED 31,528,970',
    asset2: 'AED 31,528,970',
    totalFee: 'AED 63,057,940',
    perM2: '630.58',
  },
  {
    discipline: 'Structures',
    asset1: 'AED 17,197,620',
    asset2: 'AED 17,197,620',
    totalFee: 'AED 34,395,240',
    perM2: '343.95',
  },
  {
    discipline: 'Façade Engineering',
    asset1: 'AED 7,165,675',
    asset2: 'AED 7,165,675',
    totalFee: 'AED 14,331,350',
    perM2: '143.31',
  },
  {
    discipline: 'Sustainability / Energy',
    asset1: 'AED 3,582,838',
    asset2: 'AED 3,582,838',
    totalFee: 'AED 7,165,675',
    perM2: '71.66',
  },
  {
    discipline: 'Infrastructure / Civil',
    asset1: 'AED 2,866,270',
    asset2: 'AED 2,866,270',
    totalFee: 'AED 5,732,540',
    perM2: '57.33',
  },
  {
    discipline: 'Authority Liaison (AOR)',
    asset1: 'AED 4,299,405',
    asset2: 'AED 4,299,405',
    totalFee: 'AED 8,598,810',
    perM2: '85.99',
  },
  {
    discipline: 'Cost Consultant / QS',
    asset1: 'AED 2,866,270',
    asset2: 'AED 2,866,270',
    totalFee: 'AED 5,732,540',
    perM2: '57.33',
  },
  {
    discipline: 'TOTAL (13 core disciplines)',
    asset1: 'AED 133,998,123',
    asset2: 'AED 133,998,123',
    totalFee: 'AED 267,996,245',
    perM2: '2679.96',
  },
];

export const EDGNEX_FEE_NOTES: string[] = [
  'Cost/m² values come from Fee_Generator_Rev00.xlsx → Master Con Cost (USD × 3.6700 AED/USD).',
  'Design Fee % is applied per asset based on its individual CAPEX tier (less than 200M / 200-500M / 500M+).',
  'The 13 disciplines may not sum to 100% by design — extended consultant list is intentionally excluded at this stage.',
  'Rows marked inferred use RFP context where the pack does not state a value explicitly.',
];

export const EDGNEX_FEE_ASSET_1_HEADER =
  'ASSET 1: Dhahran Data Center (Site 1) — Commercial Office | 50,000 m² | CAPEX AED 2,605,700,000 | Fee 5.5% = AED 143,313,500';

export const EDGNEX_FEE_ASSET_2_HEADER =
  'ASSET 2: Dammam Data Center (Site 2) — Commercial Office | 50,000 m² | CAPEX AED 2,605,700,000 | Fee 5.5% = AED 143,313,500';

export const EDGNEX_FEE_INFERRED_CAPTION =
  'GFA inferred · Reference typology inferred · Cost typology inferred';

export const EDGNEX_FEE_PORTFOLIO_SUMMARY_LINE =
  'Aggregated fee breakdown across all 2 assets | Portfolio GFA: 100,000 m² | Total Design Fee: AED 286,627,000';
