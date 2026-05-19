// src/pages/rfp/ProcessingPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, FileText, CheckCircle2 } from 'lucide-react';
import { EDGNEX_DEMO_ANALYSIS_ID, useEdgnexDemoStore } from '../../store/useEdgnexDemoStore';

const STEPS = [
  "Reading documents...",
  "Identifying key requirements...",
  "Assessing risk factors...",
  "Generating executive summary...",
  "Formatting results...",
];

const TOTAL_DURATION_MS = 4 * 60 * 1000;
const STEP_DURATION_MS = TOTAL_DURATION_MS / STEPS.length;

export const ProcessingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const isProcessingFromNewFlow = useEdgnexDemoStore((s) => s.isProcessingFromNewFlow);
  const isEdgnexVisible = useEdgnexDemoStore((s) => s.isVisible);
  const completeDemoProcessing = useEdgnexDemoStore((s) => s.completeDemoProcessing);
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
  }, []);

  const finishProcessing = useCallback(() => {
    if (!id) return;
    if (id === EDGNEX_DEMO_ANALYSIS_ID) {
      completeDemoProcessing();
    }
    navigate(`/rfp/${id}`, { replace: true });
  }, [id, navigate, completeDemoProcessing]);

  const skipToAnalysis = useCallback(() => {
    clearTimers();
    finishProcessing();
  }, [clearTimers, finishProcessing]);

  useEffect(() => {
    if (id !== EDGNEX_DEMO_ANALYSIS_ID || isProcessingFromNewFlow) return;
    if (isEdgnexVisible) {
      navigate(`/rfp/${EDGNEX_DEMO_ANALYSIS_ID}`, { replace: true });
    } else {
      navigate('/rfp', { replace: true });
    }
  }, [id, isProcessingFromNewFlow, isEdgnexVisible, navigate]);

  useEffect(() => {
    if (!id) return;
    if (id === EDGNEX_DEMO_ANALYSIS_ID && !isProcessingFromNewFlow) return;

    setCurrentStep(0);

    stepIntervalRef.current = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, STEP_DURATION_MS);

    completionTimerRef.current = setTimeout(finishProcessing, TOTAL_DURATION_MS);

    return clearTimers;
  }, [id, isProcessingFromNewFlow, finishProcessing, clearTimers]);

  return (
    <div className="h-[calc(100vh-theme(height.topbar))] flex items-center justify-center p-8 bg-off-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full text-center shadow-modal"
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <Loader2 className="w-16 h-16 text-yellow animate-spin pointer-events-none" strokeWidth={3} />
            <button
              type="button"
              onClick={skipToAnalysis}
              className="absolute inset-0 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 cursor-pointer"
              aria-label="Skip to analysis"
              title="Skip to analysis"
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-navy-primary shadow-sm hover:bg-surface-grey transition-colors">
                <FileText size={20} />
              </div>
            </button>
          </div>

          <h2 className="text-xl font-bold text-navy-primary mb-2">Analyzing your documents</h2>
          <p className="text-text-secondary text-sm mb-8">
            This usually takes about 4 minutes. We'll notify you when it's ready.
          </p>

          <div className="w-full bg-surface-grey rounded-lg p-6 text-left border border-border">
            <div className="space-y-4">
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

          <div className="mt-8 pt-8 border-t border-border w-full flex flex-col gap-4">
            <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">
              Running background tasks
            </p>
            <NavLink to="/rfp" className="text-navy-primary font-bold text-sm hover:underline">
              Continue in background
            </NavLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
