// src/pages/rfp/NewAnalysisPage.tsx
import React, { useState, useCallback } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { 
  CloudUpload, File, X, CheckCircle2, AlertCircle, Loader2, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { uploadFile, getSignedUrl, createAnalysis, triggerN8nWorkflow } from '../../lib/analysisService';

interface FileState {
  file: File;
  id: string;
  status: 'QUEUED' | 'UPLOADING' | 'SUCCESS' | 'ERROR';
  progress: number;
  storagePath?: string;
  error?: string;
}

export const NewAnalysisPage: React.FC = () => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [analysisName, setAnalysisName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileState[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'QUEUED',
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || files.length === 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Step 1: Generate a temporary ID for the storage path
      const tempId = crypto.randomUUID();

      // Step 2: Upload all files to Supabase Storage with progress simulation
      const uploadResults: { path: string; name: string; size: number }[] = [];
      for (const fileState of files) {
        setFiles(prev => prev.map(f =>
          f.id === fileState.id ? { ...f, status: 'UPLOADING', progress: 30 } : f
        ));

        const path = await uploadFile(user.id, tempId, fileState.file);
        uploadResults.push({ path, name: fileState.file.name, size: fileState.file.size });

        setFiles(prev => prev.map(f =>
          f.id === fileState.id ? { ...f, status: 'SUCCESS', progress: 100, storagePath: path } : f
        ));
      }

      // Step 3: Generate signed URLs for n8n to download the files
      const signedUrls = await Promise.all(uploadResults.map(r => getSignedUrl(r.path)));

      // Step 4: Create the analysis row in the database
      const name = analysisName.trim() || files.map(f => f.file.name).join(', ');
      const analysis = await createAnalysis({
        userId: user.id,
        name,
        comment,
        fileUrls: uploadResults.map(r => r.path),
        fileNames: uploadResults.map(r => r.name),
        fileSizes: uploadResults.map(r => r.size),
      });

      // Step 5: Trigger the n8n webhook (fire and forget — we poll the DB for completion)
      await triggerN8nWorkflow({
        analysisId: analysis.id,
        userId: user.id,
        signedFileUrls: signedUrls,
        fileNames: uploadResults.map(r => r.name),
        comment,
      });

      // Step 6: Navigate to the processing page
      navigate(`/rfp/${analysis.id}/processing`);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-4 md:p-8 max-w-4xl mx-auto">
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Analysis Name */}
        <section>
          <label className="block text-sm font-bold text-navy-primary mb-2">
            Analysis Name
          </label>
          <input
            type="text"
            value={analysisName}
            onChange={e => setAnalysisName(e.target.value)}
            placeholder="e.g. Project Horizon RFP – Infrastructure"
            className="input text-sm"
            disabled={isSubmitting}
          />
          <p className="text-xs text-text-secondary mt-1.5">
            If left blank, we'll use the uploaded file names.
          </p>
        </section>

        {/* File Upload */}
        <section>
          <label className="block text-sm font-bold text-navy-primary mb-2">
            Documents
          </label>
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
              ${isDragActive ? 'border-yellow bg-yellow/5' : 'border-border hover:border-navy-primary/30 hover:bg-surface-grey/50'}
              ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 bg-off-white rounded-full flex items-center justify-center mb-4 text-text-secondary">
                <CloudUpload size={28} />
              </div>
              <p className="text-sm font-medium text-navy-primary mb-1">
                {isDragActive ? 'Drop files here' : 'Drag files here or click to browse'}
              </p>
              <p className="text-xs text-text-secondary">
                PDF, DOCX, XLSX — max 50MB per file
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <AnimatePresence>
              {files.map(f => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-3 p-3 bg-white border border-border rounded-lg shadow-sm"
                >
                  <div className="w-8 h-8 rounded bg-off-white flex items-center justify-center text-text-secondary shrink-0">
                    <File size={16} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium truncate">{f.file.name}</p>
                      <span className="text-[10px] text-text-secondary ml-2 shrink-0">
                        {(f.file.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-off-white rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${f.progress}%` }}
                          className={`h-full ${f.status === 'SUCCESS' ? 'bg-status-complete' : f.status === 'ERROR' ? 'bg-status-failed' : 'bg-yellow'}`}
                        />
                      </div>
                      <span className="text-[10px] font-bold w-10 text-right">
                        {f.status === 'SUCCESS' ? 'DONE' : f.status === 'ERROR' ? 'ERR' : `${Math.round(f.progress)}%`}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {f.status === 'SUCCESS' && <CheckCircle2 size={16} className="text-status-complete" />}
                    {f.status === 'ERROR' && <AlertCircle size={16} className="text-status-failed" />}
                    {f.status === 'UPLOADING' && <Loader2 size={16} className="animate-spin text-yellow" />}
                    {!isSubmitting && (
                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        className="p-1 hover:bg-surface-grey rounded text-text-secondary"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Comment */}
        <section>
          <label className="block text-sm font-bold text-navy-primary mb-2">
            Additional context <span className="font-normal text-text-secondary">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value.slice(0, 5000))}
            placeholder="Add notes, priorities, or context to guide the analysis..."
            className="input min-h-[100px] resize-none text-sm leading-relaxed"
            disabled={isSubmitting}
          />
          <div className="text-right mt-1">
            <span className={`text-[10px] ${comment.length > 4500 ? 'text-status-failed' : 'text-text-secondary'}`}>
              {comment.length} / 5000
            </span>
          </div>
        </section>

        {/* Error */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle size={18} className="text-status-failed shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{submitError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => navigate('/rfp')}
            className="btn btn-ghost px-6"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={files.length === 0 || isSubmitting}
            className="btn btn-primary px-10 h-11"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Uploading & Starting Analysis...
              </>
            ) : (
              'Run Analysis'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
