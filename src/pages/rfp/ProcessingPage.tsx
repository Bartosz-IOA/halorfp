// src/pages/rfp/ProcessingPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, FileText, CheckCircle2 } from 'lucide-react';

const STEPS = [
  "Reading documents...",
  "Identifying key requirements...",
  "Assessing risk factors...",
  "Generating executive summary...",
  "Formatting results...",
];

export const ProcessingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);

    // Simulate completion after 12 seconds
    const completionTimer = setTimeout(() => {
      navigate(`/rfp/${id}`);
    }, 12000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completionTimer);
    };
  }, [id, navigate]);

  return (
    <div className="h-[calc(100vh-theme(height.topbar))] flex items-center justify-center p-8 bg-off-white">
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
            This usually takes 1–3 minutes. We'll notify you when it's ready.
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
