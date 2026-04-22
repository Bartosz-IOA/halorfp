// src/pages/rfp/NewAnalysisPage.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  CloudUpload, 
  File, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileState {
  file: File;
  id: string;
  status: 'QUEUED' | 'UPLOADING' | 'SUCCESS' | 'ERROR';
  progress: number;
  error?: string;
}

export const NewAnalysisPage: React.FC = () => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileState[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'QUEUED',
      progress: 0
    }));
    
    setFiles(prev => [...prev, ...newFiles]);

    // Simulate individual file uploads
    newFiles.forEach(fileState => {
      simulateUpload(fileState.id);
    });
  }, []);

  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'SUCCESS', progress: 100 } : f));
      } else {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'UPLOADING', progress } : f));
      }
    }, 400);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.filter(f => f.status === 'SUCCESS').length === 0) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    navigate('/rfp/new-id/processing');
  };

  const allUploaded = files.length > 0 && files.every(f => f.status === 'SUCCESS');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <NavLink 
        to="/rfp" 
        className="inline-flex items-center text-text-secondary hover:text-navy-primary mb-6 transition-fast text-sm font-medium"
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to RFP Analysis
      </NavLink>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-navy-primary">New Analysis</h2>
        <p className="text-text-secondary">Upload documents and provide context to start the analysis.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section A: Upload */}
        <section>
          <div 
            {...getRootProps()} 
            className={`
              relative border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
              ${isDragActive ? 'border-yellow bg-yellow/5' : 'border-border hover:border-text-secondary/50'}
              ${files.length > 0 ? 'pb-8' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-off-white rounded-full flex items-center justify-center mb-4 text-text-secondary">
                <CloudUpload size={32} />
              </div>
              <p className="text-md font-medium text-navy-primary mb-1">
                Drag files here or click to browse
              </p>
              <p className="text-sm text-text-secondary">
                PDF, DOCX, XLSX — max 50MB per file
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <AnimatePresence>
              {files.map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-4 p-3 bg-white border border-border rounded-md shadow-sm"
                >
                  <div className="w-8 h-8 rounded bg-off-white flex items-center justify-center text-text-secondary shrink-0">
                    <File size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1">
                      <p className="text-sm font-medium truncate">{f.file.name}</p>
                      <span className="text-xs text-text-secondary">{(f.file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-off-white rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${f.progress}%` }}
                          className={`h-full transition-all ${f.status === 'SUCCESS' ? 'bg-status-complete' : 'bg-yellow'}`}
                        />
                      </div>
                      <span className="text-[10px] font-bold w-8">
                        {f.status === 'SUCCESS' ? 'DONE' : `${Math.round(f.progress)}%`}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {f.status === 'SUCCESS' && <CheckCircle2 size={18} className="text-status-complete" />}
                    {f.status === 'ERROR' && <AlertCircle size={18} className="text-status-failed" />}
                    {f.status === 'UPLOADING' && <Loader2 size={18} className="animate-spin text-yellow" />}
                    
                    <button 
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="p-1 hover:bg-surface-grey rounded text-text-secondary pointer-events-auto"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Section B: Context */}
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-navy-primary mb-2">
              Additional context (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 5000))}
              placeholder="Add notes, priorities, or context to guide the analysis..."
              className="input min-h-[120px] resize-none text-sm leading-relaxed"
            />
            <div className="text-right mt-1">
              <span className={`text-[10px] ${comment.length > 4500 ? 'text-status-failed' : 'text-text-secondary'}`}>
                {comment.length} / 5000
              </span>
            </div>
          </div>
        </section>

        {/* Section C: Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-border">
          <button 
            type="button"
            onClick={() => navigate('/rfp')}
            className="btn btn-ghost px-6"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!allUploaded || isSubmitting}
            className="btn btn-primary px-10 h-11 relative"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Processing Analysis...
              </>
            ) : (
              'Run Analysis'
            )}
            {(!allUploaded && files.length > 0) && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-navy-primary text-white text-[10px] px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Wait for uploads to complete
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
