// src/pages/rfp/RfpListPage.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, ChevronRight, Search, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { listAnalyses } from '../../lib/analysisService';
import type { Analysis } from '../../types/analysis';

const StatusBadge = ({ status }: { status: Analysis['status'] }) => {
  const styles = {
    COMPLETE:   "bg-green-100 text-status-complete",
    PROCESSING: "bg-amber-100 text-status-process",
    FAILED:     "bg-red-100 text-status-failed",
  };
  const labels = {
    COMPLETE:   "Complete",
    PROCESSING: "Analysing",
    FAILED:     "Failed",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${styles[status]}`}>
      {labels[status]}
      {status === 'PROCESSING' && <span className="ml-1 animate-pulse">...</span>}
    </span>
  );
};

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export const RfpListPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listAnalyses();
      setAnalyses(data);
    } catch (err: any) {
      console.error('Failed to load analyses:', err);
      setError('Failed to load analyses. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();

    // Auto-refresh every 10s if any analysis is still PROCESSING
    const interval = setInterval(() => {
      if (analyses.some(a => a.status === 'PROCESSING')) {
        fetchAnalyses();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [analyses.length]);

  const filtered = analyses.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="px-4 py-4 md:px-6 md:py-6 space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-[72px] bg-white rounded-xl animate-pulse border border-border shadow-sm" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center mt-8">
        <AlertCircle size={40} className="text-status-failed mb-4 opacity-60" />
        <p className="text-navy-primary font-bold mb-1">Could not load analyses</p>
        <p className="text-text-secondary text-sm mb-6">{error}</p>
        <button onClick={fetchAnalyses} className="btn btn-primary px-6 flex items-center gap-2">
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center mt-8 mx-4 rounded-xl border border-dashed border-border bg-white">
        <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center mb-6">
          <FileText size={32} className="text-text-secondary opacity-40" />
        </div>
        <h2 className="text-xl font-bold mb-2">No analyses yet</h2>
        <p className="text-text-secondary mb-8 max-w-sm text-sm">
          Upload your first RFP to get started with pre-contract intelligence.
        </p>
        <NavLink to="/rfp/new" className="btn btn-primary px-8 py-3">
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
            className="input pl-9 h-9 text-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn btn-ghost border border-border px-3 h-9 text-sm flex items-center gap-1.5 shrink-0">
          <Filter size={14} />
          <span className="hidden sm:inline">Filter</span>
        </button>
        <button
          onClick={fetchAnalyses}
          className="btn btn-ghost border border-border px-3 h-9 text-sm flex items-center gap-1.5 shrink-0"
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-2">
        {filtered.map(analysis => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(
              analysis.status === 'PROCESSING'
                ? `/rfp/${analysis.id}/processing`
                : `/rfp/${analysis.id}`
            )}
            className="bg-white rounded-xl border border-border px-4 py-3 group hover:bg-surface-grey hover:border-yellow/20 cursor-pointer transition-all duration-200 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 shrink-0 rounded bg-off-white flex items-center justify-center text-navy-primary group-hover:bg-white transition-colors">
                  <FileText size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-navy-primary leading-snug truncate group-hover:text-navy-mid transition-colors">
                    {analysis.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {formatDate(analysis.created_at)}
                    </span>
                    <span>·</span>
                    <span>{analysis.file_names.length} file{analysis.file_names.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <StatusBadge status={analysis.status} />
                <ChevronRight size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {analysis.status === 'FAILED' && analysis.error_message && (
              <div className="mt-2 pt-2 border-t border-border/50">
                <p className="text-xs text-status-failed italic line-clamp-1">
                  Error: {analysis.error_message}
                </p>
              </div>
            )}
          </motion.div>
        ))}

        {filtered.length === 0 && searchQuery && (
          <div className="text-center py-10 text-text-secondary text-sm">
            No analyses match "<strong>{searchQuery}</strong>"
          </div>
        )}
      </div>
    </div>
  );
};
