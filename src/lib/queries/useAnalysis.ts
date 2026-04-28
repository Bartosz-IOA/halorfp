import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { Analysis, AnalysisFile, AnalysisSection, AnalysisImage } from '../database.types';

export interface AnalysisDetail extends Analysis {
  analysis_files: AnalysisFile[];
  analysis_sections: AnalysisSection[];
  analysis_images: AnalysisImage[];
}

// Fetches a single analysis with all its child rows in one query.
// Used by ResultsPage and ProcessingPage.
export function useAnalysis(id: string | undefined) {
  return useQuery({
    queryKey: ['analysis', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analyses')
        .select(`
          *,
          analysis_files(*),
          analysis_sections(* order by position asc),
          analysis_images(* order by position asc)
        `)
        .eq('id', id!)
        .single();

      if (error) throw error;
      return data as AnalysisDetail;
    },
  });
}

// Polls status every 4 seconds while an analysis is processing.
// Used by ProcessingPage — stops polling once a terminal state is reached.
export function useAnalysisPolling(id: string | undefined) {
  return useQuery({
    queryKey: ['analysis', id],
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'processing' || status === 'queued' ? 4000 : false;
    },
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analyses')
        .select('id, status, completed_at')
        .eq('id', id!)
        .single();

      if (error) throw error;
      return data;
    },
  });
}
