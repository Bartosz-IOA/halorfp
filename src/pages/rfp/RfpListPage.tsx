// src/pages/rfp/RfpListPage.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plus, FileText, Clock, ChevronRight, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface Analysis {
  id: string;
  name: string;
  status: 'COMPLETE' | 'PROCESSING' | 'FAILED';
  files: number;
  date: string;
  comment?: string;
}

const MOCK_ANALYSES: Analysis[] = [
  {
    id: '1',
    name: 'Project Horizon RFP - Infrastructure',
    status: 'COMPLETE',
    files: 3,
    date: '2 hours ago',
    comment: 'Primary focus on the technical requirements for the cloud migration phase.',
  },
  {
    id: '2',
    name: 'Global Logistics Software Tenders',
    status: 'PROCESSING',
    files: 1,
    date: 'Just now',
  },
  {
    id: '3',
    name: 'Healthcare Systems Modernization',
    status: 'FAILED',
    files: 5,
    date: '1 day ago',
    comment: 'Missing core pricing document in the initial upload batch.',
  },
];

const StatusBadge = ({ status }: { status: Analysis['status'] }) => {
  const styles = {
    COMPLETE: "bg-green-100 text-status-complete",
    PROCESSING: "bg-amber-100 text-status-process",
    FAILED: "bg-red-100 text-status-failed",
  };
  
  const labels = {
    COMPLETE: "Complete",
    PROCESSING: "Analysing",
    FAILED: "Failed",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
      {status === 'PROCESSING' && <span className="ml-1 animate-pulse">...</span>}
    </span>
  );
};

export const RfpListPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setAnalyses(MOCK_ANALYSES);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-white rounded-lg animate-pulse border border-border" />
        ))}
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white m-8 rounded-xl border border-dashed border-border">
        <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center mb-6">
          <FileText size={32} className="text-text-secondary opacity-40" />
        </div>
        <h2 className="text-xl font-bold mb-2">No analyses yet</h2>
        <p className="text-text-secondary mb-8 max-w-sm">
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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-text-secondary mb-1">{analyses.length} analyses total</p>
          <p className="text-text-secondary">Review past analyses or start a new one.</p>
        </div>
        <NavLink to="/rfp/new" className="btn btn-primary px-6 py-2.5">
          <Plus size={18} className="mr-2" />
          New Analysis
        </NavLink>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
          <input 
            type="text" 
            placeholder="Search analyses..." 
            className="input pl-10 h-10 text-sm"
          />
        </div>
        <button className="btn btn-ghost border border-border px-4 h-10 text-sm flex items-center gap-2">
          <Filter size={16} />
          Filter
        </button>
      </div>

      <div className="space-y-3">
        {analyses.map((analysis) => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(analysis.status === 'PROCESSING' ? `/rfp/${analysis.id}/processing` : `/rfp/${analysis.id}`)}
            className="card group hover:bg-surface-grey border border-transparent hover:border-yellow/20 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded bg-off-white flex items-center justify-center text-navy-primary group-hover:bg-white transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-md mb-1 group-hover:text-navy-mid transition-colors">
                    {analysis.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {analysis.date}
                    </span>
                    <span>•</span>
                    <span>{analysis.files} files</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={analysis.status} />
                <ChevronRight size={16} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            
            {analysis.comment && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-text-secondary italic line-clamp-1">
                  "{analysis.comment}"
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
