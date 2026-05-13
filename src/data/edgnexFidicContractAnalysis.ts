export const EDGNEX_FIDIC_META = {
  title: 'Contract Analysis (FIDIC Risk Review)',
  projectLine: 'Dhahran & Dammam Data Center Project — Lead Consultant DATACENTER-2025',
  generatedLabel: 'Generated 13/05/2026',
} as const;

export const EDGNEX_FIDIC_INTRO =
  'This review benchmarks the supplied contract against the FIDIC White Book 2017. It summarises contract metadata, top risk items, clause-by-clause comparison, missing protections, and drafting issues identified in the retrieved documents.';

export const EDGNEX_FIDIC_EXEC_SUMMARY = `This RFP document set for the EDGNEX/DAMAC Dhahran and Dammam Data Center Lead Consultancy presents a contract risk profile that DSA Architects must rate as Critical before proceeding to bid. The four most dangerous exposures are: (1) the complete absence of a limitation of liability cap across all retrieved documents, leaving DSA with unlimited exposure on a 50-200 MW hyperscale facility; (2) the requirement under Section 2.1.7.1(d) for DSA to assume AOR liability for all third-party designs without a paid review period or Employer indemnity — a provision that is likely uninsurable under standard PI terms; (3) uncapped delay penalties deducted 'notwithstanding any objections' under Section 9.3H, combined with an Employer discretion to deduct for design deficiencies with no process or cap; and (4) the complete absence of a dispute resolution clause, meaning DSA has no contractual mechanism to challenge deductions, recover withheld payments or resolve disagreements short of litigation. Compounding these structural risks are a material LD basis inconsistency between the Commercial T&Cs and Section 9.3H, an open-ended scope against a fixed lump sum, and the surrender of DSA's proposal IP to DAMAC unconditionally. DSA should not submit a proposal unless DAMAC agrees in pre-bid negotiations to: insert a liability cap, remove the third-party AOR liability assumption, cap and qualify the delay penalty regime, insert a dispute resolution clause, and clarify the LD calculation basis.`;

export const EDGNEX_FIDIC_OVERALL_RATING = 'CRITICAL' as const;

export const EDGNEX_FIDIC_CONTRACT_DETAILS: { label: string; value: string }[] = [
  { label: 'Client', value: 'DAMAC Properties Co. LLC / EDGNEX Data Centres by DAMAC' },
  {
    label: 'Consultant',
    value: 'To Be Confirmed — DSA Architects (prospective bidder)',
  },
  {
    label: 'Project',
    value: 'Dhahran & Dammam Data Center Project — Lead Consultant DATACENTER-2025',
  },
  {
    label: 'Governing Law',
    value:
      'NOT STATED IN RETRIEVED CONTRACT DOCUMENTS — no governing law clause found across all 12 retrieval queries',
  },
  {
    label: 'Jurisdiction',
    value:
      'NOT STATED IN RETRIEVED CONTRACT DOCUMENTS — project sites in Dhahran and Dammam, Kingdom of Saudi Arabia; Employer entity registered in UAE',
  },
  {
    label: 'Contract Type',
    value:
      'Lead Design Consultancy — multi-stage design, documentation, tender support and contract administration services',
  },
  { label: 'Currency', value: 'USD' },
];

export type FidicSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export type FidicTopRiskRow = {
  rank: number;
  title: string;
  description: string;
  clause: string;
  severity: FidicSeverity;
  dsaPosition: string;
};

export const EDGNEX_FIDIC_TOP_RISKS: FidicTopRiskRow[] = [
  {
    rank: 1,
    title: 'No Limitation of Liability Cap — Entire Contract',
    description:
      "No limitation of liability clause was found across all 12 retrieval queries covering the full RFP document set. DSA faces unlimited liability for professional negligence, design defects, delay and third-party claims with no contractual ceiling. On a hyperscale data centre project with IT loads of 50-200 MW, a single design error could result in claims vastly exceeding DSA's fee and PI insurance limits.",
    clause: 'MISSING — not found in any retrieved document',
    severity: 'CRITICAL',
    dsaPosition:
      "DSA must insist on a liability cap equal to the total Remuneration or the PI insurance limit (USD 8M), whichever is lower, for all claims arising from the Services. Consequential and indirect losses must be expressly excluded.",
  },
  {
    rank: 2,
    title: 'AOR Assumption of Third-Party Design Liability Without Indemnity',
    description:
      'DSA is required to assume full AOR responsibility for designs produced by predecessor or parallel consultants — including structural, Civil Defence, security and planning compliance — without a paid review period, without an Employer indemnity for pre-existing defects, and without any carve-out for latent defects. This is commercially uninsurable under standard PI policy terms.',
    clause:
      'Section 2.1.7.1(d) — PART 02-DC_DLC_RFP__Services Brief Summary.pdf, p.23',
    severity: 'CRITICAL',
    dsaPosition:
      'DSA requires: (a) a paid design review period before assuming AOR; (b) an Employer indemnity for pre-existing third-party design defects; and (c) a written record of all designs accepted \'as-is\' at the point of AOR assumption.',
  },
  {
    rank: 3,
    title: "Uncapped Delay Penalties Deducted Notwithstanding Objections",
    description:
      "Delay penalties of 0.5% per week per stage are imposed with no aggregate cap and are deducted 'notwithstanding any objections by the Consultant.' On a 5-stage contract with compressed timelines and multiple Employer approval gateways, cumulative penalties could exceed the total fee. The 'notwithstanding objections' language removes DSA's right to dispute deductions.",
    clause: 'Section 9.3 H — PART 1B-PROPOSAL SCHEDULES.pdf, p.13',
    severity: 'CRITICAL',
    dsaPosition:
      "DSA requires: (a) an aggregate cap on delay penalties of 10% of total Remuneration; (b) exclusion of delays caused by Employer approvals, third-party consultants or force majeure; and (c) removal of the 'notwithstanding any objections' language.",
  },
  {
    rank: 4,
    title: 'Employer Discretion to Deduct for Design Deficiencies — No Process, No Cap',
    description:
      "The Employer may deduct costs for 'omission, deficiency or inadequate or incomplete design detailing' at its sole discretion, with no defined process, no cap, no cure period and no right of objection. This creates a unilateral fee reduction mechanism that could be triggered by any post-contract variation, regardless of whether DSA was at fault.",
    clause: 'Section 9.3 H — PART 1B-PROPOSAL SCHEDULES.pdf, p.13',
    severity: 'CRITICAL',
    dsaPosition:
      'DSA requires: (a) a written notice and 14-day cure period before any deduction; (b) a cap on aggregate deductions; and (c) a right to dispute deductions through the contract\'s dispute resolution mechanism.',
  },
  {
    rank: 5,
    title: 'LD Basis Inconsistency — Contract Value vs Portion of Remuneration',
    description:
      "The Commercial T&Cs specify LD at 0.5% of 'Contract Value' per week while Section 9.3H specifies 0.5% of the 'portion of the Remuneration' per stage. These are materially different bases. DAMAC will apply the higher Contract Value basis; DSA will argue the lower stage-based basis. This ambiguity must be resolved before contract execution.",
    clause:
      'Commercial Qualifications-DMM&DAH DC (1).xlsx vs Section 9.3H — PART 1B-PROPOSAL SCHEDULES.pdf, p.13',
    severity: 'HIGH',
    dsaPosition:
      'DSA requires the LD basis to be confirmed as 0.5% of the stage-specific Remuneration portion per week, with an aggregate cap, and the Contract Value basis to be expressly deleted.',
  },
  {
    rank: 6,
    title: 'No Compensation for Omitted Optional Services Including One Plot Suspension',
    description:
      'The Employer may omit any or all Optional Services and appoint third parties, with DSA expressly excluded from any loss of revenue, loss of profit or consequential loss compensation. The RFP explicitly contemplates one of the two plots being suspended. DSA must price both plots in its lump sum but may receive fee for only one.',
    clause: 'Section 2.1.1(b) and (c) — PART 02-DC_DLC_RFP__Services Brief Summary.pdf, p.15',
    severity: 'HIGH',
    dsaPosition:
      'DSA requires compensation for sunk costs and a reasonable overhead/profit contribution on omitted services, and must price the two-plot scenario with explicit fee provisions for each plot as separate line items.',
  },
  {
    rank: 7,
    title: 'Broad Pre-Contract Indemnity Covering DAMAC Affiliates',
    description:
      'DSA is required to indemnify DAMAC and all its affiliates, officers, directors, agents and employees for all losses arising from ProTender use. The indemnity is uncapped, covers the entire DAMAC corporate group, and is triggered by submission of the proposal — before any fee has been earned.',
    clause: 'Section 4.23 — PART 1A-TENDER INSTRUCTIONS.pdf, p.15',
    severity: 'HIGH',
    dsaPosition:
      "DSA requires the indemnity to be limited to direct losses caused by DSA's own negligent misuse of the ProTender platform, with a cap equal to DSA's proposal preparation costs, and with the indemnity not surviving contract execution.",
  },
  {
    rank: 8,
    title: "Payment at Employer's Sole Discretion — No Enforceable Payment Timeline",
    description:
      "Interim payments are at the 'sole discretion of the Employer' with no defined payment period. The Commercial T&Cs reference 30-day bank transfer but this is not a binding contractual obligation. Combined with 5% retention held until final tender documents, DSA's cash flow is entirely dependent on DAMAC's goodwill.",
    clause: 'Section 9 — PART 1B-PROPOSAL SCHEDULES.pdf, p.12',
    severity: 'HIGH',
    dsaPosition:
      'DSA requires a binding 30-day payment obligation from invoice receipt, interest on late payments, and a defined process for disputed invoices that does not permit DAMAC to withhold undisputed amounts.',
  },
  {
    rank: 9,
    title: 'IP Rights in Proposals Surrendered to Employer Without Compensation',
    description:
      "DSA's proposal IP — including data centre design concepts, BIM methodologies and technical solutions — is surrendered to DAMAC unconditionally upon submission. DAMAC can use this IP to brief competitors or build the project without awarding DSA the contract. No contract-stage IP clause was found in the retrieved documents.",
    clause: 'Section 4.18 — PART 1A-TENDER INSTRUCTIONS.pdf, p.14',
    severity: 'HIGH',
    dsaPosition:
      'DSA requires a reciprocal confidentiality obligation on DAMAC, a licence-only grant for evaluation purposes, and a contract-stage IP clause confirming DSA retains copyright in all deliverables with a project-specific licence granted to DAMAC.',
  },
  {
    rank: 10,
    title: 'Open-Ended Scope Against Fixed Lump Sum — No Variation Mechanism',
    description:
      "The Services Brief states the scope is 'not limited to' the 50-item checklist, while the fee is a fixed lump sum that 'will not be permitted to exceed' without written Employer approval. There is no defined variation mechanism, no trigger for use of the hourly rates in Section 9.2C, and no right to additional fee for Employer-instructed scope additions.",
    clause:
      'Section 2.2 — PART 1A-TENDER INSTRUCTIONS.pdf, p.7 and Section 2.1.4 — PART 02-DC_DLC_RFP__Services Brief Summary.pdf, p.17',
    severity: 'HIGH',
    dsaPosition:
      "DSA requires: (a) a defined scope boundary; (b) a contractual variation mechanism with automatic entitlement to additional fee for Employer-instructed scope additions; and (c) the 'not limited to' language to be deleted or replaced with a defined list of included services.",
  },
];

export type FidicClauseRow = {
  clauseRef: string;
  topic: string;
  original: string;
  fidicPosition: string;
  severity: FidicSeverity;
  riskCategory: string;
  proposedAmendment: string;
  rationale: string;
};

export const EDGNEX_FIDIC_CLAUSE_ROWS: FidicClauseRow[] = [
  {
    clauseRef: 'Section 2.1.7.1(d) — PART 02-DC_DLC_RFP__Services Brief Summary.pdf, p.23',
    topic: 'Consultant General Responsibilities — AOR Assumption of Third-Party Design Liability',
    original:
      'The Consultant, is to take the responsibility of the design produced by other consultant, including but are not limited to structural design, compliance to Local requirements of Civil Defense, complia…',
    fidicPosition:
      'FIDIC White Book 2017 Clause 5.1 provides that the Consultant is responsible only for the Services performed by the Consultant and its sub-consultants. The Consultant does not assume liability for work designed by third parties appointed independently by the Client unless the Consultant has expressly reviewed and approved such work.',
    severity: 'CRITICAL',
    riskCategory: 'Liability & Indemnity',
    proposedAmendment:
      "The Consultant shall act as AOR for the Project. The Consultant's liability shall extend only to design work performed by the Consultant and its directly appointed sub-consultants. Where the Consultant is required to assume AOR responsibility for designs produced by third parties appointed by the Employer, the Employer shall: (a) provide a paid design review period of not less than [21] days; (b) indemnify the Consultant against claims arising from latent defects in pre-existing third-party designs that could not reasonably have been identified during such review; and (c) provide the Consultant with all relevant design documentation, calculations and approvals prior to the assumption of AOR responsibility.",
    rationale:
      "Client-facing: Assuming liability for unknown third-party designs without a paid review period and Employer indemnity exposes DSA to unlimited professional liability for work it did not produce. This is commercially uninsurable under standard PI policy terms.\n\nDSA note: This is the single most dangerous clause in the document. If DSA steps in as AOR and a structural failure or Civil Defence non-compliance is later discovered in the inherited design, DSA's PI insurer will likely deny cover because the defect pre-dates DSA's appointment. DSA could face direct claims from DAMAC and third parties with no contractual backstop.",
  },
  {
    clauseRef: 'Section 9.3 H — PART 1B-PROPOSAL SCHEDULES.pdf, p.13',
    topic: 'Adjustments — Delay Penalty and Design Deficiency Deductions',
    original:
      'If the Employer suffers the cost of post contract variations as a result of an omission, deficiency or of inadequate or incomplete design detailing of the Tender Documents or Issued for Construction D…',
    fidicPosition:
      "FIDIC White Book 2017 Clause 7.4 provides that delay damages must be a genuine pre-estimate of loss, must be capped (typically at the total fee or a defined percentage), and the Consultant must have the right to dispute any deduction through the dispute resolution mechanism. FIDIC does not permit unilateral deductions 'notwithstanding any objections.'",
    severity: 'CRITICAL',
    riskCategory: 'Delay & Damages',
    proposedAmendment:
      'Delay damages shall be limited to 0.5% of the portion of the Remuneration attributable to the delayed Stage per week of delay, subject to a maximum aggregate cap of [10%] of the total Remuneration. Delay damages shall not apply where delay is caused by: (a) the Employer\'s failure to provide timely approvals, instructions or information; (b) acts or omissions of Other Consultants appointed by the Employer; or (c) Force Majeure events. Any deduction for alleged design deficiencies shall be subject to a written notice from the Employer specifying the deficiency, a [14]-day cure period, and, if disputed, resolution through the dispute resolution mechanism in Article [X] of the Agreement.',
    rationale:
      "Client-facing: Without a cap, cumulative delay penalties across five stages could theoretically exceed the total contract value. The 'notwithstanding any objections' language removes DSA's fundamental right to contest deductions, creating a unilateral payment reduction mechanism with no procedural safeguard.\n\nDSA note: On a compressed 3-month design programme with multiple Employer approval gateways, delays caused by the Employer's own review process could trigger penalties against DSA. The 'notwithstanding any objections' language means DAMAC can deduct fees immediately and DSA has no contractual mechanism to recover them without litigation.",
  },
  {
    clauseRef: 'Section 4.23 — PART 1A-TENDER INSTRUCTIONS.pdf, p.15',
    topic: 'Indemnity to Employer',
    original:
      'By submitting the Tender, the Tenderer agrees to indemnify and hold the Employer and its affiliates, officers, directors, agents, and employees, harmless from and against any losses, claims, liabiliti…',
    fidicPosition:
      "FIDIC White Book 2017 Clause 8.2 provides for mutual indemnities proportionate to each party's fault. The Consultant is not required to indemnify the Client for losses arising from the Client's own platform or procurement process. Pre-contract indemnities are not standard in FIDIC.",
    severity: 'CRITICAL',
    riskCategory: 'Liability & Indemnity',
    proposedAmendment:
      "The Tenderer's liability in connection with the use of the ProTender platform shall be limited to direct losses caused by the Tenderer's own negligent or wilful misuse of the platform. The Tenderer shall not be liable for any indirect, consequential or special losses, and shall not be required to indemnify the Employer's affiliates, officers, directors, agents or employees beyond the scope of the Tenderer's own acts or omissions. This indemnity shall not survive the execution of the Consultancy Services Agreement.",
    rationale:
      "Client-facing: The indemnity extends to DAMAC's entire corporate group ('affiliates') without any cap or proportionality requirement, creating theoretically unlimited pre-contract exposure for DSA before a single dirham of fee has been earned.\n\nDSA note: DAMAC is a large conglomerate. 'Affiliates' could include dozens of entities. A ProTender platform incident — even one caused by DAMAC's own IT infrastructure — could trigger this indemnity. DSA's PI insurance does not cover pre-contract indemnities of this nature.",
  },
  {
    clauseRef: 'Section 2.1.1(b) and (c) — PART 02-DC_DLC_RFP__Services Brief Summary.pdf, p.15',
    topic: 'Stages — Optional Services Omission and No Loss of Revenue',
    original:
      'The Employer may, in its sole and unfettered discretion and by giving a written notice to the Consultant, omit any or all of the Optional Services from the scope of the Services and appoint other cons…',
    fidicPosition:
      'FIDIC White Book 2017 Clause 6.1 provides that where the Client omits services, the Consultant is entitled to reasonable compensation for work already performed and for loss of anticipated profit on the omitted portion, subject to a fair adjustment of the fee. The Client cannot omit services to give them to a third party without compensating the Consultant.',
    severity: 'HIGH',
    riskCategory: 'Scope & Variations',
    proposedAmendment:
      'The Employer may omit Optional Services by written notice. Where Optional Services are omitted, the Consultant shall be entitled to: (a) payment for all work performed on the omitted services up to the date of the omission notice; and (b) a reasonable contribution to overhead and profit on the omitted portion, calculated at [X]% of the fee attributable to the omitted services. The Employer shall not omit services for the purpose of having them performed by a third party at a lower cost without the Consultant\'s agreement.',
    rationale:
      "Client-facing: The project involves two plots (Dhahran and Dammam). The RFP explicitly states that one plot may be suspended. If one plot is omitted, DSA loses up to 50% of anticipated revenue with zero compensation for mobilisation costs, sub-consultant commitments or overhead already incurred.\n\nDSA note: DSA must price both plots in its lump sum. If DAMAC suspends one plot after award, DSA absorbs all sunk costs with no recovery. This is a structural financial trap that could make the contract loss-making from day one.",
  },
  {
    clauseRef: 'Section 9 (Proposal Schedule 2) — PART 1B-PROPOSAL SCHEDULES.pdf, p.12',
    topic: 'Remuneration and Payment — Interim Payments at Employer\'s Sole Discretion',
    original:
      'The Remuneration shall be calculated and payable as set out below in this Schedule. Payment shall be made in instalments upon the successful completion of each Phase as defined in Schedule 1 and as de…',
    fidicPosition:
      'FIDIC White Book 2017 Clause 7.3 requires the Client to pay invoices within a defined period (typically 28 days) after receipt of a valid invoice. The Client does not have discretion to withhold payment for completed work. FIDIC also provides for interest on late payments.',
    severity: 'HIGH',
    riskCategory: 'Payment Terms',
    proposedAmendment:
      'Payment shall be made by bank transfer within 30 calendar days of the Employer\'s receipt of a valid invoice following completion of each Stage milestone. Interim payments within a Stage shall be made within 30 calendar days of the Employer\'s receipt of a valid interim invoice, provided the Consultant has demonstrated satisfactory progress. Interest shall accrue on overdue payments at [SAIBOR/EIBOR + 2%] per annum from the due date until the date of payment.',
    rationale:
      "Client-facing: The 3-month design programme is extremely compressed. DSA will incur significant staff and sub-consultant costs from day one. Without a payment obligation, DAMAC can delay payment indefinitely while DSA continues to perform, creating a severe cash flow risk.\n\nDSA note: The Commercial T&Cs specify 'Bank Transfer by 30 days' but this is not reflected as a binding obligation in the Proposal Schedule. The 'sole discretion' language in Section 9 overrides the 30-day reference, leaving DSA with no enforceable payment timeline.",
  },
  {
    clauseRef: 'Section 4.12 (4.12.1 through 4.12.5) — PART 1A-TENDER INSTRUCTIONS.pdf, p.12',
    topic: 'No Obligations — Employer\'s Absolute Discretion to Terminate Process',
    original:
      'The Employer reserves the right in its absolute discretion and without limiting any other right which the Employer may have whether under this RFP or otherwise, to do any one or more of the following …',
    fidicPosition:
      'FIDIC White Book 2017 Clause 8.4 provides that either party may terminate the Agreement for convenience, but the Consultant is entitled to payment for all work performed to the date of termination plus reasonable demobilisation costs. Pre-contract, FIDIC does not contemplate unilateral termination without any compensation obligation.',
    severity: 'HIGH',
    riskCategory: 'Termination & Suspension',
    proposedAmendment:
      'The Employer reserves the right to withdraw this RFP or terminate the proposal process at any time. In the event the Employer terminates the process after shortlisting Tenderers for final evaluation, the Employer shall reimburse each shortlisted Tenderer a reasonable contribution to bid preparation costs, not to exceed [USD X]. The Tenderer\'s proposal validity obligation under Clause 4.20 shall be reduced to [8] weeks.',
    rationale:
      "Client-facing: DSA will invest significant resources in preparing a compliant bid for a complex data centre project. The 12-week lock-in with zero compensation for termination creates an asymmetric risk that is commercially unreasonable for a specialist consultancy.\n\nDSA note: DAMAC's 'absolute discretion' language, combined with the confidential Q&A process (Section 4.3) and the right to accept non-conforming proposals (Section 4.13), creates a procurement environment where DSA has no procedural protections and no recourse if the process is manipulated.",
  },
  {
    clauseRef: 'Section 4.18 — PART 1A-TENDER INSTRUCTIONS.pdf, p.14',
    topic: 'Retention of Documents — Intellectual Property in Proposals',
    original:
      'Despite any intellectual property or other ownership rights which may apply to any Proposal, The Employer is entitled to retain all Proposals, including all copies.',
    fidicPosition:
      'FIDIC White Book 2017 Clause 9.1 provides that the Consultant retains copyright and all intellectual property rights in documents prepared by the Consultant. The Client receives a licence to use such documents for the purposes of the project only. The Client cannot use the Consultant\'s documents for other projects or share them with third parties without the Consultant\'s consent.',
    severity: 'HIGH',
    riskCategory: 'IP Rights',
    proposedAmendment:
      'The Employer may retain copies of all Proposals for evaluation purposes only. All intellectual property rights in the Proposal, including design concepts, technical methodologies, BIM models and specifications, remain vested in the Tenderer. The Employer shall not use, reproduce, disclose or share any Proposal content for any purpose other than evaluation of this RFP without the prior written consent of the Tenderer. Upon conclusion of the procurement process, the Employer shall destroy or return all copies of unsuccessful Proposals upon request.',
    rationale:
      "Client-facing: DSA's proposal for a hyperscale data centre will contain proprietary design solutions, data centre engineering methodologies and potentially patentable technical approaches. Surrendering these to DAMAC unconditionally — including to DAMAC's affiliates — creates a permanent IP risk.\n\nDSA note: DAMAC's 'Data Centres by DAMAC' brand (EDGNEX) is a commercial data centre operator. DSA's proposal could be used to brief EDGNEX's in-house team or a lower-cost competitor. The absence of any IP protection in the executed contract (missing protection) compounds this risk.",
  },
  {
    clauseRef: 'Section 2.2 — PART 1A-TENDER INSTRUCTIONS.pdf, p.7',
    topic: 'Fee — Lump Sum with No Escalation or Variation Mechanism',
    original:
      'The Employer is seeking a Proposal for performing the Services consisting of a lump sum price for the requested Services. The agreed lump sum price, based on Proposal Schedule 2 for the successful Ten…',
    fidicPosition:
      'FIDIC White Book 2017 Clause 6.1 provides for adjustment of the fee where the scope of services changes materially, where the Client issues additional instructions, or where unforeseen circumstances arise. A lump sum is permissible but must be accompanied by a clear variation mechanism and a right to additional fee for Employer-instructed changes.',
    severity: 'HIGH',
    riskCategory: 'Payment Terms',
    proposedAmendment:
      'The agreed lump sum fee covers the Services as defined in the Services Brief. Where the Employer instructs additional services beyond the defined scope, or where the scope is materially changed by the Employer, the Consultant shall be entitled to additional fee calculated at the hourly rates set out in Section 9.2C, subject to the Employer\'s prior written approval of the estimated additional cost. The Consultant shall not be required to perform additional services without written instruction and agreed additional fee.',
    rationale:
      "Client-facing: The open-ended scope definition ('not limited to as below') combined with a hard lump sum creates a mechanism for unlimited scope creep at no additional cost to DAMAC. The hourly rates in Section 9.2C are provided but there is no contractual trigger for their use.\n\nDSA note: The 50-item Consultancy Services Checklist (Section 2.1.4) includes items marked 'TBC' and the scope is explicitly stated as 'not limited to' the listed items. DSA cannot price an open-ended scope as a lump sum without accepting unlimited scope risk.",
  },
  {
    clauseRef: 'Section 4.16 — PART 1A-TENDER INSTRUCTIONS.pdf, p.14',
    topic: 'Confidentiality — One-Sided Obligation',
    original:
      'A Tenderer must not disclose or provide to any person, other than to persons engaged in the preparation of its Proposal, any particulars concerning its Proposal or any other information with which it …',
    fidicPosition:
      'FIDIC White Book 2017 Clause 9.4 imposes mutual confidentiality obligations on both the Client and the Consultant. Neither party may disclose the other\'s confidential information without consent. The obligation is reciprocal and time-limited.',
    severity: 'MEDIUM',
    riskCategory: 'Audit & Compliance',
    proposedAmendment:
      'Each party agrees to keep confidential all information received from the other party in connection with this RFP and the Services (\'Confidential Information\'). Neither party shall disclose Confidential Information to any third party without the prior written consent of the disclosing party, except: (a) to employees or advisers who need to know such information for the purposes of the RFP or the Services; (b) as required by law or regulation; or (c) information that is or becomes publicly available through no fault of the receiving party. This obligation shall survive for [3] years after the conclusion of the procurement process or termination of the Agreement.',
    rationale:
      "Client-facing: DSA will share commercially sensitive pricing, staffing models and technical methodologies with DAMAC. Without a reciprocal confidentiality obligation, DAMAC can share this information with competitors or use it in future procurements.\n\nDSA note: The absence of Employer-side confidentiality is particularly concerning given that DAMAC operates EDGNEX as a commercial data centre business. DSA's data centre design IP and pricing intelligence could directly benefit DAMAC's commercial operations.",
  },
  {
    clauseRef: 'Section 8 (Proposal Schedule 4) — PART 1B-PROPOSAL SCHEDULES.pdf, p.10',
    topic: 'Consultant Personnel — 100% Dedication and No Replacement Procedure',
    original:
      'The Consultant Design Manager must have significant development experience and shall be responsible for the overall design management of the Project and the principle liaison with the Employer during …',
    fidicPosition:
      'FIDIC White Book 2017 Clause 5.3 permits the Client to object to key personnel but requires a reasonable replacement procedure. The Consultant retains the right to replace personnel for legitimate business reasons (resignation, illness, etc.) subject to providing a suitably qualified replacement. 100% dedication requirements are not standard in FIDIC.',
    severity: 'MEDIUM',
    riskCategory: 'Key Personnel',
    proposedAmendment:
      'The Consultant Design Manager shall be dedicated to the Project for a minimum of [80%] of working time during Stages 2 to 4T. The Consultant may replace the Design Manager with a suitably qualified individual of equivalent or greater experience, subject to providing the Employer with [14] days\' prior written notice and the Employer\'s approval, not to be unreasonably withheld. Any requirement for the Design Manager to be based at the Employer\'s office shall be agreed in advance and shall not exceed [X] consecutive days without the Consultant\'s agreement.',
    rationale:
      "Client-facing: A 100% dedication requirement with no replacement procedure creates a single point of failure. If the Design Manager resigns, falls ill or is unavailable, DSA is in breach of contract with no contractual remedy.\n\nDSA note: The requirement for the Design Manager to be 'primarily based in the Employer's office for periods of time as required by the Employer' is an open-ended secondment obligation. This creates employment law complications and significant cost exposure if the Employer's office is in a different city or country from DSA's base.",
  },
  {
    clauseRef: 'Section 2.5 — PART 1A-TENDER INSTRUCTIONS.pdf, p.7',
    topic: 'Associations, Joint Ventures and Sub-Consultants — Sole Responsibility',
    original:
      'If the Tenderer participates as a group of firms, it is to be understood that the firm invited will be solely responsible for all matters and incidents (contractual, legal, technical, etc.) of the Pro…',
    fidicPosition:
      'FIDIC White Book 2017 Clause 1.3 permits joint ventures and consortia with proportionate liability between members. The lead consultant is responsible for coordination but not for the independent negligence of consortium members beyond its proportionate share.',
    severity: 'MEDIUM',
    riskCategory: 'Affiliate/Third Party',
    proposedAmendment:
      'Where the Tenderer participates as a group of firms or engages sub-consultants, the lead firm shall be the primary point of contact with the Employer and shall be responsible for coordinating the delivery of the Services. Each firm shall be responsible for its own work and the lead firm\'s liability for the acts or omissions of sub-consultants shall be limited to losses arising from the lead firm\'s failure to exercise reasonable care in selecting, instructing or supervising such sub-consultants.',
    rationale:
      "Client-facing: DSA will need to engage specialist sub-consultants for data centre MEP, structural engineering and Uptime certification support. Assuming sole and unlimited liability for all sub-consultant work — including work performed by DAMAC-nominated sub-consultants — is commercially unacceptable.\n\nDSA note: Section 2.1.3 identifies several sub-consultants nominated by DAMAC (geotechnical, topographic survey, traffic). Under Section 2.5, DSA would be solely responsible for these DAMAC-nominated parties' work despite having no control over their appointment or performance.",
  },
  {
    clauseRef:
      'Commercial Qualifications — Commercial Qualifications-DMM&DAH DC (1).xlsx, p.1 vs Section 9.3H — PART 1B-PROPOSAL SCHEDULES.pdf, p.13',
    topic: 'Liquidated Damages — Inconsistent Basis Between Commercial T&Cs and Proposal Schedule',
    original:
      "Commercial T&Cs: 'LD - Liquidated Damages for delay: 0.5% of the Contract Value per week.' Section 9.3H: 'The penalty for delay, which will be applied individually to each of the defined Stages, will …",
    fidicPosition:
      'FIDIC White Book 2017 requires delay damages to be clearly defined with a single, unambiguous basis. Where contract documents are inconsistent, FIDIC provides a priority of documents clause to resolve conflicts. The basis for LD calculation must be certain at the time of contract execution.',
    severity: 'HIGH',
    riskCategory: 'Delay & Damages',
    proposedAmendment:
      'Delay damages shall be calculated at 0.5% of the portion of the Remuneration attributable to the delayed Stage per week of delay, subject to a maximum aggregate cap of [10%] of the total Remuneration. For the avoidance of doubt, delay damages shall not be calculated on the basis of the total Contract Value. In the event of any inconsistency between the Commercial Terms and Conditions and the Proposal Schedule, the Proposal Schedule shall prevail.',
    rationale:
      "Client-facing: The inconsistency creates a dispute risk at the point of any delay. DAMAC will argue the higher 'Contract Value' basis; DSA will argue the lower 'portion of Remuneration' basis. This ambiguity must be resolved before contract execution.\n\nDSA note: If the Contract Value basis applies, a single week's delay on the entire contract could cost DSA 0.5% of the total fee — potentially USD 50,000+ per week on a multi-million dollar engagement. This is a material financial exposure that must be clarified and capped.",
  },
];

export const EDGNEX_FIDIC_MISSING_PROTECTIONS: string[] = [
  'Limitation of liability cap — no clause found in any retrieved document; DSA faces unlimited liability for all claims arising from the Services',
  'Consequential and indirect loss exclusion — no clause found; DSA is exposed to claims for loss of data centre revenue, business interruption and third-party losses on a 50-200 MW hyperscale facility',
  'Proportionate liability clause — no clause found; DSA faces joint and several liability for third-party consultant failures under Section 2.5',
  'Dispute resolution and arbitration clause — no clause found across all 12 retrieval queries; there is no contractual mechanism to resolve disputes, challenge deductions or recover withheld payments',
  'Governing law and jurisdiction clause — not stated in any retrieved document; critical ambiguity given UAE employer, KSA project site and potential international arbitration',
  'Extension of time provisions — no clause found; DSA has no contractual right to additional time for Employer-caused delays, third-party delays or force majeure events',
  'Force majeure clause — no clause found; DSA bears full delay penalty risk for events beyond its control',
  'Termination for convenience by Consultant — no clause found; DSA has no exit right if the project becomes commercially unviable or if DAMAC fails to pay',
  'Time bar on claims — no clause found; DAMAC can bring claims against DSA for design defects without any limitation period beyond applicable statute',
  'Intellectual property ownership clause for contract deliverables — only proposal IP addressed (Section 4.18); no clause found governing ownership of IFC documents, BIM models, specifications and other contract deliverables',
  'Binding payment timeframe — the 30-day reference in Commercial T&Cs is not reflected as a binding contractual obligation; Section 9 makes interim payments discretionary',
  "Employer's obligations and Employer default provisions — no clause found defining DAMAC's obligations to provide timely approvals, information and instructions, or the consequences of DAMAC's failure to do so",
  'Suspension for non-payment — no clause found giving DSA the right to suspend services if DAMAC fails to pay',
  'Standard of care definition — no clause found defining the standard of care (reasonable skill and care vs fitness for purpose); the Uptime Tier III and TIA-942 compliance requirements could be interpreted as fitness-for-purpose obligations',
];

export const EDGNEX_FIDIC_DRAFTING_ERRORS: string[] = [
  "LD basis inconsistency: Commercial Qualifications xlsx specifies LD at '0.5% of the Contract Value per week' while Section 9.3H of Proposal Schedules specifies '0.5% of the portion of the Remuneration per week' — these are materially different calculation bases that must be reconciled before contract execution",
  "Section 9.2 payment table contains two separate Stage 4 entries both described as 'Upon formal approval of Enabling and Early Works, including Shell and Core Package' at 15% and 20% respectively — the distinction between these two identical milestone descriptions is unclear and creates payment ambiguity",
  "Section 8 (Proposal Schedule 4) states design staff requirements are set out in 'Article 5.4 of the proposed Consultancy Services Agreement' but the Consultancy Services Agreement (RFP Part 3/Part 4) was not retrieved and is not available for review — this is a dangling cross-reference to an unreviewed document",
  "Section 3 (Proposal Schedule 1.2) states insurance minimums are 'as noted in the Consultancy Services Agreement in RFP Part 4' but the Commercial Qualifications xlsx specifies USD 8M PI and USD 1.3M Public Liability — the CSA (Part 4) has not been retrieved and may contain different minimums, creating a potential inconsistency",
  "Multiple 'TBC' placeholders in the technical specifications table (Services Brief p.10-13) including: UPS output bus, MV switchgear type, PODs Transformer Capacity, Battery Charger backup time, Critical LV Bus, Compartmentalization, IT Power Distribution, No. of Units — these are unresolved design parameters that form part of the scope DSA must price",
  "Plot Assessment Report noted as 'will be provided later' (Services Brief Section 1.1.2) — a fundamental site document required for scope definition and fee pricing is not yet available at tender stage",
  "Section 2.1.4 states 'The Scope not limited to as below & refer RFP Part 3' but RFP Part 3 (Service Brief Appendices) was not retrieved — the full scope cannot be assessed without this document",
  'The document revision table in PART 1A (p.15) contains blank Author, Reviewer and Approved for Issue fields — the document has not been formally approved or version-controlled, raising questions about its contractual status',
  "Section 2.1.1 refers to 'Article 0 of the Agreement' for definitions but the Agreement (RFP Part 3) was not retrieved — key defined terms may differ between the Services Brief and the Agreement",
];
