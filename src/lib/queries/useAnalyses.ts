import { useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';
import type { Analysis } from '../database.types';

export type AnalysisStatus = Analysis['status'];

interface UseAnalysesOptions {
  status?: AnalysisStatus;
  search?: string;
}

// Lists all analyses for an organisation, newest first.
// Supports optional status filter and name search — mirrors the
// filter controls already on RfpListPage.
export function useAnalyses(organizationId: string | undefined, options: UseAnalysesOptions = {}) {
  return useQuery({
    queryKey: ['analyses', organizationId, options],
    enabled: !!organizationId,
    queryFn: async () => {
      let query = supabase
        .from('analyses')
        .select('*')
        .eq('organization_id', organizationId!)
        .order('created_at', { ascending: false });

      if (options.status) {
        query = query.eq('status', options.status);
      }

      if (options.search) {
        query = query.ilike('name', `%${options.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Analysis[];
    },
  });
}
