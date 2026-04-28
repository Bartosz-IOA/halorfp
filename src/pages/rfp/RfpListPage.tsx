// src/pages/rfp/RfpListPage.tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, ChevronRight, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrentOrg, useAnalyses } from '../../lib/queries';
import type { AnalysisStatus } from '../../lib/database.types';

const StatusBadge = ({ status }: { status: AnalysisStatus }) => {
  const styles: Record<AnalysisStatus, string> = {
    queued:     "bg-slate-100 text-slate-600",
    processing: "bg-amber-100 text-status-process",
    complete:   "bg-green-100 text-status-complete",
    failed:     "bg-red-100 text-status-failed",
  };

  const labels: Record<AnalysisStatus, string> = {
    queued:     "Queued",
    processing: "Analysing",
    complete:   "Complete",
    failed:     "Failed",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
      {status === 'processing' && <span className="ml-1 animate-pulse">...</span>}
    </span>
  );
};

// Human-friendly relative time, falls back to absolute date after a week.
function formatRelative(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60)  return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)  return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7)      return `${days} day${days !== 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString();
}

export const RfpListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const { data: membership, isLoading: orgLoading } = useCurrentOrg();
  const { data: analyses, isLoading: analysesLoading, error } = useAnalyses(
    membership?.organization_id,
    { search: search || undefined }
  );

  const isLoading = orgLoading || analysesLoading;

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white rounded-lg animate-pulse border border-border" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 text-sm">
        Failed to load analyses: {error.message}
      </div>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 text-center bg-white my-4 md:m-8 rounded-xl border border-dashed border-border">
        <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center mb-6">
          <FileText size={32} className="text-text-secondary opacity-40" />
        </div>
        <h2 className="text-xl font-bold mb-2">No analyses yet</h2>
        <p className="text-text-secondary mb-8 max-w-sm text-sm">
          Upload your first RFP to get started with pre-contract intelligence.
        </p>
        <NavLink to="/rfp/new" className="btn btn-primary px-8 py-3 w-full sm:w-auto">
          <Plus size={18} className="mr-2" />
          New Analysis
        </NavLink>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-text-secondary">{analyses.length} analyses total</p>
          <p className="text-text-secondary text-xs md:text-sm hidden sm:block">Review past analyses or start a new one.</p>
        </div>
        <NavLink to="/rfp/new" className="btn btn-primary px-4 py-2 text-sm flex items-center gap-1.5 shrink-0">
          <Plus size={16} className="shrink-0" />
          <span>New Analysis</span>
        </NavLink>
      </div>

      {/* Search + Filter Row */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
          <input
            type="text"
            placeholder="Search analyses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9 h-9 text-sm"
          />
        </div>
        <button className="btn btn-ghost border border-border px-3 h-9 text-sm flex items-center gap-1.5 shrink-0">
          <Filter size={14} />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-2">
        {analyses.map((analysis) => {
          const isProcessing = analysis.status === 'processing' || analysis.status === 'queued';
          return (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(isProcessing ? `/rfp/${analysis.id}/processing` : `/rfp/${analysis.id}`)}
              className="bg-white rounded-xl border border-border px-4 py-3 group hover:bg-surface-grey hover:border-yellow/20 cursor-pointer transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 shrink-0 rounded bg-off-white flex items-center justify-center text-navy-primary group-hover:bg-white transition-colors">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-navy-primary leading-snug truncate group-hover:text-navy-mid transition-colors">
                      {analysis.title || analysis.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {formatRelative(analysis.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StatusBadge status={analysis.status} />
                  <ChevronRight size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {analysis.comment && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <p className="text-xs text-text-secondary italic line-clamp-1">
                    "{analysis.comment}"
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
