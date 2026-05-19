// src/store/useEdgnexDemoStore.ts
import { create } from 'zustand';

export const EDGNEX_DEMO_ANALYSIS_ID = 'edgnex-dc-ksa';

interface EdgnexDemoState {
  /** When true, EDGNEX appears on the list and /rfp/edgnex-dc-ksa is allowed. */
  isVisible: boolean;
  /** Set when starting analysis from New Analysis; allows the processing route for EDGNEX. */
  isProcessingFromNewFlow: boolean;
  beginDemoFromNewAnalysis: () => void;
  completeDemoProcessing: () => void;
  reset: () => void;
}

export const useEdgnexDemoStore = create<EdgnexDemoState>((set) => ({
  isVisible: false,
  isProcessingFromNewFlow: false,
  beginDemoFromNewAnalysis: () => set({ isProcessingFromNewFlow: true }),
  completeDemoProcessing: () => set({ isVisible: true, isProcessingFromNewFlow: false }),
  reset: () => set({ isVisible: false, isProcessingFromNewFlow: false }),
}));
