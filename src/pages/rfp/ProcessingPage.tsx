// src/pages/rfp/ProcessingPage.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { pollAnalysisStatus } from '../../lib/analysisService';

const STEPS = [
  "Reading documents...",
  "Identifying key requirements...",
  "Assessing risk factors...",
  "Generating executive summary...",
  "Formatting results...",
];

const POLL_INTERVAL_MS = 3000; // Check DB every 3 seconds
const STEP_ADVANCE_MS = 4000;  // Advance the visible step every 4 seconds (cosmetic)

export const ProcessingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!id) return;

    // Advance UI steps cosmetically (doesn't affect actual polling)
    stepRef.current = setInterval(() => {
      setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, STEP_ADVANCE_MS);

    // Poll the database for real status changes
    pollingRef.current = setInterval(async () => {
      try {
        const analysis = await pollAnalysisStatus(id);

        if (analysis.status === 'COMPLETE') {
          clearAllTimers();
          navigate(`/rfp/${id}`);
        } else if (analysis.status === 'FAILED') {
          clearAllTimers();
          setError(analysis.error_message || 'The analysis failed. Please try submitting again.');
        }
        // If still PROCESSING, do nothing — keep polling
      } catch (err: any) {
        console.error('Polling error:', err);
        // Don't stop polling on a transient network error
      }
    }, POLL_INTERVAL_MS);

    return clearAllTimers;
  }, [id, navigate]);

  const clearAllTimers = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (stepRef.current) clearInterval(stepRef.current);
  };

  if (error) {
    return (
      <div className="h-[calc(100vh-theme(height.topbar))] flex items-center justify-center p-4 bg-off-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-md w-full text-center shadow-modal"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-status-failed" />
            </div>
            <h2 className="text-xl font-bold text-navy-primary mb-2">Analysis Failed</h2>
            <p className="text-text-secondary text-sm mb-8">{error}</p>
            <div className="flex gap-3">
              <NavLink to="/rfp" className="btn btn-ghost px-6">
                Go Back
              </NavLink>
              <NavLink to="/rfp/new" className="btn btn-primary px-6">
                Try Again
              </NavLink>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-theme(height.topbar))] flex items-center justify-center p-4 bg-off-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full text-center shadow-modal"
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <Loader2 className="w-16 h-16 text-yellow animate-spin" strokeWidth={3} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-navy-primary shadow-sm">
                <FileText size={20} />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-navy-primary mb-2">Analyzing your documents</h2>
          <p className="text-text-secondary text-sm mb-8">
            This usually takes 1–3 minutes. You can leave this page and come back.
          </p>

          <div className="w-full bg-surface-grey rounded-lg p-5 text-left border border-border">
            <div className="space-y-3.5">
              {STEPS.map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="shrink-0 flex items-center justify-center w-5 h-5">
                    {index < currentStep ? (
                      <CheckCircle2 size={18} className="text-status-complete" />
                    ) : index === currentStep ? (
                      <Loader2 size={16} className="animate-spin text-yellow" />
                    ) : (
                      <div className="w-1.5 h-1.5 bg-border rounded-full" />
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors ${index <= currentStep ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border w-full flex flex-col items-center gap-3">
            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">
              Running in background
            </p>
            <NavLink to="/rfp" className="text-navy-primary font-bold text-sm hover:underline">
              Continue in background →
            </NavLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
