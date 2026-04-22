// src/pages/rfp/ResultsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download, ChevronDown, ChevronRight, ChevronLeft,
  FileArchive, Info, MessageSquare, X, Send, Loader2, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getAnalysis } from '../../lib/analysisService';
import type { Analysis, AnalysisResults, GoNoGoCriterion } from '../../types/analysis';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map n8n color strings to Tailwind classes
const colorMap: Record<string, string> = {
  green: 'bg-green-500',
  amber: 'bg-amber-500',
  red: 'bg-red-600',
  grey: 'bg-slate-400',
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

const IndicatorCard = ({
  label, value, subtext, alert
}: {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  alert?: boolean;
}) => (
  <div className={cn("flex flex-col p-4 rounded-xl border", alert ? "bg-red-50 border-red-200" : "bg-white border-border shadow-sm")}>
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
  title, number, summaryPill, defaultExpanded = false, children
}: {
  title: string;
  number?: string;
  summaryPill?: React.ReactNode;
  defaultExpanded?: boolean;
  children?: React.ReactNode;
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

// ─── GO/NO-GO ROW ────────────────────────────────────────────────────────────

const GoNoGoRow = ({ data, questions }: {
  data: GoNoGoCriterion;
  questions: AnalysisResults['questions'];
}) => {
  const [open, setOpen] = useState(false);
  const widthPercent = data.score > 0 ? (data.score / data.max) * 100 : 0;
  const tailwindColor = colorMap[data.color] || 'bg-slate-400';

  return (
    <div className="mb-2">
      <div
        className={cn("grid grid-cols-[1fr_2fr_120px_24px] gap-3 items-center p-2 rounded-lg cursor-pointer hover:bg-surface-grey transition-colors", open && "bg-surface-grey")}
        onClick={() => setOpen(!open)}
      >
        <div className="text-xs text-navy-primary font-medium truncate pr-2">{data.name}</div>

        <div className="relative h-1.5 bg-border rounded-full overflow-hidden">
          {data.is_blocker ? (
            <div className="absolute inset-0 bg-red-600 rounded-full" />
          ) : (
            <div className={cn("absolute left-0 top-0 bottom-0 rounded-full transition-all duration-500", tailwindColor)} style={{ width: `${widthPercent}%` }} />
          )}
        </div>

        <div className="text-right">
          <div className={cn("text-xs font-bold", data.is_blocker ? "text-red-600" : data.score === 0 ? "text-slate-500" : "text-green-600")}>
            {data.is_blocker ? "blocker" : `${data.score} / ${data.max}`}
          </div>
          <div className="text-[9px] text-text-secondary truncate">{data.text}</div>
        </div>

        <div className="flex justify-end items-center h-full">
          <ChevronLeft size={16} className={cn("text-text-secondary/60 transition-transform duration-300", open ? "-rotate-90" : "rotate-0")} />
        </div>
      </div>

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
                {questions.map((q, i) => (
                  <div key={i} className="grid grid-cols-[2fr_1fr_2fr_1fr] gap-4 py-2 border-b border-border last:border-0 items-start">
                    <div className="text-xs text-navy-primary">{q.question}</div>
                    <div className={cn("text-xs font-bold", q.answer.toLowerCase() === 'yes' ? "text-green-600" : "text-red-600")}>{q.answer}</div>
                    <div className="text-xs text-text-secondary">{q.notes}</div>
                    <div className="text-xs text-navy-primary font-medium text-right italic cursor-pointer hover:underline">{q.reference}</div>
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

// ─── LOADING / ERROR STATES ───────────────────────────────────────────────────

const LoadingState = () => (
  <div className="min-h-full p-4 md:p-8 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 text-text-secondary">
      <Loader2 size={32} className="animate-spin text-yellow" />
      <p className="text-sm">Loading analysis results...</p>
    </div>
  </div>
);

const ErrorState = ({ message, onBack }: { message: string; onBack: () => void }) => (
  <div className="min-h-full p-4 md:p-8 flex items-center justify-center">
    <div className="card max-w-md w-full text-center">
      <AlertCircle size={40} className="text-status-failed mx-auto mb-4 opacity-60" />
      <h2 className="font-bold text-navy-primary mb-2">Could not load results</h2>
      <p className="text-sm text-text-secondary mb-6">{message}</p>
      <button onClick={onBack} className="btn btn-primary px-8">Go Back</button>
    </div>
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export const ResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await getAnalysis(id);
        if (data.status === 'PROCESSING') {
          navigate(`/rfp/${id}/processing`, { replace: true });
          return;
        }
        setAnalysis(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load analysis.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (loading) return <LoadingState />;
  if (error || !analysis) return <ErrorState message={error || 'Analysis not found.'} onBack={() => navigate('/rfp')} />;
  if (!analysis.results) return <ErrorState message="This analysis has no results yet." onBack={() => navigate('/rfp')} />;

  const r: AnalysisResults = analysis.results;
  const totalGfa = r.buildings.reduce((sum, b) => sum + b.gfa_m2, 0);
  const scorePct = Math.round((r.verdict.total_score / r.verdict.max_score) * 100);
  const isNoGo = r.verdict.decision === 'NO-GO' || r.verdict.has_blocker;

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8 font-sans bg-off-white">
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* ── Top Hero Block ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 items-start">

          {/* Executive Summary */}
          <div className="bg-white rounded-xl p-6 border border-border shadow-sm">
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-navy-primary mb-1">{r.project.name}</h2>
              <p className="text-sm text-text-secondary">{r.project.client} · {r.project.location}</p>
            </div>

            <p className="text-sm text-text-primary leading-relaxed mb-6">{r.project.executive_summary}</p>

            {/* Breakdown Data */}
            <div className="flex flex-col mb-6 text-xs border-y border-border py-2">
              {r.breakdown.map((item, i) => (
                <div key={i} className="flex flex-col md:grid md:grid-cols-[150px_1fr_40px] gap-1 md:gap-x-6 py-3 md:py-2 border-b border-border/50 last:border-0 md:items-start relative">
                  <div className="font-bold text-text-secondary pr-8 md:pr-0 md:mt-1">{item.label}</div>
                  <div className="text-navy-primary whitespace-pre-line leading-relaxed text-[13px] md:text-xs">{item.value}</div>
                  <div className="group absolute top-3 right-0 md:relative md:top-auto md:flex md:justify-end">
                    <Info size={16} className="text-text-secondary/50 cursor-help md:mt-1 hover:text-navy-primary transition-colors" />
                    <div className="absolute right-0 top-full mt-2 md:top-auto md:bottom-full md:mb-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-navy-mid text-white p-4 rounded-xl shadow-modal z-50 w-[280px] sm:w-[320px] pointer-events-none">
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

            {/* Buildings Table */}
            {r.buildings.length > 0 && (
              <div className="mb-6 border border-border rounded-lg overflow-x-auto bg-white text-xs shadow-sm">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead className="bg-surface-grey border-b border-border">
                    <tr>
                      <th className="px-4 py-2 font-bold text-text-secondary border-r border-border">Building</th>
                      <th className="px-4 py-2 font-bold text-text-secondary border-r border-border">Typology</th>
                      <th className="px-4 py-2 font-bold text-text-secondary text-right">Area (GFA)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {r.buildings.map((b, i) => (
                      <tr key={i} className="hover:bg-surface-grey/50 transition-colors">
                        <td className="px-4 py-2.5 border-r border-border font-medium text-navy-primary">{b.name}</td>
                        <td className="px-4 py-2.5 border-r border-border text-navy-primary">{b.typology}</td>
                        <td className="px-4 py-2.5 text-navy-primary text-right font-mono text-[11px]">{b.gfa_m2.toLocaleString()} m²</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-off-white/80 border-t border-border">
                    <tr>
                      <td colSpan={2} className="px-4 py-3 font-bold text-text-secondary text-right uppercase tracking-widest text-[10px]">Total GFA</td>
                      <td className="px-4 py-3 text-navy-primary font-bold text-right font-mono text-sm">{totalGfa.toLocaleString()} m²</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Project Images */}
            {r.project_images.length > 0 && (
              <div className="mt-6 border-t border-border pt-6">
                <h3 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-4">PROJECT IMAGERY</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {r.project_images.map((img, i) => (
                    <div key={i} onClick={() => setIsGalleryOpen(true)} className="flex-shrink-0 relative w-[240px] h-[160px] rounded-lg overflow-hidden cursor-pointer group border border-border shadow-sm">
                      <img src={img.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={img.description} />
                      <div className="absolute inset-0 bg-navy-primary/10 group-hover:bg-transparent transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-4">
            <IndicatorCard
              label="TOTAL SCORE"
              value={`${scorePct}%`}
              subtext={`${r.verdict.total_score} / ${r.verdict.max_score} pts`}
              alert={isNoGo}
            />
            <IndicatorCard
              label="DECISION"
              value={<span className="text-lg">{r.verdict.decision}</span>}
              subtext={r.verdict.has_blocker ? r.verdict.blocker_reason ?? 'Blocker present' : `${r.go_no_go_criteria.length} criteria assessed`}
              alert={isNoGo}
            />
            <IndicatorCard
              label="BLOCKERS"
              value={r.verdict.has_blocker ? '⚠ Yes' : 'None'}
              subtext={r.verdict.has_blocker ? r.verdict.blocker_reason ?? '' : 'No critical blockers found'}
              alert={r.verdict.has_blocker}
            />
            <IndicatorCard
              label="FILES ANALYSED"
              value={<span className="text-lg">{analysis.file_names.length}</span>}
              subtext={analysis.file_names.join(', ')}
            />
            <IndicatorCard
              label="BUILDINGS"
              value={<span className="text-lg">{r.buildings.length}</span>}
              subtext={`${totalGfa.toLocaleString()} m² total GFA`}
            />
            <IndicatorCard
              label="PROCESSED"
              value={<span className="text-sm font-bold">{new Date(r.processed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
              subtext={new Date(r.processed_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            />
          </div>
        </div>

        {/* ── Source Documents ── */}
        <AccordionSection
          title="SOURCE DOCUMENTS"
          summaryPill={<span className="text-[10px] text-text-secondary"><strong className="text-navy-primary">{r.documents.length}</strong> RFP files</span>}
          defaultExpanded={true}
        >
          <div className="flex items-center justify-end mb-4 pb-2">
            <button className="flex items-center gap-2 bg-yellow hover:bg-yellow-dark text-navy-primary px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm">
              <Download size={16} />
              Download all ({r.documents.length} files)
            </button>
          </div>
          <div className="flex flex-wrap gap-4 pb-2">
            {r.documents.map((doc, i) => (
              <div key={i} className="flex-shrink-0 flex items-center gap-3 p-3 rounded-lg min-w-[200px] relative pr-10 border bg-white border-border">
                <div className="w-8 h-8 rounded flex items-center justify-center font-bold text-[9px] bg-red-50 text-red-600">
                  PDF
                </div>
                <div>
                  <p className="text-xs font-medium truncate max-w-[130px] text-navy-primary">{doc.name}</p>
                  <p className="text-[10px] text-text-secondary">{(doc.size_bytes / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <div className="absolute top-2 right-2 group">
                  <Info size={14} className="text-text-secondary/50 cursor-help hover:text-navy-primary transition-colors" />
                  <div className="absolute bottom-full right-0 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-navy-mid text-white p-3 rounded-xl shadow-modal z-50 w-[240px] pointer-events-none">
                    <p className="font-bold text-[9px] text-yellow uppercase tracking-widest mb-1.5 border-b border-white/10 pb-1.5 truncate">{doc.name}</p>
                    <p className="text-[10px] text-white/90 leading-relaxed text-left whitespace-normal">{doc.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* ── Analysis Accordions ── */}
        <div className="space-y-4 pb-12">
          <AccordionSection number="01" title="GO/NO-GO SCORING BREAKDOWN" defaultExpanded={true}>
            <div className="flex justify-between items-end mb-4 border-b border-border pb-2">
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                {r.go_no_go_criteria.length} criteria · Assessment Matrix
              </div>
              <div className="flex items-center gap-4 text-[10px] text-text-secondary">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-green-500" /> Positive</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-red-600" /> Blocker</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-slate-400" /> No score</span>
              </div>
            </div>
            <div className="space-y-1">
              {r.go_no_go_criteria.map(criterion => (
                <GoNoGoRow key={criterion.id} data={criterion} questions={r.questions} />
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-4 flex justify-end">
              <button className="flex items-center gap-2 bg-white border border-border hover:bg-surface-grey text-navy-primary px-4 py-2 rounded-lg font-bold text-xs transition-colors shadow-sm">
                <FileArchive size={16} className="text-text-secondary" />
                Download xlsx breakdown
              </button>
            </div>
          </AccordionSection>

          <AccordionSection number="02" title="Contract analysis" summaryPill={<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">Coming soon</span>}>
            <div className="py-8 text-center text-text-secondary text-sm">Contract analysis will be available in the next release.</div>
          </AccordionSection>

          <AccordionSection number="03" title="Subcontractors analysis" summaryPill={<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">Coming soon</span>}>
            <div className="py-8 text-center text-text-secondary text-sm">Subcontractor capability analysis coming soon.</div>
          </AccordionSection>

          <AccordionSection number="04" title="Post contract analysis" summaryPill={<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">Coming soon</span>}>
            <div className="py-8 text-center text-text-secondary text-sm">Post contract analysis coming soon.</div>
          </AccordionSection>

          <AccordionSection number="05" title="Fee analysis" summaryPill={<span className="text-[10px] font-bold text-text-secondary">Not priceable yet</span>}>
            <div className="py-8 text-center text-text-secondary text-sm">Fee analysis coming soon.</div>
          </AccordionSection>
        </div>
      </div>

      {/* ── Gallery Modal ── */}
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
              <h2 className="text-white font-bold tracking-widest uppercase text-sm">Project Imagery</h2>
              <button onClick={e => { e.stopPropagation(); setIsGalleryOpen(false); }} className="text-white/60 hover:text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory gap-8 p-10 items-center" onClick={e => e.stopPropagation()}>
              {r.project_images.map((img, i) => (
                <div key={i} className="flex-shrink-0 snap-center w-[85vw] max-w-[1000px] flex flex-col mx-auto">
                  <img src={img.url} className="w-full max-h-[70vh] object-contain rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]" alt={img.description} />
                  <div className="mt-8 text-center bg-black/20 p-6 rounded-xl border border-white/10 backdrop-blur-md">
                    <p className="text-white font-bold text-xl">{img.description}</p>
                    <p className="text-yellow/90 font-mono tracking-wider text-sm mt-2">{img.reference}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Chat ── */}
      <div
        className={cn("fixed inset-0 bg-navy-mid/20 backdrop-blur-sm z-40 transition-opacity duration-300", isChatOpen ? "opacity-100" : "opacity-0 pointer-events-none")}
        onClick={() => setIsChatOpen(false)}
      />
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-navy-primary text-yellow rounded-full shadow-lg flex items-center justify-center hover:bg-navy-mid hover:scale-105 transition-all z-40"
      >
        <MessageSquare size={24} />
      </button>
      <div className={cn("fixed top-0 right-0 w-full md:w-[400px] h-screen bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-l border-border", isChatOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex items-center justify-between p-6 border-b border-border bg-off-white/50">
          <div>
            <h3 className="font-bold text-navy-primary">HALO AI Assistant</h3>
            <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">Context: {r.project.name}</p>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-border text-text-secondary hover:bg-surface-grey hover:text-navy-primary transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto bg-surface-grey/20">
          <div className="text-center text-xs text-text-secondary/60 mt-10">
            Ask questions about the uploaded project documents, request custom data extraction, or get clarifications on the scoring metrics.
          </div>
        </div>
        <div className="p-4 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="relative flex items-center">
            <textarea
              rows={1}
              placeholder="Ask anything about this assessment..."
              className="w-full bg-off-white border border-border rounded-xl pl-4 pr-12 py-3 text-sm text-navy-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-colors resize-none"
            />
            <button className="absolute right-2 w-8 h-8 rounded-lg bg-navy-primary text-yellow flex items-center justify-center hover:opacity-90 transition-opacity">
              <Send size={14} />
            </button>
          </div>
          <div className="text-center text-[9px] text-text-secondary mt-3">
            AI can make mistakes. Verify critical information in the GO/NO-GO breakdown.
          </div>
        </div>
      </div>
    </div>
  );
};
