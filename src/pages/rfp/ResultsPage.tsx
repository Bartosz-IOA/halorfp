import React, { useState } from 'react';
import { Download, FileText, ChevronDown, ChevronRight, ChevronLeft, FileArchive, Info, MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- MOCK DATA ---
const GO_NO_GO_DATA = [
  { id: '1', name: 'Client relationship', score: 10, max: 30, text: 'C — Bid but not won', color: 'bg-amber-500' },
  { id: '2', name: 'Scope', score: 30, max: 30, text: 'A — Lead Design Consulta...', color: 'bg-green-500' },
  { id: '3', name: 'Project type', score: 20, max: 30, text: 'B — Commercial / Public / ...', color: 'bg-amber-500' },
  { id: '4', name: 'Stages', score: 30, max: 30, text: 'A — Full Design and Site', color: 'bg-green-500' },
  { id: '5', name: 'Programme', score: 30, max: 30, text: 'A — Realistic / Achievable', color: 'bg-green-500' },
  { id: '6', name: 'DSA resource capacity', score: 0, max: 30, text: '— Unknown / Not confirmed', color: 'bg-slate-400' },
  { id: '7', name: 'Quality of RFP', score: 30, max: 30, text: 'A — Excellent information p...', color: 'bg-green-500' },
  { id: '8', name: 'Prior knowledge of RFP', score: 30, max: 30, text: 'A — Yes (director briefing h...', color: 'bg-green-500' },
  { id: '9', name: 'Tender bonds / securities', score: -100, max: 30, text: 'B — Required (bonds, guar...', color: 'bg-red-500', isBlocker: true },
  { id: '10', name: 'Submission timeline', score: 0, max: 30, text: 'B — Due less than two wee...', color: 'bg-slate-400' },
];

const MOCK_QUESTIONS = [
  { q: "Is the deadline achievable?", a: "No", notes: "Lapsed deadline. 627 days overdue.", ref: "Sec 1.2" },
  { q: "Are tender bonds required?", a: "Yes", notes: "Mandatory securities explicitly requested.", ref: "Appendix B" },
];

const MOCK_BREAKDOWN_DATA = [
  { label: 'Plot Size', value: '50,344.97 m²', note: 'Surveyed plot size. Subject to final municipality verification.', ref: 'Appendix A - Site Survey' },
  { label: 'Location', value: 'The project is located in District 11B, including a Golf Course area, with coordinates set by the contractor based on a master model file.', note: 'Coordinates provided in local municipality datum.', ref: 'Sec 1.2 Site Location' },
  { label: 'Authority approvals', value: 'In Progress', note: 'Initial concept approved. Detailed design pending.', ref: 'Status Report Mar 2024' },
  { label: 'Disciplines', value: 'Architecture, Structural, MEP, Fire & Life Safety, Sustainability, Interiors, Landscape, Roads & Traffic, Security, Kitchen & Waste Management, Lighting, Acoustics', note: 'All lead disciplines requested, sub-consultants required for acoustics.', ref: 'Annexure C Deliverables' },
  { label: 'Star Rating', value: '—', note: 'Not specified in current documentation.', ref: 'N/A' },
  { label: 'Number of Keys', value: '—', note: 'Not applicable for this project typology.', ref: 'N/A' },
];

const MOCK_DOCUMENTS = [
  { name: 'ITB GolfClub_LDC.pdf', size: '1.5 MB', type: 'PDF', iconBg: 'bg-red-50', iconTxt: 'text-red-600', cardBg: 'bg-white', border: 'border-border', desc: 'Invitation to Bid containing tender instructions, submission protocols, and high-level architectural scope.' },
  { name: 'Annexure_C_Deliverables.pdf', size: '1.8 MB', type: 'PDF', iconBg: 'bg-red-50', iconTxt: 'text-red-600', cardBg: 'bg-white', border: 'border-border', desc: 'Detailed schedule outlining all milestone deliverables for the 12 principal disciplines required.' },
  { name: 'Appendix_14_BIM.pdf', size: '2.4 MB', type: 'PDF', iconBg: 'bg-red-50', iconTxt: 'text-red-600', cardBg: 'bg-white', border: 'border-border', desc: 'Mandatory BIM Level 3 modeling protocols, PIM formats, and Asset Information Requirements (AIR).' },
];

const MOCK_PROJECT_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1596422846543-74c6d66e51cc?q=80&w=800&auto=format&fit=crop', desc: 'Clubhouse Exterior Concept', ref: 'Ref 1.1' },
  { url: 'https://images.unsplash.com/photo-1587140329524-74ea02243e8d?q=80&w=800&auto=format&fit=crop', desc: 'Master Plan Aerial View', ref: 'Appendix A' },
  { url: 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=800&auto=format&fit=crop', desc: 'Academy Training Center', ref: 'Ref 2.4' }
];

// --- COMPONENTS ---

const IndicatorCard = ({ label, value, subtext, alert }: { label: string, value: React.ReactNode, subtext?: React.ReactNode, alert?: boolean }) => (
  <div className={cn(
    "flex flex-col p-4 rounded-xl border",
    alert ? "bg-red-50 border-red-200" : "bg-white border-border shadow-sm"
  )}>
    <p className={cn("text-[9px] font-bold uppercase tracking-widest mb-1", alert ? "text-red-700" : "text-text-secondary")}>
      {label}
    </p>
    <div className={cn("text-2xl font-bold mb-1", alert ? "text-red-600" : "text-navy-primary")}>
      {value}
    </div>
    {subtext && <div className={cn("text-xs", alert ? "text-red-600/80" : "text-text-secondary")}>{subtext}</div>}
  </div>
);

const AccordionSection = ({ 
  title, 
  number, 
  summaryPill, 
  defaultExpanded = false, 
  children 
}: { 
  title: string, 
  number?: string, 
  summaryPill?: React.ReactNode, 
  defaultExpanded?: boolean, 
  children?: React.ReactNode 
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-4">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-surface-grey transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          {number && <span className="text-text-secondary font-mono text-sm">{number}</span>}
          <h3 className="font-bold text-navy-primary text-md">{title}</h3>
        </div>
        <div className="flex items-center gap-4">
          {summaryPill && <div>{summaryPill}</div>}
          <div className="text-text-secondary">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-5 border-t border-border bg-off-white/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-SECTIONS ---

const GoNoGoRow = ({ data }: { data: typeof GO_NO_GO_DATA[0] }) => {
  const [open, setOpen] = useState(false);
  
  // Calculate width % based on positive score for the bar
  const widthPercent = data.score > 0 ? (data.score / data.max) * 100 : data.score === 0 ? 0 : 100;
  
  return (
    <div className="mb-2">
      <div 
        className={cn(
          "grid grid-cols-[1fr_2fr_120px_24px] gap-3 items-center p-2 rounded-lg cursor-pointer hover:bg-surface-grey transition-colors",
          open && "bg-surface-grey"
        )}
        onClick={() => setOpen(!open)}
      >
        <div className="text-xs text-navy-primary font-medium truncate pr-2">{data.name}</div>
        
        {/* Progress Bar Area */}
        <div className="relative h-1.5 bg-border rounded-full overflow-hidden flex items-center">
           {data.isBlocker ? (
             <div className="absolute left-0 top-0 bottom-0 w-full bg-red-600 rounded-full" />
           ) : (
             <div 
                className={cn("absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500", data.color)} 
                style={{ width: `${widthPercent}%` }} 
             />
           )}
        </div>
        
        {/* Score & Text Area */}
        <div className="text-right">
          <div className={cn("text-xs font-bold", data.isBlocker ? "text-red-600" : data.score === 0 ? "text-slate-500" : "text-green-600")}>
            {data.isBlocker ? "-100 blocker" : `${data.score} / ${data.max}`}
          </div>
          <div className="text-[9px] text-text-secondary truncate">{data.text}</div>
        </div>

        {/* Dropdown Icon */}
        <div className="flex justify-end items-center h-full">
          <ChevronLeft 
            size={16} 
            className={cn("text-text-secondary/60 transition-transform duration-300", open ? "-rotate-90" : "rotate-0")} 
          />
        </div>
      </div>
      
      {/* Dropdown Details Table */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 ml-2 md:ml-4 mr-2 mb-4 bg-white border border-border shadow-sm rounded-lg overflow-x-auto">
               <div className="p-4 min-w-[600px]">
                 <div className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 mb-2 pb-2 border-b border-border">
                   <div className="text-[10px] font-bold text-text-secondary uppercase">Question</div>
                   <div className="text-[10px] font-bold text-text-secondary uppercase">Answer</div>
                   <div className="text-[10px] font-bold text-text-secondary uppercase">Notes</div>
                   <div className="text-[10px] font-bold text-text-secondary uppercase text-right">Reference</div>
                 </div>
                 
                 {MOCK_QUESTIONS.map((itm, i) => (
                   <div key={i} className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 py-2 border-b border-border last:border-0 items-start">
                     <div className="text-xs text-navy-primary">{itm.q}</div>
                     <div className={cn("text-xs font-bold", itm.a === 'Yes' ? "text-green-600" : "text-red-600")}>{itm.a}</div>
                     <div className="text-xs text-text-secondary">{itm.notes}</div>
                     <div className="text-xs text-navy-primary font-medium text-right italic cursor-pointer hover:underline">{itm.ref}</div>
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


// --- MAIN PAGE ---

export const ResultsPage: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8 font-sans bg-off-white">
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* --- Top Hero & Stats Block --- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 items-start">
          
          {/* Executive Summary Left */}
          <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <div className="mb-4">
              <div>
                <h2 className="text-2xl font-bold text-navy-primary mb-1">Public Golf Club and Academy — Lead Design Consultancy</h2>
                <p className="text-sm text-text-secondary">Qiddiya Investment Company · District 11B, Qiddiya, KSA</p>
              </div>
            </div>

            <p className="text-sm text-text-primary leading-relaxed mb-6">
              The RFP seeks a Lead Design Consultancy for a five-building Golf Club and Academy (GFA 11,215 m² / Plot 50,345 m²) in District 11B, Qiddiya. Scope spans 12 disciplines under full LDC remit with ISO 19650 / BIM Level 3 digital delivery. The bid submission date of 15 July 2024 has lapsed (627 days overdue). Performance securities are mandatory. Maximum achievable score remains below 50%. Proceed only if Client reissues with updated timelines.
            </p>

            <div className="flex flex-col mb-6 text-xs border-y border-border py-2">
              {MOCK_BREAKDOWN_DATA.map((item, i) => (
                <div key={i} className="flex flex-col md:grid md:grid-cols-[150px_1fr_40px] gap-1 md:gap-x-6 py-3 md:py-2 border-b border-border/50 last:border-0 md:items-start relative">
                  <div className="font-bold text-text-secondary pr-8 md:pr-0 md:mt-1">{item.label}</div>
                  <div className="text-navy-primary whitespace-pre-line leading-relaxed text-[13px] md:text-xs">{item.value}</div>
                  
                  <div className="group absolute top-3 right-0 md:relative md:top-auto md:flex md:justify-end">
                    <Info size={16} className="text-text-secondary/50 cursor-help md:mt-1 hover:text-navy-primary transition-colors" />
                    
                    {/* Tooltip Popup */}
                    <div className="absolute right-0 top-full mt-2 md:top-auto md:bottom-full md:mb-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-navy-mid text-white p-4 rounded-xl shadow-modal z-50 w-[280px] sm:w-[320px] pointer-events-none md:before:content-[''] md:before:absolute md:before:top-[100%] md:before:right-[5px] md:before:border-[6px] md:before:border-transparent md:before:border-t-navy-mid">
                       <p className="font-bold text-[10px] text-yellow uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Reference Note</p>
                       <p className="text-xs text-white/90 leading-relaxed mb-3 text-left">{item.note}</p>
                       <div className="flex justify-between items-center text-[10px]">
                         <span className="text-white/40">Source:</span>
                         <span className="text-yellow text-right italic font-medium">{item.ref}</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Building Grid Table */}
            <div className="mb-6 border border-border rounded-lg overflow-x-auto bg-white text-xs shadow-sm">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-surface-grey border-b border-border">
                  <tr>
                    <th className="px-4 py-2 font-bold text-text-secondary border-r border-border w-[40%] md:w-[200px]">Building</th>
                    <th className="px-4 py-2 font-bold text-text-secondary border-r border-border w-[40%] md:w-[180px]">Typology</th>
                    <th className="px-4 py-2 font-bold text-text-secondary text-right">Area (GFA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="hover:bg-surface-grey/50 hover:text-navy-primary transition-colors">
                    <td className="px-4 py-2.5 border-r border-border font-medium text-navy-primary">Club House</td>
                    <td className="px-4 py-2.5 border-r border-border text-navy-primary">Hospitality</td>
                    <td className="px-4 py-2.5 text-navy-primary text-right font-mono text-[11px]">3,607 m²</td>
                  </tr>
                  <tr className="hover:bg-surface-grey/50 hover:text-navy-primary transition-colors">
                    <td className="px-4 py-2.5 border-r border-border font-medium text-navy-primary">Recreation Centre</td>
                    <td className="px-4 py-2.5 border-r border-border text-navy-primary">Hospitality</td>
                    <td className="px-4 py-2.5 text-navy-primary text-right font-mono text-[11px]">2,668 m²</td>
                  </tr>
                  <tr className="hover:bg-surface-grey/50 hover:text-navy-primary transition-colors">
                    <td className="px-4 py-2.5 border-r border-border font-medium text-navy-primary">Community Hub</td>
                    <td className="px-4 py-2.5 border-r border-border text-navy-primary">Community</td>
                    <td className="px-4 py-2.5 text-navy-primary text-right font-mono text-[11px]">2,585 m²</td>
                  </tr>
                  <tr className="hover:bg-surface-grey/50 hover:text-navy-primary transition-colors">
                    <td className="px-4 py-2.5 border-r border-border font-medium text-navy-primary">Academy</td>
                    <td className="px-4 py-2.5 border-r border-border text-navy-primary">Institutional / Commercial</td>
                    <td className="px-4 py-2.5 text-navy-primary text-right font-mono text-[11px]">2,294 m²</td>
                  </tr>
                  <tr className="hover:bg-surface-grey/50 hover:text-navy-primary transition-colors">
                    <td className="px-4 py-2.5 border-r border-border font-medium text-navy-primary">Starters + Halfway House</td>
                    <td className="px-4 py-2.5 border-r border-border text-navy-primary">Hospitality / Golf</td>
                    <td className="px-4 py-2.5 text-navy-primary text-right font-mono text-[11px]">61 m²</td>
                  </tr>
                </tbody>
                <tfoot className="bg-off-white/80 border-t border-border">
                  <tr>
                    <td colSpan={2} className="px-4 py-3 font-bold text-text-secondary text-right uppercase tracking-widest text-[10px]">Total GFA</td>
                    <td className="px-4 py-3 text-navy-primary font-bold text-right font-mono text-sm">11,215 m²</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Project Imagery Section */}
            <div className="mt-8 border-t border-border pt-6">
               <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">PROJECT IMAGERY</h3>
               <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                 {MOCK_PROJECT_IMAGES.map((img, i) => (
                   <div key={i} onClick={() => setIsGalleryOpen(true)} className="flex-shrink-0 relative w-[240px] h-[160px] rounded-lg overflow-hidden cursor-pointer group border border-border shadow-sm">
                     <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={img.desc} />
                     
                     <div className="absolute inset-0 bg-navy-primary/10 group-hover:bg-transparent transition-colors z-0" />
                     
                     {/* Hover Tooltip trigger for image */}
                     <div 
                        className="absolute top-2 right-2 p-1.5 bg-navy-mid/60 backdrop-blur-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-navy-mid"
                        onClick={(e) => e.stopPropagation()}
                     >
                       <div className="relative group/icon flex items-center justify-center">
                         <Info size={14} className="text-white cursor-help" />
                         
                         {/* Details tooltip */}
                         <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover/icon:opacity-100 group-hover/icon:visible transition-all duration-200 bg-navy-mid text-white p-3 rounded-xl shadow-modal z-50 w-[200px] pointer-events-none before:content-[''] before:absolute before:bottom-[100%] before:right-[5px] before:border-[5px] before:border-transparent before:border-b-navy-mid">
                            <p className="font-bold text-[9px] text-yellow uppercase tracking-widest mb-1.5 border-b border-white/10 pb-1.5 truncate text-left">{img.desc}</p>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="text-white/40">Source:</span>
                              <span className="text-yellow text-right italic font-medium">{img.ref}</span>
                            </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-[11px] text-red-600 font-medium">Deadline lapsed</span>
              <span className="px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-[11px] text-red-600 font-medium">Securities required</span>
              <span className="px-3 py-1.5 rounded-md border border-yellow-dark bg-white text-[11px] text-navy-primary font-medium">BIM Level 3 / ISO 19650</span>
              <span className="px-3 py-1.5 rounded-md border border-yellow-dark bg-white text-[11px] text-navy-primary font-medium">12 disciplines</span>
              <span className="px-3 py-1.5 rounded-md border border-yellow-dark bg-white text-[11px] text-navy-primary font-medium">LDC scope</span>
              <span className="px-3 py-1.5 rounded-md border border-yellow-dark bg-white text-[11px] text-navy-primary font-medium">GFA 11,215 m²</span>
            </div>
          </div>

          {/* KPI Indicators Right */}
          <div className="grid grid-cols-2 gap-4">
            <IndicatorCard 
              label="TOTAL SCORE" 
              value="29.6%" 
              subtext="80 / 270 pts" 
            />
            <IndicatorCard 
              label="MAX POSSIBLE" 
              value="36.7%" 
              subtext="110 / 300 pts" 
            />
            <IndicatorCard 
              label="OVERALL RISK" 
              value="High" 
              subtext="1 critical · 3 high" 
              alert 
            />
            <IndicatorCard 
              label="BID COST EST." 
              value={<span className="text-text-secondary/50">—</span>} 
              subtext="TBC on reissue" 
            />
            <IndicatorCard 
              label="SUBMISSION DEADLINE" 
              value={<span className="text-navy-primary text-lg">15 Jul 2024</span>} 
              subtext={<div className="flex justify-between items-center w-full"><span className="text-[10px] text-text-secondary uppercase">Status</span><span className="text-[10px] font-bold text-red-600">627 days overdue</span></div>} 
              alert
            />
            <IndicatorCard 
              label="RECOMMENDATION" 
              value={<span className="text-lg">Decline</span>} 
              subtext="Score 80/270 · 29.6%" 
              alert
            />
          </div>
        </div>

        {/* --- Source Documents --- */}
        <AccordionSection 
          title="SOURCE DOCUMENTS"
          summaryPill={<span className="text-[10px] text-text-secondary"><strong className="text-navy-primary">4</strong> RFP files · <strong className="text-navy-primary">1</strong> assessment output</span>}
          defaultExpanded={true}
        >
          <div className="flex items-center justify-end mb-4 pb-2">
            <button className="flex items-center gap-2 bg-yellow hover:bg-yellow-dark text-navy-primary px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm">
               <Download size={16} />
               Download all (5 files)
            </button>
          </div>

          <div className="flex flex-wrap gap-4 pb-2">
            {MOCK_DOCUMENTS.map((doc, i) => (
              <div key={i} className={cn("flex-shrink-0 flex items-center gap-3 p-3 rounded-lg min-w-[200px] relative pr-10 border", doc.cardBg, doc.border)}>
                <div className={cn("w-8 h-8 rounded flex items-center justify-center font-bold text-[9px]", doc.iconBg, doc.iconTxt)}>
                  {doc.type === 'HALO' ? <FileText size={16} /> : doc.type}
                </div>
                <div>
                  <p className={cn("text-xs font-medium truncate max-w-[130px]", doc.type === 'HALO' ? "text-navy-primary font-bold" : "text-navy-primary")}>{doc.name}</p>
                  <p className={cn("text-[10px]", doc.type === 'HALO' ? "text-navy-primary/60" : "text-text-secondary")}>{doc.size}</p>
                </div>
                
                {/* Right Edge Absolute Tooltip Wrapper */}
                <div className="absolute top-2 right-2 group">
                  <Info size={14} className={cn("cursor-help transition-colors", doc.type === 'HALO' ? "text-navy-primary/40 hover:text-navy-primary" : "text-text-secondary/50 hover:text-navy-primary")} />
                  {/* Tooltip Popup */}
                  <div className="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-navy-mid text-white p-3 rounded-xl shadow-modal z-50 w-[240px] pointer-events-none before:content-[''] before:absolute before:top-[100%] before:right-[3px] before:border-[5px] before:border-transparent before:border-t-navy-mid">
                     <p className="font-bold text-[9px] text-yellow uppercase tracking-widest mb-1.5 border-b border-white/10 pb-1.5 truncate">{doc.name}</p>
                     <p className="text-[10px] text-white/90 leading-relaxed text-left whitespace-normal">{doc.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* --- Analysis Accordions --- */}
        <div className="space-y-4 pb-12">
          
          <AccordionSection 
            number="01"
            title="GO/NO-GO SCORING BREAKDOWN" 
            defaultExpanded={true}
          >
            {/* Table Header / Legend */}
            <div className="flex justify-between items-end mb-4 border-b border-border pb-2">
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                10 criteria · DSA Assessment Matrix
              </div>
              <div className="flex items-center gap-4 text-[10px] text-text-secondary">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-green-500" /> Positive</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-red-600" /> Blocker</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-slate-400" /> No score</span>
              </div>
            </div>

            {/* List of Bars */}
            <div className="space-y-1">
              {GO_NO_GO_DATA.map(data => (
                <GoNoGoRow key={data.id} data={data} />
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-4 flex justify-end">
              <button className="flex items-center gap-2 bg-white border border-border hover:bg-surface-grey text-navy-primary px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm">
                 <FileArchive size={16} className="text-text-secondary" />
                 Download xlsx breakdown
              </button>
            </div>
          </AccordionSection>

          <AccordionSection 
            number="02"
            title="Contract analysis"
            summaryPill={<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">3 critical clauses</span>}
          >
             <div className="py-8 text-center text-text-secondary text-sm">Contract analysis details placeholder...</div>
          </AccordionSection>

          <AccordionSection 
            number="03"
            title="Subcontractors analysis"
            summaryPill={<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">2 capability gaps</span>}
          >
             <div className="py-8 text-center text-text-secondary text-sm">Subcontractors specific data goes here...</div>
          </AccordionSection>
          
          <AccordionSection 
            number="04"
            title="Post contract analysis"
            summaryPill={<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">Approval dependency</span>}
          >
             <div className="py-8 text-center text-text-secondary text-sm">Post contract details placeholder...</div>
          </AccordionSection>
          
          <AccordionSection 
            number="05"
            title="Fee analysis"
            summaryPill={<span className="text-[10px] font-bold text-text-secondary">Not priceable yet</span>}
          >
             <div className="py-8 text-center text-text-secondary text-sm">Fee analysis calculations go here...</div>
          </AccordionSection>

        </div>
      </div>

      {/* --- Gallery Modal Overlay --- */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsGalleryOpen(false)}
            className="fixed inset-0 bg-navy-mid/95 backdrop-blur-md z-[100] flex flex-col cursor-pointer"
          >
             <div className="p-6 flex justify-between items-center border-b border-white/10">
               <h2 className="text-white font-bold tracking-widest uppercase text-sm">Project Imagery Gallery</h2>
               <button onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(false); }} className="text-white/60 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
                 <X size={20} />
               </button>
             </div>
             
             {/* Scrolling Content */}
             <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory gap-8 p-10 items-center justify-start scrollbar-thin hide-scrollbar" onClick={(e) => e.stopPropagation()}>
                {MOCK_PROJECT_IMAGES.map((img, i) => (
                  <div key={i} className="flex-shrink-0 snap-center w-[85vw] max-w-[1000px] flex flex-col mx-auto">
                    <img src={img.url} className="w-full max-h-[70vh] object-contain rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" alt={img.desc} />
                    <div className="mt-8 text-center bg-black/20 p-6 rounded-xl border border-white/10 backdrop-blur-md">
                       <p className="text-white font-bold text-xl">{img.desc}</p>
                       <p className="text-yellow/90 font-mono tracking-wider text-sm mt-2">{img.ref}</p>
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Floating Chat Elements --- */}
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-navy-mid/20 backdrop-blur-sm z-40 transition-opacity duration-300", 
          isChatOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )} 
        onClick={() => setIsChatOpen(false)} 
      />

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-navy-primary text-yellow rounded-full shadow-lg flex items-center justify-center hover:bg-navy-mid hover:scale-105 transition-all z-40 group"
      >
        <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide-out Chat Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 w-full md:w-[400px] h-screen bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-border",
          isChatOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-off-white/50">
          <div>
            <h3 className="font-bold text-navy-primary">HALO AI Assistant</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Context: Golf Club RFP</p>
          </div>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded bg-white border border-border text-text-secondary hover:bg-surface-grey hover:text-navy-primary transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Chat Content Area (Placeholder) */}
        <div className="flex-1 p-6 overflow-y-auto bg-surface-grey/20">
          <div className="text-center text-xs text-text-secondary/60 mt-10">
            Ask questions about the uploaded project documents, request custom data extraction, or get clarifications on the scoring metrics.
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="relative flex items-center">
            <textarea 
              rows={1}
              placeholder="Ask anything about this assessment..."
              className="w-full bg-off-white border border-border rounded-xl pl-4 pr-12 py-3 text-sm text-navy-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-colors resize-none overflow-hidden"
            />
            <button className="absolute right-2 w-8 h-8 rounded-lg bg-navy-primary text-yellow flex items-center justify-center hover:opacity-90 transition-opacity">
              <Send size={14} className="-ml-0.5 mt-0.5" />
            </button>
          </div>
          <div className="text-center text-[9px] text-text-secondary mt-3">
            AI can make mistakes. Verify critical information in GO/NO-GO breakdown.
          </div>
        </div>
      </div>

    </div>
  );
};
